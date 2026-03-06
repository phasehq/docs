# Troubleshooting Guide

Common issues encountered when deploying Phase Console on Kubernetes, and how to fix them.

## LoadBalancer Shows `<pending>` EXTERNAL-IP

**Symptom:** `kubectl get svc -n ingress-nginx ingress-nginx-controller` shows `<pending>` under EXTERNAL-IP and never resolves.

**Cause:** The cluster does not have a cloud provider integration or load balancer controller that can provision an external IP.

**Common scenarios:**
- **Bare metal cluster** — No cloud provider, so `LoadBalancer` services can't be fulfilled. Install MetalLB (https://metallb.universe.tf/) to provide LoadBalancer IPs from a pool, or switch to a `NodePort` service.
- **Local cluster (kind, minikube, k3s)** — Use `minikube tunnel` (for Minikube) or configure MetalLB.
- **Cloud cluster with missing permissions** — The cluster service account may lack permission to create cloud load balancers. Check IAM roles/permissions.

**Quick workaround with NodePort (no external LB needed):**

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=NodePort \
  --set controller.service.nodePorts.http=30080 \
  --set controller.service.nodePorts.https=30443
```

Then point your DNS to a node's external IP and use port-based routing, or put a reverse proxy in front.

## kubectl Not Connected to Cluster

**Symptom:** `kubectl cluster-info` fails with a connection error.

**Fix:** Ensure your kubeconfig is correctly configured. The exact command depends on your cluster provider:

- **GKE:** `gcloud container clusters get-credentials <cluster-name> --region <region>`
- **AKS:** `az aks get-credentials --resource-group <rg> --name <cluster-name>`
- **DigitalOcean:** `doctl kubernetes cluster kubeconfig save <cluster-name>`
- **Generic / self-managed:** Copy the kubeconfig from the control plane or cluster admin

After running the appropriate command, retry `kubectl cluster-info`.

## No Default StorageClass

**Symptom:** Phase Postgres or Redis PVCs stay in `Pending` state. `kubectl describe pvc <name>` shows no matching StorageClass.

**Diagnosis:**

```bash
kubectl get storageclass
kubectl describe pvc
```

**Fix:** Either:

1. Install a StorageClass appropriate for your environment (see `k8s-deployment.md` for options), or
2. Set an existing StorageClass as default:
   ```bash
   kubectl patch storageclass <name> \
     -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```
3. Switch to external databases — provide your own managed Postgres and Redis.

## Certificate Not Issuing

**Symptom:** `kubectl get certificate` shows the certificate in a non-Ready state. The site is not accessible via HTTPS.

**Cause:** Usually one of:
1. DNS CNAME/A record not set up or not propagated yet
2. cert-manager can't reach the ACME solver (HTTP-01 challenge requires the domain to resolve to the ingress)
3. Port 80 is blocked (HTTP-01 challenge must be reachable from the internet)
4. ClusterIssuer misconfigured

**Diagnosis:**

```bash
kubectl describe certificate phase-tls
kubectl logs -l app.kubernetes.io/name=cert-manager -n cert-manager
kubectl get orders
kubectl get challenges
```

**Common fixes:**
- Ensure the DNS record points to the ingress EXTERNAL-IP
- Verify DNS propagation with multiple resolvers (see below)
- Check port 80 is open on the node/firewall
- Verify the ClusterIssuer: `kubectl get clusterissuer letsencrypt-prod -o yaml`

## DNS Not Propagating

**Symptom:** After creating the DNS record, dig returns NXDOMAIN or an old value. cert-manager ACME challenges fail.

**Fix:** Verify using multiple DNS resolvers before proceeding:

```bash
dig @8.8.8.8 ${DOMAIN} +short        # Google
dig @1.1.1.1 ${DOMAIN} +short        # Cloudflare
dig @9.9.9.9 ${DOMAIN} +short        # Quad9
dig @208.67.222.222 ${DOMAIN} +short  # OpenDNS
```

Wait until at least 3 of 4 resolvers return the correct value. Propagation can take minutes to hours depending on TTL.

## Pods CrashLooping

**Symptom:** Pods restart repeatedly with `CrashLoopBackOff` status.

**Diagnosis:**

```bash
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl describe pod <pod-name>
```

**Common causes:**
- **Missing secret keys** — The Kubernetes secret wasn't created or is missing required keys. Verify: `kubectl get secret phase-console-secret -o json | jq '.data | keys'`
- **Database not reachable** — Incorrect host/port in values.yaml, or firewall/security group blocking access
- **Wrong database password** — The password in the secret doesn't match what the database expects

## Pods Stuck in Pending

**Symptom:** `kubectl get pods` shows pods in `Pending` for an extended time.

**Diagnosis:**

```bash
kubectl describe pod <pod-name>
```

**Common causes:**
- **Insufficient resources** — Nodes don't have enough CPU/memory. Check: `kubectl describe nodes`
- **No default StorageClass** — PVCs can't bind. See "No Default StorageClass" above.
- **Taints/tolerations** — Nodes have taints that pods don't tolerate. Check node taints: `kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints`

## NGINX 502/504 Errors

**Symptom:** The site loads but returns 502 Bad Gateway or 504 Gateway Timeout.

**Diagnosis:**

```bash
kubectl logs -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx
kubectl get pods -l app=backend
kubectl describe ingress
```

**Common causes:**
- Backend pods are not ready yet (still migrating the database)
- Ingress host doesn't match the domain in values.yaml
- Backend service not found (Helm chart not fully applied)

## Ingress Class Not Found

**Symptom:** Ingress is created but has no address. `kubectl describe ingress` shows an event like "ingress class not found".

**Cause:** The `className` in the values file doesn't match an installed IngressClass.

**Fix:**

```bash
kubectl get ingressclass
```

Use the exact name shown. Update `phase-values.yaml`:

```yaml
ingress:
  className: "<exact-class-name>"
```

Then upgrade:

```bash
helm upgrade phase-console phase/phase -f phase-values.yaml
```

## PR_CONNECT_RESET_ERROR — Proxy Protocol Mismatch

**Symptom:** After enabling proxy protocol, all connections fail with `PR_CONNECT_RESET_ERROR` or `connection reset by peer`.

**Cause:** Proxy protocol is enabled on one side but not the other. Both the load balancer and NGINX must be configured together.

**Fix:** Ensure both are enabled or both are disabled. To disable:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.publishService.enabled=true \
  --set controller.service.type=LoadBalancer
```

To enable (cloud providers that support it):

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.config.use-proxy-protocol="true"
```

And enable proxy protocol on the cloud load balancer side via the appropriate annotation for your provider.
