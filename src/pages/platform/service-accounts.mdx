import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Service Accounts work in Phase — non-human identities for programmatic access to secrets.'

<Tag variant="small">PLATFORM</Tag>

# Service Accounts

Service Accounts are non-human identities that provide programmatic access to the Phase platform. They are used by applications, CI/CD pipelines, automation scripts, and any other machine-to-machine workflow that needs to interact with secrets.

<DocActions />

## How Service Accounts Work

Service Accounts share many properties with [User accounts](/platform/users). Each Service Account has:

- **A unique cryptographic keyring** — Just like Users, each Service Account has its own encryption keys. This means access to secrets is cryptographically enforced, not just permission-based.
- **A role** — Determines the permissions the account has. By default, new Service Accounts are assigned the managed [Service](/access-control/roles#service) role, which provides full access to secrets at the App level with minimal organisation-level permissions.
- **Scoped access** — Service Accounts must be explicitly added to Apps and granted access to specific Environments before they can access any secrets.
- **Tokens** — Authentication credentials that the Service Account uses to interact with Phase via the CLI, SDKs, or API.

## Service Accounts vs Users

| | Users | Service Accounts |
| --- | ----- | ---------------- |
| **Identity** | Human individuals | Applications, pipelines, automation |
| **Authentication** | Email/password, SSO, sudo password | Service Account Tokens, External Identities |
| **Cryptographic keys** | Generated during signup | Generated during account creation |
| **Default role** | Developer | Service |
| **Access scoping** | Per-App, per-Environment | Per-App, per-Environment |
| **KMS** | Client-side only | Client-side or Server-side |

## Roles

Service Accounts follow the same [RBAC system](/platform/access) as Users. They can be assigned any managed role or custom role. The default **Service** role is designed specifically for programmatic access:

| Resource | Access |
| -------- | ------ |
| **Secrets** | Full access (Create, Read, Update, Delete) |
| **Dynamic Secret Leases** | Generate and Read |
| **Environments** | Full access |
| **Other App resources** | Read-only or no access |
| **Organisation resources** | Minimal (read-only where needed) |

You can assign a different role if the Service Account needs broader or more restricted permissions.

## KMS Modes

Each Service Account's keyring can operate in one of two KMS modes, which determine who can create and manage tokens for the account.

### Client-side KMS

The default mode. The Service Account's keyring is only accessible to designated users (called *Service Account Handlers*) who have the required `ServiceAccountTokens` permissions. The keyring is encrypted with each handler's keys, so only they can create and manage tokens.

This is the most secure mode — the Phase server never has access to the Service Account's keyring.

### Server-side KMS

Optionally, you can grant the Phase backend access to the Service Account's keyring. This allows the server to create and manage tokens on behalf of the Service Account. Server-side KMS is required for:

- [External Identities](/access-control/external-identities) — Allowing external auth providers (AWS IAM, Kubernetes, OIDC, etc.) to authenticate as this Service Account
- Automated token management without requiring a human handler

<Note>
Enabling Server-side KMS is an additive operation. The Service Account's keyring remains accessible to existing handlers alongside the server.
</Note>

## Tokens

Service Accounts authenticate with Phase using tokens. Tokens are bound to the Service Account's role and access scope. They can be used with:

- **CLI** — `phase auth` with a service token
- **SDKs** — Pass the token when initialising the Phase client
- **API** — Include the token in API request headers


For details on creating and managing tokens, see [Tokens](/access-control/authentication/tokens#service-account-tokens).

## Network Access Policies

Service Accounts can have [Network Access Policies](/access-control/network) applied to restrict which IP addresses or CIDR ranges can authenticate using the account's tokens. This adds an additional layer of security for production service accounts.

## Managing Service Accounts

Service Accounts can be created and managed through the [Phase Console](/access-control/service-accounts). From the Console you can:

- Create new accounts with a chosen name and role
- Update account names and roles
- Switch between Client-side and Server-side KMS
- Add accounts to Apps with specific Environment access
- Create and revoke tokens
- Apply Network Access Policies
- Delete accounts

<Warning>
Deleting a Service Account will permanently remove the account and all associated tokens. Any integrations or pipelines using those tokens will immediately lose access.
</Warning>
