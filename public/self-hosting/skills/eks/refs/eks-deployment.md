# EKS Deployment Reference

Complete reference for deploying Phase Console on AWS EKS. This file contains all commands, YAML templates, and configuration details.

## Prerequisites Installation

### eksctl

```bash
curl --silent --location \
  "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" \
  | tar xz -C /tmp && \
sudo mv /tmp/eksctl /usr/local/bin
```

### Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## Minimum Requirements

- **CPU**: 2.35 cores (2350m)
- **Memory**: 3.768 GB (3866Mi)
- **Storage**: 50Gi for PostgreSQL (EBS for in-cluster, or managed by RDS for external)

## EKS Cluster Configuration

### cluster-config.yaml

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: ${CLUSTER_NAME}
  region: ${REGION}

autoModeConfig:
  enabled: true

iam:
  withOIDC: true
```

Create the cluster — the agent runs this directly and waits for it to complete:

```bash
eksctl create cluster -f cluster-config.yaml
```

After completion, verify kubectl connectivity:

```bash
kubectl get pods -A
```

If kubectl fails to connect, update the kubeconfig:

```bash
aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}
```

## cert-manager

Install (replace version with latest from https://github.com/cert-manager/cert-manager/releases):

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml
```

Wait for readiness:

```bash
kubectl wait --for=condition=Ready pods -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=120s
```

## ClusterIssuer

### cluster-issuer.yaml

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${LETSENCRYPT_EMAIL}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply:

```bash
kubectl apply -f cluster-issuer.yaml
```

## Database Setup

### Option A: In-Cluster (StorageClass)

#### storage-class.yaml

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: auto-ebs-sc
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.eks.amazonaws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
  encrypted: "true"
```

Apply:

```bash
kubectl apply -f storage-class.yaml
```

### Option B: External (RDS + ElastiCache)

#### Security Group

```bash
# Get the VPC ID of the EKS cluster
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=tag:alpha.eksctl.io/cluster-name,Values=${CLUSTER_NAME}" \
  --query 'Vpcs[0].VpcId' --output text \
  --region ${REGION})

# Create the security group
SG_ID=$(aws ec2 create-security-group \
  --group-name phase-db-sg \
  --description "Security group for Phase RDS and ElastiCache" \
  --vpc-id $VPC_ID \
  --region ${REGION} \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=project,Value=phase},{Key=cluster,Value=${CLUSTER_NAME}}]" \
  --output text --query 'GroupId')

# Allow PostgreSQL access from the VPC CIDR
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID --protocol tcp --port 5432 \
  --cidr 192.168.0.0/16 --region ${REGION}

# Allow Redis access from the VPC CIDR
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID --protocol tcp --port 6379 \
  --cidr 192.168.0.0/16 --region ${REGION}
```

Note: The default VPC CIDR for eksctl clusters is `192.168.0.0/16`. If the cluster uses a different CIDR, check with `aws ec2 describe-vpcs --vpc-id $VPC_ID --query 'Vpcs[0].CidrBlock'` and update the rules.

#### Subnet Groups

eksctl clusters tag private subnets with `kubernetes.io/role/internal-elb=1`. Use this tag to find private subnets — do NOT rely on the CloudFormation logical ID pattern `SubnetPrivate*`, which may not match in all regions. Convert tab-separated output to space-separated for CLI compatibility:

```bash
# Get private subnet IDs using the internal-elb tag
SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
            "Name=tag:kubernetes.io/role/internal-elb,Values=1" \
  --query 'Subnets[*].SubnetId' --output text \
  --region ${REGION} | tr '\t' ' ')

# Create RDS subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name phase-db-subnet \
  --db-subnet-group-description "Phase DB subnet group" \
  --subnet-ids $SUBNET_IDS \
  --tags Key=project,Value=phase Key=cluster,Value=${CLUSTER_NAME} \
  --region ${REGION}

# Create ElastiCache subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name phase-cache-subnet \
  --cache-subnet-group-description "Phase ElastiCache subnet group" \
  --subnet-ids $SUBNET_IDS \
  --tags Key=project,Value=phase Key=cluster,Value=${CLUSTER_NAME} \
  --region ${REGION}
