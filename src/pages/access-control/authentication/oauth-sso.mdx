import { Tag } from '@/components/Tag'
export const description = 'Authenticating via various OAuth Single sign-on providers with Phase.'

<Tag variant="small">AUTHENTICATION</Tag>

# OAuth 2.0 Single sign-on (SSO)

## Google

Follow these steps to set up Google SSO for your Phase application:

1. Go to your [Google Cloud Platform Console](https://console.cloud.google.com/) and click the "Select a project" dropdown.

   ![Select a project](/assets/images/auth/sso/google/1-select-a-project.png)

2. Click "New project". If you already have a project you want to use, select it from the list and skip to step 5.

   ![New project select](/assets/images/auth/sso/google/2-new-project-select.png)

3. Enter a valid Project Name and click "Create".

   ![New project create](/assets/images/auth/sso/google/3-new-project-create.png)

4. Go to your newly created project by clicking "SELECT PROJECT" from the notifications.

   ![Go to new project](/assets/images/auth/sso/google/4-go-to-new-project.png)

5. In your console's search box, type 'Credentials' and click on the result that says "Credentials - APIs & Services".

   ![Search credentials](/assets/images/auth/sso/google/5-search-credentials.png)

6. Click on "+ CREATE CREDENTIALS" and select "OAuth client ID". If this is your first time creating an OAuth credential, you'll need to set up a consent screen. If you've already set up a consent screen, skip to Step 13.

   ![Create OAuth client ID](/assets/images/auth/sso/google/6-create-oauth-client-id.png)

7. When prompted to configure an OAuth consent screen, click the "CONFIGURE CONSENT SCREEN" button.

   ![Configure consent screen](/assets/images/auth/sso/google/7-first-time-consent-screen-config.png)

8. Choose "External" as the User Type for the OAuth consent screen.

   ![Create external consent screen](/assets/images/auth/sso/google/8-create-external-consent-screen.png)

9. Enter details for mandatory fields such as App name, User support email, and Developer contact information. Click "SAVE AND CONTINUE".

   ![Consent screen app information](/assets/images/auth/sso/google/9-consent-screen-app-information.png)
   ![Consent screen app information save and continue](/assets/images/auth/sso/google/10-consent-screen-app-information-save-continue.png)

10. Continue through the Scopes step by clicking "SAVE AND CONTINUE".

    ![Consent screen scope save and continue](/assets/images/auth/sso/google/11-consent-screen-scope-save-continue.png)

11. Continue through the Test user setup screen by clicking "SAVE AND CONTINUE".

    ![Consent screen test users save and continue](/assets/images/auth/sso/google/12-consent-screen-test-users-save-continue.png)

12. Review the details of your Consent screen app registration and click "BACK TO DASHBOARD".

    ![Consent screen back to dashboard](/assets/images/auth/sso/google/13-consent-screen-back-to-dashboard.png)

13. In the APIs & Services dashboard, click "+ CREATE CREDENTIALS" and select "OAuth client ID" from the dropdown.

    ![Select a project](/assets/images/auth/sso/google/13-5-create-oauth-app.png)

14. Fill in the application details:

    <Properties>
      <Property name="Application type" type="string">
        Web application
      </Property>
      <Property name="Name" type="string">
        Phase Console
      </Property>
      <Property name="Authorised redirect URI" type="string">
        `https://[**YOUR_DOMAIN**]/api/auth/callback/google`
      </Property>
    </Properties>

    Then click "CREATE".

    ![Create OAuth client ID config](/assets/images/auth/sso/google/14-create-oauth-client-id-config.png)

15. You will be presented with the OAuth Client ID and Client secret. Copy these by clicking the clipboard icon next to each.

    ![Copy OAuth credentials](/assets/images/auth/sso/google/15-copy-oauth-creds.png)

16. Supply these credentials to your Phase Console deployment as [environment variables](/self-hosting/configuration/envars#google-sso).

You can find detailed official instructions for setting up SSO with a Google OAuth Application [here](https://support.google.com/cloud/answer/6158849?hl=en).

## GitHub

Follow these steps to set up GitHub SSO for your Phase application:

If you are using GitHub Enterprise Server (self-hosted) instance, you may follow the steps below to set up GitHub SSO for your Phase application as the instructions are nearly identical. The only exception being the Authorization callback URL.

<Note>
   GitHub Enterprise Server (self-hosted) instance for OAuth SSO is only available for organizations with an `Enterprise` tier subscription. See [Pricing](https://phase.dev/pricing).
</Note>

1. Log in to your GitHub account and go to [OAuth Apps](https://github.com/settings/developers) in Developer Settings.

2. Click "New OAuth App".

   ![Create a new GitHub OAuth app](/assets/images/auth/sso/github/1-create-new-oauth-app.png)

3. Fill in the application details:

   <Properties>
     <Property name="Application name" type="string">
       Phase Console
     </Property>
     <Property name="Homepage URL" type="string">
       `https://[**YOUR_DOMAIN**]`
     </Property>
     <Property name="Authorization callback URL" type="string">
       For GitHub.com: `https://[**YOUR_DOMAIN**]/api/auth/callback/github`<br/>
       For GitHub Enterprise Server: `https://[**YOUR_DOMAIN**]/api/auth/callback/github-enterprise`
     </Property>
   </Properties>

   ![Configure and register a new application](/assets/images/auth/sso/github/2-configure-register-application.png)

4. Click "Register application".

5. On the next screen, click "Generate a new client secret".

   ![Generate a new client secret](/assets/images/auth/sso/github/3-generate-client-secret.png)

6. Copy the Client ID and newly generated Client Secret.

   ![Copy the client ID and client secret](/assets/images/auth/sso/github/4-copy-client-id-secret.png)

7. Supply these credentials to your Phase Console deployment as [environment variables](/self-hosting/configuration/envars#git-hub-o-auth-2-0). If you are using GitHub Enterprise (self-hosted), supply the following configurations as [environment variables](/self-hosting/configuration/envars#git-hub-enterprise-o-auth-2-0).

You can find detailed official instructions for setting up SSO with a GitHub OAuth Application [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app). 

## GitLab

Follow these steps to set up GitLab SSO for your Phase application:

1. Log in to your GitLab account and go to User Preferences > Applications.

   ![Navigate to User Preferences](/assets/images/auth/sso/gitlab/1-personal-preferences.png)

   ![Navigate to User Applications](/assets/images/auth/sso/gitlab/2-applications.png)

2. Click on "Add new application".  

   ![Add new application](/assets/images/auth/sso/gitlab/3-add-new-application.png)

3. Fill in the application details:

   <Properties>
     <Property name="Name" type="string">
       Phase Console SSO
     </Property>
     <Property name="Redirect URI" type="string">
       `https://[**YOUR_DOMAIN**]/api/auth/callback/gitlab`
     </Property>
     <Property name="Confidential" type="boolean">
       ✓ (Check this box)
     </Property>
     <Property name="Scopes" type="string">
       `read_user` (The only scope required)
     </Property>
   </Properties>

   ![Configure new application](/assets/images/auth/sso/gitlab/4-application-config-permission.png)

Make sure the application has the `read_user` scope. This grants read-only access to the user's profile through the /user API endpoint, which includes username, public email, and full name.

4. Click "Save application".

    ![Configure new application](/assets/images/auth/sso/gitlab/5-save-application.png)

5. On the next screen, copy the Application ID and Secret.

   ![Copy Application ID and Secret](/assets/images/auth/sso/gitlab/6-copy-application-id-application-secret.png)

6. Supply these credentials to your Phase Console deployment as [environment variables](/self-hosting/configuration/envars#git-lab-sso).

<Note>
  You can use user-owned or group-owned applications to login to Phase. If you are running a self-hosted instance, you can also use an instance-wide application.
</Note>

You can find detailed official instructions for setting up SSO with a GitLab OAuth Application [here](https://docs.gitlab.com/ee/integration/oauth_provider.html). 


## Authentik

You can integrate [Authentik](https://goauthentik.io) as an OIDC provider for your Phase instance. Follow these steps to set up Authentik SSO for Phase:

1. Sign in to your Authentik administrative interface.


2. From the left sidebar, click **Applications**.

   ![Click Applications](/assets/images/auth/sso/oidc/authentik/authentik-sidebar-applications.png)

3. Click the **Create with Provider** button. You can also click the **Create** button if you want to create a new application first and configure the provider separately.

   ![Create new Application](/assets/images/auth/sso/oidc/authentik/authentik-create-with-provider-button.png)

4. Provide the following values:

   - **Name**: e.g. `Phase`
   - **Slug**: e.g. `phase`
   

   Click **Next** 

   ![Configure new Application](/assets/images/auth/sso/oidc/authentik/authentik-app-step-1.png)

5. Select "OAuth2/OpenID Provider" and click **Next**.

   ![Select Provider](/assets/images/auth/sso/oidc/authentik/authentik-app-step-2.png)

6. Configure the provider:

   - **Name**: e.g. `Provider for Phase`
   - **Authorization flow**: Select `default-provider-authorization-explicit-consent`
   - **Signing Key**: Choose an existing key or create a new one
   - **Client ID**: Make a note of this value, as it will be used later as `AUTHENTIK_CLIENT_ID`
   - **Client Secret**: Make a note of this value, as it will be used later as `AUTHENTIK_CLIENT_SECRET`
   - **Redirect URIs**: This will be the hostname of your Phase instance, followed by:
   
   ```
   /api/auth/callback/authentik
   ```
   
   (e.g., `https://[YOUR_PHASE_HOST]/api/auth/callback/authentik`).

   - Click **Next**


   ![Configure OIDC Provider](/assets/images/auth/sso/oidc/authentik/authentik-app-step-3.png)

7. Configure Bindings for the application. This will control which users can log in to Phase using this provider. Please see the [authentik docs on application management](https://docs.goauthentik.io/docs/add-secure-apps/applications/manage_apps) for more information on this. In the example below, we are binding the application to the `Phase Users` group.

   ![Configure bindings](/assets/images/auth/sso/oidc/authentik/authentik-app-step-4.png)

8. Click **Next** to review your configuration, then click **Create** to finalize the application setup.


9. Supply these credentials to your Phase Console deployment as environment variables:

 - `AUTHENTIK_CLIENT_ID`
 - `AUTHENTIK_CLIENT_SECRET`
 - `AUTHENTIK_URL`
 - `AUTHENTIK_APP_SLUG`

 Please see [deployment configuration](/self-hosting/configuration/envars#authentik) for more details.

Your Authentik SSO application is now configured! You can now provision user access to your Phase instance via Authentik.

For more detailed information about Authentik application and OIDC configuration, refer to the [Authentik documentation](https://goauthentik.io/docs/providers/oidc/).

### Troubleshooting: Authentik SSO

#### Issue: Redirect URI Mismatch

If you receive an error like:

`redirect_uri_mismatch`


Ensure that the redirect URI configured in Authentik exactly matches:

`https://[YOUR_PHASE_HOST]/api/auth/callback/authentik`