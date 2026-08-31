import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Deploy Phase via Helm on Azure Kubernetes Service (AKS), with standard or Tailscale networking.'

<Tag variant="small">SELF-HOSTING</Tag>

# Azure Kubernetes Service (AKS) Helm Deployment

Deploy Phase on AKS with standard Kubernetes networking, keep it private to your Tailscale network, or publish the same instance through Tailscale Funnel. {{ className: 'lead' }}

<DocActions />

<SkillBox
  skill="aks"
  triggerPhrase="deploy Phase on Azure AKS"
/>

The Phase Helm chart remains independent of Tailscale. Tailscale ingress and
egress are separate Kubernetes resources managed by the
[Tailscale Kubernetes operator](https://tailscale.com/docs/kubernetes-operator);
the chart needs no Tailscale dependency or modification.

## Prerequisites

- An Azure subscription with permission to use AKS and create or update
  resources in the target resource group.
- An existing AKS cluster, or permission to create one.
- Azure Cloud Shell in **Bash** mode, or a workstation with the Azure CLI,
  `kubectl`, Helm, `jq`, `curl`, and OpenSSL.
  Microsoft Entra-enabled AKS clusters also use the
  [`kubelogin`](https://learn.microsoft.com/azure/aks/kubelogin-authentication)
  credential plugin. Cloud Shell and current Azure CLI installations normally
  manage it; verify it is on `PATH` with `kubelogin --version`.
- At least 2.35 vCPUs and 3.8 GiB of allocatable memory for Phase, in addition
  to AKS system overhead, plus a storage class that can provision a 50 GiB
  ReadWriteOnce volume for the default in-cluster deployment.
- Enough total regional vCPU quota and quota in the selected VM family for the
  intended AKS node count. The optional preflight below uses
  `Standard_D4as_v5` as an example, not a requirement.
- For either Tailscale path: a tailnet with MagicDNS and HTTPS certificates
  enabled.

Keep these example Azure and release values near the top for reference. The
optional preflight uses the Azure values as variables; the main deployment
steps show values directly so each command remains easy to read. Replace the
marked Azure values for your cluster:

```fish
AZURE_RESOURCE_GROUP="phase-aks-rg" # 👈 replace with your resource group
AKS_CLUSTER="phase-aks"             # 👈 replace with your AKS cluster name
AZURE_REGION="centralindia"         # 👈 replace with your AKS region
PHASE_NAMESPACE="phase"
PHASE_RELEASE="phase-console"
PHASE_CHART_VERSION="1.0.2"
TAILSCALE_OPERATOR_VERSION="1.98.9"
```

<details className="my-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/30 [&>:last-child]:mb-0">
  <summary className="cursor-pointer select-none font-semibold text-zinc-900 marker:text-zinc-500 dark:text-white dark:marker:text-zinc-400">
    Optional preflight: select a subscription, check SKU quota and
    capacity, and create or connect AKS
  </summary>

Expand this section when choosing a region or node SKU, creating a cluster, or
refreshing local AKS credentials. If `kubectl` already targets a suitable
cluster with sufficient quota and capacity, continue with the check after this
section.

**Select the Azure subscription**

The Azure CLI already has an active subscription. Detect and display it
instead of hard-coding a subscription ID:

```fish
az account show \
  --query '{name:name,id:id,tenantId:tenantId}' \
  --output table
```

**Check regional quota and VM availability**

AKS node creation is constrained by both total regional vCPU quota and the
quota for the selected VM family. Check the target region before creating or
scaling a cluster:

```fish
az vm list-usage \
  --location "$AZURE_REGION" \
  --query "[?name.value=='cores'].{
    Quota:name.localizedValue,
    Used:currentValue,
    Limit:limit
  }" \
  --output table
```

**Create or connect to AKS**

If you need a new cluster, create it using the
[AKS Automatic quickstart](https://learn.microsoft.com/azure/aks/automatic/quick-automatic-managed-network)
or the Azure portal. Use the quota-checked region. The validated development
cluster used Azure CNI Overlay, a Standard load balancer, node
auto-provisioning, a managed identity, OIDC, and workload identity.

For a production cluster, use Microsoft Entra authentication with Kubernetes
or Azure RBAC, disable local accounts, and avoid the non-auditable `--admin`
credential path. Prefer a private API server, or restrict a public API server
to approved source ranges. Inspect the current posture before deploying:

```fish
az aks show \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$AKS_CLUSTER" \
  --query '{
    rbac:enableRbac,
    entraManaged:aadProfile.managed,
    azureRbac:aadProfile.enableAzureRbac,
    localAccountsDisabled:disableLocalAccounts,
    privateApi:apiServerAccessProfile.enablePrivateCluster,
    authorizedIpRanges:apiServerAccessProfile.authorizedIpRanges
  }' \
  --output yaml
```

See the Azure guidance for
[disabling local accounts](https://learn.microsoft.com/azure/aks/local-accounts)
and [securing API server access](https://learn.microsoft.com/azure/architecture/security/access-azure-kubernetes-service-cluster-api-server)
before changing an existing cluster's access model.

<Note>
  Tailscale's standalone proxy pods perform network configuration in an init
  container. Confirm that your AKS admission and pod-security policy allows
  the operator proxy workload before standardizing a locked-down cluster
  configuration.
</Note>

Connect `kubectl` to the cluster:

```fish
# Entra-enabled AKS clusters use kubelogin for Azure CLI authentication.
# If this command is missing on a workstation, run: az aks install-cli
kubelogin --version

az aks get-credentials \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$AKS_CLUSTER" \
  --overwrite-existing
```

Whether you used the optional preflight or already had AKS configured, verify
the active context before deploying:

```fish
kubectl config current-context
kubectl get nodes -o wide
```

The current context must be the intended cluster and every existing node
should report `Ready` before continuing.

</details>


## Deployment

### 1. Prepare ingress before installing Phase

Choose one tab and complete it. For Funnel, use the Tailscale tab now and
enable public access only after the private Phase health checks pass.

<Warning>
  The application-routing NGINX mode is cluster-wide. Before running an
  `approuting update` command on a shared cluster, inventory every Ingress that
  uses `webapprouting.kubernetes.azure.com` and confirm its owner accepts the
  load-balancer exposure change.
</Warning>

<TabGroup
  title="Ingress setup"
  subtitle="Establish the final hostname before installing Phase."
  slug="aks-ingress-setup"
>
  <TabPanel title="Standard Kubernetes ingress" slug="standard">

For a cluster without application routing, enable the add-on with an external
NGINX controller:

```fish
# 👇 Replace these two Azure values with your cluster details.
az aks approuting enable \
  --resource-group "phase-aks-rg" \
  --name "phase-aks" \
  --nginx External

kubectl -n app-routing-system get pods,services -o wide
kubectl get ingressclass webapprouting.kubernetes.azure.com
```

If application routing is already enabled, run `update` instead of `enable`:

```fish
# 👇 Replace these two Azure values with your cluster details.
az aks approuting update \
  --resource-group "phase-aks-rg" \
  --name "phase-aks" \
  --nginx External
```

Set your final hostname and point its A/AAAA or CNAME record at the NGINX
Service address:

```fish
# Point your Phase hostname at the address shown by this Service.
kubectl -n app-routing-system get service nginx -o wide
```

Install cert-manager using step 1 of the
[Kubernetes Helm guide](/self-hosting/kubernetes#1-install-cert-manager).
Do not reuse that guide's generic NGINX issuer. Create
`aks-letsencrypt-prod.yaml` with the AKS application-routing class and replace
the email address:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: "admin@example.com"
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            ingressClassName: webapprouting.kubernetes.azure.com
```

```fish
kubectl apply --dry-run=server -f aks-letsencrypt-prod.yaml
kubectl apply -f aks-letsencrypt-prod.yaml
kubectl get clusterissuer letsencrypt-prod
```

The standard values in **Create the Phase values file** ask this issuer for the
Phase certificate.
Replace `<trusted-bootstrap-cidr>` with the administrator's stable public IP
`/32`, or the routed CIDR for a trusted VPN, VNet, or corporate network. From
the workstation that will perform onboarding, `curl -4 https://ifconfig.me`
prints its public egress IP; append `/32` (for example,
`198.51.100.24/32`). For private access, ask the network administrator for the
routed range (for example, `10.20.0.0/16`). Do not use `0.0.0.0/0`. The
allowlist protects Phase routes while cert-manager's separate HTTP-01 solver
remains public. If you already operate another ingress controller, skip the
AKS add-on and issuer instructions, then follow the custom-controller path in
**Create the Phase values file**.

  </TabPanel>
  <TabPanel title="Custom ingress controller" slug="custom">

Keep your existing maintained controller and establish its DNS and TLS before
installing Phase. Set the final hostname:

Use `phase.example.com` below as the example and replace it with your final
hostname.

Chart `1.0.2` generates NGINX regex and rewrite annotations, so the chart
Ingress cannot be reused merely by changing its class. Instead, create
`phase-custom-ingress.yaml`. Replace the class, hostname, and TLS Secret with
values for your controller:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: phase-console
  namespace: phase
spec:
  ingressClassName: "<controller-class>"
  tls:
    - hosts:
        - phase.example.com
      secretName: phase-console-tls
  rules:
    - host: phase.example.com
      http:
        paths:
          - path: /service
            pathType: Prefix
            backend:
              service:
                name: phase-console-backend
                port:
                  number: 8000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: phase-console-frontend
                port:
                  number: 3000
```

Phase Console `v2.71.0` accepts `/service/` directly; preserve that path and do
not add a rewrite. Configure your controller or cert-manager to populate
`phase-console-tls`. Before applying the Ingress, add the controller's
equivalent of a source-IP allowlist for the trusted administrator or corporate
egress CIDR. Keep it through onboarding and authentication setup so the public
endpoint cannot accept unintended sign-ups during bootstrap.

```fish
kubectl create namespace phase --dry-run=client -o yaml | kubectl apply -f -
kubectl apply --dry-run=server -f phase-custom-ingress.yaml
kubectl apply -f phase-custom-ingress.yaml
```

The controller may report an unavailable backend until Helm creates the Phase
Services in **Install Phase**.

  </TabPanel>
  <TabPanel title="Private Tailscale or Funnel" slug="tailscale">

For a cluster without application routing, enable the add-on with an
**internal** NGINX controller:

```fish
# 👇 Replace these two Azure values with your cluster details.
az aks approuting enable \
  --resource-group "phase-aks-rg" \
  --name "phase-aks" \
  --nginx Internal

kubectl -n app-routing-system get pods,services -o wide
kubectl get ingressclass webapprouting.kubernetes.azure.com
```

If application routing is already enabled, run `update` instead of `enable`.
This is required when an existing controller was created in external mode:

```fish
# 👇 Replace these two Azure values with your cluster details.
az aks approuting update \
  --resource-group "phase-aks-rg" \
  --name "phase-aks" \
  --nginx Internal
```

Confirm the `nginx` Service has a private RFC1918 address. Do not continue if
Azure created a public address for a tailnet-only deployment.

#### Next: Configure Tailscale access and operator identity

Before installing the operator, configure its identity and the tailnet access
policy. These controls serve different purposes:

- [`tagOwners`](https://tailscale.com/docs/kubernetes-operator/reference/tags)
  lets the operator create and manage ingress and egress proxy devices with the
  Phase-specific tags below.
- [`grants`](https://tailscale.com/docs/features/access-control/grants) are the
  network access rules—often referred to as ACLs—that decide which tailnet
  identities may connect to the tagged Phase ingress.
- A scoped [OAuth client](https://tailscale.com/kb/1215/oauth-clients)
  authenticates the operator to the Tailscale API. The operator exchanges its
  client credentials for one-hour API tokens and creates auth keys as needed,
  instead of embedding a manually managed reusable auth key in the deployment.

This section establishes **private tailnet ingress**. It does not enable
[Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel).
The optional Funnel section later adds the required `nodeAttrs` permission and
Ingress annotation to publish the same `.ts.net` hostname to the internet; see
Tailscale's
[Kubernetes Funnel guide](https://tailscale.com/docs/kubernetes-operator/ingress/expose-workload-to-internet)
for the underlying behavior.

##### Delegate the proxy tags

In [Access controls](https://console.tailscale.com/admin/acls/file) in the Tailscale admin console, merge these entries into
the existing `tagOwners` object. Do not replace the rest of the policy:

```json
"tagOwners": {
  "tag:k8s-operator": [],
  "tag:k8s": ["tag:k8s-operator"],
  "tag:phase-aks-ingress": ["tag:k8s-operator"],
  "tag:phase-aks-egress": ["tag:k8s-operator"]
}
```

Tag ownership lets the operator assign tags; it does not grant users access.

##### Grant private access to Phase

First, define `group:phase-admins` in the tailnet policy's existing `groups`
object. Replace the examples with the full login identities of your Tailscale
users, and merge this entry instead of creating a second `groups` object:

```json
"groups": {
  "group:phase-admins": [
    "alice@example.com",
    "bob@example.com"
  ]
}
```

Group names must begin with `group:` and groups cannot contain other groups.
See Tailscale's [group syntax](https://tailscale.com/docs/reference/syntax/policy-file#groups).

Then add a narrow grant. This example allows those Phase administrators to
reach only the tagged ingress on HTTPS:

```json
"grants": [
  {
    "src": ["group:phase-admins"],
    "dst": ["tag:phase-aks-ingress"],
    "ip": ["tcp:443"]
  }
]
```

Merge the rule into the existing `grants` array and replace the example group
with an identity defined in your tailnet. For one administrator, you can skip
the group and use their full login identity directly in `src`.

##### Create scoped OAuth credentials

Create an OAuth client in **Trust credentials → [OAuth clients](https://console.tailscale.com/admin/settings/trust-credentials)**. Tag it
`tag:k8s-operator` and grant the operator's required read/write access to:

- **General → Services**
- **Devices → Core**
- **Keys → Auth Keys**

Copy the client ID and one-time-displayed secret. Create the Kubernetes Secret
interactively. Here's a useful oneliner:

```fish
kubectl create namespace tailscale \
  --dry-run=client -o yaml | kubectl apply -f -

read -rp "Tailscale OAuth client ID: " TS_CLIENT_ID
read -rsp "Tailscale OAuth client secret: " TS_CLIENT_SECRET; echo

kubectl -n tailscale create secret generic operator-oauth \
  --from-literal=client_id="$TS_CLIENT_ID" \
  --from-literal=client_secret="$TS_CLIENT_SECRET"

unset TS_CLIENT_ID TS_CLIENT_SECRET
```

Expected output is `secret/operator-oauth created`. If the Secret already
exists, leave it unchanged unless you are deliberately rotating the OAuth
client.

Create `tailscale-operator-values.yaml`:

```yaml
operatorConfig:
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 500m
      memory: 256Mi
```

Install the pinned operator. It uses the pre-created
`tailscale/operator-oauth` Secret, so OAuth values do not enter Helm release
data:

```fish
helm repo add tailscale https://pkgs.tailscale.com/helmcharts
helm repo update tailscale

helm upgrade --install tailscale-operator tailscale/tailscale-operator \
  --version 1.98.9 \
  --namespace tailscale \
  --create-namespace \
  --values tailscale-operator-values.yaml \
  --wait \
  --timeout 10m

kubectl -n tailscale get deployment,pods
kubectl get ingressclass tailscale
kubectl get crd proxyclasses.tailscale.com
```

The operator device should also appear in the Tailscale admin console with
`tag:k8s-operator`.

Create `tailscale-proxy-class.yaml`:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: ProxyClass
metadata:
  name: phase-aks-proxy
spec:
  statefulSet:
    pod:
      tailscaleContainer:
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
      tailscaleInitContainer:
        resources:
          requests:
            cpu: 10m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 128Mi
```

Create `tailscale-bridge.yaml`. It deliberately has no Funnel annotation:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: phase-tailscale-bridge
  namespace: app-routing-system
  annotations:
    tailscale.com/proxy-class: "phase-aks-proxy"
    tailscale.com/tags: "tag:phase-aks-ingress"
spec:
  ingressClassName: tailscale
  defaultBackend:
    service:
      name: nginx
      port:
        number: 80
  tls:
    - hosts:
        - phase-aks
```

The bridge lives in `app-routing-system` because an Ingress backend Service
must be in the same namespace. Confirm that the AKS-managed backend is really
named `nginx` before applying it:

```fish
kubectl -n app-routing-system get service nginx

kubectl apply --dry-run=server \
  -f tailscale-proxy-class.yaml \
  -f tailscale-bridge.yaml

kubectl apply \
  -f tailscale-proxy-class.yaml \
  -f tailscale-bridge.yaml

kubectl -n app-routing-system wait ingress/phase-tailscale-bridge \
  --for=jsonpath='{.status.loadBalancer.ingress[0].hostname}' \
  --timeout=10m

PHASE_HOST="$(kubectl -n app-routing-system get ingress \
  phase-tailscale-bridge \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"

printf 'Phase hostname: %s\n' "$PHASE_HOST"
test -n "$PHASE_HOST"
```

The hostname resembles `phase-aks.tail123abc.ts.net`. A request can return an
NGINX 404 until Phase is installed; that confirms the private bridge works but
NGINX does not yet have a matching Phase Ingress.

<Note>
  Tailscale provisions a public TLS certificate for this private hostname.
  The machine and tailnet DNS names therefore appear in public Certificate
  Transparency logs. Do not encode customer names, environment secrets, or
  other sensitive metadata in the name. See Tailscale's
  [certificate privacy note](https://tailscale.com/docs/how-to/set-up-https-certificates#machine-names-in-the-public-ledger).
</Note>

  </TabPanel>
</TabGroup>

### 2. Create the Phase namespace and Secret

Create the namespace:

```fish
kubectl create namespace phase --dry-run=client -o yaml | kubectl apply -f -
```

Generate the four required values and create the Secret in one command. Run
this once for a new deployment; if the Secret already exists, leave it
unchanged unless you are deliberately rotating it:

```fish
kubectl -n phase create secret generic phase-console-secret \
  --from-literal=SECRET_KEY="$(openssl rand -hex 32)" \
  --from-literal=SERVER_SECRET="$(openssl rand -hex 32)" \
  --from-literal=DATABASE_PASSWORD="$(openssl rand -hex 32)" \
  --from-literal=REDIS_PASSWORD="$(openssl rand -hex 32)"
```

Back up this Secret in your approved secret-management system. Losing
`SERVER_SECRET` can make encrypted Phase data unreadable. Never put the Secret
values in a Helm values file, Git repository, ticket, or chat.

### 3. Create the Phase values file

Use the final `PHASE_HOST` from **Prepare ingress before installing Phase** in
`global.host` and, for chart-managed ingress, `ingress.host`. Do not install
with a placeholder and plan to repair it later.

<TabGroup
  title="Phase values"
  subtitle="Choose the values that match the ingress path."
  slug="aks-values"
>
  <TabPanel title="Standard Kubernetes ingress" slug="standard">

Create `phase-values.yaml` and replace `phase.example.com` if you chose a
different hostname:

```yaml
global:
  host: "phase.example.com"
  httpProtocol: "https://"
  version: "v2.71.0"

phaseSecrets: phase-console-secret

passwordAuth:
  enabled: true

database:
  external: false
  name: phase
  user: phase
  persistence:
    enabled: true
    size: 50Gi
    storageClass: ""

redis:
  external: false

ingress:
  enabled: true
  className: "webapprouting.kubernetes.azure.com"
  host: "phase.example.com"
  annotations:
    # 👇 Replace with a trusted public /32 or private range such as 10.20.0.0/16.
    nginx.ingress.kubernetes.io/whitelist-source-range: "<trusted-bootstrap-cidr>"

certManager:
  enabled: true
  issuerName: "letsencrypt-prod"
  issuerKind: "ClusterIssuer"
```

  </TabPanel>
  <TabPanel title="Private Tailscale or Funnel" slug="tailscale">

Record the cluster pod CIDR. The Tailscale values use this address range as the
NGINX trusted-proxy boundary:

```fish
POD_CIDR="$(az aks show \
  --resource-group "phase-aks-rg" \
  --name "phase-aks" \
  --query networkProfile.podCidr \
  --output tsv)"

printf 'AKS pod CIDR: %s\n' "$POD_CIDR"
test -n "$POD_CIDR"
```

Create `phase-values.yaml`, replace the fictional hostname with the exact
value printed in **Prepare ingress before installing Phase**, and replace the
tested pod CIDR when the command above prints a different value:

```yaml
global:
  host: "phase-aks.tail123abc.ts.net"
  httpProtocol: "https://"
  version: "v2.71.0"

phaseSecrets: phase-console-secret

passwordAuth:
  enabled: true

database:
  external: false
  name: phase
  user: phase
  persistence:
    enabled: true
    size: 50Gi
    storageClass: ""

redis:
  external: false

ingress:
  enabled: true
  className: "webapprouting.kubernetes.azure.com"
  host: "phase-aks.tail123abc.ts.net"
  tls: []
  annotations:
    nginx.ingress.kubernetes.io/configuration-snippet: |
      set_real_ip_from 10.244.0.0/16;
      real_ip_header X-Forwarded-For;
      real_ip_recursive on;

certManager:
  enabled: false
```

Tailscale terminates HTTPS at its ingress proxy. The proxy sends in-cluster
HTTP to the internal NGINX Service, so Phase does not need cert-manager for
this route.

Tailscale replaces a caller-supplied `X-Forwarded-For` value with the source
address it observes. AKS managed NGINX otherwise replaces that address with the
Tailscale proxy pod address. The annotation belongs on the Helm-generated Phase
Ingress, not `tailscale-bridge.yaml`: it tells NGINX to trust the proxy source
range and restores the tailnet client address for private ingress or the public
client address for Funnel. The existing `ingress.annotations` value supports
this configuration; no Phase chart template change or additional dependency is
required.

<Warning>
  Never use `0.0.0.0/0` for `set_real_ip_from`. Trusting the complete pod
  CIDR means another pod that can reach NGINX could forge
  `X-Forwarded-For`. Prevent untrusted workloads from reaching NGINX with an
  enforced NetworkPolicy or use a narrower dedicated proxy boundary before
  treating the address as a production security control. This annotation
  restores client IP attribution only; it does not configure every forwarded
  host, protocol, or port header.
</Warning>

  </TabPanel>
  <TabPanel title="Custom ingress controller" slug="custom">

Create `phase-values.yaml`, use the final hostname established in
**Prepare ingress before installing Phase**, and leave ingress ownership to
your controller:

```yaml
global:
  host: "phase.example.com"
  httpProtocol: "https://"
  version: "v2.71.0"

phaseSecrets: phase-console-secret

passwordAuth:
  enabled: true

database:
  external: false
  name: phase
  user: phase
  persistence:
    enabled: true
    size: 50Gi
    storageClass: ""

redis:
  external: false

ingress:
  enabled: false

certManager:
  enabled: false
```

The separately managed `phase-custom-ingress.yaml` owns routing and TLS.

  </TabPanel>
</TabGroup>

The values above use the minimal in-cluster database path. For managed
PostgreSQL or Redis, start with the
[Helm chart values](https://github.com/phasehq/kubernetes-secrets-operator/blob/main/phase-console/values.yaml)
and configure `database.external` and `redis.external` before installation.

### 4. Install Phase

Add the Phase Helm repository:

```fish
helm repo add phase https://helm.phase.dev
helm repo update phase
```

Optionally render the pinned chart and ask the Kubernetes API server to
validate the resources without persisting them:

```fish
helm template phase-console phase/phase \
  --version 1.0.2 \
  --namespace phase \
  --values phase-values.yaml |
kubectl apply --dry-run=server -f - >/dev/null
```

Install Phase:

```fish
helm upgrade --install phase-console phase/phase \
  --version 1.0.2 \
  --namespace phase \
  --values phase-values.yaml \
  --timeout 15m
```

<Note>
  Do not add `--wait` or `--atomic` while using this chart version with the
  bundled database. Application init containers wait for the migration hook,
  and waiting for application readiness before running the hook can create a
  circular wait.
</Note>

Watch the workloads become ready:

```fish
kubectl -n phase get pods,pvc,services,ingress -o wide --watch
```

The successful migration hook deletes itself. `kubectl get jobs` returning no
migration job after installation is normal.

### 5. Verify Phase

Check that all three application deployments use the intended host:

```fish
kubectl -n phase exec \
  deployment/phase-console-frontend -- printenv HOST

kubectl -n phase exec \
  deployment/phase-console-backend -- \
  printenv HOST ALLOWED_HOSTS ALLOWED_ORIGINS

kubectl -n phase exec \
  deployment/phase-console-worker -- printenv HOST ALLOWED_HOSTS
```

For the standard AKS application-routing path, wait for DNS and the certificate
before onboarding:

```fish
kubectl -n phase wait certificate/phase-console-tls \
  --for=condition=Ready \
  --timeout=10m

kubectl -n phase get certificate phase-console-tls
```

After it is ready, add only this annotation under `ingress.annotations` in the
standard `phase-values.yaml`. Chart `1.0.2` already emits an
`ssl-redirect` key, so adding that key again would create duplicate YAML:

```yaml
ingress:
  annotations:
    # 👇 Replace with a trusted public /32 or private range such as 10.20.0.0/16.
    nginx.ingress.kubernetes.io/whitelist-source-range: "<trusted-bootstrap-cidr>"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
```

Apply the updated values and confirm that HTTP redirects before creating the
first account. Run the request from the trusted bootstrap network; an
untrusted source should receive `403` instead:

```fish
helm upgrade phase-console phase/phase \
  --version 1.0.2 \
  --namespace phase \
  --values phase-values.yaml \
  --timeout 15m

curl --head "http://phase.example.com/"
```

For a custom controller, enforce and test its equivalent HTTPS redirect and
bootstrap allowlist. Run the following health checks from an allowed source;
for Tailscale ingress, use a device authorized on the tailnet:

```fish
curl --fail --show-error "https://phase.example.com/api/health"
curl --fail --show-error "https://phase.example.com/service/health/"
```

Expected responses resemble:

```text
{"status":"alive"}
{"status":"alive","version":"v2.71.0"}
```

Open `https://<phase-host>` from the allowed source and create the first
account. It becomes the owner of its new organization. Copy or download the
recovery kit before finishing onboarding; it cannot be retrieved later.

<Warning>
  The minimal values explicitly enable password authentication and do not
  configure SMTP. In this mode Phase cannot send a verification email, so
  password registrations become active immediately. Keep the standard or
  custom ingress bootstrap allowlist in place, and do not enable Funnel, until
  you deliberately configure and test the intended public registration policy.
  An email-domain allowlist alone is not identity proof without working email
  verification.
</Warning>

Before making the instance public, choose and test one authentication posture:

- Configure SSO and its Secret values. In a fresh private browser session,
  verify the intended organization owner can complete SSO and has the expected
  membership before setting `passwordAuth.enabled: false`; otherwise a provider
  or claim mismatch can lock every administrator out. Apply the change, verify
  SSO again in another fresh session, then confirm a non-destructive empty
  password registration request returns `403`:

  ```bash
  REGISTER_STATUS="$(curl --silent --show-error --output /tmp/phase-register-check.json \
    --write-out '%{http_code}' \
    --request POST \
    --header 'content-type: application/json' \
    --data '{}' \
    "https://${PHASE_HOST}/service/auth/password/register/")"
  test "$REGISTER_STATUS" = 403
  ```

- Or configure a working SMTP gateway, retain password authentication, and set
  the intended registration/domain policy. Complete a controlled email
  verification test before opening the network gate.

Use the
[SSO configuration](/self-hosting/configuration/envars#single-sign-on-sso) or
[email gateway configuration](/self-hosting/configuration/envars#email-gateway-configuration)
for the selected path. Keep provider and SMTP credentials in the existing
Kubernetes Secret, never in `phase-values.yaml`. After changing authentication
values, apply them and restart the ConfigMap consumers while the bootstrap
allowlist remains:

```fish
helm upgrade phase-console phase/phase \
  --version 1.0.2 \
  --namespace phase \
  --values phase-values.yaml \
  --timeout 15m

kubectl -n phase rollout restart \
  deployment/phase-console-frontend \
  deployment/phase-console-backend \
  deployment/phase-console-worker
```

Only after the selected posture passes its test should a standard deployment
remove `nginx.ingress.kubernetes.io/whitelist-source-range` from
`phase-values.yaml` and run the Helm upgrade again. A custom-controller
deployment should remove its equivalent gate. Keep either allowlist permanently
when the instance is not intended for the whole internet.

For Tailscale ingress, verify that Azure still exposes only a private NGINX
address:

```fish
kubectl -n app-routing-system get service nginx -o wide
kubectl -n app-routing-system get ingress phase-tailscale-bridge -o wide
```

Confirm that Helm applied the real-IP configuration to the Phase Ingress:

```fish
kubectl -n phase get ingress phase-console \
  -o jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}{"\n"}'
```

The command must print the three `real_ip` directives from the values file.
From a tailnet device, perform a new action that appears in the Phase audit
log. Its client address should be that device's Tailscale IPv4 address in
`100.64.0.0/10` or its Tailscale IPv6 address, not an address in the AKS pod
CIDR. Existing audit events are historical and are not rewritten by this
change.

## Optional networking

The base deployment is now healthy. The following options document the
private ingress boundary, an explicit full-instance Funnel endpoint, and
destination-specific tailnet egress. Ingress and private egress are
independent choices.

<TabGroup
  title="Ingress method"
  subtitle="Choose how users reach Phase."
  slug="ingress-method"
>
  <TabPanel title="Tailscale private ingress" slug="tailscale">

Install the Tailscale Kubernetes operator, create the ingress bridge, and read
the assigned `.ts.net` hostname before installing Phase. Put that final
hostname in both `global.host` and `ingress.host` so the first Phase pods start
with the correct API origin.

This path is private to the tailnet unless you explicitly enable Funnel. The
tested deployment sends Tailscale HTTPS ingress to the internal AKS NGINX
Service; Phase keeps using the existing Helm-chart ingress routing.

  </TabPanel>
  <TabPanel title="Standard Kubernetes ingress" slug="standard">

Use your preferred ingress controller, DNS record, and TLS certificate. Point
the Phase Ingress at that controller and use the final public or private DNS
hostname in both `global.host` and `ingress.host`.

Tailscale is not required for the Phase Helm release or for calls to public
integration APIs. Keep the controller private or public according to your
organization's network and access requirements.

  </TabPanel>
  <TabPanel title="Public instance via Funnel" slug="funnel">

[Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel) gives
external browsers and integrations such as Okta a public HTTPS route to the
same `.ts.net` hostname used inside the tailnet. No Azure public load balancer,
new DNS name, or second Phase host configuration is required.

<Warning>
  This intentionally makes the complete Phase instance internet-reachable:
  the UI, login and authentication routes, health endpoints, and APIs. Funnel
  is a transport boundary, not application authentication. Enable it only when
  the organization accepts that exposure and Phase authentication, SSO, RBAC,
  and SCIM bearer-token controls are configured appropriately.

  Do not continue with the Funnel annotation while using the minimal
  password-auth values without SMTP: that combination permits immediate public
  self-registration. Complete the public authentication gate in **Verify
  Phase** first, and verify the chosen SSO-only or email-verification behavior.
</Warning>

The same hostname is useful here: existing CSP, cookie domains, frontend API
origins, and backend `ALLOWED_HOSTS` remain valid. Merge this entry into the
existing `nodeAttrs` array; tagged proxies are not included in
`autogroup:member`:

```json
"nodeAttrs": [
  {
    "target": ["tag:phase-aks-ingress"],
    "attr": ["funnel"]
  }
]
```

Save the current Ingress for evidence, then enable Funnel on the existing
bridge:

```fish
kubectl -n app-routing-system get ingress phase-tailscale-bridge \
  -o yaml > /tmp/phase-tailscale-bridge.before-funnel.yaml

PHASE_HOST="$(kubectl -n app-routing-system get ingress \
  phase-tailscale-bridge \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
test -n "$PHASE_HOST"

kubectl -n app-routing-system annotate ingress phase-tailscale-bridge \
  tailscale.com/funnel=true --overwrite
```

Confirm the existing ingress proxy received Funnel capability, then wait for
public DNS:

```fish
PROXY_POD="$(kubectl -n tailscale get pods -o json | jq -r '
  .items[] |
  select(.metadata.name | startswith("ts-phase-tailscale-bridge-")) |
  .metadata.name
' | head -n 1)"
test -n "$PROXY_POD"

kubectl -n tailscale exec "$PROXY_POD" -- tailscale status --json \
  | jq -e '
    ((.Self.Capabilities // []) + ((.Self.CapMap // {}) | keys)) |
    any(.[]; test("funnel"; "i"))
  '

kubectl -n tailscale exec "$PROXY_POD" -- \
  tailscale funnel status --json | jq .

FUNNEL_IP="$(
  curl --silent --show-error --get \
    --header 'accept: application/dns-json' \
    --data-urlencode "name=${PHASE_HOST}" \
    --data-urlencode 'type=A' \
    https://cloudflare-dns.com/dns-query \
  | jq -r '.Answer[]? | select(.type == 1) | .data' \
  | head -n 1
)"
test -n "$FUNNEL_IP"
```

Public DNS can take up to ten minutes. DNS-over-HTTPS is intentional here:
Tailscale can intercept direct DNS queries for its own `.ts.net` domain on a
tailnet client, even when `dig` names a public resolver. Force the public
Funnel address and bypass any HTTP proxy so this test cannot use MagicDNS:

```fish
(
set -euo pipefail

UI_STATUS="$(curl --noproxy '*' --silent --show-error --location --output /dev/null \
  --write-out '%{http_code}' --resolve "$PHASE_HOST:443:$FUNNEL_IP" \
  "https://${PHASE_HOST}/")"
HEALTH_STATUS="$(curl --noproxy '*' --silent --show-error --output /dev/null \
  --write-out '%{http_code}' --resolve "$PHASE_HOST:443:$FUNNEL_IP" \
  "https://${PHASE_HOST}/api/health")"
SCIM_STATUS="$(curl --noproxy '*' --silent --show-error \
  --resolve "$PHASE_HOST:443:$FUNNEL_IP" \
  --output /tmp/scim-provider-public.json --write-out '%{http_code}' \
  "https://${PHASE_HOST}/service/v1/scim/v2/ServiceProviderConfig")"
USERS_STATUS="$(curl --noproxy '*' --silent --show-error --output /dev/null \
  --write-out '%{http_code}' --resolve "$PHASE_HOST:443:$FUNNEL_IP" \
  "https://${PHASE_HOST}/service/v1/scim/v2/Users")"

test "$UI_STATUS" = 200
test "$HEALTH_STATUS" = 200
test "$SCIM_STATUS" = 200
case "$USERS_STATUS" in
  401|403) ;;
  *)
    printf 'Unexpected unauthenticated SCIM status: %s\n' "$USERS_STATUS" >&2
    false
    ;;
esac

jq -e '.schemas | index(
  "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"
) != null' /tmp/scim-provider-public.json
)
```

From a client that is not connected to the tailnet, perform a new audited
action through Funnel and confirm that the Phase audit event records the
caller's public egress address, not an AKS pod address. A caller behind NAT or
another trusted edge proxy will naturally appear as that public egress or
proxy address.

The discovery endpoint is intentionally unauthenticated. `/Users`, `/Groups`,
and provisioning operations require a Phase SCIM bearer token. Ordinary Phase
routes continue to use the application's login, SSO, session, and RBAC checks.

For an IdP such as Okta, copy the base URL and create a dedicated Phase SCIM
bearer token with only the required provisioning access:

```fish
printf 'SCIM base URL: https://%s/service/v1/scim/v2\n' "$PHASE_HOST"
```

Configure the IdP with that URL and `Authorization: Bearer <phase-scim-token>`.
Do not use the Tailscale OAuth credential or an operator auth key for SCIM.

For a temporary experiment, remove Funnel and confirm public access stops while
the same hostname still works inside the tailnet:

```fish
kubectl -n app-routing-system annotate ingress phase-tailscale-bridge \
  tailscale.com/funnel-

(
set -euo pipefail

PUBLIC_AFTER_ROLLBACK="$(curl --noproxy '*' --silent --show-error \
  --connect-timeout 10 --output /dev/null --write-out '%{http_code}' \
  --resolve "$PHASE_HOST:443:$FUNNEL_IP" \
  "https://${PHASE_HOST}/api/health" || true)"
test "$PUBLIC_AFTER_ROLLBACK" != 200
)
```

Public DNS can remain cached briefly; repeat the forced-IP check if teardown is
still propagating. From a separate tailnet-connected client, confirm the private
route still works:

```fish
curl --noproxy '*' --fail --show-error \
  "https://${PHASE_HOST}/api/health"
```

For a completed temporary experiment, also remove the
`tag:phase-aks-ingress` Funnel entry from `nodeAttrs` when nothing else uses it,
then confirm the proxy no longer reports an active Funnel configuration:

```fish
kubectl -n tailscale exec "$PROXY_POD" -- \
  tailscale funnel status --json | jq .
```

Certificate Transparency history cannot be removed. For an intentional public
endpoint, keep the annotation and policy permission under change control
instead of running the rollback.

<Note>
  A separate SCIM-only Funnel Ingress is an optional hardening design when the
  UI must remain private. It needs another `.ts.net` hostname and current chart
  `1.0.2` would need an `additionalAllowedHosts` value. It is not required for
  the same-host full-instance setup above.
</Note>

Funnel is beta, supports only `.ts.net` names and public ports `443`, `8443`,
and `10000`, and has bandwidth limits. The tested operator `1.98.9` Funnel path
uses one standalone ingress proxy. A private ingress `ProxyGroup` does not add
Funnel support in this validated version, so this guide does not provide an HA
Funnel recipe. Treat the proxy as a public-endpoint availability dependency or
select another production public-ingress design. The public client-to-proxy leg
uses TLS; Tailscale's relay cannot decrypt it, while the proxy-to-NGINX leg is
in-cluster HTTP. See the
official [Kubernetes Funnel guide](https://tailscale.com/docs/kubernetes-operator/ingress/expose-workload-to-internet),
[Funnel limits](https://tailscale.com/docs/features/tailscale-funnel), and
[operator ingress guide](https://tailscale.com/docs/kubernetes-operator/ingress).

  </TabPanel>
</TabGroup>

<TabGroup
  title="Private integration egress"
  subtitle="Choose whether Phase must call services on a tailnet."
  slug="private-egress"
>
  <TabPanel title="No Tailscale" slug="none">

No additional Phase configuration is required. Backend and worker replicas
use normal Kubernetes and AKS DNS/routing for public APIs and services
reachable through your Azure virtual network.

  </TabPanel>
  <TabPanel title="Tailscale egress services" slug="tailscale">

Create one operator-managed ExternalName Service per private tailnet target.
Every backend and worker replica can call the stable Service concurrently:

```text
Each backend and worker replica
  → phase-local-llm-gateway:8443
  → Tailscale egress proxy
  == WireGuard-encrypted tailnet connection ==>
  llm-node.tail123abc.ts.net:8443
  → target-local LiteLLM
```

The Service is destination-specific, not a general tailnet or internet
gateway. Another private asset needs another Service, although many Services
can share a production egress ProxyGroup.

Give the target device a dedicated tag. Merge ownership for that target tag
into the existing `tagOwners` object using an appropriate human or
administrative group; the Kubernetes operator does not need to own it:

```json
"tagOwners": {
  "tag:internal-llm-gateway": ["group:network-admins"]
}
```

Then merge a narrow grant into the existing `grants` array. For a target tagged
`tag:internal-llm-gateway`:

```json
"grants": [
  {
    "src": ["tag:phase-aks-egress"],
    "dst": ["tag:internal-llm-gateway"],
    "ip": ["tcp:8443"]
  }
]
```

```yaml {{ title: 'phase-local-llm-gateway.yaml' }}
apiVersion: v1
kind: Service
metadata:
  name: phase-local-llm-gateway
  namespace: phase
  annotations:
    tailscale.com/tailnet-fqdn: "llm-node.tail123abc.ts.net"
    tailscale.com/tags: "tag:phase-aks-egress"
    tailscale.com/proxy-class: "phase-aks-proxy"
spec:
  type: ExternalName
  externalName: placeholder
  ports:
    - name: http
      port: 8443
      protocol: TCP
```

```fish
kubectl apply --dry-run=server \
  -f phase-local-llm-gateway.yaml

kubectl apply -f phase-local-llm-gateway.yaml

kubectl -n phase wait service/phase-local-llm-gateway \
  --for=condition=TailscaleProxyReady \
  --timeout=10m
```

For an HTTP-only target, use the stable Kubernetes address in Phase:

```text
http://phase-local-llm-gateway.phase.svc.cluster.local:8443
```

If the target uses HTTPS with a certificate for its `.ts.net` name, the
Kubernetes hostname will fail certificate validation. Keep the egress Service,
enable in-cluster MagicDNS with Tailscale's
[DNSConfig procedure](https://tailscale.com/docs/kubernetes-operator/egress/enable-magicdns-resolution),
and use the certificate name instead:

```text
https://llm-node.tail123abc.ts.net:8443
```

In this mode DNS resolves the MagicDNS name to the destination-specific egress
proxy. It does not turn the workload pod into a Tailscale node or provide a
general route to other tailnet assets.

Test every backend and worker replica against a non-destructive target health
endpoint. Adapt the URL and authorization mechanism to the service:

```fish
(
set -euo pipefail

for component in backend worker
do
  pods=()
  while IFS= read -r pod
  do
    [ -n "$pod" ] && pods+=("$pod")
  done < <(
    kubectl -n phase get pods \
      -l "app.kubernetes.io/instance=phase-console,app=$component" \
      -o name
  )
  test "${#pods[@]}" -gt 0

  for pod in "${pods[@]}"
  do
    printf '%s: ' "$pod"
    kubectl -n phase exec "$pod" -- \
      python -c '
import urllib.request
url = "http://phase-local-llm-gateway.phase.svc.cluster.local:8443/health"
with urllib.request.urlopen(url, timeout=10) as response:
    print(response.status)
'
  done
done
)
```

Every pod should receive the target's healthy response. Supply credentials
over standard input or an existing Kubernetes Secret when the endpoint
requires authentication; do not paste keys into the command or documentation.

<Note>
  Tailscale encrypts the proxy-to-target tailnet leg with WireGuard, so an
  HTTP-only target is not sent in plaintext across the internet. This is not
  end-to-end HTTPS/TLS: pod-to-proxy and target-daemon-to-local-service hops
  remain ordinary local TCP. Use HTTPS or mTLS when application-layer
  process-to-process encryption is required.
</Note>

The minimal standalone configuration has one proxy replica. It accepts
traffic from any number of Phase replicas, but proxy-layer high availability
requires a multi-replica egress ProxyGroup. Target-side availability remains
a separate concern.

Authorize `tag:phase-aks-egress` to reach only the intended target tag and
ports in your tailnet policy. The Kubernetes Service is not an authorization
boundary inside the cluster: another pod that can connect to it can use the
same proxy. Combine narrow tailnet grants with Kubernetes NetworkPolicy when
cluster workloads are not equally trusted.

Normal workload pods do not automatically become Tailscale clients or resolve
MagicDNS names. Tailscale's optional `DNSConfig` integration can add `.ts.net`
resolution for HTTPS certificate validation, but each destination still
requires an egress proxy.

  </TabPanel>
</TabGroup>

## Upgrading

Back up the database and `phase-console-secret`, update the repositories, and
review the new chart and application release notes:

```fish
helm repo update phase

helm upgrade phase-console phase/phase \
  --version "<new-chart-version>" \
  --namespace phase \
  --values phase-values.yaml \
  --timeout 15m
```

Chart `1.0.2` does not checksum the application ConfigMap in pod templates.
After changing `global.host` or another ConfigMap-backed value, explicitly
restart its consumers:

```fish
kubectl -n phase rollout restart \
  deployment/phase-console-frontend \
  deployment/phase-console-backend \
  deployment/phase-console-worker

kubectl -n phase rollout status \
  deployment/phase-console-frontend
kubectl -n phase rollout status \
  deployment/phase-console-backend
kubectl -n phase rollout status \
  deployment/phase-console-worker
```

## Security and availability

For a Tailscale route, HTTPS terminates at the operator proxy. Restrict direct
access to the internal NGINX load balancer with Azure network controls so it
does not become an unintended bypass around tailnet identity policy.

The CIDR passed to `set_real_ip_from` is also a trust boundary. The validated
Azure CNI Overlay setup trusts the pod CIDR because the standalone Tailscale
proxy can move between pod addresses. Restrict who can edit Ingress
annotations, prevent untrusted pods from reaching NGINX, and narrow the trusted
proxy range when your network design provides a stable smaller range. Never
trust `0.0.0.0/0`, especially when Phase IP-based access rules depend on the
result.

Because TLS terminates at the Tailscale operator proxy on this route, the
backend validates browser request origins for
[CSRF protection](/self-hosting/configuration/reverse-proxy#csrf-protection) (Console `v2.75.0`+)
against the origin derived from `global.host`. Keep it exactly matching the
hostname users visit. Additional origins require an `ALLOWED_ORIGINS` override
on the backend deployment. See
[Load balancers and reverse proxies](/self-hosting/configuration/reverse-proxy#tailscale-serve-funnel).

One optional subnet-level control is the preview
`service.beta.kubernetes.io/azure-allowed-ip-ranges` load-balancer annotation,
set through the AKS application-routing
[`NginxIngressController` resource](https://learn.microsoft.com/azure/aks/app-routing-nginx-configuration).
Determine and verify the real source ranges first. With Azure CNI Overlay,
outbound pod traffic uses node IPs, so an allowlist normally needs the node
subnet and does not isolate one cluster pod from another. See the
[AKS load-balancer restriction guidance](https://learn.microsoft.com/azure/aks/configure-load-balancer-standard#restrict-inbound-traffic-to-specific-ip-ranges)
and add Kubernetes NetworkPolicy for pod-level boundaries.

Before production:

- Replace the bundled single-replica PostgreSQL and Redis workloads with
  managed services or an explicitly designed highly available deployment.
- Run multiple frontend, backend, and worker replicas and enable their pod
  disruption budgets.
- Back up the database and `SERVER_SECRET`, then test restoration.
- Use a multi-replica egress
  [ProxyGroup](https://tailscale.com/docs/kubernetes-operator/egress) and a
  private-ingress ProxyGroup where supported when one proxy is unacceptable.
  This does not make the validated Funnel path highly available.
- Apply Kubernetes NetworkPolicy and narrow Tailscale grants according to
  workload trust boundaries.
- Monitor public authentication and SCIM endpoints when Funnel is enabled.
- Test AKS upgrades and node auto-provisioning consolidation with stateful
  workloads before production.

## Troubleshooting

### AKS cannot allocate a node

Check both total regional quota and the candidate SKU's VM-family quota. A
family limit of zero blocks that SKU even when total regional vCPUs are free.
If both quotas are sufficient, the failure may be live Azure capacity; try
another allowed SKU, zone, or region.

### The Tailscale URL returns NGINX 404

Before Phase is installed, this is expected: the bridge reached internal
NGINX but no Phase Ingress matched the hostname. After installation, compare
the bridge, Phase Ingress, and backend configuration:

```fish
printf 'Bridge: %s\n' "$(kubectl -n app-routing-system get ingress \
  phase-tailscale-bridge \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"

kubectl -n phase get ingress phase-console \
  -o jsonpath='{.spec.rules[0].host}{"\n"}'

kubectl -n phase exec \
  deployment/phase-console-backend -- printenv HOST ALLOWED_HOSTS
```

They must use the same full hostname.

### Audit events show the Tailscale proxy pod address

Without the real-IP annotation in the Tailscale values, AKS managed NGINX
replaces Tailscale's client address and Phase records an overlay address such
as `10.244.x.x`. Compare the cluster pod CIDR with the live Phase Ingress:

```fish
az aks show \
  --resource-group "phase-aks-rg" \
  --name "phase-aks" \
  --query networkProfile.podCidr \
  --output tsv

kubectl -n phase get ingress phase-console \
  -o jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}{"\n"}'
```

Correct the CIDR in `phase-values.yaml`, rerun the Helm upgrade from **Install
Phase**, and create a new audit event. Private tailnet events should
show a Tailscale IPv4 or IPv6 address; Funnel events should show the public
client address. Older events keep their original recorded value.

### The frontend calls an invalid or old API hostname

Install ingress first and put its final hostname into `global.host` and the
matching chart-managed or custom Ingress host. If the values were corrected
after installation, run the three rollout restarts in the upgrade section and
clear the old site's browser cache.

### Helm appears stuck on migrations

The backend, worker, and frontend init containers wait for database
migrations. Inspect the migration hook while Helm is still running:

```fish
kubectl -n phase get pods
kubectl -n phase logs \
  job/phase-console-migrations --all-containers
```

Check PostgreSQL and Redis connectivity, credentials, PVC binding, and node
capacity. Do not delete the hook until the underlying failure is understood.

### The egress Service never becomes ready

Operator `1.98.9` reports `TailscaleProxyReady=True`. Older examples may name
a different condition. Inspect the Service, proxy pods, operator logs, target
hostname, tag ownership, and grants:

```fish
kubectl -n phase describe service phase-local-llm-gateway
kubectl -n tailscale get pods
kubectl -n tailscale logs deployment/operator --tail=200
```

### Funnel appears private during testing

A tailnet client resolves the `.ts.net` hostname to its private Tailscale
address. Use the DNS-over-HTTPS and `curl --resolve` checks above to force the
public path. A direct `dig @1.1.1.1` can still be intercepted by local
Tailscale DNS.

## Uninstalling

Remove Phase without deleting its Kubernetes Secret or persistent volume
claims:

```fish
helm uninstall phase-console \
  --namespace phase

kubectl -n phase get secret,pvc
```

Deleting `phase-console-secret` or the PostgreSQL PVC is destructive. Retain
them unless you intentionally want to discard the deployment's encrypted data.

If no other workload uses them, remove only the Phase-specific manifest files
that exist on the current machine:

```fish
for manifest in \
  phase-local-llm-gateway.yaml \
  tailscale-bridge.yaml \
  tailscale-proxy-class.yaml
do
  if [ -f "$manifest" ]
  then
    kubectl delete -f "$manifest" --ignore-not-found
  fi
done
```

Uninstall the operator only when no other cluster resource uses it:

```fish
helm uninstall tailscale-operator --namespace tailscale
```

Revoke its OAuth client in the Tailscale admin console. Disable AKS
application routing only after confirming that no other cluster Ingress uses
the controller.
