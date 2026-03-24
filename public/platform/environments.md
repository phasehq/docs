import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Environments work in Phase — the stages of your development workflow that organise secrets within an App.'

<Tag variant="small">PLATFORM</Tag>

# Environments

Environments in Phase represent the stages of your development workflow. They live inside [Apps](/platform/apps) and hold [Secrets](/platform/secrets) that are specific to that stage — such as development database credentials, staging API keys, or production configuration.

<DocActions />

## How Environments Work

Each Environment within an App is an isolated container of secrets. The same secret key (e.g. `DATABASE_URL`) can exist in multiple Environments with different values — allowing you to maintain separate configuration for each stage of your workflow without any overlap.

Environments also serve as the finest-grained unit of access control. Users can be granted access to specific Environments within an App, so a developer might have access to Development and Staging but not Production.

## Default Environments

When you create a new App, Phase automatically initializes it with three default Environments:

| Environment | Purpose |
| ----------- | ------- |
| **Development** | Local development and testing. Typically contains secrets for local databases, debug-mode API keys, and development service endpoints. |
| **Staging** | Pre-production testing. Mirrors the production setup but with separate credentials and endpoints for safe testing before deployment. |
| **Production** | Live production configuration. Contains the real credentials, API keys, and endpoints used by your deployed application. |

These defaults provide a standard structure that works for most projects. You can rename, remove, or add additional Environments to match your specific workflow.

## Custom Environments

Beyond the defaults, you can create custom Environments to match your development process. Common examples include:

- **QA** — Dedicated quality assurance testing
- **Preview** — Short-lived preview or feature-branch deployments
- **DR** — Disaster recovery configuration
- **Local** — Shared local development overrides
- **CI** — CI/CD pipeline-specific configuration

<Note>
The ability to create and manage custom Environments is available for Organisations with a Phase Pro or Enterprise tier subscription.
</Note>

## Naming Rules

Environment names must follow these constraints:

- Can contain: letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_)
- Must be between 1 and 32 characters long
- Must match the pattern: `^[a-zA-Z0-9\-_]{1,32}$`

Choose descriptive names that clearly communicate the purpose of each Environment to your team.

<Warning>
Renaming an Environment will affect how you construct secret references. Any cross-environment references using the old name will need to be updated.
</Warning>

## Folders and Paths

Within each Environment, secrets can be organised into folders using a path structure. This is useful for grouping related secrets:

```
/                         # Root path
/frontend/                # Frontend-specific secrets
/backend/                 # Backend-specific secrets
/backend/payments/        # Payment service secrets
```

Paths are used in [secret referencing](/platform/secrets#secret-referencing) to access secrets in specific folders, and when fetching secrets through the CLI, SDKs, or API.

## Access Control

Environment access is the most granular level of access control in Phase:

- **Organisation Owners and Admins** have access to all Environments by default
- **Developers** are granted access to specific Environments when they are added to an App
- **Service Accounts** are scoped to specific Environments when added to an App

When a user is added to an App, you select which Environments they can access. This can be updated at any time by an Owner or Admin.

## Environments and Integrations

Each Environment can have its own set of sync integrations. When secrets in an Environment are updated, all connected integrations for that Environment are automatically triggered. This means you can configure Production to sync to AWS Secrets Manager while Development syncs to a local Docker setup.

## Managing Environments

Environments can be created and managed through the [Phase Console](/console/environments), the [CLI](/cli/commands), or the [API](/public-api).

<Warning>
Deleting an Environment will permanently delete all Secrets and Integrations associated with it. This action cannot be undone.
</Warning>
