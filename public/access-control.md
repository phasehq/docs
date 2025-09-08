import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'
import { UserAuthProviders } from '@/components/UserAuthProviders'

export const description =
  'This guide explains how to authenticate with Phase and manage access with the Access Control system.'

<HeroPattern />

# Authentication & Access Control


## Overview

Phase employs a Role-Based Access Control (RBAC) system to manage permissions for both human users and programmatic access via Service Accounts. 

Phase supports third-party authentication systems for access control. You can delegate authentication and administration to external providers such as Google, AWS IAM, GitHub, Kubernetes, GitLab, or Microsoft Azure to best suit your setup. When choosing an authentication provider, consider whether the access to Phase will be programmatic (machine-access) via REST API, SDK, CLI, etc., or user access (human-access). 

Phase's access control system is based on roles that define policies governing the behavior and access of clients, whether they are human Users or Service Accounts. The system allows for fine-grained control over resources at both the organization and application levels.

## User Authentication

User authentication in Phase is designed for seamless and secure access for human users. Phase supports various Single Sign-On (SSO) providers, allowing organizations to leverage their existing identity management systems.

[Read more](/access-control/authentication#user-authentication) about how user accounts can authenticate with the Phase platform.

## Service Accounts

Programmatic access to secrets in Phase is facilitated by Service Accounts. A Service Account is a special type of account that represents non-human users, such as applications, automation processes, or CI/CD pipelines, that need to interact with Phase programmatically through the API, SDK, or CLI.

[Read more](/access-control/service-accounts) about how service accounts work.  



## Access Control - Key Concepts

1. **Roles**: Phase offers default managed roles (e.g., `Owner`, `Admin`, `Developer`) with predefined permissions. Users can also create custom roles for more specific access control.

2. **Access**: This defines the level of access (No access, Read access, Full access, Custom access) for various resources.

3. **Actions**: These define the operations that can be performed (Create, Read, Update, Delete) on various resources.

4. **Resources**: The entities that can be accessed or modified, categorized into organization-level and application-level resources.

### Permissions to Perform Actions (CRUD)

Phase's RBAC system allows you to define permissions for Create, Read, Update, and Delete (CRUD) operations on various resources. These permissions are assigned to roles, which are then assigned to users or service accounts.

### Resource Categories

#### Organization-level Resources:

| Resource | Description |
|----------|-------------|
| **Organisation** | Manage overall access to the organization |
| **Billing** | Control access to billing & payment information in settings |
| **Apps** | Manage access to applications within the organization |
| **Members** | Control user membership and access within the organization |
| **Service Accounts** | Manage service account permissions |
| **Roles** | Define and assign roles within the organization |
| **Integration Credentials** | Manage credentials for third-party integrations |

#### Application-level Resources:

| Resource | Description |
|----------|-------------|
| **Environments** | Control access to different secret environments within the app |
| **Secrets** | Manage access to app secrets |
| **Lockbox** | Control access to Lockbox secret sharing |
| **Logs** | Manage access to app and secret audit logs |
| **Tokens** | Control creation and management of access tokens |
| **Members** | Manage user access within the app |
| **Integrations** | Control setup and management of app integrations |
| **Encryption Mode** | Manage encryption settings for the app |

## Global Access

The Phase End-to-End encryption implementation works in conjunction with the access control system to ensure secure and manageable resource access. When a new resource such as an App or an Environment inside an App is created, encryption keys are automatically and securely shared (using Sealed-box encryption) with users holding `Owner` or `Admin` roles. This mechanism prevents the creation of "island resources" - isolated resources within a managed organization that would be invisible or unmanageable by administrators due to lack of access to cryptographic keys.

Global access is a special type of permission that grants users with a "global access" role implicit access to all Apps and Environments across the organization. Currently, Global access is reserved exclusively for the Phase managed `Owner` and `Admin` roles.

### External Auth Method Considerations

- To use an external auth provider for programmatic authentication with Phase to access sensitive data (e.g., Secrets) via the Phase API, SDKs, or the Kubernetes Operator, you must enable Server-side Encryption (SSE) so that Phase can generate a Service Token on the server side with access to given application(s) or environment(s).

- When using an external auth method (e.g., Kubernetes), Phase will call the external service at the time of authentication and for subsequent token renewals. If the status of an entity changes in the external system (e.g., an account expires or is disabled), Phase will deny requests to renew tokens associated with that entity. However, any existing tokens remain valid for their original grant period unless explicitly revoked.