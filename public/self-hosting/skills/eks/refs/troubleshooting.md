# Troubleshooting Guide

Common issues encountered when deploying Phase Console on AWS EKS, and how to fix them.

## PR_CONNECT_RESET_ERROR — Proxy Protocol Mismatch

**Symptom:** After enabling proxy protocol, all connections to the site fail with `PR_CONNECT_RESET_ERROR` in the browser (or `connection reset by peer` in curl).

**Cause:** Proxy protocol is enabled on one side but not the other. Both the NLB target groups and the NGINX ingress controller must agree:
- If NGINX expects proxy protocol headers but the NLB is not sending them → connection reset
- If the NLB is sending proxy protocol headers but NGINX is not configured to read them → connection reset

**Fix:** Ensure both are enabled together in a single `helm upgrade` command:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.publishService.enabled=true \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-target-group-attributes"="proxy_protocol_v2.enabled=true" \
  --set controller.config.use-proxy-protocol="true"
```

If you need to disable proxy protocol (e.g., to restore connectivity while debugging), remove both settings:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.publishService.enabled=true \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing
```

The change may take up to a minute to propagate.

## EKS Auto Mode Reverts Manual Target Group Changes

**Symptom:** You manually enabled proxy protocol on the NLB target groups via the AWS Console or CLI (`aws elbv2 modify-target-group-attributes`), but it keeps getting reverted back to disabled.

**Cause:** EKS Auto Mode continuously reconciles target group settings. It manages the NLB and its target groups, and will revert any manual modifications to match its desired state.

**Fix:** Do not manually modify target group attributes. Instead, use the service annotation which tells the EKS Auto Mode controller what settings to maintain:

```
service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: proxy_protocol_v2.enabled=true
```

This is set via Helm `--set` as shown in the proxy protocol fix above.

## aws-load-balancer-proxy-protocol Annotation Not Supported

**Symptom:** You set `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"` but proxy protocol is not being enabled on the NLB target groups.

**Cause:** The `aws-load-balancer-proxy-protocol` annotation is for the AWS Load Balancer Controller (ALB Controller) and Classic Load Balancers. It is **not supported** in EKS Auto Mode, which manages NLBs directly.

**Fix:** Use the `aws-load-balancer-target-group-attributes` annotation instead:

```
service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: proxy_protocol_v2.enabled=true
```

## Internal Cluster IPs in Audit Logs

**Symptom:** Phase audit logs show internal cluster IPs (like `192.168.x.x`) instead of real client IP addresses.

**Cause:** Proxy protocol is not enabled. Without it, the NLB performs DNAT and the original client IP is lost by the time packets reach NGINX.

**Fix:** Enable proxy protocol v2 on both the NLB (via annotation) and NGINX (via config). See the proxy protocol section in the deployment reference.

After enabling, verify by checking audit logs or running:

```bash
kubectl logs -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx | grep "X-Real-IP"
```

## CloudFormation Stack Already Exists

**Symptom:** `eksctl create cluster` fails with an error like:

```
creating CloudFormation stack "eksctl-phase-eks-cluster-cluster": already exists
```

**Cause:** A previous cluster creation attempt left behind a CloudFormation stack. This can happen if a previous `eksctl create cluster` was interrupted or if `eksctl delete cluster` didn't fully clean up.

**Fix:**

1. Check the stack status:
   ```bash
   aws cloudformation describe-stacks \
     --stack-name eksctl-${CLUSTER_NAME}-cluster \
     --region ${REGION} \
     --query 'Stacks[0].StackStatus'
   ```

2. If it's in `DELETE_IN_PROGRESS`, wait for it to complete:
   ```bash
   aws cloudformation wait stack-delete-complete \
     --stack-name eksctl-${CLUSTER_NAME}-cluster \
     --region ${REGION}
   ```

3. If it's in `ROLLBACK_COMPLETE` or `DELETE_FAILED`, delete it manually:
   ```bash
   aws cloudformation delete-stack \
     --stack-name eksctl-${CLUSTER_NAME}-cluster \
     --region ${REGION}
   ```
   Then wait for deletion to complete before retrying `eksctl create cluster`.

4. If the stack is in `CREATE_COMPLETE`, a cluster already exists. Either use it or delete it first:
   ```bash
   eksctl delete cluster --name ${CLUSTER_NAME} --region ${REGION}
   ```

## Certificate Not Issuing

**Symptom:** `kubectl get certificate` shows the certificate in a non-Ready state. The site is not accessible via HTTPS.

**Cause:** Usually one of:
1. DNS CNAME not set up or not propagated yet
2. cert-manager can't reach the ACME solver (HTTP-01 challenge requires the domain to resolve to the NLB)
3. ClusterIssuer misconfigured

**Diagnosis:**

```bash
# Check certificate status
kubectl describe certificate phase-tls

# Check cert-manager logs
kubectl logs -l app.kubernetes.io/name=cert-manager -n cert-manager

# Check if an Order was created
kubectl get orders

# Check if a Challenge was created
kubectl get challenges
```

**Common fixes:**
- Ensure the DNS CNAME record points to the NLB hostname
- Wait for DNS propagation (can take minutes to hours depending on TTL)
- Verify the ClusterIssuer exists and has the correct email: `kubectl get clusterissuer letsencrypt-prod -o yaml`
- Check that port 80 is reachable from the internet (required for HTTP-01 challenges)