```

#### RDS PostgreSQL Instance

The agent reads the database password directly from the Kubernetes secret — the user never manages this password:

```bash
DB_PASSWORD=$(kubectl get secret phase-console-secret \
  -o jsonpath='{.data.DATABASE_PASSWORD}' | base64 -d)

aws rds create-db-instance \
  --db-instance-identifier phase-postgres \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version "15" \
  --allocated-storage 50 \
  --storage-type gp3 \
  --master-username phase_admin \
  --master-user-password "$DB_PASSWORD" \
  --db-name phase \
  --vpc-security-group-ids $SG_ID \
  --db-subnet-group-name phase-db-subnet \
  --no-multi-az \
  --no-publicly-accessible \
  --tags Key=project,Value=phase Key=cluster,Value=${CLUSTER_NAME} \
  --region ${REGION}
```

Production adjustments:
- Instance class: `db.t3.medium` or larger
- Storage: 50 GiB gp3 (adjust based on usage)
- Multi-AZ: Add `--multi-az` for failover

#### ElastiCache Redis

The agent reads the Redis password directly from the Kubernetes secret:

```bash
REDIS_PASSWORD=$(kubectl get secret phase-console-secret \
  -o jsonpath='{.data.REDIS_PASSWORD}' | base64 -d)

aws elasticache create-replication-group \
  --replication-group-id phase-redis \
  --replication-group-description "Phase Redis" \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --num-cache-clusters 1 \
  --cache-subnet-group-name phase-cache-subnet \
  --security-group-ids $SG_ID \
  --transit-encryption-enabled \
  --auth-token "$REDIS_PASSWORD" \
  --tags Key=project,Value=phase Key=cluster,Value=${CLUSTER_NAME} \
  --region ${REGION}
```

Production adjustments:
- Node type: `cache.t3.medium` or larger
- Multi-AZ: Add `--multi-az-enabled` and increase `--num-cache-clusters` to 2+

#### Poll Database Status

Poll every 60 seconds until both show `available`:

```bash
# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier phase-postgres \
  --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address]' \
  --output text --region ${REGION}

# Check ElastiCache status
aws elasticache describe-replication-groups \
  --replication-group-id phase-redis \
  --query 'ReplicationGroups[0].[Status,NodeGroups[0].PrimaryEndpoint.Address]' \
  --output text --region ${REGION}
```

Note the endpoint addresses — they're needed for values.yaml.

## SES SMTP Credentials

If the user has no existing SMTP gateway, provision SES SMTP credentials automatically.

### Provision SES SMTP User

```bash
# Create IAM user for SES SMTP
aws iam create-user \
  --user-name phase-ses-smtp \
  --tags Key=project,Value=phase Key=cluster,Value=${CLUSTER_NAME}

# Create and attach policy for SES sending
cat > ses-send-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["ses:SendRawEmail"],
    "Resource": "*"
  }]
}
EOF

aws iam put-user-policy \
  --user-name phase-ses-smtp \
  --policy-name PhaseSESSend \
  --policy-document file://ses-send-policy.json

