import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how User accounts work in Phase — cryptographic identity, authentication, and the account security model.'

<Tag variant="small">PLATFORM</Tag>

# Users

A User in Phase is an individual account within an [Organisation](/platform/organisations). Each user has a unique cryptographic identity that enables Phase's end-to-end encryption model — meaning that access to [Secrets](/platform/secrets) is cryptographically enforced, not just permission-based.

<DocActions />

## Cryptographic Identity

Phase is built on end-to-end encryption, and every user's account is anchored by a unique set of encryption keys. These keys are:

- **Generated during signup** or when accepting an Organisation invite
- **Used to cryptographically assign or revoke access** to specific [Environments](/platform/environments) and Secrets
- **Protected by the user's sudo password** — they are encrypted at rest and only decrypted when needed

This means that granting a user access to an Environment is not just a permission flag — it involves encrypting the Environment's keys with the user's public key. Similarly, revoking access removes the user's ability to decrypt those keys entirely.

## Account Setup

When a user signs up or accepts an Organisation invite, they go through a two-step process:

### Step 1: Create a Sudo Password

The sudo password is a strong password that encrypts the user's account keys. It is required for privileged actions such as:

- Creating Apps
- Managing Environments and Tokens
- Managing user access
- Any operation that requires the account keyring

Requirements:
- Must be 16 characters or longer
- Must contain both letters and numbers
- Should be a long, memorable phrase

By default, the sudo password is remembered on the current device for convenience. This can be toggled off on untrusted machines.

### Step 2: Save the Account Recovery Kit

The recovery kit contains a recovery phrase that can restore access to the user's account keys if the sudo password is forgotten. It is provided as a downloadable document that should be:

- Printed and stored physically in a safe location
- Copied to a secure note in a password manager
- Both, for maximum redundancy

<Warning>
The recovery kit is the **only** way to regain access to your account if you forget your sudo password. Store it securely and do not lose it.
</Warning>

## The Sudo Password

The sudo password gates access to the user's encrypted keyring. When the keyring is locked, the user can browse the Console but cannot perform privileged operations.

### Unlocking Behaviour

- If "Remember password on this device" is enabled, the keyring unlocks automatically on login
- Otherwise, the user is prompted to enter the sudo password when they first perform a privileged action in a session
- Once unlocked, the keyring remains accessible for the duration of the session (until the tab is closed or the page is refreshed)

### Lost Password Recovery

| Scenario | Recovery Path |
| -------- | ------------- |
| **Member** loses sudo password, has recovery kit | Use the recovery phrase to restore account keys |
| **Member** loses sudo password and recovery kit | Can be removed from the Organisation and re-invited by an Admin |
| **Owner** loses sudo password, has recovery kit | Use the recovery phrase to restore account keys |
| **Owner** loses sudo password and recovery kit | **Permanent loss of access** — no recovery path exists. Mitigate this risk by [transferring ownership](/console/organisation#transfer-ownership) to a trusted Admin. |

## Roles

Every user has a role that determines their permissions within the Organisation. Phase provides managed roles and supports custom roles.

### Managed Roles

| Role | Scope | Description |
| ---- | ----- | ----------- |
| **Owner** | Global | Full control over the Organisation. Can manage billing, transfer ownership, and perform all administrative actions. One per Organisation. |
| **Admin** | Global | Can manage Apps, Environments, Users, and most Organisation settings. Automatically has access to all Environments. |
| **Manager** | Scoped | Can manage specific Apps and Environments they have access to, including managing members within those Apps. |
| **Developer** | Scoped | The default role for new members. Can access only the Apps and Environments explicitly granted to them. |
| **Service** | Scoped | A role intended for service accounts and automation. Scoped to specific Apps and Environments. |

New members are assigned the Developer role by default, but a role can be selected during the invite process. Roles can be changed by Owners or Admins after the user joins.

For a complete breakdown of permissions and custom roles, see [Roles](/access-control/roles).

## Organisation Membership

### Joining an Organisation

Users join an Organisation by accepting an email invitation. After accepting, they go through the account setup process (sudo password + recovery kit). Once setup is complete, they are a member of the Organisation with the Developer role.

Newly joined members do **not** have access to any Apps or Environments. Access must be explicitly provisioned by an Owner or Admin.

### Switching Organisations

A user can belong to multiple Organisations. Switching between them can be done through the Console UI or with the CLI command `phase users switch`.

### Leaving or Being Removed

Users can be removed from an Organisation by an Owner or Admin. Removal revokes all cryptographic access to the Organisation's secrets. If a removed user is re-invited, they go through the full setup process again with fresh keys.

## Managing Users

Users can be managed through the [Phase Console](/console/users), the [CLI](/cli/commands), or the [API](/public-api).