## Interactive CLI Commands Need the Terminal

**Symptom:** Running `aws configure` or `aws sso login` via the agent fails or hangs.

**Cause:** These commands require interactive terminal input (prompts for credentials or browser-based authentication) and cannot be run non-interactively by the agent.

**Fix:** The agent should instruct the user to run these commands in their own terminal:

- `aws configure` — Prompts for access key, secret key, region, output format
- `aws sso login` / `aws sso configure` — Opens a browser for SSO authentication

Note: `eksctl create cluster` is run directly by the agent — it is non-interactive and the agent waits for it to complete.

## kubectl Not Connected After Cluster Creation

**Symptom:** `kubectl get pods -A` fails with a connection error immediately after `eksctl create cluster` completes.

**Cause:** The local kubeconfig was not updated, or the context was not switched to the new cluster.

**Fix:** Update the kubeconfig explicitly:

```bash
aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}
```

Then retry `kubectl get pods -A`. If it still fails, verify the cluster is active:

```bash
aws eks describe-cluster --name ${CLUSTER_NAME} --region ${REGION} \
  --query 'cluster.status' --output text
```

## Subnet Group Creation Fails with "Invalid Subnets"

**Symptom:** `aws rds create-db-subnet-group` or `aws elasticache create-cache-subnet-group` fails with an error like "Some input subnets are invalid."

**Cause:** The subnet IDs were filtered using the CloudFormation logical ID pattern `SubnetPrivate*`, which uses uppercase region names (e.g., `SubnetPrivateAPSOUTH1A`) that don't match a simple wildcard in some regions. The AWS CLI also returns subnet IDs tab-separated, which the RDS/ElastiCache CLI doesn't accept.

**Fix:** Filter subnets by the `kubernetes.io/role/internal-elb` tag instead, and convert tab-separated output to space-separated:

```bash
SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
            "Name=tag:kubernetes.io/role/internal-elb,Values=1" \
  --query 'Subnets[*].SubnetId' --output text \
  --region ${REGION} | tr '\t' ' ')
```

## DNS Not Propagating

**Symptom:** After creating the CNAME record, `dig` returns NXDOMAIN or the old value. cert-manager ACME challenges fail.

**Cause:** DNS propagation takes time — anywhere from seconds to hours depending on the TTL of the record and how aggressively upstream resolvers cache. Different resolvers may see different results during propagation.

**Fix:** Verify using multiple DNS resolvers before proceeding:

```bash
dig @8.8.8.8 ${DOMAIN} +short        # Google
dig @1.1.1.1 ${DOMAIN} +short        # Cloudflare
dig @9.9.9.9 ${DOMAIN} +short        # Quad9
dig @208.67.222.222 ${DOMAIN} +short  # OpenDNS
```

Wait until at least 3 of 4 resolvers return the correct NLB hostname or IP. Do not proceed to Phase deployment until DNS is confirmed — the cert-manager HTTP-01 challenge requires the domain to resolve to the NLB.

## Pods Stuck in Pending State

**Symptom:** `kubectl get pods` shows pods in `Pending` state for an extended time.

**Diagnosis:**

```bash
kubectl describe pod <pod-name>
```

**Common causes:**
- **Insufficient resources:** The node doesn't have enough CPU/memory. EKS Auto Mode should scale automatically, but it may take a few minutes.
- **No default StorageClass:** PostgreSQL PVC can't bind. Check: `kubectl get storageclass`
- **PVC pending:** Check: `kubectl get pvc`

## Pods CrashLooping

**Symptom:** Pods restart repeatedly, showing `CrashLoopBackOff` status.

**Diagnosis:**

```bash
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
```

**Common causes:**
- **Missing secrets:** The Kubernetes secret wasn't created or is missing required keys
- **Database not reachable:** RDS/ElastiCache security group doesn't allow traffic from the cluster, or endpoints are wrong in values.yaml
- **Migration failure:** The migration job failed — check migration pod logs

## NGINX Ingress 502/504 Errors

**Symptom:** The site loads but returns 502 Bad Gateway or 504 Gateway Timeout.

**Diagnosis:**

```bash
# Check NGINX ingress controller logs
kubectl logs -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx

# Check backend pod readiness
kubectl get pods -l app=backend

# Check ingress configuration
kubectl describe ingress
```

**Common causes:**
- Backend pods are not ready yet (still starting or migrating)
- Ingress host doesn't match the domain in values.yaml
- Backend service not found (Helm chart not fully installed)

## Security Group Issues with External Databases

**Symptom:** Backend pods can't connect to RDS or ElastiCache. Logs show connection timeout or connection refused.

**Diagnosis:**

```bash
# Check the security group rules
aws ec2 describe-security-groups \
  --group-ids <sg-id> \
  --region ${REGION}

# Verify the VPC CIDR used by the cluster
aws ec2 describe-vpcs \
  --vpc-id <vpc-id> \
  --query 'Vpcs[0].CidrBlock' \
  --region ${REGION}
```

**Fix:** Ensure the security group allows inbound traffic on:
- Port 5432 (PostgreSQL) from the VPC CIDR
- Port 6379 (Redis) from the VPC CIDR

The default VPC CIDR for eksctl clusters is `192.168.0.0/16`. If your cluster uses a different CIDR, update the security group rules accordingly.
