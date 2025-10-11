import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Vercel'

<Tag variant="small">INTEGRATE</Tag>

# Vercel

You can use Phase to sync secrets with your Vercel projects.

<DocActions /> 

<Warning>
  When secret syncing is enabled, secrets stored inside Phase will be treated as
  the source of truth. Any secrets on the target service will be overwritten or
  deleted. Please import your secrets into Phase before continuing.
</Warning>

### Prerequisites

- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app).
- Enable Server-side Encryption (SSE) for the App from the [Settings](/console/apps#settings) tab.

## Step 1: Authentication

### Create a Vercel Token

1. Go to Vercel's [Dashboard](https://vercel.com/login) and log in.

2. Click on your user icon in the top right and select **Account Settings**.

![Vercel dashboard](/assets/images/platform-integrations/vercel/1.png)

3. In account settings, click on **Tokens** from the menu bar in the left.

![Vercel dashboard account settings](/assets/images/platform-integrations/vercel/2.png)

4. Create a new **Token** with a descriptive name (eg. `phase-console-vercel-sync`) , set the **Scope** to `Full Account`, choose an **Expiration** and click **Create**. (Note: If you choose an expiry option other than `No Expiration`, you will need to manually update this token in Phase when it expires.)

Alternatively, you may create a token with a narrower scope to a specific team. Keep in mind that this will affect the Phase Console from being able to list your projects and sync secrets to them.

![Vercel dashboard account settings token create](/assets/images/platform-integrations/vercel/3.png)

5. Once the `Token` has been created simply copy it by clicking the clipboard.

![Vercel dashboard account settings token copy](/assets/images/platform-integrations/vercel/4.png)


### Store authentication credentials in Phase

<Note>
  Your credentials are kept secure with robust application-layer encryption.
  Phase encrypts your credentials directly in the browser and only decrypts them
  in memory to perform sync operations. Your credentials are never stored in
  plaintext.
</Note>

1. Go to **Integrations** from the sidebar and click on **Third-party credentials** in the integrations tab.

![Go to integrations](/assets/images/platform-integrations/integrations-sidebar.png)

2. Click on **Vercel**

![Select Vercel](/assets/images/platform-integrations/vercel/1-vercel-create-new-service-credential.png)

3. Paste your Vercel  `API Token` and add a descriptive name for the service credential and click **Save**

![Add vercel token as service credential](/assets/images/platform-integrations/vercel/2-vercel-save-new-service-credentials.png)

## Step 2: Set up a secret sync

1. Go to your App in the Phase Console and go to the **Syncing** tab. Select **Vercel** under the 'Create a new Sync' menu.

![Set up an vercel secret sync](/assets/images/platform-integrations/vercel/1-create-new-sync-select-vercel.png)

2. Choose the credentials you added in the previous step as the authentication mode, and click **Next**.

![Select service credentials for the sync](/assets/images/platform-integrations/vercel/2-create-new-sync-select-vercel-service-credentials.png)

3. Next, configure the source and destination for your secrets. Pick an Environment from your App as the source. To configure the destination for the sync, choose a Vercel Project from the list of available Projects, as well as the Target Environment and the Secret Type.

![Set up the sync config](/assets/images/platform-integrations/vercel/3-create-new-sync-choose-secret-config.png)

4. Once set up, your secrets will automatically be synced to the chosen destination project in Vercel. You can manage your sync from the *Syncing* tab of your App, or from the *Integrations* screen.

![Sync status](/assets/images/platform-integrations/vercel/4-create-new-sync-sync-status-success.png)

## Reserved environment variables keys by Vercel

The following secret keys are reserved or prepopulated by Vercel for technical reasons on their end that Phase will automatically filter for and not sync with Vercel to avoid errors.

### Environment variables that are reserved by Vercel Serverless Function runtimes that Phase will filter for. 

- `AWS_SECRET_KEY`
- `AWS_EXECUTION_ENV`
- `AWS_LAMBDA_LOG_GROUP_NAME`
- `AWS_LAMBDA_LOG_STREAM_NAME`
- `AWS_LAMBDA_FUNCTION_NAME`
- `AWS_LAMBDA_FUNCTION_MEMORY_SIZE`
- `AWS_LAMBDA_FUNCTION_VERSION`
- `NOW_REGION`
- `TZ`
- `LAMBDA_TASK_ROOT`
- `LAMBDA_RUNTIME_DIR`

### Environment Variables are allowed by Vercel Serverless Function runtimes that Phase will not filter for:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `AWS_REGION`
- `AWS_DEFAULT_REGION`

<div className="not-prose">
  <Button
    href="https://vercel.com/docs/projects/environment-variables/reserved-environment-variables"
    variant="text"
    arrow="right"
    children="Reserved Environment Variables - Vercel Docs"
  />
</div>

### System environment variables:

Vercel provides a set of Environment Variables that are automatically populated by the System, such as the URL of the Deployment or the name of the Git branch deployed.

- `VERCEL` - An indicator to show that System Environment Variables have been exposed to your project's Deployments. Example: `1`.
- `CI` - An indicator that the code is running in a Continuous Integration environment. Example: `1`. **Note**: This Variable is only exposed during Build Step.
- `VERCEL_ENV` - The Environment that the app is deployed and running on. The value can be either production, preview, or development.
- `VERCEL_URL` - The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
- `VERCEL_BRANCH_URL` - The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
- `VERCEL_PROJECT_PRODUCTION_URL` - A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme `https://`.
- `VERCEL_REGION` - The ID of the Region where the app is running. Example: `cdg1`. **Note**: This Variable is only exposed during Runtime for Vercel Functions.
- `VERCEL_DEPLOYMENT_ID` - The unique identifier for the deployment, which can be used to implement Skew Protection. Example: `dpl_7Gw5ZMBpQA8h9GF832KGp7nwbuh3`.
- `VERCEL_SKEW_PROTECTION_ENABLED` - When Skew Protection is enabled in Project Settings, this value is set to 1. Example: `1`.
- `VERCEL_AUTOMATION_BYPASS_SECRET` - The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
- `VERCEL_GIT_PROVIDER` - The Git Provider the deployment is triggered from. Example: `github`.
- `VERCEL_GIT_REPO_SLUG` - The origin repository the deployment is triggered from. Example: `my-site`.
- `VERCEL_GIT_REPO_OWNER` - The account that owns the repository the deployment is triggered from. Example: `acme`.
- `VERCEL_GIT_REPO_ID` - The ID of the repository the deployment is triggered from. Example: `117716146`.
- `VERCEL_GIT_COMMIT_REF` - The git branch of the commit the deployment was triggered by. Example: improve-about-page.
- `VERCEL_GIT_COMMIT_SHA` - The git SHA of the commit the deployment was triggered by. Example: `fa1eade47b73733d6312d5abfad33ce9e4068081`.
- `VERCEL_GIT_COMMIT_MESSAGE` - The message attached to the commit the deployment was triggered by. Example: Update about page.
- `VERCEL_GIT_COMMIT_AUTHOR_LOGIN` - The username attached to the author of the commit that the project was deployed by. Example: `johndoe`.
- `VERCEL_GIT_COMMIT_AUTHOR_NAME` - The name attached to the author of the commit that the project was deployed by. Example: `John Doe`.
- `VERCEL_GIT_PREVIOUS_SHA` - The git SHA of the last successful deployment for the project and branch. Example: `fa1eade47b73733d6312d5abfad33ce9e4068080`. Note: This Variable is only exposed when an Ignored Build Step is provided.
- `VERCEL_GIT_PULL_REQUEST_ID` - The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string.

<div className="not-prose">
  <Button
    href="https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables"
    variant="text"
    arrow="right"
    children="System Environment Variables - Vercel Docs"
  />
</div>

### Framework environment variables

<CodeGroup>

```fish {{ title: 'Next.js' }}
# Next.js
"NEXT_PUBLIC_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"NEXT_PUBLIC_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"NEXT_PUBLIC_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"NEXT_PUBLIC_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"NEXT_PUBLIC_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Nuxt.js' }}
# Nuxt.js
"NUXT_ENV_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"NUXT_ENV_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"NUXT_ENV_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"NUXT_ENV_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"NUXT_ENV_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"NUXT_ENV_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"NUXT_ENV_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"NUXT_ENV_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"NUXT_ENV_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"NUXT_ENV_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"NUXT_ENV_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"NUXT_ENV_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"NUXT_ENV_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"NUXT_ENV_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"NUXT_ENV_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Create React App' }}
# Create React App
"REACT_APP_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"REACT_APP_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"REACT_APP_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"REACT_APP_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"REACT_APP_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"REACT_APP_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"REACT_APP_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"REACT_APP_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"REACT_APP_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"REACT_APP_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"REACT_APP_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"REACT_APP_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"REACT_APP_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"REACT_APP_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"REACT_APP_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Gatsby' }}
# Gatsby
"GATSBY_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"GATSBY_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"GATSBY_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"GATSBY_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"GATSBY_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"GATSBY_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"GATSBY_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"GATSBY_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"GATSBY_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"GATSBY_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"GATSBY_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"GATSBY_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"GATSBY_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"GATSBY_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"GATSBY_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'SolidStart' }}
# SolidStart
"VITE_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"VITE_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"VITE_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"VITE_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"VITE_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"VITE_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"VITE_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"VITE_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"VITE_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"VITE_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"VITE_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"VITE_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"VITE_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'SvelteKit' }}
# SvelteKit
"VITE_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"VITE_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"VITE_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"VITE_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"VITE_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"VITE_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"VITE_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"VITE_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"VITE_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"VITE_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"VITE_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"VITE_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"VITE_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Astro' }}
# Astro
"PUBLIC_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"PUBLIC_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol schemehttps://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"PUBLIC_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"PUBLIC_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"PUBLIC_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"PUBLIC_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"PUBLIC_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"PUBLIC_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"PUBLIC_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"PUBLIC_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"PUBLIC_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Solid Start v1' }}
# Solid Start v1
"VITE_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"VITE_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"VITE_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"VITE_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"VITE_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"VITE_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"VITE_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"VITE_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"VITE_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"VITE_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"VITE_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"VITE_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"VITE_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Vue.js' }}
# Vue.js
"VUE_APP_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"VUE_APP_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"VUE_APP_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"VUE_APP_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"VUE_APP_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"VUE_APP_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"VUE_APP_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"VUE_APP_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"VUE_APP_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"VUE_APP_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"VUE_APP_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"VUE_APP_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"VUE_APP_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"VUE_APP_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"VUE_APP_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'RedwoodJS' }}
# RedwoodJS
"REDWOOD_ENV_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"REDWOOD_ENV_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"REDWOOD_ENV_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"REDWOOD_ENV_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"REDWOOD_ENV_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"REDWOOD_ENV_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"REDWOOD_ENV_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"REDWOOD_ENV_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"REDWOOD_ENV_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"REDWOOD_ENV_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"REDWOOD_ENV_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"REDWOOD_ENV_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"REDWOOD_ENV_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"REDWOOD_ENV_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"REDWOOD_ENV_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

```fish {{ title: 'Sanity' }}
# Sanity
"SANITY_STUDIO_VERCEL_ENV",  # The Environment that the app is deployed and running on. The value can be either production, preview, or development.
"SANITY_STUDIO_VERCEL_URL",  # The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://. Note: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection.
"SANITY_STUDIO_VERCEL_BRANCH_URL",  # The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://.
"SANITY_STUDIO_VERCEL_PROJECT_PRODUCTION_URL",  # A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://.
"SANITY_STUDIO_VERCEL_AUTOMATION_BYPASS_SECRET",  # The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
"SANITY_STUDIO_VERCEL_GIT_PROVIDER",  # The Git Provider the deployment is triggered from. Example: github.
"SANITY_STUDIO_VERCEL_GIT_REPO_SLUG",  # The origin repository the deployment is triggered from. Example: my-site.
"SANITY_STUDIO_VERCEL_GIT_REPO_OWNER",  # The account that owns the repository the deployment is triggered from. Example: acme.
"SANITY_STUDIO_VERCEL_GIT_REPO_ID",  # The ID of the repository the deployment is triggered from. Example: 117716146.
"SANITY_STUDIO_VERCEL_GIT_COMMIT_REF",  # The git branch of the commit the deployment was triggered by. Example: improve-about-page.
"SANITY_STUDIO_VERCEL_GIT_COMMIT_SHA",  # The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081.
"SANITY_STUDIO_VERCEL_GIT_COMMIT_MESSAGE",  # The message attached to the commit the deployment was triggered by. Example: Update about page.
"SANITY_STUDIO_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",  # The username attached to the author of the commit that the project was deployed by. Example: johndoe.
"SANITY_STUDIO_VERCEL_GIT_COMMIT_AUTHOR_NAME",  # The name attached to the author of the commit that the project was deployed by. Example: John Doe.
"SANITY_STUDIO_VERCEL_GIT_PULL_REQUEST_ID",  # The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.
```

</CodeGroup>

<div className="not-prose">
  <Button
    href="https://vercel.com/docs/projects/environment-variables/system-environment-variables#framework-environment-variables"
    variant="text"
    arrow="right"
    children="Framework Environment Variables - Vercel Docs"
  />
</div>