import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how Dynamic Secrets work in Phase — short-lived, on-demand credentials for third-party services.'

<Tag variant="small">PLATFORM</Tag>

# Dynamic Secrets

Dynamic Secrets are credentials for third-party services that are *leased* on-demand for a limited time. Instead of storing long-lived static credentials, Dynamic Secrets generate fresh, scoped credentials whenever they are needed — and automatically expire when the lease runs out.

<DocActions />

<Note>
Dynamic Secrets are available for Organisations with an Enterprise tier subscription.
</Note>

## Why Dynamic Secrets

Static credentials — even when properly encrypted and managed — carry inherent risk. If a credential is leaked, it remains valid until someone notices and rotates it. Dynamic Secrets reduce this attack surface by:

- **Limiting credential lifespan** — Credentials expire automatically after a configured time-to-live (TTL)
- **Isolating access** — Each user or service gets their own set of credentials, making it easy to trace and revoke access
- **Eliminating shared credentials** — No more passing around long-lived API keys or database passwords between team members
- **Automating rotation** — Credentials are always fresh, removing the need for manual rotation schedules

## How Dynamic Secrets Work

A Dynamic Secret is a configuration that defines how to generate credentials for a specific third-party service. It lives inside an [Environment](/platform/environments) within an [App](/platform/apps).

The lifecycle works as follows:

1. **Configure** — Set up a Dynamic Secret with the provider credentials, naming, TTL limits, and output mappings
2. **Lease** — When credentials are needed, generate a lease. This creates fresh credentials on the third-party service with a specific TTL
3. **Use** — The generated credentials are available as secrets in your Environment, mapped to the output keys you configured
4. **Renew** (optional) — Extend the lease TTL if more time is needed, up to the configured maximum
5. **Revoke** or **Expire** — When the lease expires or is manually revoked, the credentials are deleted from the third-party service

## Configuration

Every Dynamic Secret requires:

| Field | Description |
| ----- | ----------- |
| **Secret Name** | A unique name identifying this Dynamic Secret within the Environment. |
| **Description** | A brief description of what this Dynamic Secret is for. |
| **Max TTL** | The maximum duration (in seconds) that any lease can be valid for. This is a hard upper bound. |
| **Default TTL** | The default lease duration when generating new credentials. Must be less than or equal to the Max TTL. |
| **Outputs** | A mapping that defines how credentials created on the third-party service are mapped to secret keys in your Phase Environment. |

Additional provider-specific configuration is required depending on the provider (e.g. AWS IAM role ARN, permissions policies, etc.).

## Supported Providers

| Provider | Description |
| -------- | ----------- |
| **[AWS IAM](/integrations/platforms/aws-iam)** | Generates temporary IAM user credentials with configurable permissions policies. |

## Leases

A lease represents a single set of generated credentials with a defined lifespan.

### Generating a Lease

When you generate a lease, you provide:

- **Lease name** — A descriptive name for this lease (e.g. "ci-pipeline-deploy", "local-dev-session")
- **TTL** — The time-to-live in seconds. Must be less than or equal to the Dynamic Secret's Max TTL.

The generated credentials are displayed once and cannot be retrieved again. Make sure to copy them immediately or inject them into your application using `phase run`.

### Renewing a Lease

A lease can be renewed to extend its expiration time. The renewal TTL is added to the current time, but the total active duration cannot exceed the Max TTL configured on the Dynamic Secret. The renewal dialog shows the available TTL remaining.

### Revoking a Lease

Revoking a lease immediately deletes the associated credentials on the third-party service and marks the lease as revoked. This is useful for:

- Terminating access after a deployment is complete
- Responding to a security incident
- Cleaning up unused credentials

### Lease History

Each lease maintains a complete event history including creation, renewal, and revocation events with timestamps and metadata.

## Requirements

- **SSE must be enabled** on the App to use Dynamic Secrets. This is because the server needs to interact with third-party services to manage credential lifecycles.
- **Provider credentials** must be configured with sufficient permissions to create and delete credentials on the target service.

## Managing Dynamic Secrets

Dynamic Secrets can be managed through the [Phase Console](/console/dynamic-secrets), the [CLI](/cli/commands) (`phase dynamic-secrets`), or the [API](/public-api/dynamic-secrets).

<Warning>
Deleting a Dynamic Secret will immediately revoke all active leases and remove all associated credentials from the third-party service.
</Warning>
