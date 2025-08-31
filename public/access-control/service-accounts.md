import { Tag } from '@/components/Tag'

<Tag variant="small">ACCESS CONTROL</Tag>

# Service Accounts

Service Accounts provide a secure and controlled method for programmatic access to the Phase platform. Service accounts are non-human users that can use various authentication mechanisms to access resources such as secrets within the applications and environments it has been granted access to. 

Service accounts share many of the properties and behavior of human user accounts. Service Accounts follow an Access Policy that can be defined by [Managed Roles](/access-control/roles#managed-roles) or [Custom Roles](/access-control/roles#creating-custom-roles) based on the permissions required. Service accounts are secured with the same security and cryptographic architecture as user accounts, and must be manually provisioned access to Apps and Environments in order to access secrets. 

## Create a new Service Account

To create a new Service Account:

1. Navigate to Access Control page from the sidebar and click on the **Service Accounts** tab.

![Navigate to access control](/assets/images/console/access-control/service-accounts/create-new-service-accounts/1-navigate-to-access-control.png)

![Click on service accounts tab](/assets/images/console/access-control/service-accounts/create-new-service-accounts/2-click-on-service-accounts-tab.png)

2. Click the **Create Service Account** button in the center of the screen, if you have previously created service accounts you will see in the top right corner of the screen.

![Click create service account](/assets/images/console/access-control/service-accounts/create-new-service-accounts/3-click-create-new-service-account.png)

3. Give your new service account an Account name and choose a Role and Click "Create Service Account".

By default, when you create a new Service Account it uses the [Service](/access-control/roles#service) role that's managed by Phase which only has access to secrets at the Application level.

[Service](/access-control/roles#service) role secret access policy:

| Resource | Access | Read | Create | Update | Delete |
|----------|--------|------|--------|--------|--------|
| **Secrets** | Full access | ✅ | ✅ | ✅ | ✅ |

You may choose to select a different Managed role or a Custom role by clicking the one from the dropdown.

![Create new service account](/assets/images/console/access-control/service-accounts/create-new-service-accounts/4-create-new-service-account.png)

Click "Create service account". This will create a new account with the chosen name and role. 

<Note>
Creating a Service Account can take a few seconds as a unique encryption keyring is generated for each account. Do not close the tab or navigate away from this page during this process. You can find out more about this process in the [security architecture](/security/architecture#user-keys) page
</Note>

Once the account is created, you will see it listed in the table. 


## Manage a Service Account

You can manage a Service Account from the account detail page, accessible by clicking the "Manage" account button. Here you will find information about this account including the account name, role, App / Environment access and tokens. 

![Click manage service account button](/assets/images/console/access-control/service-accounts/create-new-service-accounts/5-manage-service-account.png)

### Update account name

To update the name of an account, simply click the account name at the top of the page and edit it in place. Click "Save" to save your changes. 

![Update service account name](/assets/images/console/access-control/service-accounts/manage-account/service-account-update-name.png)

### Update account role

To update an account's role, click the role label to open the dropdown and select a role from the list. The selected role will be applied on selection.

![Update service account role](/assets/images/console/access-control/service-accounts/manage-account/service-account-update-role.png)

### Delete account

To delete a Service Account, click on the "Delete" button at the bottom of the page. This will permanently delete this account and all associated tokens. Confirm that you want to delete this account by clicking "Delete" on the confirm dialog.

![Delete service account](/assets/images/console/access-control/service-accounts/manage-account/service-account-delete-1.png)

![Confirm delete service account](/assets/images/console/access-control/service-accounts/manage-account/service-account-delete-2.png)

## Create a new Service Account Token

You can find instructions on how to create a Service Account Token [here](/access-control/authentication/tokens#service-account-tokens).

## Add a Service Account to an App

You can find instructions on adding Service Account to Apps [here](/console/apps#add-a-service-account-to-an-app).