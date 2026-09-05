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

Accounts are created either by signing up with an email address and password, or through an SSO provider (such as Google, GitHub, or GitLab). On Phase Cloud, email/password signups require email verification before the account is activated. The sign-in methods available depend on how the instance is configured — see [Authentication](/access-control/authentication).

Phase has two distinct passwords with different purposes:

- **Login password** — what you sign in to the Console with, when password authentication is enabled. See [Password authentication](/access-control/authentication/password).
- **Sudo password** — protects the account encryption keys and gates privileged operations. Every account has one, including accounts that sign in exclusively via SSO. See [Account management](/access-control/authentication/account).

When a user signs up or accepts an Organisation invite, account setup happens in two phases: the user first creates a sudo password, and then receives an account recovery kit. Both artifacts exist because of Phase's end-to-end encryption model — the server never holds the material needed to decrypt a user's keys, so the user must hold it instead.

- **The sudo password** is used to derive the device key that encrypts the account keyring at rest. The keyring — the set of keys that anchors the user's cryptographic identity — is never stored in plaintext; it can only be decrypted by re-deriving the device key from the sudo password.
- **The account recovery kit** contains the recovery phrase: a mnemonic encoding of the high-entropy seed from which the account keys are derived. Because Phase cannot decrypt or reset a keyring, the recovery phrase is the only path to restoring the account keys if the sudo password is forgotten — there is no server-side reset.

<Warning>
The recovery kit is the **only** way to regain access to your account if you forget your sudo password. Store it securely and do not lose it.
</Warning>

For the step-by-step walkthrough of account setup, see [Console > Users > Account Setup](/console/users#account-setup).

## The Sudo Password

The sudo password gates access to the user's encrypted keyring. When the keyring is locked, the user can browse the Console but cannot perform privileged operations, such as:

- Creating Apps
- Managing Environments and Tokens
- Managing user access
- Any other operation that requires the account keyring

For the full key derivation scheme, see [Security Architecture](/security/architecture#device-key-and-sudo-password).

### Unlocking Behaviour

- The sudo password can be remembered on a trusted device, in which case the keyring unlocks automatically on login
- Otherwise, the user is prompted for the sudo password when they first perform a privileged action in a session
- Once unlocked, the keyring is held in memory for the duration of the session (until the tab is closed or the page is refreshed)

### Lost Password Recovery

| Scenario | Recovery Path |
| -------- | ------------- |
| **Member** loses sudo password, has recovery kit | Use the recovery phrase to restore account keys |
| **Member** loses sudo password and recovery kit | Can be removed from the Organisation and re-invited by an Admin |
| **Owner** loses sudo password, has recovery kit | Use the recovery phrase to restore account keys |
| **Owner** loses sudo password and recovery kit | **Permanent loss of access** — no recovery path exists. Mitigate this risk by [transferring ownership](/console/organisation#transfer-ownership) to a trusted Admin. |

## Account Security

Beyond the sudo password and recovery kit, Phase provides several account-level security controls, managed from the personal Account page:

### Two-Factor Authentication (2FA)

Users can enable TOTP-based 2FA with any standard authenticator app. Once enabled, every Console sign-in — password, OAuth, or SSO — requires a 6-digit code in addition to the primary method, and single-use recovery codes cover the loss of the authenticator device. 2FA protects Console sign-in only; personal access tokens, service tokens, and CLI/API access are unaffected. See [Two-factor authentication](/access-control/authentication/mfa).

### Sensitive Action Re-authentication

Changes to sign-in methods, the account email address, 2FA, and account deletion require a recent sign-in. If the last sign-in is stale, Phase prompts the user to confirm their identity before continuing. The default freshness window is 15 minutes; self-hosted operators can tune it with the `AUTH_FRESHNESS_MAX_AGE_SECONDS` environment variable. See [Sensitive action re-authentication](/access-control/authentication/account#sensitive-action-re-authentication).

### Sign-in Methods

An account can have multiple linked sign-in identities — for example, Google and Microsoft Entra ID — any of which signs in to the same Phase account. Identities are matched by the provider's stable account ID, not by email, so linking is also the tool for migrating to a new identity provider. To protect against account takeover, a new sign-in identity is never automatically attached to an existing account based on a matching email address; the user must sign in with their existing method and link the new one explicitly. Unlinking is blocked if it would leave the account without a sign-in method, if the identity belongs to an enforced organisation SSO provider, or if the user's membership is SCIM-provisioned. See [Sign-in methods](/access-control/authentication/account#sign-in-methods).

### Account Deletion

Users can delete their own account from the Account page. Deletion is immediate and irreversible — it permanently removes organisation memberships, encryption keys, personal access tokens, and personal data. Deletion is blocked while the user is the Owner of an Organisation (ownership must be transferred first) or while their account is SCIM-provisioned in any Organisation. See [Deleting your account](/access-control/authentication/account#deleting-your-account).

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

Users join an Organisation by accepting an email invitation, or automatically via [SCIM provisioning](/access-control/provisioning/scim) from an identity provider (Enterprise tier). After joining, they go through the account setup process (sudo password + recovery kit). Once setup is complete, they are a member of the Organisation with their assigned role (the Developer role by default).

Newly joined members do **not** have access to any Apps or Environments by default. Access can be granted to individual users, or through [Teams](/access-control/teams) — when a member joins a team, environment keys for the team's Apps are provisioned automatically, and revoked when they leave the team unless they also hold individually granted access. SCIM-provisioned users receive their team-provisioned keys on first login.

### Switching Organisations

A user can belong to multiple Organisations. Switching between them can be done through the Console UI or with the CLI command `phase users switch`.

### Leaving or Being Removed

Users can be removed from an Organisation by an Owner or Admin. Removal revokes all cryptographic access to the Organisation's secrets. If a removed user is re-invited, they go through the full setup process again with fresh keys. Users can also [delete their own account](/access-control/authentication/account#deleting-your-account) entirely, which removes them from all Organisations.

## Managing Users

Users can be managed through the [Phase Console](/console/users), the [CLI](/cli/commands), or the [API](/public-api).
