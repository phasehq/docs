import { Tag } from '@/components/Tag'

export const description =
'Deploy Phase via the official Helm chart on your Kubernetes cluster.'

<Tag variant="small">SELF-HOSTING</Tag>

# Kubernetes Helm Deployment

Learn how to set up the Phase Console using Helm on Kubernetes. {{ className: 'lead' }}

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

## Uninstalling

To uninstall Phase Console:

```fish
helm uninstall phase-console
```

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

