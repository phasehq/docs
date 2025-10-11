import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Learn how to create and manage authentication tokens in Phase.'

<Tag variant="small">AUTHENTICATION</Tag>

# Authentication Tokens

Phase provides secure authentication tokens for both human users and service accounts. These tokens enable programmatic access to Phase through our API, CLI, and SDKs while maintaining strict access controls and security standards. {{ className: 'lead' }}

<DocActions /> 

## Service Account Tokens

Service Account Tokens are used to authenticate your Service Account when making API requests. These tokens inherit the permissions and access levels of the service account they belong to.

### Creating a Service Account Token

Follow these steps to create a new Service Account Token:

1. Navigate to Service Account Management by heading to Access Control and clicking on the Service Accounts tab
   From the Service Account tab in Access Control, find the Service Account you want to create a Service Token for and click the **Manage** button.
   ![Click manage service account button](/assets/images/console/access-control/service-accounts/create-new-service-tokens/3-click-manage-service-accounts.png)

2. Create New Token
   Click the **+ Create Token** button to begin the token creation process.
   ![Click create a new service token button](/assets/images/console/access-control/service-accounts/create-new-service-tokens/4-click-create-new-token.png)

3. Configure Token Settings
   - Provide a suitable **Token name**
   - Set an Expiry date
   - Click **Create** to generate the token
   ![Enter service token name create](/assets/images/console/access-control/service-accounts/create-new-service-tokens/5-enter-service-token-name-choose-expiry.png)

#### Personal Secret Token
This token contains cryptographic key material and is intended for use with clients such as the [CLI](/cli), [SDKs](/sdks), or the [Kubernetes operator](/integrations/platforms/kubernetes).

4. Copy the Token
   Copy the token based on your client needs. 
   **Important**: For security reasons, you won't be able to view the token after exiting the page or closing the popup.
   ![Copy created service token](/assets/images/console/access-control/service-accounts/create-new-service-tokens/6-copy-created-service-token.png)

#### REST API Token
The REST API token is an alternative authentication method that can be used to fetch application secrets when [Server-side Encryption](/console/apps#enabling-sse) is enabled on a particular app.

Save this token securely - it's required for API authentication.
![Copy REST API Token](/assets/images/console/access-control/service-accounts/create-new-service-tokens/6-copy-rest-api-token.png)

## Personal Access Tokens (PATs)

Personal Access Tokens allow you to interact with Phase programmatically while inheriting your user permissions. These tokens are ideal for development workflows, testing, and accessing personal secret overrides.

### Creating a Personal Access Token

Follow these steps to create a new Personal Access Token:

1. Navigate to Personal Access Tokens management by heading to Access Control and clicking on the Authentication tab

2. Create New Token
   Click the "Create New Token" button to start the token creation process.
   ![Create New Token](/assets/images/console/access-control/tokens/user/3-click-create-new-token.png)

3. Configure Token Settings
   - Enter a descriptive name for your token
   - Select an expiry date
   - Click "Create" to generate the token
   ![Configure Token Settings](/assets/images/console/access-control/tokens/user/4-name-exprity-click-create.png)


#### Personal Secret Token
This token contains cryptographic key material and is intended for use with clients such as the [CLI](/cli), [SDKs](/sdks), or the [Kubernetes operator](/integrations/platforms/kubernetes).

**Important**: Copy this token immediately after creation - you won't be able to access it again.
![Copy PSS Token](/assets/images/console/access-control/tokens/user/5-copy-pat-pss.png)

#### REST API Token
The REST API token is an alternative authentication method that can be used to fetch application secrets when [Server-side Encryption](/console/apps#enabling-sse) is enabled on a particular app.

Save this token securely - it's required for API authentication.
![Copy REST API Token](/assets/images/console/access-control/tokens/user/6-copy-rest-api-token.png)