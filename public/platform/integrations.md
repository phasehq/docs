import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Integrations work in Phase — automatically sync secrets to third-party platforms and services.'

<Tag variant="small">PLATFORM</Tag>

# Integrations

Integrations in Phase allow you to automatically sync secrets from your [Environments](/platform/environments) to third-party platforms and services. When secrets change, connected integrations are triggered automatically — keeping your external services in sync without manual intervention.

<DocActions />

## How Integrations Work

Integrations connect at the Environment level within an [App](/platform/apps). When you set up an integration, you select:

1. **The target service** — Where secrets should be synced to
2. **The source Environment** — Which Environment's secrets to sync from
3. **The secrets to sync** — Optionally filter which secrets are included

Once configured, any change to secrets in that Environment (create, update, or delete) automatically triggers a sync to all connected integrations. This ensures your external platforms always have the latest secret values.

## Requirements

### Server-Side Encryption (SSE)

All sync integrations require [SSE to be enabled](/platform/apps#encryption-modes) on the App. This is because the Phase server needs to decrypt secrets in order to push them to external services. Without SSE, the server cannot access secret values and syncing is not possible.

### Integration Credentials

Most integrations require credentials to authenticate with the target service. These are stored as **Integration Credentials** at the Organisation level and can be reused across multiple integrations. Examples include:

- AWS access keys or IAM role ARNs
- GitHub personal access tokens or app installations
- Vercel API tokens
- Azure service principal credentials

Integration Credentials are managed separately from your application secrets and are subject to their own [RBAC permissions](/platform/access).

### Secret References

When syncing secrets that use [cross-environment or cross-application references](/platform/secrets#secret-referencing), all referenced secrets must be resolvable. If a reference points to a secret that doesn't exist or an App without SSE enabled, the sync will fail. This is by design — Phase never pushes broken or unresolved references to third-party platforms.

## Supported Platforms

Phase supports syncing to a wide range of platforms across several categories:

### CI/CD

| Platform | Description |
| -------- | ----------- |
| [GitHub Actions](/integrations/platforms/github-actions) | Sync secrets to GitHub Actions repository or environment secrets |
| [GitHub Dependabot](/integrations/platforms/github-dependabot) | Sync secrets for Dependabot |
| [GitLab CI](/integrations/platforms/gitlab-ci) | Sync secrets to GitLab CI/CD variables |
| [CircleCI](/integrations/platforms/circleci) | Sync secrets to CircleCI project environment variables |
| [Jenkins](/integrations/platforms/jenkins) | Sync secrets to Jenkins credentials |
| [AWS CodeBuild](/integrations/platforms/aws-codebuild) | Sync secrets to AWS CodeBuild environment variables |
| [Azure Pipelines](/integrations/platforms/azure-pipelines) | Sync secrets to Azure Pipelines variables |
| [Travis CI](/integrations/platforms/travis-ci) | Sync secrets to Travis CI environment variables |
| [Bitbucket Pipelines](/integrations/platforms/bitbucket-pipelines) | Sync secrets to Bitbucket Pipelines variables |
| [TeamCity](/integrations/platforms/teamcity) | Sync secrets to TeamCity build parameters |
| [Drone CI](/integrations/platforms/drone-ci) | Sync secrets to Drone CI |
| [Buildkite](/integrations/platforms/buildkite) | Sync secrets to Buildkite pipelines |

### Cloud Providers

| Platform | Description |
| -------- | ----------- |
| [AWS Secrets Manager](/integrations/platforms/aws-secrets-manager) | Sync secrets to AWS Secrets Manager |
| [AWS IAM](/integrations/platforms/aws-iam) | Dynamic credentials via IAM |
| [Azure Key Vault](/integrations/platforms/azure-key-vault) | Sync secrets to Azure Key Vault |
| [HashiCorp Vault](/integrations/platforms/hashicorp-vault) | Sync secrets to HashiCorp Vault |
| [HashiCorp Terraform](/integrations/platforms/hashicorp-terraform) | Inject secrets into Terraform workflows |
| [HashiCorp Nomad](/integrations/platforms/hashicorp-nomad) | Sync secrets to Nomad job variables |

### Containers & Orchestration

| Platform | Description |
| -------- | ----------- |
| [Docker](/integrations/platforms/docker) | Inject secrets into Docker containers |
| [Docker Compose](/integrations/platforms/docker-compose) | Inject secrets into Docker Compose services |
| [Kubernetes](/integrations/platforms/kubernetes) | Sync secrets to Kubernetes Secrets |
| [AWS ECS](/integrations/platforms/aws-elastic-container-service) | Sync secrets to ECS task definitions |

### Hosting & Deployment

| Platform | Description |
| -------- | ----------- |
| [Vercel](/integrations/platforms/vercel) | Sync secrets to Vercel project environment variables |
| [Railway](/integrations/platforms/railway) | Sync secrets to Railway service variables |
| [Render](/integrations/platforms/render) | Sync secrets to Render service environment variables |
| [Cloudflare Workers](/integrations/platforms/cloudflare-workers) | Sync secrets to Cloudflare Workers |
| [Cloudflare Pages](/integrations/platforms/cloudflare-pages) | Sync secrets to Cloudflare Pages |

## Sync Behaviour

### Automatic Triggering

Syncs are triggered automatically whenever secrets in the connected Environment are deployed. This includes:

- Creating new secrets
- Updating existing secret values
- Deleting secrets
- Changes propagated from secret references

### Failure Handling

If a sync fails (due to invalid credentials, network issues, or unresolvable references), the failure is logged in the App's [audit logs](/platform/apps#audit-logs). The secrets in Phase remain unaffected — a sync failure does not roll back changes to your secrets.

### One-Way Sync

Integrations are one-way: secrets flow **from Phase to the target platform**. Changes made directly on the target platform are not synced back to Phase and may be overwritten on the next sync.

## Managing Integrations

Integrations can be configured from the **Syncing** tab within an App in the [Phase Console](/console/apps#syncing). Each integration has its own setup guide — see the individual platform pages linked above for specific configuration steps.
