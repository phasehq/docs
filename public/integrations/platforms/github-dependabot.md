import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with GitHub Dependabot'

<Tag variant="small">INTEGRATE</Tag>

# GitHub Dependabot

You can use Phase to sync secrets to GitHub Dependabot.

<DocActions />

## Automated secret syncing

Automatically sync secrets in your Phase App to GitHub Dependabot Secrets.

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. Any secrets on the target service will be overwritten or
  deleted. Please import your secrets into Phase before continuing.
</Warning>

### Prerequisites

- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app)
- Enable Server-side Encryption (SSE) for the App from the [Settings](/console/apps#settings) tab
- GitHub Account with access to repositories you want to sync secrets to

Phase will encrypt your secrets via libsodium's `SealedBox` using your GitHub
repository's public key before sending them to GitHub. For more information,
please see: [GitHub
Docs](https://docs.github.com/en/rest/guides/encrypting-secrets-for-the-rest-api?apiVersion=2022-11-28#example-encrypting-a-secret-using-python)

### Step 1: Authenticate with GitHub

<TabGroup title="Phase Deployment" subtitle="Select your Phase deployment type." slug="deployment">
  <TabPanel title="Phase Cloud" slug="phase-cloud">

1. Go to **Integrations** from the sidebar, select the **Third-party credentials** tab and click **+ Add credentials**.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **GitHub**

![Click on GitHub](/assets/images/platform-integrations/github/select-github-credentials.png)

3. Choose between **OAuth** or **Access Token** authentication method.

OAuth redirects you to GitHub, where you will be prompted to authorize Phase to access your repositories. Using an Access Token requires you to manually create the token on GitHub for a given set of permissions and provide it to Phase.

<TabGroup title="Authentication Method" subtitle="Select your preferred authentication method." slug="auth-method-cloud">
  <TabPanel title="OAuth" slug="oauth">

4. Choose between GitHub.com or GitHub Enterprise Server. Select the type of GitHub credentials you wish to add and give it a descriptive name.

![Add GitHub.com credentials](/assets/images/platform-integrations/github/add-github-com-credentials.png)

If you want to add GitHub Enterprise Server OAuth credentials, you will need to provide the following information:

**GitHub Host** (for example `github.yourdomain.com`) and **GitHub API URL** (this is typically a path on the GitHub host, for example `https://github.yourdomain.com/api`. This can also be a subdomain, for example `api.github.yourdomain.com`. If you are unsure, please contact your GitHub Enterprise Server administrator).

<Note>
This is only for users who want to integrate their self-managed GitHub Enterprise Server with Phase. If you are using GitHub.com cloud with the GitHub enterprise tier, you can simply set up GitHub.com credentials.
</Note>

![Add GitHub Enterprise Server credentials](/assets/images/platform-integrations/github/add-github-enterprise-server-creds.png)

5. You will be redirected to GitHub to authorize Phase. **Make sure to grant access to any organizations whose repositories you wish to integrate Phase with**. Click **Authorize** to continue.

![Authorize GitHub Phase Integration](/assets/images/platform-integrations/github/github-oauth-consent.png)

6. You will be redirected back to the Integrations page, and your new credentials should be visible under the "Third-party credentials" section:

![GitHub credentials stored](/assets/images/platform-integrations/github/github-credentials-created.png)

  </TabPanel>
  <TabPanel title="Access Token" slug="access-token">

4. Create a new Personal Access Token (PAT) in GitHub by heading over to **Settings**, Click on **Developer settings** at the very bottom of the sidebar list, select **Personal access tokens** from the dropdown and click on **Fine-grained tokens**. Next, provide the following details:

- **Name and description**
- **Resource owner**: select the organization whose repositories you are trying to sync secrets to. 
- **Expiration**: select No expiration, although GitHub may rightfully recommend you set an expiration date, this is to simply prevent your integrations from breaking unexpectedly.
- **Repository access**: choose between Public repositories, All repositories or Only select repositories, based on your requirements.
- **Permissions**: select the following permissions that are required for Phase to sync secrets to your repositories:
  - **Dependabot secrets** - Access: `Read and write`
  - **Metadata** - Access: `Read-only` (Auto-selected)

![Add GitHub Access Token credentials](/assets/images/platform-integrations/github/github-fine-grained-pat-syncing-permissons.png)

Click **Create token** and copy the token.

Next, head back to Phase Console, and paste the token in **Access Token** field, provide a distinct name and click **Save**.

Alternatively, if you want to use GitHub Enterprise Server, you will need to provide the following information:

**Host URL** (for example `github.yourdomain.com`) and **API URL** (this is typically a path on the GitHub host, for example `https://github.yourdomain.com/api`. This can also be a subdomain, for example `api.github.yourdomain.com`. If you are unsure, please contact your GitHub Enterprise Server administrator).

![Add GitHub Access Token credentials](/assets/images/platform-integrations/github/add-github-credentials-self-hosted-access-token.png)

5. You will see that the integration credential has been created successfully.

![GitHub credentials stored](/assets/images/platform-integrations/github/github-credentials-created.png)

  </TabPanel>
</TabGroup>

  </TabPanel>
  <TabPanel title="Self-hosted" slug="self-hosted">

<Note>
  If you are using a self-hosted instance of the Phase Console and would like to set up credentials via the OAuth method, you will need to
  set up a new GitHub OAuth Application and supply the
  `GITHUB_INTEGRATION_CLIENT_ID` and `GITHUB_INTEGRATION_CLIENT_SECRET`
  environment variables. [Setup instructions](/self-hosting/configuration/envars#third-party-integrations-configuration)
</Note>

1. Go to **Integrations** from the sidebar, select the **Third-party credentials** tab and click **+ Add credentials**.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **GitHub**

![Click on GitHub](/assets/images/platform-integrations/github/select-github-credentials.png)

3. Choose between **OAuth** or **Access Token** authentication method.

<TabGroup title="Authentication Method" subtitle="Select your preferred authentication method." slug="auth-method">
  <TabPanel title="OAuth" slug="oauth">

4. Choose between GitHub.com or GitHub Enterprise Server. Select the type of GitHub credentials you wish to add and give it a descriptive name.

![Add GitHub.com credentials](/assets/images/platform-integrations/github/add-github-credentials-self-hosted-oauth.png)

If you want to add GitHub Enterprise Server OAuth credentials, you will need to provide the following information:

**GitHub Host** (for example `github.yourdomain.com`) and **GitHub API URL** (this is typically a path on the GitHub host, for example `https://github.yourdomain.com/api`. This can also be a subdomain, for example `api.github.yourdomain.com`. If you are unsure, please contact your GitHub Enterprise Server administrator).

<Note>
This is only for users who want to integrate their self-managed GitHub Enterprise Server with Phase. If you are using GitHub.com cloud with the enterprise tier, you can simply set up GitHub.com credentials.
</Note>

![Add GitHub Enterprise Server credentials](/assets/images/platform-integrations/github/add-github-enterprise-server-creds.png)

5. You will be redirected to GitHub to authorize Phase. **Make sure to grant access to any organizations whose repositories that you wish to integrate Phase with**. Click **Authorize** to continue.

![Authorize GitHub Phase Integration](/assets/images/platform-integrations/github/github-oauth-consent.png)

6. You will be redirected back to the Integrations page, and your new credentials should be visible under the "Third-party credentials" section:

![GitHub credentials stored](/assets/images/platform-integrations/github/github-credentials-created.png)

  </TabPanel>
  <TabPanel title="Access Token" slug="access-token">

4. Create a new Personal Access Token (PAT) in GitHub by heading over to **Settings**, Click on **Developer settings** at the very bottom of the sidebar list, select **Personal access tokens** from the dropdown and click on **Fine-grained tokens**. Next, provide the following details:

- **Name and description**
- **Resource owner**: select the organization whose repositories you are trying to sync secrets to. 
- **Expiration**: select No expiration, although GitHub may rightfully recommend you set an expiration date, this is to simply prevent your integrations from breaking unexpectedly.
- **Repository access**: choose between Public repositories, All repositories or Only select repositories, based on your requirements.
- **Permissions**: select the following permissions that are required for Phase to sync secrets to your repositories:
  - **Dependabot secrets** - Access: `Read and write`
  - **Metadata** - Access: `Read-only` (Auto-selected)

![Add GitHub Access Token credentials](/assets/images/platform-integrations/github/github-fine-grained-pat-syncing-permissons.png)

Click **Create token** and copy the token.

Next, head back to Phase Console, and paste the token in **Access Token** field, provide a distinct name and click **Save**.

Alternatively, if you want to use GitHub Enterprise Server, you will need to provide the following information:

**Host URL** (for example `github.yourdomain.com`) and **API URL** (this is typically a path on the GitHub host, for example `https://github.yourdomain.com/api`. This can also be a subdomain, for example `api.github.yourdomain.com`. If you are unsure, please contact your GitHub Enterprise Server administrator).

![Add GitHub Access Token credentials](/assets/images/platform-integrations/github/add-github-credentials-self-hosted-access-token.png)

5. You will see that the integration credential has been created successfully.

![GitHub credentials stored](/assets/images/platform-integrations/github/github-credentials-created.png)

  </TabPanel>
</TabGroup>

  </TabPanel>
</TabGroup>

### Step 2: Configure Sync

Now that you have authenticated with GitHub, you can configure syncs for your app:

1. Go to your App in the Phase Console and go to the **Syncing** tab. Select **GitHub Dependabot** under the 'Create a new Sync' menu.

![Create a new sync button](/assets/images/platform-integrations/github/dependabot/create-gh-dependabot-sync-button.png)

2. Select the credentials stored in the previous step as the authentication method for this sync, and click **Next**

![Choose sync authentication credentials](/assets/images/platform-integrations/github/dependabot/select-gh-third-party-credentials.png)

3. Choose the source and destination to sync secrets. Select the Phase Environment as the source for Secrets.
   Next, choose a GitHub repository from the dropdown as the destination to sync Secrets to.

   <Note>
   For security reasons, secrets in your source Phase Environment will be synced to your GitHub repository as Dependabot Secrets.
   </Note>

![Configure sync](/assets/images/platform-integrations/github/dependabot/setup-gh-dependabot-sync-repo.png)

Alternatively, you sync secrets directly to your GitHub organization. You can choose between **All repositories**, meaning private and public repositories, or Only **Private repositories**, based on your requirements. Your GitHub repositories will inherit the organization-level secrets automatically. GitHub Actions secret takes the following precedence:


- **Environment secret**
  - if not present, then use **Repository secret** 
    - if not present, then use **Organization secret**


![Configure an organization sync](/assets/images/platform-integrations/github/dependabot/setup-gh-dependabot-sync-org.png)

4. Once you have selected your desired source and destination, click **Create**.
   The sync has been set up! Secrets will automatically be synced from your chosen Phase Environment to the GitHub repository as Dependabot Secrets.
   You can click on the **Manage** button on the Sync card to view sync logs, pause syncing, or update authentication credentials.

#### Troubleshooting

- If you are using a self-hosted Phase instance and see a warning message about missing `GITHUB_INTEGRATION_CLIENT_ID` and `GITHUB_INTEGRATION_CLIENT_SECRET` while trying to set up GitHub integration credentials, this means the GitHub integration credentials have not been configured for your self-hosted deployment. Please provision the integration credentials following the [Third-party integrations configuration](/self-hosting/configuration/envars#third-party-integrations-configuration) guide, restart your deployment and then **hard refresh** the page in your browser.
- If you are not able to see your repositories or organizations, please check if you have provisioned the correct scope of access to your GitHub credentials. If you used the OAuth flow, please make sure to go through it again and to grant access to any organizations whose repositories you wish to integrate Phase with.