import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Role-Based Access Control (RBAC) works in Phase — roles, permissions, resources, and how access is enforced across the platform.'

<Tag variant="small">PLATFORM</Tag>

# Access Control

Phase uses a Role-Based Access Control (RBAC) system to govern what [Users](/platform/users), [Service Accounts](/access-control/service-accounts), and [External Identities](/access-control/external-identities) can do across the platform. Every action — from reading a secret to managing billing — is gated by a permission check against the actor's role.

<DocActions />

## How RBAC Works in Phase

Access in Phase is determined by three things:

1. **Who** is performing the action — a User, Service Account, or External Identity
2. **What role** they have — which defines a set of permissions
3. **What scope** they have access to — which Apps and Environments they can operate on

Roles define permissions as a matrix of **actions** (Create, Read, Update, Delete) against **resources** (Secrets, Environments, Members, etc.). When a user attempts to perform an action, Phase checks whether their role grants the required permission on the target resource.

## Roles

A role is a named set of permissions. Every user and service account in an Organisation must have exactly one role assigned to them. Phase provides managed (built-in) roles and supports custom roles for more specific access control needs.

### Managed Roles

Phase ships with five managed roles that cover the most common access patterns:

| Role | Access Scope | Description |
| ---- | ------------ | ----------- |
| **Owner** | Global | Unrestricted access to everything. One per Organisation. Can manage billing, transfer ownership, and perform all administrative actions. |
| **Admin** | Global | Near-full access to all resources. Can manage Apps, Environments, Users, Service Accounts, Roles, and most Organisation settings. |
| **Manager** | Scoped | Broad management capabilities for Apps and Environments they have access to. Can manage members, service accounts, integrations, and secrets within their scope. |
| **Developer** | Scoped | The default role. Can read and write secrets, manage integrations, and use Lockbox within Apps and Environments they have been granted access to. Limited organisation-level visibility. |
| **Service** | Scoped | Designed for Service Accounts and automation. Focused on secret access with minimal organisation-level permissions. Cannot access Lockbox, Logs, or legacy Tokens. |

For detailed permission matrices for each role, see [Roles](/access-control/roles).

### Custom Roles

Organisations on Pro or Enterprise plans can create custom roles with fine-grained permissions tailored to their specific security requirements. Custom roles are built by configuring access levels for each resource individually.

<Note>
Follow the [Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when creating custom roles. Grant only the minimum permissions needed for the role's intended function.
</Note>

## Resources

Permissions are defined against resources, which are grouped into two categories:

### Organisation-Level Resources

These resources exist at the Organisation level and are not scoped to any specific App:

| Resource | What It Controls |
| -------- | ---------------- |
| **Organisation** | Overall access to organisation settings and configuration |
| **Billing** | Access to billing and payment information |
| **Apps** | Ability to create, read, update, or delete Apps |
| **Members** | User membership management — inviting, removing, updating roles |
| **Member Personal Access Tokens** | Ability to view or manage other users' PATs |
| **Service Accounts** | Service Account creation and management |
| **Service Account Tokens** | Token management for Service Accounts |
| **External Identities** | Management of external auth identity mappings |
| **Roles** | Ability to view, create, or modify roles |
| **Integration Credentials** | Credentials used by third-party sync integrations |
| **Network Access Policies** | IP-based access restrictions for users and service accounts |

### App-Level Resources

These resources are scoped to a specific App and controlled per-Environment where applicable:

| Resource | What It Controls |
| -------- | ---------------- |
| **Environments** | Creating, renaming, and deleting Environments within an App |
| **Secrets** | Reading, creating, updating, and deleting secrets |
| **Dynamic Secret Leases** | Generating, renewing, and revoking Dynamic Secret leases |
| **Lockbox** | Creating and accessing Lockbox share links |
| **Logs** | Viewing audit logs for secret and environment operations |
| **Tokens (Legacy)** | Managing legacy service tokens |
| **Members** | Managing which users have access to the App and its Environments |
| **Service Accounts** | Managing which Service Accounts have access to the App |
| **Integrations** | Setting up and managing third-party sync integrations |
| **Encryption Mode** | Enabling or modifying the App's encryption mode (E2EE/SSE) |

## Actions

For each resource, permissions are defined using four CRUD actions:

| Action | Description |
| ------ | ----------- |
| **Create** | Add new instances of the resource (e.g. create a secret, invite a member) |
| **Read** | View or list existing instances (e.g. list secrets, view members) |
| **Update** | Modify existing instances (e.g. update a secret value, change a role) |
| **Delete** | Remove instances (e.g. delete a secret, remove a member) |

## Access Levels

When configuring permissions (either in managed roles or custom roles), each resource can be set to one of four access levels:

| Level | Description |
| ----- | ----------- |
| **No access** | The role cannot perform any action on this resource |
| **Read access** | Read-only. The role can view but not modify the resource |
| **Full access** | Complete CRUD access to the resource |
| **Custom access** | A subset of CRUD actions enabled individually |

## Global Access vs Scoped Access

Phase distinguishes between two types of access scope:

### Global Access

Users with **Owner** or **Admin** roles have global access. This means they automatically have access to **all** Apps and Environments across the Organisation, including any newly created ones. When a new App or Environment is created, encryption keys are automatically shared with global-access users via [sealed-box encryption](/security/architecture), preventing "island resources" that would be invisible to administrators.

### Scoped Access

Users with **Manager**, **Developer**, **Service**, or custom roles have scoped access. They can only access Apps and Environments that have been explicitly granted to them. When a user with a scoped role is added to an App, the administrator selects which Environments within that App the user can access.

This scoping works in conjunction with Phase's end-to-end encryption — granting access involves encrypting the Environment's keys with the user's public key, and revoking access removes the user's ability to decrypt those keys entirely.

## Compound Permissions

Some actions in Phase require permissions across multiple resources. For example:

- **Adding a member to an App** requires `AppMembers:update`, `Members:read`, and `Environments:read`
- **Enabling SSE** requires `EncryptionMode:update`, `Environments:read`, and access to all Environments in the App
- **Creating a sync integration** requires `Integrations:create` and `Environments:read`

For a full cheat sheet of compound permission requirements, see [Resource Permissions Cheat Sheet](/access-control/roles#resource-permissions-cheat-sheet).

## Authentication Methods

The RBAC system works with multiple authentication methods:

- **User accounts** — Authenticated via email/password with sudo password for privileged actions, or via [SSO providers](/access-control/authentication) (Google, GitHub, GitLab, Microsoft)
- **Service Accounts** — Authenticated via [Service Account Tokens](/access-control/service-accounts) for programmatic access
- **External Identities** — Authenticated via [external providers](/access-control/external-identities) such as AWS IAM, Kubernetes, or OIDC for machine-to-machine access

All authentication methods produce tokens that are bound to a role, and all access checks are performed against the role's permissions regardless of the authentication method used.

For more on authentication, see [Authentication & Access](/access-control).

## Managing Access

Roles and permissions can be managed through the [Phase Console](/access-control/roles), the [CLI](/cli/commands), or the [API](/public-api).
