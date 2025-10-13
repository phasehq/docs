import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Railway'

<Tag variant="small">INTEGRATE</Tag>

# Railway

You can use Phase to sync secrets with your Railway environments.

<DocActions />

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. Any secrets on the target service will be overwritten or
  deleted, including those automatically provisioned by Railway for services like
  databases. Please import your secrets into Phase before continuing.
</Warning>

### Prerequisites

- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app).
- Enable Server-side Encryption (SSE) for the App from the [Settings](/console/apps#settings) tab.

## Step 1: Authentication

1. Log in to your [Railway Dashboard](https://railway.app/dashboard).

2. Click on your user icon to see the user account options and click on **Account Settings**.

![Railway dashboard](/assets/images/platform-integrations/railway/1-account-settings.png)

3. Click on **Tokens** in the sidebar menu on the left.

![Railway dashboard](/assets/images/platform-integrations/railway/2-account-settings-menu-token-tab.png)

4. Create a **New Token** with a descriptive name and select No team. Note: If you do not have a Railway Team, you will not see the Team dropdown as shown in the screenshot below.

![Railway dashboard](/assets/images/platform-integrations/railway/3-create-personal-token.png)

Alternatively, if you do have a Railway Team you want to sync secrets to, please make sure you select your Team from the dropdown.

![Railway dashboard](/assets/images/platform-integrations/railway/3.5-create-team-token.png)

5. Copy the **API Token**.

![Railway dashboard](/assets/images/platform-integrations/railway/4-copy-created-token.png)


### Store authentication credentials in Phase

<Note>
  Your credentials are kept secure with robust application-layer encryption.
  Phase encrypts your credentials directly in the browser and only decrypts them
  in memory to perform sync operations. Your credentials are never stored in
  plaintext.
</Note>

1. Go to **Integrations** from the sidebar and click on **Third-party credentials** in the integrations tab.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **Railway**.

![railway-create-creds](/assets/images/platform-integrations/railway/railway-create-creds-button.png)

3. Enter your Railway `API Token` from the previous step. Enter a descriptive name and click **Save**.

![railway-input-creds](/assets/images/platform-integrations/railway/railway-input-creds.png)

Your credentials will be encrypted and saved. You can view and manage these credentials under *Service Credentials* in the *Integrations* screen.

## Step 2: Set up a secret sync

1. Go to your App in the Phase Console and go to the **Syncing** tab. Select **Railway** under the 'Create a new Sync' menu.

![create railway sync](/assets/images/platform-integrations/railway/railway-create-sync-button.png)

2. Choose the credentials you added in the previous step as the authentication mode, and click **Next**.

![select railway creds](/assets/images/platform-integrations/railway/railway-select-creds.png)

3. Next, configure the source and destination for your secrets. Pick an Environment from your App as the source. To configure the destination for the sync, choose a Railway Project from the list of available Projects, as well as an Environment. You can also optionally select a specific Service to sync secrets to. Leave this field blank to sync secrets as Shared Variables in the selected Railway environment.

<Note>
   If you choose to sync to a Railway Service, shared Variables automatically provisioned by Railway, including those belonging to a Railway Deployments such as Databases, will be overwritten by Phase. Please import all secrets into Phase before continuing.
</Note>

![configure railway sync](/assets/images/platform-integrations/railway/railway-setup-sync.png)

4. Once set up, your secrets will automatically be synced to the chosen destination in Railway. You can manage your sync from the *Syncing* tab of your App, or from the *Integrations* screen.

![railway syncs](/assets/images/platform-integrations/railway/railway-sync-cards.png)
