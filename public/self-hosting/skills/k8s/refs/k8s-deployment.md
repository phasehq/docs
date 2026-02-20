# Kubernetes Deployment Reference

Complete reference for deploying Phase Console on a generic Kubernetes cluster. This file contains all commands, YAML templates, and configuration details.

## Prerequisites

- `kubectl` installed and connected to the target cluster (`kubectl cluster-info` succeeds)
- `helm` v3 installed

### Install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## Verify Cluster Connectivity

```bash
kubectl cluster-info
kubectl get nodes
kubectl get storageclass
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

## StorageClass — In-Cluster Databases

### Check Existing StorageClasses

```bash
kubectl get storageclass
```

Look for a StorageClass marked `(default)`. If one exists, Phase's in-cluster Postgres and Redis will use it automatically — no further action needed.

### Bare Metal: local-path-provisioner

If no StorageClass exists (common on bare-metal clusters), install Rancher's local-path-provisioner:

```bash
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml
```

Then set it as the default:

```bash
kubectl patch storageclass local-path \
  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

Note: `local-path` uses node-local storage — data is tied to the node it lands on. It is suitable for dev/test but not for production (no replication, no cross-node failover).

### Cloud Providers

Most cloud-managed clusters come with a default StorageClass:

| Provider | Default StorageClass |
|---|---|
| GKE | `standard` (pd-standard) or `standard-rwo` |
| AKS | `default` (Azure Disk) |
| DigitalOcean | `do-block-storage` |
| EKS | Requires manual setup (see EKS skill) |

## NGINX Ingress Controller

### Check for Existing Ingress Controller

```bash
kubectl get ingressclass
```

If one already exists, use its name in the values file — skip installation.

### Standard Installation

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.publishService.enabled=true
```

### DigitalOcean

```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.publishService.enabled=true \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-enable-proxy-protocol"=true \
  --set controller.config.use-proxy-protocol="true"
```

### GKE

```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.publishService.enabled=true \
  --set controller.service.annotations."cloud\.google\.com/load-balancer-type"=External
```

### Bare Metal (MetalLB)

Install MetalLB first (https://metallb.universe.tf/installation/), then install NGINX ingress:

```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.publishService.enabled=true
```

### Get LoadBalancer Endpoint

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || \
kubectl get svc -n ingress-nginx ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

The result is a hostname (use CNAME) or an IP (use A record).

## DNS Verification

After the user creates the DNS record, verify with multiple resolvers before proceeding:

```bash
dig @8.8.8.8 ${DOMAIN} +short        # Google
dig @1.1.1.1 ${DOMAIN} +short        # Cloudflare
dig @9.9.9.9 ${DOMAIN} +short        # Quad9
dig @208.67.222.222 ${DOMAIN} +short  # OpenDNS
```

Wait until at least 3 of 4 resolvers agree before proceeding.

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
--from-literal=DATABASE_PASSWORD=EDIT_ME_DB_PASSWORD \
--from-literal=REDIS_PASSWORD=EDIT_ME_REDIS_PASSWORD \
--from-literal=GITHUB_CLIENT_ID=EDIT_ME_CLIENT_ID \
--from-literal=GITHUB_CLIENT_SECRET=EDIT_ME_CLIENT_SECRET
```

### Optional Additions

SMTP password (if SMTP gateway configured):
```bash
--from-literal=EMAIL_HOST_PASSWORD=EDIT_ME_SMTP_PASSWORD
```

AWS Secrets Manager (static credentials):
```bash
--from-literal=AWS_ACCESS_KEY_ID=EDIT_ME_AWS_KEY_ID \
--from-literal=AWS_SECRET_ACCESS_KEY=EDIT_ME_AWS_SECRET \
--from-literal=AWS_DEFAULT_REGION=EDIT_ME_REGION
```

Enterprise license:
```bash
--from-literal=LICENSE_KEY=YOUR_LICENSE_KEY
```

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

Pattern: `https://${DOMAIN}/api/auth/callback/${PROVIDER_SLUG}`

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

Some providers require extra variables in the secret:

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
  className: "${INGRESS_CLASS}"
  annotations:
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

# External PostgreSQL
database:
  external: true
  host: "${POSTGRES_HOST}"
  port: "${POSTGRES_PORT}"
  name: "${POSTGRES_DB}"
  user: "${POSTGRES_USER}"
  sslmode: "${POSTGRES_SSLMODE}"  # disable, require, verify-full

# External Redis
redis:
  external: true
  host: "${REDIS_HOST}"
  port: "${REDIS_PORT}"
  ssl: ${REDIS_SSL}  # true or false
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
  className: "${INGRESS_CLASS}"
  annotations:
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
helm repo remove phase 2>/dev/null || true
helm repo add phase https://helm.phase.dev
helm repo update
helm install phase-console phase/phase -f phase-values.yaml
```

## Verify Deployment

```bash
kubectl get pods -A
kubectl get ingress
kubectl get certificate
```

Wait for the cert-manager ACME solver pod to complete — that means the certificate has been issued.

## Upgrading

```bash
helm repo update
helm upgrade phase-console phase/phase -f phase-values.yaml
```

### Upgrading to 1.0.0

Version 1.0.0 has breaking changes:

1. **PostgreSQL StatefulSet Migration** — PVC naming changed. Migrate data:
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

Clean up manually: PersistentVolumeClaims (if in-cluster databases were used), DNS records, external databases.
