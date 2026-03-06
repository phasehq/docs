---
name: k8s
description: |
  Deploy Phase Console on a generic Kubernetes cluster. Triggers: "deploy Phase on Kubernetes",
  "install Phase on k8s", "self-host Phase on Kubernetes", "Phase Kubernetes deployment",
  "deploy Phase to my cluster", "set up Phase on k8s", "Phase Helm Kubernetes setup"
---

# Deploy Phase Console on Kubernetes

This skill autonomously deploys Phase Console on any Kubernetes cluster using the Phase Helm chart. The agent handles all file creation and kubectl/helm commands directly. The user only handles things that require their own secrets.

## Important Principles

- **Autopilot by default.** The agent creates files and runs commands without asking permission at each step. Show a preview of generated files once before writing, then proceed.
- **Never handle secrets directly.** Write the Kubernetes secret as a shell script (`create-secret.sh`) with `$(openssl rand -hex 32)` for auto-generated values and `EDIT_ME` placeholders for values the user must supply. Keep `--from-literal` lines flush with no unnecessary leading indentation. Tell the user to fill in the `EDIT_ME` values and run the script. Never ask the user to type secret values into the chat.
- **License key is not a secret.** If the user has a Phase Enterprise license key, ask them to paste it directly into the chat.
- **Reference files for details.** See `refs/k8s-deployment.md` for exact commands and YAML templates, and `refs/troubleshooting.md` for diagnosing issues.

## Workflow

### Phase 1 — Prerequisites

Run these checks automatically without asking:

1. `which kubectl` — if missing, point to https://kubernetes.io/docs/tasks/tools/ and stop
2. `which helm` — if missing, show the install command from references and stop
3. `kubectl cluster-info` — if it fails, tell the user their kubeconfig is not connected and stop. They must configure `kubectl` to point to their cluster before proceeding.
4. `kubectl get storageclass` — note what StorageClasses are available. If none exist, warn the user that in-cluster databases will require a StorageClass.

Once all checks pass, proceed to Phase 2 without waiting for the user to say "continue".

### Phase 2 — Configuration Questions

Ask all questions in a single conversational message. Do not ask one at a time.

1. **Domain name** — The FQDN where Phase Console will be accessible (e.g., `phase.example.com`). Required.
2. **Email for Let's Encrypt** — Used for certificate expiry notifications.
3. **SSO provider** — Which identity provider to use for login:
   - `google` — Google OAuth 2.0
   - `github` — GitHub OAuth 2.0
   - `gitlab` — GitLab OAuth 2.0
   - `google-oidc`, `jumpcloud-oidc`, `entra-id-oidc`, `okta-oidc` — OIDC providers
   - `authentik` — Authentik OAuth 2.0
   - `github-enterprise` — GitHub Enterprise
4. **Database mode**:
   - **In-cluster** (default) — PostgreSQL and Redis inside the cluster. Simpler, requires a working StorageClass.
   - **External** — Bring your own managed Postgres and Redis. Recommended for production.
5. **AWS Secrets Manager integration** — Will Phase need to sync secrets to AWS Secrets Manager? (yes/no). If yes, the user will need to provide AWS credentials as a secret.
6. **SMTP / email notifications** — Does the user have an SMTP gateway for Phase email notifications (invites, alerts)?
   - If **yes**: ask for SMTP host, port, sender address, and username. Tell them the password will be added to the secret script — do not ask for it in chat.
   - If **no**: skip, or suggest they configure one later via the Phase admin panel.
7. **Phase Enterprise license** — Do they have a Phase Enterprise license key? If yes, ask them to paste it here.

Store all answers. Proceed to Phase 3 once answered.

### Phase 3 — Credential Setup

#### SSO OAuth Application

Tell the user the exact callback URL to register when creating their OAuth app:

- Pattern: `https://{domain}/api/auth/callback/{provider_slug}`
- Examples: `/callback/google`, `/callback/github`, `/callback/gitlab` — see `refs/k8s-deployment.md` for all providers

