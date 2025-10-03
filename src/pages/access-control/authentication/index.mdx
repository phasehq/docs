import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'
import { UserAuthProviders } from '@/components/UserAuthProviders'
import { ProgrammaticAuth } from '@/components/ProgrammaticAuth'
import { DocActions } from '@/components/DocActions'

export const description = 'Authenticating with Phase.'

<HeroPattern />

<Tag variant="small">AUTHENTICATION</Tag>

# Authentication Methods

Phase supports third-party authentication systems for access control. You can delegate authentication and administration to external providers such as Google, AWS IAM, GitHub, Kubernetes, GitLab, or Microsoft Azure to best suit your setup. When choosing an authentication provider, consider whether the access to Phase will be programmatic (machine-access) via REST API, SDK, CLI, etc., or user access (human-access).

<DocActions /> 

## User Authentication

User authentication in Phase is designed for seamless and secure web access. Phase supports both OAuth 2.0 and OpenID Connect (OIDC) protocols for Single Sign-On (SSO), allowing organizations to leverage their existing identity providers like Google, GitHub, GitLab, and JumpCloud. We plan to extend support to SCIM (System for Cross-domain Identity Management), which will enable automatic synchronization of user directories with Phase, including automatic provisioning and deprovisioning of user accounts based on changes in your organization's primary identity system.

<UserAuthProviders />

## Programmatic Authentication

Programmatic authentication enables secure machine-to-machine access to Phase through tokens. This authentication method is essential for automated processes, CI/CD pipelines, and applications that need to interact with Phase programmatically.

<ProgrammaticAuth />

### Third party authentication

When using third-party authentication systems for programmatic access to Phase, you delegate the authentication of a particular accessor to a third party. This delegation is used as an assertion to obtain a Phase Service Token with the correct set of permissions, which can then be used to access secrets. The process works as follows:

1. A service (accessor) attempting to access secrets stored in Phase uses a third-party authentication token (e.g., a JWT service account token for Kubernetes or an AWS IAM v4 Signature for AWS).
2. The accessor sends this token to Phase.
3. Phase internally validates the token or signature using the third-party authentication system's APIs.
4. Phase validates the identity of the accessor and returns a Phase Service Token in accordance with the RBAC policy.
5. The accessor can then use the Phase Service Token to access secrets in Phase until expiry.
6. Upon expiry, the process can and will be repeated to gain access to a fresh Phase Service Token.

### External Auth Method Considerations

- To use an external auth provider for programmatic authentication with Phase to access sensitive data (e.g., Secrets) via the Phase API, SDKs, or the Kubernetes Operator, you will need to enable Server-side Encryption (SSE) so that Phase can generate a Service Token on the server side with access to a given application(s) or environment(s).
- When using an external auth method (e.g., Kubernetes), Phase will call the external service at the time of authentication and for subsequent token renewals. If the status of an entity changes in the external system (e.g., an account expires or is disabled), Phase will deny requests to renew tokens associated with that entity. However, any existing tokens remain valid for their original grant period unless explicitly revoked.