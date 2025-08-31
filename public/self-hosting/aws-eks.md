import { Tag } from '@/components/Tag'

export const description =
  'Deploy Phase via Helm on your AWS Elastic Kubernetes Service (EKS) cluster.'

<Tag variant="small">SELF-HOSTING</Tag>

# AWS EKS Helm Deployment

Learn how to set up the Phase Console using Helm on AWS Elastic Kubernetes Service (EKS). {{ className: 'lead' }}

This guide will walk you through installing the Phase Console on an AWS EKS cluster. This setup utilizes AWS native services where appropriate, such as Elastic Block Store (EBS) for persistent storage via a default StorageClass, and an AWS Load Balancer to expose the NGINX Ingress controller. By default, the installation includes:

- Phase Console
- Database services (PostgreSQL and Redis) running inside the cluster
- NGINX ingress controller (exposed via AWS Load Balancer)
- Let's Encrypt certificate for TLS via cert-manager

This guide assumes you are setting up Phase Console with in-cluster databases. For external databases, you will need to adjust the Helm chart [values](https://github.com/phasehq/kubernetes-secrets-operator/blob/main/phase-console/values.yaml) accordingly. This entire guide can be completed in a CloudShell in the AWS Console in 30 minutes.

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
- **Storage**: 50Gi for PostgreSQL (backed by AWS EBS)

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
kubectl wait --for=condition=Ready pods -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=60s
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

### 5. Create Default StorageClass for PostgreSQL

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
This `StorageClass` named `auto-ebs-sc` will be used by PostgreSQL for data persistence.

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

### 9. Deploy Phase Console

With the EKS cluster, cert-manager, StorageClass, and NGINX Ingress Controller configured, you are now ready to install Phase Console.

Please follow **Steps 6 through 11** from our general [Kubernetes Helm Deployment guide](/self-hosting/kubernetes#6-add-the-phase-helm-repository) to complete the installation. These steps cover:

- Adding the Phase Helm repository
- Creating the Kubernetes managed secret for Phase Console
- Creating the `phase-values.yaml` configuration file
- Installing the Phase Helm chart
- Verifying the deployment
- Accessing your Phase Console

## Upgrading

To upgrade your Phase Console deployment, first update the Helm repository and then upgrade the release using your `phase-values.yaml` file:

```fish
helm repo update
helm upgrade phase-console phase/phase -f phase-values.yaml
```

## Uninstalling

To uninstall Phase Console from your EKS cluster:

```fish
helm uninstall phase-console
```

<Note>
You may also need to manually delete related resources like PersistentVolumeClaims (EBS volumes) if they are not automatically removed, and clean up DNS records.
</Note>