Tell them where to create the OAuth app and ask them to share their **Client ID** (not secret — safe to share in chat) once created.

#### Secret Script

Once you have the Client ID, write `create-secret.sh`. No unnecessary leading indentation on `--from-literal` lines. Mark every value the user must supply with an `# EDIT_ME` comment.

**For in-cluster databases:**

```bash
#!/bin/bash
kubectl create secret generic phase-console-secret \
--from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
--from-literal=SECRET_KEY=$(openssl rand -hex 32) \
--from-literal=SERVER_SECRET=$(openssl rand -hex 32) \
--from-literal=DATABASE_PASSWORD=$(openssl rand -hex 32) \
--from-literal=REDIS_PASSWORD=$(openssl rand -hex 32) \
--from-literal={SSO_CLIENT_ID_KEY}={client_id_value} \
--from-literal={SSO_CLIENT_SECRET_KEY}=EDIT_ME_CLIENT_SECRET # EDIT_ME: your {Provider} OAuth Client Secret
```

**For external databases:**

```bash
#!/bin/bash
kubectl create secret generic phase-console-secret \
--from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
--from-literal=SECRET_KEY=$(openssl rand -hex 32) \
--from-literal=SERVER_SECRET=$(openssl rand -hex 32) \
--from-literal=DATABASE_PASSWORD=EDIT_ME_DB_PASSWORD # EDIT_ME: your Postgres password
--from-literal=REDIS_PASSWORD=EDIT_ME_REDIS_PASSWORD # EDIT_ME: your Redis password/auth token
--from-literal={SSO_CLIENT_ID_KEY}={client_id_value} \
--from-literal={SSO_CLIENT_SECRET_KEY}=EDIT_ME_CLIENT_SECRET # EDIT_ME: your {Provider} OAuth Client Secret
```

If the user has an SMTP gateway, append:

```bash
--from-literal=EMAIL_HOST_PASSWORD=EDIT_ME_SMTP_PASSWORD # EDIT_ME: your SMTP password
```

If the user needs AWS Secrets Manager integration, append:

```bash
--from-literal=AWS_ACCESS_KEY_ID=EDIT_ME_AWS_KEY_ID # EDIT_ME: your AWS access key ID
--from-literal=AWS_SECRET_ACCESS_KEY=EDIT_ME_AWS_SECRET # EDIT_ME: your AWS secret access key
--from-literal=AWS_DEFAULT_REGION=EDIT_ME_REGION # EDIT_ME: e.g. us-east-1
```

If the user has an Enterprise license key, append:

```bash
--from-literal=LICENSE_KEY={license_key_value}
```

Substitute `{SSO_CLIENT_ID_KEY}`, `{SSO_CLIENT_SECRET_KEY}`, and `{client_id_value}` with the actual values from the SSO table in `refs/k8s-deployment.md`. Add any extra provider-specific variables — see "Additional SSO Provider Variables" in references.

Write the file and `chmod +x create-secret.sh`. Tell the user: "Edit the `# EDIT_ME` lines in `create-secret.sh`, then run it. Let me know when it's done."

Wait for the user to confirm the secret was created before proceeding.

### Phase 4 — Infrastructure Provisioning

#### 4a. cert-manager

Run automatically without asking:

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml
kubectl wait --for=condition=Ready pods -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=120s
```

#### 4b. ClusterIssuer

Generate `cluster-issuer.yaml` from the template in references, substituting the user's email. Write and apply:

```
kubectl apply -f cluster-issuer.yaml
```

#### 4c. Databases

**If in-cluster:**

Check if a default StorageClass exists:

```bash
kubectl get storageclass
```

If a default StorageClass exists (marked `(default)`), proceed — Phase's in-cluster Postgres and Redis will use it automatically.

If no default StorageClass exists, inform the user and ask them to either install one or switch to external databases. Common options:
- Cloud clusters (GKE, AKS, DigitalOcean): a default StorageClass is usually pre-installed
- Bare metal: suggest installing `local-path-provisioner` (see references)

**If external:**

Ask the user for their Postgres and Redis connection details:
- Postgres: host, port (default 5432), database name, username, SSL mode
- Redis: host, port (default 6379), SSL enabled (yes/no)

These go into the values file in Phase 5c. The passwords are already in the secret from Phase 3.

#### 4d. NGINX Ingress Controller

Check if an ingress controller is already installed:

```bash
kubectl get ingressclass
```

If one already exists (e.g., `nginx`, `traefik`), ask the user which class to use and skip installation.

If none exists, install NGINX ingress:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.publishService.enabled=true
```

