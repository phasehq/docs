import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Deploy Phase via Helm on your AWS Elastic Kubernetes Service (EKS) cluster.'

<Tag variant="small">SELF-HOSTING</Tag>

# AWS EKS Helm Deployment

Learn how to set up the Phase Console using Helm on AWS Elastic Kubernetes Service (EKS). {{ className: 'lead' }}

<DocActions />

This guide will walk you through installing the Phase Console on an AWS EKS cluster. This setup utilizes AWS native services where appropriate, such as an AWS Load Balancer to expose the NGINX Ingress controller and Let's Encrypt for TLS. You can choose between two database configurations:

- **In-cluster databases** — PostgreSQL and Redis run inside the cluster, backed by AWS EBS. Simpler to set up, suitable for development and small deployments.
- **External managed databases** — Amazon RDS for PostgreSQL and Amazon ElastiCache for Redis. Recommended for production deployments with automated backups, Multi-AZ failover, and managed scaling.

Both paths share the same cluster setup steps and diverge at the database and deployment configuration.

<SkillBox
  skill="eks"
  triggerPhrase="deploy Phase on EKS"
/>

## Prerequisites

- An AWS Account with necessary permissions to create EKS clusters, IAM roles, and related resources.
- [awscli](https://aws.amazon.com/cli/) installed and configured. Please ensure you have the necessary permissions to create EKS clusters, IAM roles, and related resources.
- [eksctl](https://eksctl.io/installation/) installed. Used to create the EKS cluster and related resources.
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed.
- [Helm](https://helm.sh/docs/intro/install/) installed.

Install `eksctl`:

```fish
curl --silent --location \
  "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" \
  | tar xz -C /tmp && \
sudo mv /tmp/eksctl /usr/local/bin
```

Install `helm`:

```fish
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## Minimum Requirements

- **CPU**: 2.35 cores (2350m)
- **Memory**: 3.768 GB (3866Mi)
- **Storage**: 50Gi for PostgreSQL (backed by AWS EBS for in-cluster, or managed by RDS for external)

## Deployment

You may skip steps 1 and 2 if you already have an EKS cluster and `kubectl` configured.

### 1. Create an EKS Cluster

First, create a cluster configuration file named `cluster-config.yaml`:

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: phase-eks-cluster # 👈 The name of your EKS cluster
  region: eu-central-1 # 👈 Your desired AWS region

autoModeConfig:
  enabled: true

iam:
  withOIDC: true
```

Now, create the EKS cluster using `eksctl`. This process can take 15-20 minutes.

```fish
eksctl create cluster -f cluster-config.yaml
```

`eksctl` will typically configure your `kubectl` context to point to the new cluster upon completion. If not, it will provide the command to do so.

### 2. Verify `kubectl` Configuration

After the cluster creation is complete, verify that `kubectl` is configured correctly to interact with your new EKS cluster:

```fish
kubectl get svc
```

You should see a list of services, including the Kubernetes service itself.

### 3. Install cert-manager

Install cert-manager (replace `v1.17.2` with the latest version from https://github.com/cert-manager/cert-manager/releases):

```fish
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml
```

Wait for cert-manager to be fully deployed:

```fish
kubectl wait --for=condition=Ready pods -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=120s
```

### 4. Configure ClusterIssuer

Create a file named `cluster-issuer.yaml` with the following content:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  # 👈 Replace with your email here
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply the ClusterIssuer:

```fish
kubectl apply -f cluster-issuer.yaml
```

### 5. Set Up Databases

<TabGroup title="Database Configuration" subtitle="Choose where your databases will run." slug="database">
  <TabPanel title="In-cluster" slug="in-cluster">

#### Create Default StorageClass for PostgreSQL

The Phase Helm chart allows PostgreSQL to use the default `StorageClass`. We'll create one backed by AWS EBS gp3 volumes and set it as default.

Create a file named `storage-class.yaml`:

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

Apply the StorageClass:

```fish
kubectl apply -f storage-class.yaml
```

This `StorageClass` named `auto-ebs-sc` will be used by PostgreSQL for data persistence. No further database setup is needed — PostgreSQL and Redis will be deployed inside the cluster by the Helm chart.

  </TabPanel>
  <TabPanel title="External (RDS + ElastiCache)" slug="external">

For production deployments, we recommend using managed database services: Amazon RDS for PostgreSQL and Amazon ElastiCache for Redis.

#### Create a Security Group for Databases

Create a security group in the same VPC as your EKS cluster to allow database access from the cluster's pods:

```fish
# Get the VPC ID of your EKS cluster
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=tag:alpha.eksctl.io/cluster-name,Values=phase-eks-cluster" \
  --query 'Vpcs[0].VpcId' --output text \
  --region <your-region>) # 👈 Replace with your region

# Create the security group
SG_ID=$(aws ec2 create-security-group \
  --group-name phase-db-sg \
  --description "Security group for Phase RDS and ElastiCache" \
  --vpc-id $VPC_ID \
  --region <your-region> \
  --output text --query 'GroupId')

# Allow PostgreSQL access from the VPC
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID --protocol tcp --port 5432 \
  --cidr 192.168.0.0/16 --region <your-region>

# Allow Redis access from the VPC
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID --protocol tcp --port 6379 \
  --cidr 192.168.0.0/16 --region <your-region>
```

#### Create Subnet Groups

Both RDS and ElastiCache require subnet groups. Use the private subnets created by `eksctl`:

```fish
# Get private subnet IDs
SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
            "Name=tag:aws:cloudformation:logical-id,Values=SubnetPrivate*" \
  --query 'Subnets[*].SubnetId' --output text \
  --region <your-region>)

# Create RDS subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name phase-db-subnet \
  --db-subnet-group-description "Phase DB subnet group" \
  --subnet-ids $SUBNET_IDS \
  --region <your-region>

# Create ElastiCache subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name phase-cache-subnet \
  --cache-subnet-group-description "Phase ElastiCache subnet group" \
  --subnet-ids $SUBNET_IDS \
  --region <your-region>
```

#### Create an RDS PostgreSQL Instance

Generate a secure password and create the RDS instance:

```fish
# Generate a password for PostgreSQL
DB_PASSWORD=$(openssl rand -hex 16)
echo "Save this password: $DB_PASSWORD"

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
  --region <your-region>
```

Key settings to adjust for production:
- **Instance class**: `db.t3.medium` or larger
- **Storage**: 50 GiB gp3 (adjust based on usage)
- **Multi-AZ**: Add `--multi-az` for production failover

#### Create an ElastiCache Redis Cluster

```fish
# Generate an auth token for Redis
REDIS_PASSWORD=$(openssl rand -hex 16)
echo "Save this password: $REDIS_PASSWORD"

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
  --region <your-region>
```

Key settings to adjust for production:
- **Node type**: `cache.t3.medium` or larger
- **Multi-AZ**: Add `--multi-az-enabled` and increase `--num-cache-clusters` to 2+

#### Wait for Databases to be Available

Both RDS and ElastiCache take several minutes to provision. Check their status:

```fish
# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier phase-postgres \
  --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address]' \
  --output text --region <your-region>

# Check ElastiCache status
aws elasticache describe-replication-groups \
  --replication-group-id phase-redis \
  --query 'ReplicationGroups[0].[Status,NodeGroups[0].PrimaryEndpoint.Address]' \
  --output text --region <your-region>
```

Wait until both show `available`. Note down the endpoint addresses — you'll need them for the Helm values configuration.

  </TabPanel>
</TabGroup>

### 6. Install NGINX Ingress Controller

The Phase Helm chart specifies `ingress.className: "nginx"`. You need to install an NGINX ingress controller that will manage an IngressClass named `nginx`.

Add the `ingress-nginx` Helm repository:
```fish
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

Install the NGINX Ingress Controller. This command configures it to be exposed via an AWS Load Balancer and explicitly requests an internet-facing scheme:
```fish
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
The `controller.service.type=LoadBalancer` setting will prompt AWS to provision a Network Load Balancer (NLB) or Classic Load Balancer (CLB) depending on your EKS and AWS defaults.
The added `nodeSelector` lines ensure NGINX pods are scheduled on Linux nodes, which is standard for EKS.

### 7. Get the NGINX LoadBalancer IP

Run the following command to get the external IP or hostname of the NGINX Ingress controller's service:

```fish
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

Look for the `EXTERNAL-IP` value. This may be an IP address or a DNS hostname (e.g., for an NLB).

### 8. Update Your DNS

Point your desired domain (e.g., `phase.your-domain.com`) to the LoadBalancer `EXTERNAL-IP` (IP address or hostname) obtained in the previous step. Use an A/AAAA record for an IP address or a CNAME record for a hostname.

### 9. Add the Phase Helm Repository

```fish
helm repo add phase https://helm.phase.dev
helm repo update
```

### 10. Create Kubernetes Secret

<TabGroup title="Secret Configuration" subtitle="Choose based on your database setup." slug="database">
  <TabPanel title="In-cluster" slug="in-cluster">

Create a secret with auto-generated passwords for in-cluster databases:

```fish
kubectl create secret generic phase-console-secret \
  --from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
  --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
  --from-literal=SERVER_SECRET=$(openssl rand -hex 32) \
  --from-literal=DATABASE_PASSWORD=$(openssl rand -hex 32) \
  --from-literal=REDIS_PASSWORD=$(openssl rand -hex 32) \
  --from-literal=GOOGLE_CLIENT_ID=your_google_client_id \
  --from-literal=GOOGLE_CLIENT_SECRET=your_google_client_secret
```

<Note>
Replace the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` values with your preferred SSO login provider's client ID and secret (e.g., GitHub, GitLab, Microsoft Entra ID, etc).
</Note>

  </TabPanel>
  <TabPanel title="External (RDS + ElastiCache)" slug="external">

Create a secret using the database passwords you generated earlier:

```fish
kubectl create secret generic phase-console-secret \
  --from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
  --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
  --from-literal=SERVER_SECRET=$(openssl rand -hex 32) \
  --from-literal=DATABASE_PASSWORD=your_rds_password \
  --from-literal=REDIS_PASSWORD=your_elasticache_auth_token \
  --from-literal=GOOGLE_CLIENT_ID=your_google_client_id \
  --from-literal=GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace `your_rds_password` and `your_elasticache_auth_token` with the passwords you generated when creating the RDS and ElastiCache instances.

<Note>
Replace the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` values with your preferred SSO login provider's client ID and secret (e.g., GitHub, GitLab, Microsoft Entra ID, etc).
</Note>

  </TabPanel>
</TabGroup>

### 11. Create Values File

Create a file named `phase-values.yaml`:

<TabGroup title="Values Configuration" subtitle="Choose based on your database setup." slug="database">
  <TabPanel title="In-cluster" slug="in-cluster">

```yaml
global:
  host: "phase.your-domain.com" # 👈 Replace with your domain
  version: "latest" # 👈 Replace with your preferred version https://github.com/phasehq/console/releases

sso:
  providers: "google" # 👈 The SSO login provider you want to use

phaseSecrets: phase-console-secret

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: phase.your-domain.com # 👈 Replace with your domain
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - phase.your-domain.com # 👈 Replace with your domain
      secretName: phase-tls

certManager:
  enabled: true
  issuerName: "letsencrypt-prod"
  issuerKind: "ClusterIssuer"
```

  </TabPanel>
  <TabPanel title="External (RDS + ElastiCache)" slug="external">

```yaml
global:
  host: "phase.your-domain.com" # 👈 Replace with your domain
  version: "latest" # 👈 Replace with your preferred version https://github.com/phasehq/console/releases

sso:
  providers: "google" # 👈 The SSO login provider you want to use

phaseSecrets: phase-console-secret

# External PostgreSQL (Amazon RDS)
database:
  external: true
  host: "your-rds-instance.xxxxxxxxxxxx.eu-central-1.rds.amazonaws.com" # 👈 RDS endpoint
  port: "5432"
  name: "phase"       # 👈 Your database name
  user: "phase_admin"  # 👈 Your database user
  sslmode: "require"   # Recommended for RDS

# External Redis (Amazon ElastiCache)
redis:
  external: true
  host: "master.your-cluster.xxxxxxxxxxxx.cache.amazonaws.com" # 👈 ElastiCache primary endpoint
  port: "6379"
  ssl: true  # Enable TLS for ElastiCache in-transit encryption
  user: ""   # Set if using Redis ACL (e.g., "default" for Valkey)

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
    - host: phase.your-domain.com # 👈 Replace with your domain
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - phase.your-domain.com # 👈 Replace with your domain
      secretName: phase-tls

certManager:
  enabled: true
  issuerName: "letsencrypt-prod"
  issuerKind: "ClusterIssuer"
```

<Note>
When using external databases (`database.external: true` and `redis.external: true`), the chart will not deploy in-cluster PostgreSQL or Redis pods.
</Note>

  </TabPanel>
</TabGroup>

You can find additional configuration options in the [`values.yaml`](https://github.com/phasehq/kubernetes-secrets-operator/blob/main/phase-console/values.yaml) file. You can find the latest version of the Phase Console on the [GitHub releases](https://github.com/phasehq/console/releases) page.

### 12. Install Phase

```fish
helm install phase-console phase/phase -f phase-values.yaml
```

### 13. Verify the Deployment

```fish
kubectl get pods
kubectl get ingress
kubectl get certificate
```

<Note>
This process may take up to 10 minutes to complete. You may run `watch kubectl get pods` to monitor progress. Wait for the cert-manager ACME solver pod to complete successfully — this means the certificate has been issued and the ingress is ready to use.
</Note>

### 14. Access Phase Console

Once DNS propagation is complete and the certificate is issued (which may take up to several minutes), you should be able to access your Phase Console at `https://phase.your-domain.com`.

## Upgrading

To upgrade your Phase Console deployment, first update the Helm repository and then upgrade the release using your `phase-values.yaml` file:

```fish
helm repo update
helm upgrade phase-console phase/phase -f phase-values.yaml
```

### Upgrading to 1.0.0

Version 1.0.0 introduces breaking changes that require attention:

**PostgreSQL StatefulSet Migration**

PostgreSQL has been changed from a Deployment to a StatefulSet for improved data safety. This changes the PVC naming:
- Old: `<release>-postgres-pvc`
- New: `postgres-data-<release>-postgres-0`

If you have existing data, you'll need to migrate it manually:

```fish
# 1. Create a backup before upgrading
kubectl exec -it <postgres-pod> -- pg_dumpall -U postgres > backup.sql

# 2. Upgrade the chart
helm upgrade phase-console phase/phase -f phase-values.yaml

# 3. Restore the data
kubectl exec -i <new-postgres-pod> -- psql -U postgres < backup.sql
```

**File-Based Secrets**

Secrets are now mounted as files at `/etc/phase/secrets/` with corresponding `_FILE` environment variables (e.g., `DATABASE_PASSWORD_FILE=/etc/phase/secrets/DATABASE_PASSWORD`). The Phase Console application already supports this pattern, so no application changes are needed.

**Per-Component Secret Isolation**

Each component (backend, frontend, worker) now only receives the secrets it needs. For example, the frontend no longer has access to `DATABASE_PASSWORD`. This is configured in `values.yaml` under the `secrets` key.

## Uninstalling

To uninstall Phase Console from your EKS cluster:

```fish
helm uninstall phase-console
```

<Note>
You may also need to manually delete related resources like PersistentVolumeClaims (EBS volumes) if they are not automatically removed, and clean up DNS records. If using external databases, the RDS instance and ElastiCache cluster must be deleted separately via the AWS Console or CLI.
</Note>

## Security

### Client IP Forwarding

By default, the NGINX ingress controller may not forward the real client IP address to the Phase backend. This means audit logs and rate limiting will see an internal cluster IP instead of the actual client IP.

Phase's backend reads the client IP from the `X-Real-IP` header set by the NGINX ingress controller. On EKS with an NLB, you need to enable Proxy Protocol v2 in two places: on the NLB target groups (via a service annotation) and in the NGINX configuration.

Upgrade the NGINX ingress controller with both settings:

```fish
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.publishService.enabled=true \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-target-group-attributes"="proxy_protocol_v2.enabled=true" \
  --set controller.config.use-proxy-protocol="true"
```

This configures two things:
1. The `aws-load-balancer-target-group-attributes` annotation tells EKS Auto Mode to enable Proxy Protocol v2 on the NLB target groups, which wraps each TCP connection with a header containing the real client IP.
2. The `use-proxy-protocol` controller config tells NGINX to read and trust the Proxy Protocol header.

The change may take up to a minute to propagate after applying.

<Note>
With Proxy Protocol enabled, the NLB embeds the original client IP in the TCP stream. The NGINX ingress controller extracts it and sets the `X-Real-IP` and `X-Forwarded-For` headers for upstream services. Headers from untrusted sources cannot override this, preventing client-side IP spoofing.

**Important:** Both the annotation and NGINX config must be set together. If NGINX expects Proxy Protocol headers but the NLB is not sending them (or vice versa), all connections will fail with `PR_CONNECT_RESET_ERROR`.

**EKS Auto Mode:** Do not use the `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol` annotation — it is not supported in EKS Auto Mode and will be ignored. Do not manually modify NLB target group attributes via the AWS CLI either, as EKS Auto Mode continuously reconciles target group settings and will revert manual changes. Use the `aws-load-balancer-target-group-attributes` annotation shown above instead.
</Note>

## IRSA (IAM Roles for Service Accounts)

If your Phase Console backend needs to access AWS services, you can use [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) to grant fine-grained IAM permissions to Phase pods without managing static AWS credentials.

The primary use case for IRSA with Phase is **integration credentials** — allowing Phase to sync secrets to AWS-native backends like Secrets Manager and SSM Parameter Store without embedding `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in your configuration.

### 1. Create an IAM Policy

Create an IAM policy with the permissions your Phase Console needs. Choose the policy based on which AWS integrations you plan to use:

<TabGroup title="IAM Policy" subtitle="Choose the AWS integration you want to enable." slug="irsa-policy">
  <TabPanel title="Secrets Manager" slug="secrets-manager">

Allows Phase to create, read, update, and delete secrets in AWS Secrets Manager:

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

  </TabPanel>
  <TabPanel title="SSM Parameter Store" slug="ssm">

Allows Phase to create, read, update, and delete parameters in AWS Systems Manager Parameter Store:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath",
        "ssm:DeleteParameter",
        "ssm:DeleteParameters",
        "ssm:AddTagsToResource",
        "ssm:ListTagsForResource"
      ],
      "Resource": "*"
    }
  ]
}
```

  </TabPanel>
  <TabPanel title="SES (Email)" slug="ses">

Allows Phase to send email via Amazon SES (used for notifications and invites):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

  </TabPanel>
</TabGroup>

Save the policy JSON to a file (e.g., `phase-policy.json`) and create it in IAM:

```fish
aws iam create-policy \
  --policy-name PhaseConsolePolicy \
  --policy-document file://phase-policy.json
```

Note the returned `Arn` — you'll need it in the next step.

### 2. Create an IRSA Service Account

Use `eksctl` to create a service account linked to the IAM role:

```fish
eksctl create iamserviceaccount \
  --name phase-backend-sa \
  --namespace default \
  --cluster phase-eks-cluster \
  --attach-policy-arn arn:aws:iam::123456789012:policy/PhaseConsolePolicy \
  --approve
```

Replace `123456789012` with your AWS account ID and `phase-eks-cluster` with your cluster name.

### 3. Configure the Helm Chart

Reference the IRSA service account in your `phase-values.yaml`:

```yaml
serviceAccount:
  create: false  # eksctl already created it
  name: "phase-backend-sa"
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/phase-backend-role"
```

Apply the change:

```fish
helm upgrade phase-console phase/phase -f phase-values.yaml
```

The Helm chart will configure the backend, worker, and migration pods to use this service account, enabling them to assume the associated IAM role. Phase will automatically use the instance credentials — no `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` configuration is needed.
