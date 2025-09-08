import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with Cloudflare Pages'

<Tag variant="small">INTEGRATE</Tag>

# Cloudflare Pages

You can use Phase to sync secrets with your Cloudflare Pages.

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. Any secrets on the target service will be overwritten or
  deleted. Please import your secrets into Phase before continuing.
</Warning>

### Prerequisites

- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app).
- Enable Server-side Encryption (SSE) for the App from the [Settings](/console/apps#settings) tab.

<Note>
  For security reasons Phase sets the secret type in Cloudflare Pages
  environment variables as type `Encrypted` for additional protection. This
  means that you will not be able to see the secret value in the Cloudflare
  Pages UI. You can still use the secret in your build commands and environment
  variables.
</Note>

## Step 1: Authentication

### Get your Cloudflare Account ID

1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com)

2. Click on **Workers & Pages** in the sidebar to the left.

![Workers and Pages](/assets/images/platform-integrations/cloudflare-pages/1.png)

3. Copy the **Account ID** by clicking on the copy button in the Account Details section on the right.

![Copy Account ID](/assets/images/platform-integrations/cloudflare-pages/2.png)

### Create a Cloudflare Token

1. Go to Cloudflare's [API tokens](https://dash.cloudflare.com/profile/api-tokens) page and click on **Create Token**

![Create token button](/assets/images/platform-integrations/cloudflare-pages/3.png)

2. In the Create API Tokens page, create a **Custom Token** by clicking on **Get started** in the **Custom token** section.

![Select custom token](/assets/images/platform-integrations/cloudflare-pages/4.png)

3. Give your token a descriptive name and give it **Edit** access to **Cloudflare Pages** like in the screen below:

![Token name and permissions](/assets/images/platform-integrations/cloudflare-pages/5.png)

Scroll down and click **Continue to summary**

![Continue to summary](/assets/images/platform-integrations/cloudflare-pages/6.png)

4. Confirm the permissions and create the token by clicking on **Create token**

![Confirm permissions](/assets/images/platform-integrations/cloudflare-pages/7.png)
![Create token](/assets/images/platform-integrations/cloudflare-pages/8.png)

### Save your credentials in Phase

<Note>
  Your credentials are kept secure with robust application-layer encryption.
  Phase encrypts your credentials directly in the browser and only decrypts them
  in memory to perform sync operations. Your credentials are never stored in
  plaintext.
</Note>

1. Go to **Integrations** from the sidebar and click on **Third-party credentials** in the integrations tab.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **Cloudflare**

![Create Cloudflare credentials](/assets/images/platform-integrations/cloudflare-pages/create-cf-creds-button.png)

3. Copy and paste your `Account ID` and `Access token` from the Cloudflare dashboard. Add a descriptive name for these credentials and click **Save**

![Input Cloudflare credentials](/assets/images/platform-integrations/cloudflare-pages/cf-creds-input.png)

## Step 2: Sync Secrets from Phase

Now that you have set up your Cloudflare account with Phase, you can start creating Syncs to manage your Cloudflare Pages sites.

### Create Sync

1. Select **Cloudflare Pages** under the 'Syncing' tab.

![Create cloudflare pages sync](/assets/images/platform-integrations/cloudflare-pages/phase-console-cloudflare-pages.png)

2. Select the credentials stored in the previous step as the authentication method for this sync, and click **Next**

![Choose sync authentication credentials](/assets/images/platform-integrations/cloudflare-pages/create-sync-choose-creds.png)

<Note>
  If you see an error message and cannot proceed to the next screen, it is most
  likely an issue with the Account ID or Access Token. Verify that you created
  the Cloudflare credentials correctly and update them from the Integrations
  screen if needed.
</Note>

3. Choose the source and destination to sync secrets. Select an Environment as the source for secrets along with the Path if you have a specific folder you want to sync from.
   Next, select your Cloudflare Pages project from the 'Cloudflare project' field, and select either the 'Preview' or 'Production' environment. Once you have selected your desired source and destination, click **Create**.

![Choose sync source and destination](/assets/images/platform-integrations/cloudflare-pages/create-sync-source-destination.png)

The sync has been set up! Secrets will automatically be Synced from your chosen Phase Environment to the Cloudflare pages project. You can click on the **Manage** button on the Sync card to view sync logs, pause syncing or update authentication credentials.

![Sync created](/assets/images/platform-integrations/cloudflare-pages/sync-created.png)
