import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Deploy the Phase Console Railway template.'

<Tag variant="small">SELF-HOSTING</Tag>

# Railway

Deploy the Phase Console Railway template. {{ className: 'lead' }}

<DocActions /> 

[![Railway deployment template](/assets/images/self-hosting/railway/railway-template.png)](https://railway.app/template/FgdM-Z?referralCode=rG9hj-)

## Prerequisites
- A Railway account on the [Hobby](https://railway.app/pricing) tier or better
- A [Google](/access-control/authentication/oauth-sso#google), [GitHub](/access-control/authentication/oauth-sso#github), or [GitLab](/access-control/authentication/oauth-sso#gitlab) OAuth SSO for authentication

## Known Issues

- **Nginx routing issues**: Redeployment of services (frontend, backend, worker), especially due to configuration changes (environment variables, settings, adding custom domains, etc.), can cause the Nginx routing to time out due to IPv6 changes after deployment. If you encounter such issues, please redeploy the `frontend`, `backend` and `railway-nginx` services respectively. Make sure to redeploy the Nginx service **last** after all other services have been finalized and re-deployed.

- **Secret references**: To make configuration easier, the Phase Console Railway deployment template uses numerous secret and variable references. These references are resolved only during a service deployment. Future configuration changes to other services may not reflect immediately until a redeployment is triggered (as mentioned in the previous point).

For example, the Phase `backend` service references an environment variable from the `railway-nginx` service. If a change occurs in the referenced value `${{railway-nginx.RAILWAY_PUBLIC_DOMAIN}}` (e.g., because a new custom domain was added), the `backend` and the `railway-nginx` service needs to be redeployed respectively:

```fish
ALLOWED_HOSTS=healthcheck.railway.app,${{RAILWAY_PRIVATE_DOMAIN}},${{railway-nginx.RAILWAY_PUBLIC_DOMAIN}}
```

## Installation Steps

### 1. Configure the Railway Deployment Template

1. Go to the [Phase Console](https://railway.app/template/FgdM-Z?referralCode=rG9hj-) Railway deployment template page and click **Deploy Now**.

![Railway template click deploy now button](/assets/images/self-hosting/railway/configure/1-railway-template-deploy-now.png)

2. Click **Configure** on each service container listed, fill out the required Environment variables, and click **Save Config**.

![Configure environment variables](/assets/images/self-hosting/railway/configure/2-railway-template-services-configure.png)

Important notes:
- Read the descriptions for each Environment variable as they contain setup instructions
- For security and consistency, we do not autogenerate secrets using Railway's secret function syntax. Generate them manually using `openssl` like this: `openssl rand -hex 32`
- Some Environment variables need to be set across multiple services
- You'll need to set up a Google, GitHub, or GitLab OAuth Application and provide their credentials as Environment variables. This can be done after setting up a custom domain in [Step 2](/self-hosting/railway#2-deploy-the-template).

For a complete list of all secrets and environment variables with descriptions, see the self-hosting [env vars](/self-hosting/configuration/envars) guide.

Optionally, you can click the **Pre-Configured Environment Variables** dropdown under each service to view or override the pre-set environment variables and secrets to best suit your needs.

![Configure pre-set environment variables](/assets/images/self-hosting/railway/configure/3-railway-tempalte-preset-env.png)

3. Once configured, click **Deploy**.

![Deploy railway template](/assets/images/self-hosting/railway/configure/4-deploy-railway-template.png)

Please wait for the train to arrive. 🚄

![Deploying](/assets/images/self-hosting/railway/configure/5-deploying-railway-template.png)

### 2. Deploy the Template

1. Click on the `railway-nginx` service.

![Click railway nginx](/assets/images/self-hosting/railway/deploy/1-click-railway-nginx.png)

2. Select the **Settings** tab.

![Select settings](/assets/images/self-hosting/railway/deploy/2-select-settings.png)

3. Scroll down and click **+ Custom Domain** in the Networking section.

![Set-up a custom domain](/assets/images/self-hosting/railway/deploy/3-set-up-custom-domain.png)

4. Enter your Custom Domain, set the port to `80`, and click **Add Domain**.

![Custom domain and port](/assets/images/self-hosting/railway/deploy/4-configure-custom-domaion.png)

5. Configure your DNS settings at your registrar or provider as described in the popup, then click **Dismiss**. For additional context, refer to the [Railway Docs](https://docs.railway.app/deploy/exposing-your-app#add-a-custom-domain).

Note: If using Cloudflare, disable the Proxy status (orange cloud icon) to avoid double proxying, as Railway uses Cloudflare for routing.

![CNAME setup instructions](/assets/images/self-hosting/railway/deploy/5-domain-cname-instructions.png)

6. Wait for DNS propagation and TLS certificate issuance.

7. Verify the deployment by clicking the custom domain in the **Deployments** tab.

![Custom domain](/assets/images/self-hosting/railway/deploy/6-click-custom-domain.png)

🎉

![Phase Console](/assets/images/self-hosting/railway/deploy/7-phase-console-deployed.png)

### 3. Configure OAuth Credentials

Set up a Google, GitHub or GitLab OAuth application. Please refer to the [docs](/self-hosting/configuration/envars#single-sign-on-sso) for instructions on how to set this up for each provider. Then:
1. In both the `frontend` and `backend` services:
   - Select **Variables**
   - Click **+ New Variables**
   - Add your OAuth provider's `CLIENT_ID` and `CLIENT_SECRET`
   - You may need to set `SSO_PROVIDERS` in the `frontend` service if not done previously. (Note: use the legacy `NEXT_PUBLIC_NEXTAUTH_PROVIDERS` variable if using a version of the console older than `v2.50.0`)
   - Click **Add**

Here's what it looks like for the `frontend`:
![Frontend oauth variables](/assets/images/self-hosting/railway/deploy/8-oauth-credntials-backend.png)

For the `backend`:
![Backend oauth variables](/assets/images/self-hosting/railway/deploy/9-oauth-credntials-backend.png)

2. Click **Deploy** in the top-left action bar.

![Re-deploy services after variable change](/assets/images/self-hosting/railway/deploy/10-deploy-services-after-chnages.png)

3. After deployment completes, redeploy the `railway-nginx` service:
   - Navigate to the `railway-nginx` service
   - Find the latest **Active** deployment
   - Click the options button next to "View logs"
   - Select **Redeploy**
   - Confirm the redeployment

![Redeploy railway-nginx](/assets/images/self-hosting/railway/deploy/11-select-redeploy.png)

![Confirm railway-nginx redeployment](/assets/images/self-hosting/railway/deploy/12-confirm-redeploy.png)

You should be all set! Next, head on over to your Railway custom domain and log into your Phase Console. Here's a [quickstart](/quickstart).

## Troubleshooting

### Check the health endpoints

You may check the routing and the health of your `frontend` and `backend` services by making a GET request to the following public endpoints.

Frontend: `http(s)://example.com/api/health`

Example:
```fish
curl https://demo.railway.phase.dev/api/health 
{"status":"alive"}
```

Backend: `http(s)://example.com/service/health/`

Example:
```fish
curl https://demo.railway.phase.dev/service/health/
{"status": "alive", "version": "v2.34.0"}
```

### OAuth Redirection Issues

Below is an example of an OAuth redirection error when using GitHub SSO (though not exclusive to GitHub). This can occur even with correct OAuth configuration if the Railway environment variables referenced by the Phase `backend` service from the `railway-nginx` server are outdated after adding a new custom domain. An easy way to spot this is by going through the OAuth redirection URL in your browser address bar and looking for the `redirect_url=...`. In the example below it's set to the Railway provided domain for the `railway-nginx` service and not the custom domain we have set previously.

![Oauth redirection uri error](/assets/images/self-hosting/railway/troubleshooting/1-github-ouath-redirection-error.png)

Similar issues can appear during login. If you check the browser console, you may see errors indicating that requests to a Railway domain have been blocked by the Content Security Policy (CSP) of the Phase Console. This suggests that services (`frontend` or `backend`) are using incorrect or outdated Railway referenced Environment variables. Verify the referenced variables in each service's Environment Variable tab, redeploy them, and then redeploy the `railway-nginx` service.

### Redeploying Services

1. Select the service to redeploy.

![Click railway nginx](/assets/images/self-hosting/railway/deploy/1-click-railway-nginx.png)

2. From the Deployments tab, find the latest **Active** deployment (in green), click the options button next to "View logs", and select **Redeploy**.

![Redeploy railway-nginx](/assets/images/self-hosting/railway/deploy/11-select-redeploy.png)

3. Confirm the redeployment.

![Confirm railway-nginx redeployment](/assets/images/self-hosting/railway/deploy/12-confirm-redeploy.png)

### Viewing Logs

1. Select the service to inspect.

![Click railway nginx](/assets/images/self-hosting/railway/deploy/1-click-railway-nginx.png)

2. From the Deployments tab, click the green **View logs** button from the latest active deployment.

![View logs from latest deployment](/assets/images/self-hosting/railway/troubleshooting/1-view-logs.png)

3. Select **Deploy logs** to see application-level logs.

![View deploy logs from a service](/assets/images/self-hosting/railway/troubleshooting/2-view-deploy-logs.png)

4. For publicly exposed services (like `railway-nginx`), you can also view the **HTTP Logs**.

![View http logs from a service](/assets/images/self-hosting/railway/troubleshooting/3-view-http-logs.png)