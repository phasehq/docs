import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Secrets work in Phase — encrypted key-value pairs for storing application configuration, credentials, and sensitive data.'

<Tag variant="small">PLATFORM</Tag>

# Secrets

Secrets are the fundamental unit of data in Phase. They are encrypted key-value pairs used to store application configuration, API keys, database credentials, and other sensitive values. Secrets live inside [Environments](/platform/environments), which live inside [Apps](/platform/apps).

<DocActions />

## How Secrets Work

Every secret in Phase consists of:

- **Key** — The identifier for the secret (e.g. `DATABASE_URL`, `API_KEY`, `STRIPE_SECRET`)
- **Value** — The sensitive data itself
- **Type** — Controls visibility and behavior (Secret, Sealed, or Config)
- **Tags** — Optional labels for categorisation
- **Comment** — Optional notes or documentation
- **Path** — The folder location within the Environment (defaults to `/`)

All secrets are end-to-end encrypted regardless of type. The Phase server never has access to plaintext secret values when E2EE is the active encryption mode.

### Key Naming Convention

Secret keys should follow the `UPPER_SNAKE_CASE` convention (e.g. `DATABASE_URL`, `API_KEY`, `JWT_SECRET`). Keys cannot be empty, and no two secrets can share the same key within the same Environment and path.

## Secret Types

Every secret has a type that controls its behavior and visibility in the UI. The type does not affect encryption — all secrets are encrypted the same way regardless of type.

| Type | Description |
| ---- | ----------- |
| **Secret** | The default type. Values are masked in the UI until explicitly revealed. Suitable for most credentials, API keys, and sensitive configuration. |
| **Sealed** | Write-once secrets designed for the most sensitive values. After saving, the plaintext value is permanently redacted in the Console UI and cannot be revealed. The type cannot be changed once saved. Sealed secrets are intended to be written once and only consumed at runtime via `phase run`, integrations, or the API — never browsed or copied from the UI. Use this for root database credentials, signing keys, encryption keys, and other high-sensitivity values. |
| **Config** | Non-sensitive configuration values (e.g. `APP_NAME`, `LOG_LEVEL`, `REGION`). Values are shown in plaintext by default without masking. Use this to distinguish configuration from credentials. |

A secret's type can be changed at any time — except for Sealed secrets, which are permanently locked once saved.

<Warning>
Once a Sealed secret is saved, its type is permanently locked. You cannot unseal a secret or change it to another type. To replace it, delete the secret and create a new one.
</Warning>

## Secret Referencing

Secrets can reference the values of other secrets using a variable substitution syntax. This is resolved at read time and works across Environments, folders, and even across Apps. This is especially useful for composed values like database connection strings.

### Example

```fish
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
DB_USER=j_mclaren
DB_PASSWORD=2ff9853e23b68587480da26a478b782aa8aeafe46ec716d0667ad7078870c345
DB_HOST=mc-laren-prod-db.c9ufzjtplsaq.us-west-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=XP1_LM

# DATABASE_URL resolves to:
# postgresql://j_mclaren:2ff9853e23b68587480da26a478b782aa8aeafe46ec716d0667ad7078870c345@mc-laren-prod-db.c9ufzjtplsaq.us-west-1.rds.amazonaws.com:5432/XP1_LM
```

### Reference Syntax

| Syntax | Environment | Path | Key | Description |
| ------ | ----------- | ---- | --- | ----------- |
| `${KEY}` | Same | `/` | KEY | Local reference in the same Environment at the root path. |
| `${staging.DEBUG}` | `staging` | `/` | DEBUG | Cross-environment reference to the root path. |
| `${production./frontend/SECRET_KEY}` | `production` | `/frontend/` | SECRET_KEY | Cross-environment reference with a specific path. |
| `${/backend/payments/STRIPE_KEY}` | Same | `/backend/payments/` | STRIPE_KEY | Local reference with a specific path. |
| `${backend_api::production.SECRET_KEY}` | `production` in `backend_api` | `/` | SECRET_KEY | Cross-application reference at root path. |
| `${backend_api::production./frontend/SECRET_KEY}` | `production` in `backend_api` | `/frontend/` | SECRET_KEY | Cross-application reference with a specific path. |

### Important Notes on Referencing

- **Authentication**: Your token must have access to all referenced secrets across Apps, Environments, and paths. Unresolvable references are returned with their original syntax intact.
- **Third-party syncing**: Sync integrations require all references to be resolvable. If any referenced secret is missing, the sync will fail — this prevents third-party platforms from receiving broken references.
- **Name collisions**: If two or more Apps in your Organisation share the same name (case insensitive), cross-application references to those Apps will be ambiguous and unresolvable.
- **SSE requirement**: For references to resolve over the REST API or sync integrations, all referenced Apps must have SSE enabled. This is not required for E2E-enabled clients like the CLI or SDKs.

## Personal Secrets (Overrides)

You can override the value of any secret with a Personal Secret. The overridden value is visible only to you and does not affect other users. When developing locally with the Phase CLI, the override value is used by default.

This is useful for:

- Personal API keys or authentication credentials
- Local development database URLs
- Feature flags specific to your development setup
- Any environment variable unique to your workflow

Personal Secret overrides can be toggled on and off without deleting them, making it easy to switch between your personal configuration and the shared team values.

## Tags

Secrets can be tagged with one or more labels for categorisation and filtering. Tags help organise secrets within large Environments — for example, you might tag secrets as `database`, `auth`, `third-party`, or `feature-flag`.

Tags are displayed inline with the secret key in the Console UI and can be created, applied, and removed as needed.

## Comments

Each secret can have an optional comment attached to it. Comments are useful for documenting:

- What the secret is used for
- Who or what service owns it
- Any special handling instructions
- Rotation schedules or expiration dates

## Sharing Secrets

Phase provides two mechanisms for sharing secrets:

### Permalinks

Permalinks generate a direct link to a specific secret within an App, Environment, and folder. The recipient must already have access to the secret in Phase. This is useful for pointing teammates to the right secret in a large Environment.

### Lockbox

Lockbox allows you to share a secret via a single-use link with [zero-trust encryption](/security/architecture#lockbox). The decryption key is encoded as a URL fragment and never sent to the Phase server. When creating a Lockbox, you can:

- Override the secret value for sharing
- Set an expiry time
- Set a maximum number of views

Anyone with the link can access the secret, so share Lockbox links through secure channels.

## Secret History

Phase maintains a complete version history for every secret. The history includes a timeline of all changes to the secret's key, value, type, tags, and comments — with timestamps and user attribution for each change.

You can restore any previous value of a secret from its history, which is useful for rolling back accidental changes.

## Importing Secrets

Secrets can be imported from `.env` files through the Console, CLI, or API. During import:

- All key-value pairs are parsed, along with any inline or preceding comments
- If a key already exists, its value is updated rather than duplicated
- Multiple Environments can be targeted simultaneously
- You can choose whether to include values, comments, or just keys for each Environment

This makes it easy to bootstrap a new App from existing `.env` files or migrate from another secrets management solution.

## Managing Secrets

Secrets can be managed through multiple interfaces:

- **[Console](/console/secrets)** — Full visual management with drag-and-drop import, inline editing, search, and deploy workflow
- **[CLI](/cli/commands)** — Create, read, update, delete, import, and export secrets from the command line
- **[SDKs](/sdks)** — Fetch secrets programmatically from your application code
- **[API](/public-api/secrets)** — Full CRUD operations over the REST API
