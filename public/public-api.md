import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'

export const description =
  'This guide will explain how to work with the Phase REST API.'

<HeroPattern />

# API

The Phase HTTP REST API allows you to manage secrets programmatically via an HTTP client. The API enables you to create, fetch, update, and delete secrets across all your Apps, Environments, and Folders. {{ className: 'lead' }}

## Overview

You can use the Phase public REST API to access and manage secrets via a simple HTTP endpoint. This may be desirable when accessing secrets in clients that do not have the ability to execute client-side logic necessary for secure secret management and must rely on the server to do so.

The Phase API is organized around [REST](https://en.wikipedia.org/wiki/Representational_State_Transfer). The API accepts data in the request body only in JSON-encoded format. It uses standard HTTP methods and response codes.

The API also returns specific error messages when something goes wrong. Check out the API [errors page](/public-api/errors) for more details.

## Base URL

If you are using Phase Cloud, the API can be accessed at `https://api.phase.dev`. Alternatively, if you are self-hosting Phase, the API is by default exposed at `${HTTP_PROTOCOL}${HOST}/service/public`.

Example:

<CodeGroup>

```fish {{ title: 'Phase Cloud' }}
curl https://api.phase.dev/v1/secrets/?app_id=<app_id>&env=development \
  -H "Authorization: Bearer {token}"
```

```fish {{ title: 'Self-hosted' }}
curl https://acme.com/service/public/v1/secrets/?app_id=<app_id>&env=development \
  -H "Authorization: Bearer {token}"
```

</CodeGroup>

## Authentication

All API requests must be authenticated with a bearer token in the `Authorization` header of each request, followed by the type of token used and the token. You can find more information about the token types [here](/access-control/authentication#programmatic-authentication).

When deciding between authentication token types, you may consider:
- **Service Account Token**: Belongs to a [Service Account](/access-control/service-accounts). Inherits the Access Control policies and Roles from a service account.
- **Personal Access Token (PAT)**: Belongs to a human user. Inherits the Access Control policies and Roles from a user. Has access to all Apps and Environments that a particular user has access to. Will return any [Personal Secret Overrides](/console/secrets#override-a-secret-personal-secrets) you might have set for a given secret.

Example:

<CodeGroup>

```fish {{ title: 'Service Account Token' }}
curl https://api.phase.dev/v1/secrets/?app_id=8d8fde43-ceb6-4c92-a776-827433512ff9&env=production \
  -H "Authorization: Bearer ServiceAccount ac671c7556ec51cec52baa15168339dcbe96b360f81575873d0c31607148f378"
```

```fish {{ title: 'Personal Access Token (PAT)' }}
curl https://api.phase.dev/v1/secrets/?app_id=8d8fde43-ceb6-4c92-a776-827433512ff9&env=development \
  -H "Authorization: Bearer User f3c817bda98bc37d8f3c9a176ae54ec485725de5705c52c403fc0ad96cd9be57"
```

</CodeGroup>

## Encryption Mode

Certain API endpoints that allow manipulation of encrypted data such as Secrets require Server-side Encryption (SSE) to be enabled for the App. You can enable SSE for an App from the [App settings page](/console/apps#settings).
