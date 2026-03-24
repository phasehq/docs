import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Organisations work in Phase — the top-level entity that contains all your Apps, Users, and configuration.'

<Tag variant="small">PLATFORM</Tag>

# Organisations

An Organisation is the top-level entity in Phase. It acts as the container for everything — all [Apps](/platform/apps), [Users](/platform/users), [Secrets](/platform/secrets), and configuration belong to an Organisation. Think of it as representing your team, company, or project group.

<DocActions />

## Structure

Every Organisation has:

- **Apps** — The projects and services whose secrets are managed by Phase
- **Members** — The users who belong to the Organisation, each with an assigned [role](/access-control/roles)
- **Service Accounts** — Optional non-human identities used for CI/CD pipelines, automation, and machine-to-machine access to secrets. See [Service Accounts](/access-control/service-accounts)
- **Settings** — Organisation-level configuration, billing, and account recovery information

All resources in Phase are scoped to an Organisation. A user can belong to multiple Organisations, and can switch between them as needed.

## Membership

When a user is invited to an Organisation, they go through a signup and key generation process that establishes their unique cryptographic identity within that Organisation. This is fundamental to how Phase's end-to-end encryption works — each member has their own set of encryption keys, and access to secrets is cryptographically granted or revoked on a per-user basis.

New members are assigned the managed "Developer" [role](/access-control/roles) by default, but a role can be selected during the invite process. Roles can also be changed after the member joins. Importantly, newly invited members do **not** have access to any Apps or Environments until explicitly granted — access must be provisioned by an Owner or Admin.

### Roles

Organisation members must have a role that determines their permissions. Phase has both managed roles and the ability to define custom roles. The key managed roles are:

| Role | Description |
| ---- | ----------- |
| **Owner** | Full control over the Organisation. Can manage billing, transfer ownership, and perform all administrative actions. Each Organisation has exactly one Owner. |
| **Admin** | Can manage Apps, Environments, Users, and most Organisation settings. Admins automatically have access to all Environments. |
| **Manager** | Can manage specific Apps and Environments they have access to, including managing members within those Apps. |
| **Developer** | The default role for new members. Developers can access only the specific Apps and Environments they have been granted access to. |
| **Service** | A role intended for service accounts and automation. Scoped to specific Apps and Environments. |

For a complete breakdown of roles and permissions, see [Roles](/access-control/roles).

## Ownership

Each Organisation has exactly one Owner. The Owner has unrestricted access to all resources and is the only user who can perform certain critical operations like transferring ownership or managing billing.

### Transferring Ownership

Ownership can be transferred to another member who holds the Admin role. This is useful when the current Owner is leaving the team or delegating responsibilities. After a transfer:

- The selected Admin becomes the new Owner
- The previous Owner is demoted to Admin and remains a member
- Both parties receive an email notification

It is critical that the new Owner has access to their **account recovery kit** before the transfer, as it becomes the only way to restore access to the Organisation if they forget their sudo password.

## Organisation Names

Organisation names must be unique across Phase. They can contain letters and numbers. Choose a name that clearly identifies your team or company, as it will be visible to all members.

## Account Recovery

Each Organisation member has an account recovery kit generated during signup. This kit contains a recovery phrase that can restore access to the member's account keys if they forget their sudo password.

- **Organisation members** who lose both their sudo password and recovery phrase can be removed and re-invited by an Admin
- **Organisation Owners** who lose both their sudo password and recovery phrase will permanently lose access — there is no recovery path. To mitigate this risk, Owners should consider [transferring ownership](/console/organisation#transfer-ownership) to a trusted Admin if they are unable to secure their recovery kit

## Managing Organisations

Organisations can be managed through the [Phase Console](/console/organisation), the [CLI](/cli/commands), or the [API](/public-api). The Console provides a visual interface for all Organisation management tasks including member invitations, role changes, ownership transfers, and settings configuration.
