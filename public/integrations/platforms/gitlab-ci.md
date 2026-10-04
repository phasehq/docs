import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with GitLab CI'

<Tag variant="small">INTEGRATE</Tag>

# GitLab CI

You can use Phase to sync secrets to GitLab CI/CD Variables, either for all environments or scoped to specific GitLab environments.

<DocActions />

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. Any secrets on the target service will be overwritten or
  deleted. Please import your secrets into Phase before continuing.
</Warning>

### Prerequisites

- Sign up for the [Phase Console](https://console.phase.dev) and [create an App](https://console.phase.dev/apps#create-an-app).
- Enable Server-side Encryption (SSE) for the App from the [Settings](https://console.phase.dev/apps#settings) tab.

## Step 1: Authenticate with GitLab

### Token Types for Authentication

You can use two types of tokens to authenticate Phase with GitLab: Personal Access Token (PAT) and Group Access Token.

#### **Personal Access Token (PAT)**

A Personal Access Token (PAT) is tied to an individual user's GitLab account. While this can be convenient for personal projects, it has some significant drawbacks:

- **User Dependency**: If the user who created the PAT is removed from a group or deletes their account, the integration using that token will break.
- **Scope Limitation**: The token's permissions are limited to the user's access level.

#### **Group Access Token (GAT)**

A Group Access Token is associated with a GitLab group rather than an individual user. This method is more robust for team and organizational use:

- **Resilience**: The token remains valid as long as the group exists, regardless of changes to individual user accounts.
- **Consistent Access**: All members of the group can use the token for authentication, ensuring continuous integration.

##### Availability of Group Access Tokens

- **GitLab.com**: Group access tokens are available for users with the Premium or Ultimate license tiers. They are not available with a trial license.
- **GitLab Dedicated and Self-Managed Instances**: Group access tokens are available with any license tier.

Given these factors, it is recommended to use Group Access Tokens for authenticating Phase with GitLab to ensure stable and continuous integration, especially in team or organizational environments.

### Create a Personal Access Token (PAT)

1. Go to **User Settings** from the sidebar and click on **Access Tokens**.

![Go to your GitLab Preferences](/assets/images/platform-integrations/gitlab/gitlab-pat-auth-preferences.png)

![Select Access Tokens](/assets/images/platform-integrations/gitlab/gitlab-pat-auth-preferences-access-tokens.png)

2. Click on **Add new token**.

![Click Add new token](/assets/images/platform-integrations/gitlab/gitlab-pat-auth-preferences-access-tokens-add-new-token.png)

3. Fill in the **Token name**, set the `api` Scope, and set the **Expiration date**.

![Create a Personal Access Token](/assets/images/platform-integrations/gitlab/gitlab-pat-auth-preferences-access-tokens-create-pat.png)

<Note>
  If you leave the Expiration date blank, GitLab will create a token with a
  12-month expiry by default. Ensure you set an appropriate expiration date to
  prevent the token from expiring unexpectedly. Also, ensure the `api` scope is
  selected to allow necessary permissions for Phase integration.
</Note>

4. Click **Create personal access token** and copy the token.

![Personal Access Token copy](/assets/images/platform-integrations/gitlab/gitlab-pat-auth-preferences-access-tokens-create-pat-copy.png)

### Create a Group Access Token (GAT)

This feature is only available on GitLab if you have the Premium or Ultimate license tier. Group access tokens are not available with a trial license. On GitLab Dedicated and self-managed instances, you can use group access tokens with any license tier.

1. Go to your **GitLab Group**.

![Go to your GitLab Group](/assets/images/platform-integrations/gitlab/gitlab-gat-groups-select.png)

2. Navigate to **Settings** > **Access Tokens**.

![Go to your GitLab Group Settings > Access Tokens](/assets/images/platform-integrations/gitlab/gitlab-gat-groups-setting-access-tokens.png)

3. Click on **Add new token**.

![Click Add new token](/assets/images/platform-integrations/gitlab/gitlab-gat-groups-setting-access-tokens-add-new-token.png)

4. Fill in the **Token name**, select the `Owner` Role, set the `api` Scope, and set the **Expiration date**.

![Create a Group Access Token](/assets/images/platform-integrations/gitlab/gitlab-gat-groups-setting-access-tokens-create-gat.png)

<Note>
  If you leave the Expiration date blank, GitLab will create a token with a
  12-month expiry by default. Ensure you set an appropriate expiration date to
  prevent the token from expiring unexpectedly. Also, ensure the `api` scope is
  selected to allow necessary permissions for Phase integration.
</Note>

5. Click **Create group access token** and copy the token.

![Group Access Token copy](/assets/images/platform-integrations/gitlab/gitlab-gat-groups-setting-access-tokens-create-gat-copy.png)


### Store authentication credentials in Phase

1. Go to **Integrations** from the sidebar and click on **Third-party credentials** in the integrations tab.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.webp)

2. Click on **GitLab**

![Click on GitLab](/assets/images/platform-integrations/gitlab/gitlab-creds-button.webp)

3. Enter your GitLab instance host (use `https://gitlab.com` for GitLab.com) and token. Enter a descriptive name for these credentials and click **Save**

![Input GitLab credentials](/assets/images/platform-integrations/gitlab/gitlab-creds-input.webp)

Your credentials will be encrypted and saved. You can view and manage these credentials under *Service Credentials* in the *Integrations* screen.

## Step 2: Configure Sync

Now that you have authenticated with GitLab, you can configure syncs for your app.

1. Go to your App in the Phase Console and go to the **Syncing** tab. Select **GitLab CI** under the 'Create a new Sync' menu.

![Create a new sync button](/assets/images/platform-integrations/gitlab/gitlab-create-sync-button.webp)

2. Select the credentials stored in the previous step as the authentication method for this sync, and click **Next**.

![Choose sync authentication credentials](/assets/images/platform-integrations/gitlab/gitlab-choose-creds.webp)

3. Choose the source and destination to sync secrets. Select an Environment as the source for Secrets.
   Next, choose a GitLab Project or GitLab Group from the dropdown as the destination to sync Secrets to.

   Then choose a **GitLab Environment Scope**. By default, secrets are synced to the `*` scope (**All environments**) and are available to every job in your pipelines. To make secrets available only to a specific GitLab environment, select a scope from the dropdown, or type any environment scope, including wildcards such as `review/*`. For a project, the dropdown lists the project's environments. Groups don't have environments, so for a group it lists the scopes that the group's variables already use. See [Environment scopes](#environment-scopes) for details.

   ![Choose a GitLab environment scope](/assets/images/platform-integrations/gitlab/gitlab-setup-sync-environment-scope.webp)

   You can optionally also choose to [mask](https://docs.gitlab.com/ee/ci/variables/#mask-a-cicd-variable) and/or [protect](https://docs.gitlab.com/ee/ci/variables/) secrets synced to GitLab.

   <Note>
   Masked variables must meet the following criteria in GitLab. 
   If any secrets in the selected environment and path do not meet these requirements, the sync will fail.

   Masked variables must:

   - Be a single line.
   - Be 8 characters or longer.
   - Not match the name of an existing predefined or custom CI/CD variable. 

   Additionally, if variable expansion is enabled, the value can contain only:

   - Characters from the Base64 alphabet (RFC4648).
   - The @, :, ., or ~ characters. 
   </Note>

![Configure sync](/assets/images/platform-integrations/gitlab/gitlab-setup-sync.webp)

4. Once you have selected your desired source and destination, click **Create**.
   The sync has been set up! Secrets will automatically be synced from your chosen Phase Environment to the GitLab Project or Group as CI/CD variables.
   You can click on the **Manage** button on the Sync card to view sync logs, pause syncing, or update authentication credentials.

   ![GitLab CI sync card](/assets/images/platform-integrations/gitlab/gitlab-sync-card.webp)

## Environment scopes

GitLab CI/CD variables can be [limited to an environment](https://docs.gitlab.com/ci/environments/#limit-the-environment-scope-of-a-cicd-variable) with an environment scope. Variables in the default `*` scope are available to every job. Variables in any other scope are only available to jobs that deploy to a matching environment, and if the same key exists in more than one matching scope, GitLab uses the most specific one.

Each GitLab sync manages the variables in a single environment scope:

- It creates, updates and deletes the variables in its scope to match the secrets in the Phase Environment.
- Variables in other scopes are left untouched, even if they have the same key.

<Note>
  Syncs created before environment scopes were available don't have an
  environment scope. They keep syncing to all environments (`*`) as before, and
  keep updating variables that were moved to another environment scope in
  GitLab. To use environment scopes with the same GitLab project or group,
  delete such a sync first and create it again with an environment scope. If
  you had moved some of its variables to other scopes in GitLab, also create a
  sync for each of those scopes, or delete those variables: the new sync only
  updates variables in its own scope, so they would keep their old values.

  If a secret exists in several environment scopes in GitLab, such a sync can't
  tell which variable to update or delete. It still syncs new and changed
  secrets, but deletes no variables and fails with an error that names those
  secrets, until only one of them is left or the sync is created again with an
  environment scope.
</Note>

This lets you sync each Phase Environment to the matching environment in the same GitLab project. For example:

| Phase Environment | GitLab Environment Scope |
| ----------------- | ------------------------ |
| Development       | `review/*`               |
| Staging           | `staging`                |
| Production        | `production`             |

You can also combine a sync to the default `*` scope with syncs to specific environments. Jobs for those environments then use the scoped value of a variable, and every other job uses the value from the `*` scope.

To use secrets that are scoped to an environment, set the [`environment`](https://docs.gitlab.com/ci/yaml/#environment) of the job that needs them:

```yaml
deploy_staging:
  stage: deploy
  environment: staging
  script:
    - ./deploy.sh # Secrets synced to the staging scope are available here

deploy_production:
  stage: deploy
  environment: production
  script:
    - ./deploy.sh # Secrets synced to the production scope are available here
```

<Note>
  An App can only have one sync per GitLab project or group and environment
  scope, since two syncs to the same scope would overwrite each other's
  variables.
</Note>

<Warning>
  Environment scopes for **group** variables require GitLab Premium or
  Ultimate. On other tiers, GitLab ignores the scope and makes the variable
  available to every environment. If this happens, Phase removes the variable
  again and the sync fails with an error, so scoped secrets are never exposed
  to all environments. Use a project sync or the default `*` scope instead.
</Warning>

## Using the Phase CLI

Fetch secrets directly inside your GitLab CI pipeline during runtime without storing them in GitLab.

### Prerequisites

- Sign up for the [Phase Console](https://console.phase.dev) and [create an App](https://console.phase.dev/apps#create-an-app).
- `PHASE_SERVICE_TOKEN`

<Note>
  If you are using a Self-Hosted instance of the Phase Console, you may supply
  the `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

For detailed CLI install options, please see: [Installation](/cli/install)

### Setting `PHASE_SERVICE_TOKEN`:

1. Navigate to your project in GitLab.
2. Go to `Settings` > `CI/CD`.
3. Under `Variables`, click on `Expand`.
4. Click on `Add Variable`.
5. Enter the key as `PHASE_SERVICE_TOKEN` and your secret as the value. Save it.

### Example:

Pin the CLI to a specific version with the `--version` flag for reproducible builds — find the latest version on the [Phase CLI releases page](https://github.com/phasehq/cli/releases).

```yaml
stages:
  - prepare
  - build_and_push

prepare_phase_cli:
  stage: prepare
  script:
    - curl -fsSL https://pkg.phase.dev/install.sh | sh -s -- --version <X.XX.XX>
    - export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)

build_and_push_image:
  stage: build_and_push
  script:
    - docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
    - docker build -t my-image .
    - docker push my-image:latest
```

## Using `phasehq/cli` Docker image:

```yaml
stages:
  - prepare
  - build_and_push

prepare_phase_cli:
  image: phasehq/cli
  stage: prepare
  script:
    - secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN
  artifacts:
    untracked: true

build_and_push_image:
  stage: build_and_push
  script:
    - docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
    - docker build -t my-image .
    - docker push my-image:latest
```
