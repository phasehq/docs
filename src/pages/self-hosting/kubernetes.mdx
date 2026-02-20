import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
'Deploy Phase via the official Helm chart on your Kubernetes cluster.'

<Tag variant="small">SELF-HOSTING</Tag>

# Kubernetes Helm Deployment

Learn how to set up the Phase Console using Helm on Kubernetes. {{ className: 'lead' }}

<DocActions />

<SkillBox
  skill="k8s"
  refs={["k8s-deployment", "troubleshooting"]}
  triggerPhrase="deploy Phase on Kubernetes"
/>

This guide will walk you through installing the Phase Console on a Kubernetes cluster. By default, the installation includes:

- Phase Console
- Database services (PostgreSQL and Redis) running inside the cluster
- NGINX ingress controller
- Let's Encrypt certificate for TLS

By default, this guide sets up Phase Console with in-cluster databases and an NGINX ingress. However, you have the flexibility to use external databases if preferred. If you're using your own ingress controller and TLS certificates, you can skip steps 1 to 5 of the deployment process.

## Prerequisites

- Kubernetes cluster
- [Helm](https://helm.sh/docs/intro/install/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed & configured with your cluster

## Minimum Requirements

- **CPU**: 2.35 cores (2350m)
- **Memory**: 3.768 GB (3866Mi)
- **Storage**: 50Gi for PostgreSQL

## Deployment

### 1. Install cert-manager

Install cert-manager (replace `v1.17.2` with the latest version from https://github.com/cert-manager/cert-manager/releases):

```fish
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml
```

Wait for cert-manager to be fully deployed:

```fish
kubectl wait --for=condition=Ready pods -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=60s
```

### 2. Configure ClusterIssuer

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

### 3. Install NGINX Ingress Controller

```fish
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
```

### 4. Get the LoadBalancer IP

Run the following command to get the external IP of the ingress-nginx-controller service:

```fish
kubectl get svc
```

Look for the `EXTERNAL-IP` of the `ingress-nginx-controller` service. This may be an IP address or a hostname, depending on your cloud provider.

### 5. Update your DNS

Point your domain (e.g., phase.your-domain.com) to the LoadBalancer IP or hostname obtained in step 4. Use an A/AAAA record for an IP address or a CNAME record for a hostname.

### 6. Add the Phase Helm repository

```fish
helm repo add phase https://helm.phase.dev
helm repo update
```

### 7. Create a Kubernetes managed secret containing the Phase Console secrets

Create a secret named `phase-console-secret` with the following necessary secrets:

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
☝️ Please make sure to replace the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` secret keys and values with your preferred SSO login provider's client ID and secret (Eg. GitHub, GitLab, Microsoft Entra ID, etc).
</Note>

Please see the [Secret and deployment configuration](/self-hosting/configuration/envars) for more information on the required secrets. 

### 8. Create a values file

Create a file named `phase-values.yaml` with the following config:

```yaml
global:
  host: "phase.your-domain.com" # 👈 Replace with your domain
  version: "latest" # 👈 Replace with your preferred version https://github.com/phasehq/console/releases

sso:
  providers: "google" # 👈 The SSO login provider you want to use

phaseSecrets: phase-console-secret # 👈 The name of the secret you have created previously

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
  annotations: {}

certManager:
  enabled: true
  issuerName: "letsencrypt-prod"
  issuerKind: "ClusterIssuer"
```

You can find additional configuration options in the [`values.yaml`](https://github.com/phasehq/kubernetes-secrets-operator/blob/main/phase-console/values.yaml) file.

You can find the latest version of the Phase Console on the [GitHub release](https://github.com/phasehq/console/releases)

### 9. Install Phase

```fish
helm install phase-console phase/phase -f phase-values.yaml
```

### 10. Verify the deployment

```fish
kubectl get pods
kubectl get ingress
kubectl get certificate
```

<Note>
This process may take up to 10 minutes to complete. You may run `watch kubectl get pods` and keep an eye out for the `cert-manager` pod to exit successfully. This would mean that the certificate is issued and the ingress is ready to use.
</Note>

### 11. Access Phase Console

Once DNS propagation is complete and the certificate is issued (which may take a up to tens of minutes), you should be able to access your Phase Console at `https://phase.your-domain.com`.

## Upgrading

To upgrade your Phase Console deployment:

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

To uninstall Phase Console:

```fish
helm uninstall phase-console
```

## Security

### Client IP Forwarding

By default, the NGINX ingress controller may not forward the real client IP address to the Phase backend. This means audit logs and rate limiting will see the ingress controller's internal pod IP instead of the actual client IP.

Phase's backend reads the client IP from the `X-Real-IP` header set by the NGINX ingress controller. To ensure this header contains the real client IP (and not a spoofed value), configure the NGINX ingress controller's ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
data:
  use-forwarded-headers: "true"
  compute-real-ip-from: "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16" # 👈 Replace with your load balancer / VPC CIDR
```

Apply the ConfigMap:

```fish
kubectl apply -f ingress-nginx-configmap.yaml
```

<Note>
The `compute-real-ip-from` setting defines which source IPs are trusted to send `X-Forwarded-For` headers. Only headers from IPs matching these CIDRs are trusted — all others are overwritten with the actual TCP source IP, preventing client-side IP spoofing.

Set this to the CIDR range of your load balancer or VPC. For example, if your cluster VPC uses `10.0.0.0/16`, set `compute-real-ip-from: "10.0.0.0/16"`.
</Note>

## Troubleshooting

If you encounter issues during or after deployment:

1. Check your DNS records and make sure they're pointing to your load balancer public IP address:

```fish
dig A phase.your-domain.com
```

2. If you visit your domain and see a self-signed certificate or errors after DNS propagation:
   - Check the cert-manager pod logs in the `cert-manager` namespace
   - Check the logs of the `cm-acme-http-solver` pod:
   ```fish
   kubectl logs -l acme.cert-manager.io/http01-solver=true -n your-phase-namespace # Replace with the namespace phase is installed in
   ```
   Note that this pod briefly appears to host the Let's Encrypt challenge and terminates itself after completion. If you don't see the pod, the certificate issuance might not be triggering correctly.

3. Describe the Certificate resource to check its status and events:

```fish
kubectl describe certificate phase-tls -n your-phase-namespace # Replace with the namespace phase is installed in
```

4. Check NGINX Ingress controller logs in the `ingress-nginx` namespace.

5. Understanding the routing structure:
   - `https://phase.your-domain.com/*` routes to `http://frontend:3000`
   - `https://phase.your-domain.com/service/*` routes to `http://backend:8000` (path is stripped)

   The default ingress configuration handles this routing using regex and path rewriting. You can see the implementation in the [NGINX ingress template](https://github.com/phasehq/kubernetes-secrets-operator/blob/main/phase-console/templates/ingress.yaml#L34) of the Helm chart. If you are using a custom ingress (Traefik, etc), please make sure to replicate the same routing configuration.

6. Check application health endpoints:
   - Frontend health check:
   ```fish
   curl -v https://phase.your-domain.com/api/health
   # Expected response: {"status":"alive"}
   ```
   - Backend health check:
   ```fish
   curl -v https://phase.your-domain.com/service/health/
   # Expected response: {"status": "alive", "version": "x.x.x"}
   ```

7. If you update any configuration or secrets, you may need to restart the pods to pick up the changes:
   ```fish
   kubectl rollout restart deployment/phase-console-frontend
   kubectl rollout restart deployment/phase-console-backend
   ```
   This will gracefully restart the pods and ensure they pick up the new configuration or secret values.

8. **Installation stuck on migrations job**

   If your installation appears to be stuck with a migrations job that won't complete:

   ```fish
   kubectl get pods
   ```

   Example output showing a stuck migration:
   ```fish
   NAME                             READY   STATUS     RESTARTS   AGE
   phase-console-migrations-tfz46   0/1     Init:0/2   0          4m34s
   ```

   **Fix**: Delete the stuck migrations job to allow the installation to proceed:

   ```fish
   kubectl delete job phase-console-migrations
   ```

9. **ConfigMap ownership error during upgrade**

   If you encounter a ConfigMap ownership error when upgrading or reinstalling:

   ```fish
   helm upgrade --install phase-console phase/phase -f phase-values.yaml
   ```

   Error message:
   ```fish
   Error: Unable to continue with install: ConfigMap "phase-console-config" in namespace "default" exists and cannot be imported into the current release: invalid ownership metadata; annotation validation error: missing key "meta.helm.sh/release-name": must be set to "phase-console"; annotation validation error: missing key "meta.helm.sh/release-namespace": must be set to "default"
   ```

   **Fix**: Delete the orphaned ConfigMap to allow Helm to create a new one with proper ownership:

   ```fish
   kubectl delete configmap phase-console-config
   ```

   Then retry your Helm install or upgrade command.

