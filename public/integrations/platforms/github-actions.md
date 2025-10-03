import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with GitHub Actions'

<Tag variant="small">INTEGRATE</Tag>

# GitHub Actions

You can use Phase to sync secrets to GitHub Actions.

## Using Phase Console secret syncing

Automatically sync secrets to GitHub Actions from your Phase apps' `development`, `staging`, and `production` environments.

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. Any secrets on the target service will be overwritten or
  deleted. Please import your secrets into Phase before continuing.
</Warning>

### Prerequisites

- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app)
- Enable Server-side Encryption (SSE) for the App from the [Settings](/console/apps#settings) tab

<Note>
  If you are using a self-hosted instance of the Phase Console, you will need to
  set up a new GitHub OAuth Application and supply the
  `GITHUB_INTEGRATION_CLIENT_ID` and `GITHUB_INTEGRATION_CLIENT_SECRET`
  environment variables. [More
  info](/self-hosting/configuration/envars#third-party-integrations-configuration)
</Note>

Phase will encrypt your secrets via libsodium's `SealedBox` using your GitHub
repository's public key before sending them to GitHub. For more information,
please see: [GitHub
Docs](https://docs.github.com/en/rest/guides/encrypting-secrets-for-the-rest-api?apiVersion=2022-11-28#example-encrypting-a-secret-using-python)

### Step 1: Authenticate with GitHub

1. Go to **Integrations** from the sidebar and click on **Third-party credentials** in the integrations tab.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **GitHub**

![Click on GitHub](/assets/images/platform-integrations/github/select-github-credentials.png)

3. Choose between GitHub.com or GitHub Enterprise Server (self-hosted). Select the type of GitHub credentials you wish to add and give it a descriptive name. You will later select this credential when setting up a sync.

![Add GitHub.com credentials](/assets/images/platform-integrations/github/add-github-com-credentials.png)

If you want to add GitHub Enterprise Server (self-hosted) OAuth credentials, you will need to provide the following information:

**GitHub Host** (for example `github.yourdomain.com`) and **GitHub API URL** (this is typically a path on the GitHub host, for example `https://github.yourdomain.com/api`. This can also be a subdomain, for example `api.github.yourdomain.com`. If you are unsure, please contact your GitHub Enterprise Server administrator).

<Note>
This is only for users who want to integrate their self-managed GitHub Enterprise Server with Phase. If you are using GitHub.com cloud with the enterprise tier, you can simply set up GitHub.com credentials.
</Note>

![Add GitHub Enterprise Server credentials](/assets/images/platform-integrations/github/add-github-enterprise-server-creds.png)

If you are self-hosting Phase, you will have to supply GitHub integration OAuth credentials for GitHub.com and GitHub Enterprise Server (self-hosted) separately. Please see [Third-party integrations configuration options](/self-hosting/configuration/envars#third-party-integrations-configuration) for more information.

4. You will be redirected to GitHub to authorize Phase. **Make sure to grant access to any organizations whose repositories that you wish to integrate Phase with**. Click **Authorize** to continue.

![Authorize GitHub Phase Integration](/assets/images/platform-integrations/github/github-oauth-consent.png)

5. You will be redirected back to the Integrations page, and your new credentials should be visible under the "Credentials" section:

![GitHub credentials stored](/assets/images/platform-integrations/github/github-credentials-created.png)

### Step 2: Configure Sync

Now that you have authenticated with GitHub, you can configure syncs for your app:

1. Go to your App in the Phase Console and go to the **Syncing** tab. Select **GitHub Actions** under the 'Create a new Sync' menu.

![Create a new sync button](/assets/images/platform-integrations/github/create-gh-actions-sync-button.png)

2. Select the credentials stored in the previous step as the authentication method for this sync, and click **Next**

![Choose sync authentication credentials](/assets/images/platform-integrations/github/select-gh-credentials.png)

3. Choose the source and destination to sync secrets. Select an Environment as the source for Secrets.
   Next, choose a GitHub repository from the dropdown as the destination to sync Secrets to.

![Configure sync](/assets/images/platform-integrations/github/gh-actions-configure-sync.png)

4. Once you have selected your desired source and destination, click **Create**.
   The sync has been set up! Secrets will automatically be synced from your chosen Phase Environment to the GitHub repository as Secrets that can be used for GitHub Actions.
   You can click on the **Manage** button on the Sync card to view sync logs, pause syncing, or update authentication credentials.

#### Accessing the secrets in GitHub Actions

Once your secrets are synced, you can access them in your workflows using the `secrets` context. Here's an example workflow showing a typical CI/CD pipeline with different environments and their respective secrets:

```yaml
name: Build and Deploy
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    environment:
      name: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        env:
          # 👇 Explicitly mention each secret you want to have access to in each job
          TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          TEST_API_KEY: ${{ secrets.TEST_API_KEY }}
          STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
        run: |
          npm install
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
    environment: 
      name: build
    steps:
      - uses: actions/checkout@v4
      
      - name: Build application
        env:
          # 👇 Explicitly mention each secret you want to have access to in each job
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          NEXT_PUBLIC_ANALYTICS_ID: ${{ secrets.NEXT_PUBLIC_ANALYTICS_ID }}
        run: |
          npm install
          npm run build

  push:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    environment:
      name: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Login and push to Docker Hub
        env:
          # 👇 Explicitly mention each secret you want to have access to in each job
          DOCKERHUB_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }}
          DOCKERHUB_TOKEN: ${{ secrets.DOCKERHUB_TOKEN }}
        run: |
          docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
          docker build -t myorg/myapp:latest .
          docker push myorg/myapp:latest
```

You can find more information on how to use secrets inside of a GitHub Actions workflow [here](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#using-secrets-in-a-workflow).

## Using the Phase CLI

Fetch secrets directly inside your GitHub Actions workflow during runtime without storing them in GitHub.

### Prerequisites

- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app)
- `PHASE_SERVICE_TOKEN`

<Note>
  If you are using a self-hosted instance of the Phase Console, you may supply
  the `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

For detailed CLI installation options, please see: [Installation](/cli/install)

### Setting `PHASE_SERVICE_TOKEN`

1. Go to your GitHub Repository
2. Click on the `Settings` tab
3. Select `Secrets` from the left sidebar
4. Click on `New repository secret`
5. Name it `PHASE_SERVICE_TOKEN` and provide its value.

### Single stage

```yaml
name: CI

on: [push]

jobs:
  build_and_push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install phase-cli
        run: curl -fsSL https://pkg.phase.dev/install.sh | sudo bash

      - name: Export and set environment variables
        env:
          PHASE_SERVICE_TOKEN: ${{ secrets.PHASE_SERVICE_TOKEN }}
        run: |
          export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)

      - name: Build and Push Docker image
        run: |
          docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
          docker build -t my-image .
          docker push my-image:latest
```

### Multi-stage using `phasehq/cli` Docker image

You can find the Phase CLI docker builds and related images [here](https://hub.docker.com/r/phasehq/cli).

```yaml
name: CI

on: [push]

jobs:
  export_secrets:
    runs-on: ubuntu-latest

    container:
      image: phasehq/cli
    env:
      PHASE_SERVICE_TOKEN: ${{ secrets.PHASE_SERVICE_TOKEN }}
    steps:
      - name: Export environment variables
        id: export
        run: |
          # Export secrets
          eval "$(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN)"
          
          # Set them in GitHub Actions environment file
          echo "username=$DOCKERHUB_USERNAME" >> $GITHUB_OUTPUT
          echo "token=$DOCKERHUB_TOKEN" >> $GITHUB_OUTPUT
    outputs:
      username: ${{ steps.export.outputs.username }}
      token: ${{ steps.export.outputs.token }}

  build_and_push:
    needs: export_secrets
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build and Push Docker image
        run: |
          docker login -u ${{ needs.export_secrets.outputs.username }} -p ${{ needs.export_secrets.outputs.token }}
          docker build -t my-image .
          docker push my-image:latest
```