See references for cloud-specific annotations (DigitalOcean, GKE, etc.).

#### 4e. Get LoadBalancer Endpoint

Run automatically and report the result to the user:

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

The `EXTERNAL-IP` may be a hostname (most cloud providers) or an IP (bare metal with MetalLB). If it shows `<pending>` for more than a few minutes, consult `refs/troubleshooting.md`.

### Phase 5 — Deployment

#### 5a. DNS Setup

Tell the user to point their domain to the LoadBalancer endpoint from step 4e:
- If EXTERNAL-IP is a **hostname**: create a **CNAME** record
- If EXTERNAL-IP is an **IP address**: create an **A** record

Example:
```
phase.example.com  CNAME  abc123.your-cloud.com
phase.example.com  A      1.2.3.4
```

After the user confirms the DNS record is created, verify propagation using multiple resolvers:

```bash
dig @8.8.8.8 {domain} +short        # Google
dig @1.1.1.1 {domain} +short        # Cloudflare
dig @9.9.9.9 {domain} +short        # Quad9
dig @208.67.222.222 {domain} +short  # OpenDNS
```

All four should return the correct IP or CNAME target. Do not proceed until at least 3 of 4 resolvers agree — the cert-manager HTTP-01 challenge requires the domain to resolve to the ingress before a certificate can be issued. Propagation can take minutes to hours.

#### 5b. Add Phase Helm Repository

Run automatically. If a `phase` repo already exists pointing to a different URL, remove and re-add:

```bash
helm repo remove phase 2>/dev/null || true
helm repo add phase https://helm.phase.dev
helm repo update
```

#### 5c. Generate Values File

Build `phase-values.yaml` from the appropriate template in references (in-cluster or external), substituting all collected values: domain, SSO provider, ingress class, database/Redis endpoints if external, SMTP settings if configured, etc. Write the file.

#### 5d. Install Phase

Run automatically:

```bash
helm install phase-console phase/phase -f phase-values.yaml
```

#### 5e. Enable Proxy Protocol (if NGINX on cloud with NLB)

Only needed if the cluster uses an AWS NLB or a cloud provider that supports proxy protocol. Skip for bare-metal or providers that preserve the source IP natively.

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.config.use-proxy-protocol="true"
```

### Phase 6 — Verification

Run all checks automatically and report results:

1. `kubectl get pods -A` — Phase pods (default ns) and ingress-nginx pods should be Running
2. `kubectl get ingress` — should show the domain with an address
3. `kubectl get certificate` — should show `True` for READY

If the certificate is not ready, check DNS propagation and cert-manager logs. Consult `refs/troubleshooting.md` for common issues and fixes.

Once everything is healthy, tell the user: "Your Phase Console is ready at `https://{domain}`."

### Phase 7 — AWS Secrets Manager Integration

Skip this phase if the user answered "no" to the AWS Secrets Manager question in Phase 2.

The user already added `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION` to the secret in Phase 3. No additional configuration is needed — Phase will pick up the credentials automatically from the environment.

Confirm: "Phase will use the AWS credentials from the secret to sync to Secrets Manager."

## Post-Deployment Notes

- **Upgrading:** `helm repo update && helm upgrade phase-console phase/phase -f phase-values.yaml`
- **Uninstalling:** `helm uninstall phase-console` (PVCs must be cleaned up separately)
