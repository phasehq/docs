import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'This guide explains how Apps work in Phase.'

<Tag variant="small">CONSOLE</Tag>

# Apps

A Phase App is used to manage [Secrets](/console/secrets) for a single project, repository, or application. An App can contain multiple [Environments](/console/environments). Users can be added to or removed from an App to manage access.

<DocActions /> 

## Create an App

Create an App by clicking the "+" button on the Apps screen. Enter a name for your App and your `sudo` password if prompted.
You can also optionally choose to initialize your App with example secrets. This option is automatically selected for your first App.

![create app](/assets/images/console/apps/app-create.png)

## App Description

Each App can have a description that serves as a space for developer documentation, runbooks, onboarding notes, or any other relevant information. The description is displayed on the App's **Home** tab and supports full markdown rendering, including headings, lists, links, code blocks, and blockquotes.

![app description on home tab](/assets/images/console/apps/app-description-home.png)

Click the description to expand it in a full-screen dialog for easier reading.

![expanded app description with markdown rendering](/assets/images/console/apps/app-description-expanded.png)

### Editing a description

To add or edit a description, go to the App's **Settings** tab. The editor supports a **Write** and **Preview** toggle so you can author Markdown and preview the rendered output before saving.

![app description editor in settings](/assets/images/console/apps/app-description-editor.png)

<Note>
New organisations are created with an example app that includes a sample description demonstrating the available Markdown features.
</Note>

## Secrets

This screen shows an overview of all Secrets in this App across all Environments. You can explore a specific Environment by clicking the Environment name in the column headers.
You can expand a Secret to view its status in each Environment. Clicking an Environment name will take you to this Secret in the respective Environment management screen.

![app secrets](/assets/images/console/apps/app-secrets.png)

### One-click secret access

The Phase Console has a "One-click access" menu in the top right of the screen when inside of an App. Open this menu and click to copy a one-liner for either the CLI or REST API to fetch secrets from the current environment and path based on the context (this defaults to the first environment and the root / path if in the App home). The ability to access secrets over the REST API requires an SSE (Server-Side Encryption) enabled App.

Here's a quick demo of how it works:

<video controls autoPlay="true" muted loop><source src="/assets/images/console/apps/one-click-access.mp4" /></video>

A temporary Personal Access Token (PAT) is automatically generated and copied to your clipboard to authenticate the request. This is ideal for quickly fetching secrets either in your dev environment or in a shell session on a remote machine.

You may modify the one-liners to best suit your needs by injecting, exporting, or parsing the secrets via the CLI or over the REST API with curl. You may also run follow-up commands as the one-liners set the Personal Access Token as the `PHASE_TOKEN` environment variable, and the token is valid for 5 minutes.

## Access

### Add a service account to an App

You can add a Service Account to any App from the respective App's "Access" tab. 

1. Click "Service accounts" on the left, and then "Add service account"

![Add service account to app](/assets/images/console/access-control/service-accounts/manage-account/add-to-app-1.png)

2. Select the service account from the list of accounts. Next, select the Environments that this account should have access to. Once you have selected the account and scope, click "Add"

![Add service account to app](/assets/images/console/access-control/service-accounts/manage-account/add-to-app-2.png)

3. The account will now have access to the Environments you selected. You can always update the Environment scope for this account or remove it from the App entirely. 

![Add service account to app](/assets/images/console/access-control/service-accounts/manage-account/add-to-app-3.png)

### Add a member to an App

You can add a new user to any App from the respective App's "Access" tab. To add a member to an App, click the "+ Add a member" button. Select an Organization member from the dropdown list, select which Environments to grant them access to, and click "Add".
![app member add](/assets/images/console/apps/app-access-members-tab.png)

![app member add](/assets/images/console/apps/app-member-add.png)

### Update Environment access for a member

To update the Environments that a specific user can access, click the "Manage user access" button. Update the Environment selection and click "Save".

![app member manage access](/assets/images/console/apps/app-member-manage.png)

### Remove a member from an App

To remove a member from an App, click the "Remove member" button.

## Syncing

Phase offers the ability to automatically sync secrets to various third-party platforms and services. This feature enables seamless deployment of secrets to services like GitHub Actions, Railway, AWS Secrets Manager, and HashiCorp Nomad.

### Requirements for Syncing

1. Server-Side Encryption (SSE) must be enabled for the App to use secret syncing integrations. This allows Phase to securely manage and deploy secrets to external services.
2. Appropriate permissions and access tokens for the target service must be configured.

### Setting Up a Sync

To set up a new sync:

1. Navigate to the "Syncing" tab in your App.
2. Click on "Create a new sync" and select the desired service.
3. Follow the prompts to configure the sync, including selecting the Environment and specific secrets to sync.

![secret syncing](/assets/images/console/apps/app-sync.png)

Syncing allows Phase to keep your secrets up-to-date across different platforms automatically. This ensures consistency and reduces manual secret management tasks.

## Logs

This screen shows you audit logs for all CRUD events for all Secrets and Environments in this App. You can expand a specific log event to view more information.

![app logs](/assets/images/console/apps/app-logs.png)

## Settings

This screen shows you metadata for the App and allows you to perform administrative tasks such as changing the encryption mode of the App or deleting it permanently.

### Encryption

Phase Apps are secured with end-to-end encryption (E2EE) by default. This means only users who are granted access to the App and its Environments can decrypt the secrets that are stored within it.
However, to use certain features of Phase such as third-party integrations or the [public REST API](/public-api), you will need to enable server-side encryption (SSE).
Enabling SSE will store a copy of each Environment's root key on the server, encrypted with the server's encryption key. This allows the server to decrypt secrets for syncing with third parties or to make them available over the API.

### Enabling SSE

To enable SSE for an App, click the "Enable SSE" button under the "Encryption" section of the App Settings tab.

![enable sse button](/assets/images/console/settings/encryption-section-e2ee.webp)

Click "Enable" on the confirmation dialog:

![enable sse dialog](/assets/images/console/settings/enable-sse-dialog.webp)

Once enabled, the settings page will show you the updated Encryption mode:

![sse enabled](/assets/images/console/settings/sse-enabled.webp)

### Delete an App

To delete an App, click the "Delete" button in the Settings tab.

<Warning>
 Deleting an App will permanently delete all Environments, Secrets, and Tokens
 associated with it.
</Warning>