# Create access key
ACCESS_KEY_JSON=$(aws iam create-access-key --user-name phase-ses-smtp)
AWS_ACCESS_KEY_ID=$(echo $ACCESS_KEY_JSON | python3 -c "import sys,json; print(json.load(sys.stdin)['AccessKey']['AccessKeyId'])")
AWS_SECRET_ACCESS_KEY=$(echo $ACCESS_KEY_JSON | python3 -c "import sys,json; print(json.load(sys.stdin)['AccessKey']['SecretAccessKey'])")
```

### Derive SES SMTP Password

The SES SMTP password is derived from the IAM secret key using HMAC-SHA256:

```bash
SMTP_PASSWORD=$(python3 - <<EOF
import hmac, hashlib, base64
def sign(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()
date = "11111111"
key = sign(("AWS4" + "$AWS_SECRET_ACCESS_KEY").encode("utf-8"), date)
key = sign(key, "${REGION}")
key = sign(key, "ses")
key = sign(key, "aws4_request")
key = sign(key, "SendRawEmail")
print(base64.b64encode(b"\x04" + key).decode("utf-8"))
EOF
)
```

### Inject into Kubernetes Secret

```bash
kubectl patch secret phase-console-secret \
  --type merge \
  -p "{\"data\":{\"EMAIL_HOST_PASSWORD\":\"$(echo -n $SMTP_PASSWORD | base64)\"}}"
```

SES SMTP settings for values.yaml:
- Host: `email-smtp.${REGION}.amazonaws.com`
- Port: `587`
- Username: `$AWS_ACCESS_KEY_ID`
- TLS: `true`

Note: You must verify your sending domain or address in SES before emails will be delivered. New SES accounts are in sandbox mode — request production access via the AWS console if needed.

## NGINX Ingress Controller

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.publishService.enabled=true \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing \
  --set controller.ingressClassResource.name=nginx \
  --set controller.ingressClassResource.enabled=true \
  --set controller.ingressClassResource.default=false \
  --set controller.admissionWebhooks.patch.nodeSelector."kubernetes\.io/os"=linux \
  --set controller.nodeSelector."kubernetes\.io/os"=linux \
  --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux
```

Get the LoadBalancer endpoint:

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

The `EXTERNAL-IP` will be an NLB hostname like `abc123.elb.${REGION}.amazonaws.com`.

## DNS Verification

After the user creates the DNS record, verify propagation with multiple resolvers before proceeding:

```bash
dig @8.8.8.8 ${DOMAIN} +short        # Google
dig @1.1.1.1 ${DOMAIN} +short        # Cloudflare
dig @9.9.9.9 ${DOMAIN} +short        # Quad9
dig @208.67.222.222 ${DOMAIN} +short  # OpenDNS
```

All should return the NLB hostname or an IP. Wait and retry if results are inconsistent — do not proceed until at least 3 of 4 resolvers agree.

## Kubernetes Secret Script

Write as `create-secret.sh` and `chmod +x` it. No unnecessary leading indentation on `--from-literal` lines.

### In-Cluster Template

```bash
#!/bin/bash
kubectl create secret generic phase-console-secret \
--from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
--from-literal=SECRET_KEY=$(openssl rand -hex 32) \
--from-literal=SERVER_SECRET=$(openssl rand -hex 32) \
--from-literal=DATABASE_PASSWORD=$(openssl rand -hex 32) \
--from-literal=REDIS_PASSWORD=$(openssl rand -hex 32) \
--from-literal=GITHUB_CLIENT_ID=EDIT_ME_CLIENT_ID \
--from-literal=GITHUB_CLIENT_SECRET=EDIT_ME_CLIENT_SECRET
```

### External Database Template

```bash
#!/bin/bash
kubectl create secret generic phase-console-secret \
--from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
--from-literal=SECRET_KEY=$(openssl rand -hex 32) \
--from-literal=SERVER_SECRET=$(openssl rand -hex 32) \
--from-literal=DATABASE_PASSWORD=$(openssl rand -hex 32) \
--from-literal=REDIS_PASSWORD=$(openssl rand -hex 32) \
--from-literal=GITHUB_CLIENT_ID=EDIT_ME_CLIENT_ID \
--from-literal=GITHUB_CLIENT_SECRET=EDIT_ME_CLIENT_SECRET
```

For external databases, `DATABASE_PASSWORD` and `REDIS_PASSWORD` are auto-generated. The agent reads them from the secret when creating RDS/ElastiCache.

## SSO Provider Environment Variable Keys

| Provider | Slug | Client ID Key | Client Secret Key |
|----------|------|---------------|-------------------|
| Google OAuth | `google` | `GOOGLE_CLIENT_ID` | `GOOGLE_CLIENT_SECRET` |
| GitHub OAuth | `github` | `GITHUB_CLIENT_ID` | `GITHUB_CLIENT_SECRET` |
| GitLab OAuth | `gitlab` | `GITLAB_CLIENT_ID` | `GITLAB_CLIENT_SECRET` |
| Authentik | `authentik` | `AUTHENTIK_CLIENT_ID` | `AUTHENTIK_CLIENT_SECRET` |
| GitHub Enterprise | `github-enterprise` | `GITHUB_ENTERPRISE_CLIENT_ID` | `GITHUB_ENTERPRISE_CLIENT_SECRET` |
| Google OIDC | `google-oidc` | `GOOGLE_OIDC_CLIENT_ID` | `GOOGLE_OIDC_CLIENT_SECRET` |
| JumpCloud OIDC | `jumpcloud-oidc` | `JUMPCLOUD_OIDC_CLIENT_ID` | `JUMPCLOUD_OIDC_CLIENT_SECRET` |
| Microsoft Entra ID | `entra-id-oidc` | `ENTRA_ID_OIDC_CLIENT_ID` | `ENTRA_ID_OIDC_CLIENT_SECRET` |
| Okta OIDC | `okta-oidc` | `OKTA_OIDC_CLIENT_ID` | `OKTA_OIDC_CLIENT_SECRET` |

## SSO Callback URLs

The OAuth callback URL pattern is: `https://${DOMAIN}/api/auth/callback/${PROVIDER_SLUG}`

Examples:
- Google: `https://phase.example.com/api/auth/callback/google`
- GitHub: `https://phase.example.com/api/auth/callback/github`
- GitLab: `https://phase.example.com/api/auth/callback/gitlab`
- Authentik: `https://phase.example.com/api/auth/callback/authentik`
- GitHub Enterprise: `https://phase.example.com/api/auth/callback/github-enterprise`
- Google OIDC: `https://phase.example.com/api/auth/callback/google-oidc`
- JumpCloud OIDC: `https://phase.example.com/api/auth/callback/jumpcloud-oidc`
- Microsoft Entra ID: `https://phase.example.com/api/auth/callback/entra-id-oidc`
- Okta OIDC: `https://phase.example.com/api/auth/callback/okta-oidc`

## Additional SSO Provider Variables

Some providers require extra environment variables in the secret:

- **Authentik**: Also needs `AUTHENTIK_URL` and `AUTHENTIK_APP_SLUG`
- **GitHub Enterprise**: Also needs `GITHUB_ENTERPRISE_BASE_URL` and `GITHUB_ENTERPRISE_API_URL`
- **GitLab (self-hosted)**: Optionally needs `GITLAB_AUTH_URL`
- **Microsoft Entra ID**: Also needs `ENTRA_ID_OIDC_TENANT_ID`
- **Okta OIDC**: Also needs `OKTA_OIDC_ISSUER`

## Values File Templates

### In-Cluster Values (phase-values.yaml)

```yaml
global:
  host: "${DOMAIN}"
  version: "latest"

sso:
  providers: "${SSO_PROVIDER}"

phaseSecrets: phase-console-secret

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: ${DOMAIN}
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - ${DOMAIN}
      secretName: phase-tls

certManager:
  enabled: true
  issuerName: "letsencrypt-prod"
  issuerKind: "ClusterIssuer"
```

### External Database Values (phase-values.yaml)

```yaml
global:
  host: "${DOMAIN}"
  version: "latest"

sso:
  providers: "${SSO_PROVIDER}"

phaseSecrets: phase-console-secret

# External PostgreSQL (Amazon RDS)
database:
  external: true
  host: "${RDS_ENDPOINT}"
  port: "5432"
  name: "phase"
  user: "phase_admin"
  sslmode: "require"

# External Redis (Amazon ElastiCache)
redis:
  external: true
  host: "${ELASTICACHE_ENDPOINT}"
  port: "6379"
  ssl: true
  user: ""

# Production replica counts
app:
  frontend:
    replicaCount: 2
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi
  backend:
    replicaCount: 2
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi
  worker:
    replicaCount: 2
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

# Autoscaling
autoscaling:
  frontend:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 80
  backend:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 80
  worker:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 80

# Pod Disruption Budgets
podDisruptionBudget:
  backend:
    enabled: true
    maxUnavailable: 1
  frontend:
    enabled: true
    maxUnavailable: 1
  worker:
    enabled: true
    maxUnavailable: 1

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: ${DOMAIN}
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - ${DOMAIN}
      secretName: phase-tls

certManager:
  enabled: true
  issuerName: "letsencrypt-prod"
  issuerKind: "ClusterIssuer"
```

### SMTP Addition (append to either values template if email is configured)

```yaml
email:
  host: "${SMTP_HOST}"
  port: "${SMTP_PORT}"
  user: "${SMTP_USERNAME}"
  from: "${SMTP_FROM_ADDRESS}"
```

The SMTP password is stored in the Kubernetes secret as `EMAIL_HOST_PASSWORD`.

## Install Phase

```bash
helm install phase-console phase/phase -f phase-values.yaml
```

## Verify Deployment

```bash
kubectl get pods -A
kubectl get ingress
kubectl get certificate
```

Wait for the cert-manager ACME solver pod to complete — that means the certificate has been issued.

## Proxy Protocol (Client IP Forwarding)

Enable proxy protocol on the NGINX ingress controller for correct client IPs in audit logs:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.publishService.enabled=true \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-target-group-attributes"="proxy_protocol_v2.enabled=true" \
  --set controller.config.use-proxy-protocol="true"
```

This configures two things:
1. The `aws-load-balancer-target-group-attributes` annotation tells EKS Auto Mode to enable Proxy Protocol v2 on the NLB target groups.
2. The `use-proxy-protocol` controller config tells NGINX to read the Proxy Protocol header.

Both must be enabled together — see troubleshooting for details.

## DNS Setup

Point the domain to the NLB hostname using a CNAME record:

```
${DOMAIN}  CNAME  <nlb-hostname>.elb.${REGION}.amazonaws.com
```

If the EXTERNAL-IP is an IP address (not a hostname), use an A record instead.

## IRSA — AWS Secrets Manager Integration

Phase supports syncing secrets to **AWS Secrets Manager** via IRSA (IAM Roles for Service Accounts). This allows Phase pods to authenticate to AWS automatically using the pod's IAM role — no static credentials needed.

### IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:UpdateSecret",
        "secretsmanager:PutSecretValue",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DeleteSecret",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecrets",
        "secretsmanager:TagResource"
      ],
      "Resource": "*"
    }
  ]
}
```

### Create the IAM Policy

```bash
aws iam create-policy \
  --policy-name PhaseConsolePolicy \
  --policy-document file://phase-policy.json \
  --tags Key=project,Value=phase Key=cluster,Value=${CLUSTER_NAME}
```

### Create the IRSA Service Account

```bash
eksctl create iamserviceaccount \
  --name phase-backend-sa \
  --namespace default \
  --cluster ${CLUSTER_NAME} \
  --attach-policy-arn arn:aws:iam::<account-id>:policy/PhaseConsolePolicy \
  --approve \
  --region ${REGION}
```

### Get the Role ARN

```bash
kubectl get serviceaccount phase-backend-sa \
  -o jsonpath='{.metadata.annotations.eks\.amazonaws\.com/role-arn}'
```

### Configure in values.yaml

```yaml
serviceAccount:
  create: false
  name: "phase-backend-sa"
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::<account-id>:role/<role-name>"
```

Apply:

```bash
helm upgrade phase-console phase/phase -f phase-values.yaml
```

Phase will automatically use the instance credentials — no `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` needed.

## Upgrading

```bash
helm repo update
helm upgrade phase-console phase/phase -f phase-values.yaml
```

### Upgrading to 1.0.0

Version 1.0.0 has breaking changes:

1. **PostgreSQL StatefulSet Migration** — PVC naming changed from `<release>-postgres-pvc` to `postgres-data-<release>-postgres-0`. Migrate data:
   ```bash
   kubectl exec -it <postgres-pod> -- pg_dumpall -U postgres > backup.sql
   helm upgrade phase-console phase/phase -f phase-values.yaml
   kubectl exec -i <new-postgres-pod> -- psql -U postgres < backup.sql
   ```

2. **File-Based Secrets** — Secrets now mount at `/etc/phase/secrets/` with `_FILE` env vars. No app changes needed.

3. **Per-Component Secret Isolation** — Each component only receives secrets it needs.

## Uninstalling

```bash
helm uninstall phase-console
```

Clean up manually: PersistentVolumeClaims (EBS volumes), DNS records. If using external databases, delete RDS and ElastiCache separately via AWS CLI or Console.
