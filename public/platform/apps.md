import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Apps work in Phase — the core unit for organising secrets by project, repository, or service.'

<Tag variant="small">PLATFORM</Tag>

# Apps

An App in Phase represents a single project, repository, or service. It is the primary unit for organising and managing [Secrets](/platform/secrets). Each App contains one or more [Environments](/platform/environments), and access to secrets is controlled at both the App and Environment level.

<DocActions />

## Structure

Every App has:

- **Environments** — Stages of your development workflow (e.g. Development, Staging, Production), each containing their own set of secrets
- **Members** — Organisation users who have been granted access to this App, with per-Environment access scoping
- **Service Accounts** — Non-human identities that can access secrets in this App for automation and CI/CD
- **Syncing** — Integrations that automatically deploy secrets to third-party platforms
- **Logs** — Audit trail of all CRUD events for secrets and environments
- **Settings** — App-level configuration, encryption mode, and readme
- **Readme** — A markdown document for developer documentation, runbooks, or onboarding notes

## Default Setup

When you create a new App, it is automatically initialized with three default Environments:

- **Development**
- **Staging**
- **Production**

You can optionally initialize the App with example secrets to help you get started. You can customize these defaults by adding, renaming, or removing Environments after creation.

## Encryption Modes

Phase Apps support two encryption modes that determine how secrets are stored and who can access them:

### End-to-End Encryption (E2EE)

This is the default mode for all new Apps. With E2EE:

- Secrets are encrypted and decrypted entirely on the client side
- Only users who have been granted access can decrypt secrets
- The Phase server never has access to plaintext secret values


### Server-Side Encryption (SSE)

SSE can be enabled on top of E2EE for Apps that need to use features requiring server-side access to secrets:

- A copy of each Environment's root key is stored on the server, encrypted with the server's encryption key
- This allows the server to decrypt secrets for specific operations
- SSE is **required** for:
  - Third-party sync integrations (GitHub Actions, AWS, Vercel, etc.)
  - The [public REST API](/public-api)
  - [Dynamic Secrets](/platform/dynamic-secrets)

SSE is an additive feature — it does not disable E2EE. Client-side encryption is always active regardless of whether SSE is enabled.

<Note>
Enabling SSE is a one-way operation for an App. Once enabled, it cannot be disabled.
</Note>

## Access Control

Access to an App is managed at two levels:

### App-Level Access

Users must be explicitly added to an App before they can access any of its secrets. Organisation Owners and Admins automatically have access to all Apps.

### Environment-Level Access

Within an App, access can be further scoped to specific Environments. When adding a user to an App, you select which Environments they can access. This allows fine-grained control — for example, a developer might have access to Development and Staging, but not Production.

### Service Accounts

[Service Accounts](/access-control/service-accounts) are non-human identities that can be added to an App with access scoped to specific Environments. They are used for CI/CD pipelines, automation, and other machine-to-machine workflows.

## Secret Syncing

Phase can automatically sync secrets to third-party platforms and services. When configured, any change to secrets in an Environment triggers an automatic deployment to the connected integrations.

Supported sync targets include:

- GitHub Actions & Dependabot
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault & Nomad
- Vercel, Railway, Render
- Cloudflare Workers & Pages
- And [many more](/integrations/platforms/docker)

Syncing requires SSE to be enabled for the App, along with appropriate credentials for the target service.

## Audit Logs

Every App maintains a complete audit trail of all operations on its secrets and environments. Log entries capture:

- The operation type (create, read, update, delete)
- The user or service account that performed the action
- Timestamp and metadata
- The specific secrets and environments affected

Logs are accessible from the App's Logs tab in the Console, and can be expanded to view detailed information about each event.

## App Readme

Each App can have a readme written in Markdown. The readme is displayed on the App's Home tab and is a good place for:

- Developer onboarding documentation
- Runbooks and operational procedures
- Notes about the App's secret structure and conventions
- Links to related resources

## Managing Apps

Apps can be created and managed through the [Phase Console](/console/apps), the [CLI](/cli/commands), or the [API](/public-api).

<Warning>
Deleting an App will permanently delete all Environments and Secrets associated with it. This action cannot be undone.
</Warning>
