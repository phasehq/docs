import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'How to manage Environments in the Phase Console'

<Tag variant="small">CONSOLE</Tag>

# Environments

Manage your [Environments](/platform/environments) in the Phase Console. This page covers the practical steps for creating, updating, and administering Environments through the Console UI.

<DocActions />

When you create a new App, it is automatically initialized with three default Environments: Development, Staging, and Production. You can customize these or add additional Environments as needed.

<Note>
 The ability to create and manage custom environments is available for organizations with a `Phase Pro` or `Enterprise` tier subscription.
</Note>

## Creating a New Environment

1. Navigate to the Secrets overview screen inside your app in the Phase console.
2. Click the "+ New Environment" button.
![Create a new environment button](/assets/images/console/environments/new-environment-button.png)
3. Enter a name for your new environment. For naming rules and conventions, see [Platform > Environments](/platform/environments#naming-rules).
![Create a new environment](/assets/images/console/environments/create-new-environment.png)
4. Click `Create`

Note: All Organisation Admins will have access to this Environment.

## Managing Existing Environments

To manage an existing environment:

1. On the Secrets overview screen, locate the environment card you want to manage.
2. Click on the cog icon at the top right of the environment card.

![Manage environment cog button](/assets/images/console/environments/manage-environment-cog-button.png)

3. A "Manage [Environment Name]" dialog will appear with several options:

![Manage existing environment](/assets/images/console/environments/update-environment.png)

### Renaming an Environment

1. Enter the new name in the "Environment name" field.
2. Click the `Rename` button to apply the change.

<Warning>
Changing the environment name will affect how you construct [secret references](/platform/secrets#secret-referencing).
</Warning>

### Managing Access

1. In the "Environment Members" section, you can see users who have access to Secrets in this Environment.
2. Click `Manage access` to add or remove user access to this environment.

### Deleting an Environment

1. At the bottom of the dialog, you'll find a "Delete Environment" section.
2. Click the `Delete` button to remove the environment.

<Warning>
Deleting an environment will permanently delete all associated Secrets and Integrations.
</Warning>

Organisation Owners and Admins have access to all Environments by default. For Developers, you can control Environment access from the App Members screen.
