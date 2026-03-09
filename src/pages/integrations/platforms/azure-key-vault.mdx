import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Azure Key Vault'

<Tag variant="small">INTEGRATE</Tag>

# Azure Key Vault

You can use Phase to sync secrets to Azure Key Vault. Phase supports two sync modes:

- **Individual Secrets**: Each Phase secret becomes a separate Key Vault secret. Ideal for workloads that reference individual secrets via `@Microsoft.KeyVault(...)` (e.g. Azure App Service, Azure Functions).
- **JSON Blob**: All Phase secrets are synced as a single JSON object to one Key Vault secret. Useful for applications that consume all secrets at once.

<DocActions />

### Prerequisites

- Azure CLI (`az`) installed locally, or use [Azure Cloud Shell](https://shell.azure.com)
- An Azure account with permissions to create App Registrations and assign Key Vault roles

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. In **Individual Secrets** mode, any Key Vault secrets not present in Phase will be **disabled**. In **JSON Blob** mode, the target secret will be **overwritten**.
  Please import your secrets into Phase before enabling a sync.
</Warning>

## Azure Authentication Setup

Phase authenticates with Azure using a **Service Principal** (App Registration with a client secret). This gives Phase the `tenant_id`, `client_id`, and `client_secret` it needs to access your Key Vault.

### Step 1: Create a Key Vault (skip to Step 2 if you already have one)

Create a resource group and Key Vault. Replace `phase-rg` and `phase-kv` with your preferred names:

```fish
az group create --name phase-rg --location eastus
```

```fish
az keyvault create --name phase-kv --resource-group phase-rg --location eastus
```


Your Vault URI will be `https://phase-kv.vault.azure.net` (replace `phase-kv` with your vault name).

If you see **"You are unauthorized to view these contents"** when viewing the vault in the Azure Portal, grant yourself access:

```fish
# 👇 Replace phase-rg and phase-kv with your resource group and key vault names
az role assignment create --role "Key Vault Secrets Officer" --assignee $(az ad signed-in-user show --query id -o tsv) --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/phase-rg/providers/Microsoft.KeyVault/vaults/phase-kv
```


Note: Role assignments can take up to 30 seconds to propagate. Refresh the page if you don't see the change immediately.

### Step 2: Create a Service Principal with Key Vault access

<TabGroup>
  <TabPanel title="Single Vault Scope" slug="single-vault">

This scope is suitable for syncing to a single Key Vault. The service principal can only access secrets in the specified vault.

```fish
# 👇 Replace phase-rg and phase-kv with your resource group and key vault names
az ad sp create-for-rbac --name phase-kv-sync --role "Key Vault Secrets Officer" --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/phase-rg/providers/Microsoft.KeyVault/vaults/phase-kv
```

  </TabPanel>
  <TabPanel title="All Vaults in Resource Group" slug="resource-group">

Wider scope when you have multiple Key Vaults in the same resource group and want to use a single set of credentials to sync to any of them.

```fish
# 👇 Replace phase-rg with your resource group name
az ad sp create-for-rbac --name phase-kv-sync --role "Key Vault Secrets Officer" --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/phase-rg
```

  </TabPanel>
</TabGroup>

Example output:

```json
{
  "appId": "12345678-abcd-1234-efgh-123456789012", // 👉 Store as Client ID in Phase
  "displayName": "phase-kv-sync",
  "password": "abcdefgh-1234-5678-ijkl-mnopqrstuvwx", // 👉 Store as Client Secret in Phase
  "tenant": "87654321-dcba-4321-hgfe-210987654321" // 👉 Store as Tenant ID in Phase
}
```

## Sync Secrets from Phase

### Step 1: Set up your Azure credentials in Phase

1. Go to **Integrations** from the sidebar and click on **Third-party credentials**.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **Azure**.

![Select Azure](/assets/images/platform-integrations/azure/2-select-azure-credential-provider.png)

3. Enter the credentials from [Step 2](#step-2-create-a-service-principal-with-key-vault-access):
   - **Tenant ID**: The `tenant` value
   - **Client ID**: The `appId` value
   - **Client Secret**: The `password` value

![Create new Azure creds](/assets/images/platform-integrations/azure/3-create-new-azure-credentials.png)

4. Give these credentials a descriptive name (e.g. "Azure KV - Production") and click **Save**.

### Step 2: Configure the Sync

1. Enable Server-side Encryption (SSE) for the App from the [Settings](/console/apps#enabling-sse) tab if not enabled already.

2. Go to your App in the Phase Console and go to the **Syncing** tab. Select **Azure Key Vault** under the 'Create a new Sync' menu.

![Select Azure KV sync provider](/assets/images/platform-integrations/azure/4-create-a-sync-w:-azure-kv.png)

3. Select the Azure credentials stored in the previous step and enter your **Vault URI** (e.g. `https://phase-kv.vault.azure.net`). Click **Next**.

![Select credentials and Azure KV URI](/assets/images/platform-integrations/azure/5-select-credentials-and-vault-uri.png)

<Note>
  If you see an error and cannot proceed, verify that the credentials are correct and that the
  service principal has the [Key Vault Secrets Officer](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide) role on the target vault.
  See [Troubleshooting](#troubleshooting) for debugging steps.
</Note>

4. Choose the Phase **Environment** and **Path** as the source for secrets.

5. Select a **Sync Mode**:

<TabGroup>
  <TabPanel title="Individual Secrets" slug="individual-secrets">

Each Phase secret is synced as its own Key Vault secret. Underscores (`_`) in secret names are automatically converted to hyphens (`-`) to comply with Key Vault naming rules. Secrets in Key Vault that are not present in Phase will be **disabled** (not deleted).

![Sync mode type - individual secrets](/assets/images/platform-integrations/azure/6-sync-config-map-individual.png)

#### Naming behavior

Azure Key Vault secret names only allow alphanumeric characters and hyphens. Phase automatically transforms secret names:

| Phase Secret Name   | Key Vault Secret Name |
|--------------------|-----------------------|
| `DATABASE_URL`     | `DATABASE-URL`        |
| `API_KEY`          | `API-KEY`             |
| `my_secret_value`  | `my-secret-value`     |

#### Referencing secrets in App Service

Once secrets are synced, you can reference them in Azure App Service or Azure Functions using Key Vault references:

```
@Microsoft.KeyVault(SecretUri=https://phase-kv.vault.azure.net/secrets/DATABASE-URL/)
```

Or using the vault name shorthand:

```
@Microsoft.KeyVault(VaultName=phase-kv;SecretName=DATABASE-URL)
```

  </TabPanel>
  <TabPanel title="JSON Blob" slug="json-blob">

All secrets are stored as a single JSON object in one Key Vault secret. Choose to create a new secret or select an existing one from the dropdown.

![Sync mode type - json blob](/assets/images/platform-integrations/azure/6-sync-config-map-json-blob.png)

The secret is stored with `content_type: application/json` in Key Vault. Your application can retrieve and parse this JSON to access all secrets at once.

```json
{
  "DATABASE_URL": "postgres://...",
  "API_KEY": "sk-...",
  "SECRET_TOKEN": "abc123"
}
```

  </TabPanel>
</TabGroup>

6. Click **Create**. The sync is now active! Secrets will automatically sync whenever they are updated in Phase.

## Optional: Import existing secrets from Azure Key Vault into Phase

If you have existing secrets in your Key Vault that you want to manage with Phase, you can export them to a `.env` file and import them.

1. List all secrets in your vault:

```fish
az keyvault secret list --vault-name phase-kv --query "[].name" -o tsv
```

2. Export secrets to a `.env` file:

```fish
for name in $(az keyvault secret list --vault-name phase-kv --query "[].name" -o tsv); do
  value=$(az keyvault secret show --vault-name phase-kv --name "$name" --query "value" -o tsv)
  # Convert hyphens back to underscores for env var names
  env_name=$(echo "$name" | tr '-' '_')
  echo "${env_name}=${value}" >> .env
done
```

3. Import secrets into Phase via the `phase-cli`:

```fish
phase secrets import .env --env development
```

4. Delete the `.env` file:

```fish
rm .env
```

## Troubleshooting

If syncing fails or you get authentication errors when setting up the sync, you can verify your service principal credentials directly via the Azure CLI.

### 1. Test authentication

Log in as the service principal using the credentials you stored in Phase:

```fish
az login --service-principal \
  --username "CLIENT_ID" \
  --password "CLIENT_SECRET" \
  --tenant "TENANT_ID"
```

If this fails, the credentials are invalid — create a new client secret with:

```fish
az ad app credential reset --id "CLIENT_ID"
```

### 2. Verify role assignment

Check that the service principal has the correct role on your Key Vault:

```fish
az role assignment list \
  --assignee "CLIENT_ID" \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/phase-rg/providers/Microsoft.KeyVault/vaults/phase-kv \
  --query "[].roleDefinitionName" -o tsv
```

This should return `Key Vault Secrets Officer`. If empty, reassign the role:

```fish
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee "CLIENT_ID" \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/phase-rg/providers/Microsoft.KeyVault/vaults/phase-kv
```

### 3. Test secret access

Try listing secrets in the vault as the service principal:

```fish
az keyvault secret list --vault-name phase-kv --query "[].name" -o tsv
```

If this returns results (or an empty list) without errors, the service principal has the correct access. Log back in as yourself afterwards:

```fish
az login
```
