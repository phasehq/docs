---
title: "Supabase Edge Functions"
description: "Integrate Phase with Supabase"
url: https://docs.phase.dev/integrations/platforms/supabase
---

# Supabase Edge Functions

You can use Phase to sync secrets to your Supabase project. The secrets are available to your Edge Functions at runtime.

> **Warning:** When you enable secret syncing, Phase becomes the source of truth for your
>   secrets. Phase overwrites or deletes the secrets on the target service.
>   Import your secrets into Phase before you continue.

### Prerequisites

- Sign up for the [Phase Console](https://docs.phase.dev/quickstart.md) and [create an App](https://docs.phase.dev/console/apps.md#create-an-app).
- Enable Server-side Encryption (SSE) for the App from the [Settings](https://docs.phase.dev/console/apps.md#settings) tab.

## Step 1: Authentication

### Create a Supabase access token

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard). Click your avatar in the top right, then select **Account**.

![Supabase account menu](https://docs.phase.dev/assets/images/platform-integrations/supabase/supabase-account-menu.png)

2. Go to the [Access Tokens](https://supabase.com/dashboard/account/tokens) tab and click **Generate New Token**. Enter a descriptive name, select an expiry, and click **Generate token**. Copy the token. Supabase shows it only once.

![Generate new token](https://docs.phase.dev/assets/images/platform-integrations/supabase/supabase-generate-token.png)

> **Note:** Supabase requires an expiry on new access tokens (up to 1 year with a custom
>   date). When the token expires, syncs fail with an authentication error.
>   Syncs resume after you update the stored credentials with a new token.

### Store authentication credentials in Phase

1. Go to **Integrations** in the sidebar. Then click **Third-party credentials** in the integrations tab.

![Go to integrations](https://docs.phase.dev/assets/images/platform-integrations/integrations-sidebar.webp)

2. Click **Supabase**.

![supabase-create-creds](https://docs.phase.dev/assets/images/platform-integrations/supabase/add-credentials-supabase-1.webp)

3. Enter your Supabase `Access Token` from the previous step. Enter a descriptive name and click **Save**.

![supabase-input-creds](https://docs.phase.dev/assets/images/platform-integrations/supabase/add-credentials-supabase-2.webp)

Phase encrypts and saves your credentials. You can view and manage them under *Service Credentials* in the *Integrations* screen.

## Step 2: Set up a secret sync

1. Open your App in the Phase Console and go to the **Syncing** tab. Select **Supabase Edge Functions** in the 'Create a new Sync' menu.

![create supabase sync](https://docs.phase.dev/assets/images/platform-integrations/supabase/create-sync-supabase-1.webp)

2. Select the credentials that you added in the previous step. Then click **Next**.

![select supabase creds](https://docs.phase.dev/assets/images/platform-integrations/supabase/create-sync-supabase-2.webp)

3. Configure the source and destination for your secrets. Select an Environment from your App as the source. If you want to sync from a specific folder, set the Path. Then select a Supabase project from the dropdown and click **Create**.

![configure supabase sync](https://docs.phase.dev/assets/images/platform-integrations/supabase/create-sync-supabase-3.webp)

4. Phase now syncs your secrets to the selected Supabase project automatically. You can manage the sync from the *Syncing* tab of your App or from the *Integrations* screen.

![supabase sync card](https://docs.phase.dev/assets/images/platform-integrations/supabase/supabase-sync-card.webp)

> **Note:** Supabase reserves secret names that start with `SUPABASE_`, for example
>   `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Supabase manages these secrets for
>   every project. The sync does not delete them and does not push Phase secrets
>   with this prefix. The sync logs list the skipped keys.

Synced secrets are available to your Edge Functions without a redeploy. To see them, open the **Edge Functions → Secrets** page in the Supabase Dashboard, or use the Supabase CLI:

```fish
supabase secrets list --project-ref <your-project-ref>
```

An Edge Function reads the synced secrets as environment variables:

```ts
Deno.serve(async () => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')

  return new Response(
    JSON.stringify({ stripeKeyIsSet: Boolean(stripeKey) }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
```

> **Note:** Supabase allows a maximum of 100 secrets per project. If a sync contains
>   more than 100 secrets, the sync fails before it writes changes to the
>   project. The sync logs show this error. The
>   [Edge Functions limits](https://supabase.com/docs/guides/functions/limits)
>   page lists all limits.
