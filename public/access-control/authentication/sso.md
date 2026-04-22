import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Configure single sign-on for your organisation from the Phase Console.'

<Tag variant="small">AUTHENTICATION</Tag>

# Single Sign-On (SSO)

Administrators can configure a Single Sign-On provider for their organisation directly from the Phase Console, without needing to edit environment variables or restart the application. Each organisation can have one active OIDC provider at a time, and can optionally enforce SSO so that all members must sign in through it.


<DocActions />


## Configure a provider

1. In the Console, go to **Access → Single Sign-On**.

   ![SSO settings empty state](/assets/images/auth/sso/org/01-settings-empty-state.png)

2. Click the provider card for **Microsoft Entra ID** or **Okta**.
3. A setup dialog opens with a **Redirect URI** shown at the top — copy this value; you will register it in your identity provider as an authorised redirect URI.

   ![Entra ID setup dialog — empty](/assets/images/auth/sso/org/02-entra-setup-dialog-empty.png)

4. Register a new application in your identity provider:

   **Entra ID:** register an application in the [Azure Portal](https://portal.azure.com) under *Microsoft Entra ID → App registrations*. Note the **Tenant ID**, **Application (client) ID**, and generate a new **Client secret**.

   **Okta:** create an OIDC *Web Application* in your Okta admin console. Note the **Issuer URL** (your Okta domain, e.g. `https://dev-12345.okta.com`), **Client ID**, and **Client secret**.

5. Return to the Console and fill in:

   - **Display Name** (shown to members on the login page — e.g. *"Acme Entra ID"*)
   - **Tenant ID** / **Issuer URL** (provider-specific)
   - **Client ID**
   - **Client Secret** — encrypted client-side before submission

   ![Entra ID setup dialog — filled](/assets/images/auth/sso/org/03-entra-setup-dialog-filled.png)

6. Click **Save**. The provider is created but not yet active.

   ![Provider card — saved but inactive](/assets/images/auth/sso/org/04-provider-card-saved.png)

## Activate

Hover the configured provider card and click **Activate**. Only one provider per organisation can be active at a time; activating one deactivates any other.

![Provider card — active](/assets/images/auth/sso/org/06-provider-card-active.png)

Once active, members will see a *"Sign in with provider name"* button on the login page after entering their email.

![Login page with SSO sign-in button](/assets/images/auth/sso/org/14-login-email-check-with-sso.png)

## Test SSO

Before enforcing SSO on the whole organisation, run a Test SSO flow to confirm the provider config works end-to-end.

1. Hover the active provider card and click **Test SSO**.
2. Confirm the redirect dialog. Make sure the email in the warning matches your identity-provider account — if you sign in with a different email, Phase creates a new account rather than testing your existing one.

   ![Test SSO confirmation dialog](/assets/images/auth/sso/org/07-test-sso-dialog.png)

3. Click **Continue**. You are redirected to the identity provider, sign in, and return to the Phase Console.

A successful round-trip brings you back to the SSO settings page.

## Enforce SSO

Enforcing SSO disables password login for all members of the organisation and requires every sign-in to go through the configured provider.

1. Click **Enforce SSO**. A confirmation dialog appears.

   ![Enforce SSO dialog — acknowledgement unchecked](/assets/images/auth/sso/org/08-enforce-sso-dialog-unchecked.png)

2. Read the effects — password login disabled, other SSO providers disabled, all members required to authenticate via the active provider, users matched to their existing accounts by email.
3. Tick the acknowledgement checkbox confirming you understand enforcement will end your current session.

   ![Enforce SSO dialog — acknowledgement checked](/assets/images/auth/sso/org/09-enforce-sso-dialog-checked.png)

4. Click **Enforce SSO**.

If your current session was established via the organisation's SSO provider, enforcement takes effect immediately and you stay signed in. If you enforced from a password-authenticated session, Phase signs you out and redirects you to the login page — sign back in via SSO to continue.

![SSO enforcement active on provider card](/assets/images/auth/sso/org/10-enforcement-active.png)

Other members' existing sessions remain active for open tabs but will be rejected on the next request. They will be redirected to the lobby where a *"Sign in with provider name"* prompt appears next to the enforced organisation.

![Lobby — organisation locked behind SSO](/assets/images/auth/sso/org/15-lobby-sso-lockout.png)

### Disable enforcement

Click **Disable SSO Enforcement** on the SSO settings page. Members can sign in with a password again immediately.

### Lockout protection

If you deactivate or delete the only active SSO provider while enforcement is on, Phase automatically turns enforcement off. This prevents a scenario where no provider is available to authenticate through and the organisation becomes unreachable.

<Note>
Self-hosted operators with shell access to the backend container can also toggle SSO state out-of-band — see [SSO Enforcement Recovery](/self-hosting/maintenance#sso-enforcement-recovery).
</Note>

## Edit, deactivate, or delete a provider

Hover the provider card to reveal the action buttons:

![Provider card hover — action buttons](/assets/images/auth/sso/org/05-provider-card-hover-actions.png)

- **Edit** — update the display name, tenant / issuer / client ID, or rotate the client secret. Leaving the secret field blank keeps the existing value.

  ![Edit provider dialog](/assets/images/auth/sso/org/11-edit-dialog.png)

- **Deactivate** — turns off the provider without deleting it. If enforcement is on, deactivating also turns enforcement off to avoid locking the organisation out.

  ![Deactivate provider confirmation dialog](/assets/images/auth/sso/org/13-deactivate-dialog.png)

- **Delete** — removes the provider. If the provider was active and enforcement was on, enforcement is turned off automatically.

  ![Delete provider confirmation dialog](/assets/images/auth/sso/org/12-delete-dialog.png)
