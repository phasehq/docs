---
title: "Service Accounts"
description: "Explore the Phase Service Accounts API for managing service accounts programmatically."
url: https://docs.phase.dev/public-api/service-accounts
---

# Service Accounts

Service Accounts provide programmatic, non-human access to your Phase organisation. Each Service Account has its own Role, authentication tokens, and can be granted access to specific Apps and Environments. On this page, we'll look at the API endpoints for managing Service Accounts, their access, and their lifecycle.

## The Service Account model

### Properties

  - `id` (string): Unique identifier for the service account.
  - `name` (string): The name of the service account.
  - `role` (object): The assigned role, with `id` and `name`.
  - `createdAt` (timestamp): Timestamp of when the service account was created.
  - `updatedAt` (timestamp): Timestamp of when the service account was last updated.

### Detail Properties

When fetching a single service account, additional detail fields are included:

  - `tokens` (array): Array of active tokens, each with `id`, `name`, `createdAt`, and `expiresAt`.
  - `apps` (array): Array of accessible apps, each with `id`, `name`, and an `environments` array containing the environments the service account can access within that app.

---

## List Service Accounts

    Retrieve all active service accounts in the organisation.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/service-accounts/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/service-accounts/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "data": [
            {
                "id": "8ab27128-02d8-42c1-b893-12acaffbbd4b",
                "name": "deploy-bot",
                "role": {
                    "id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
                    "name": "Service"
                },
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            }
        ]
    }
    ```

---

## Create Service Account

    Create a new service account. The server generates all cryptographic keys and mints an initial authentication token, which is returned in the response.

> **Note:** The `initialToken.token` and `initialToken.bearerToken` strings are only returned once at creation time. Store them securely — they cannot be retrieved again. The token's `id` is returned alongside them so it can be referenced by the [Delete Token](#delete-token) endpoint later.

    ### JSON Body

    #### Required fields

      - `name` (string): The service account name. Maximum 64 characters.
      - `role_id` (string): The ID of the role to assign. Must not be a role with global access (e.g. Owner or Admin). The role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` and the error lists each extra permission. For a team-owned service account, the caller's permissions also include the team's `memberRole` override (or `serviceAccountRole` for service account callers). Callers with a global-access role are exempt.

    #### Optional fields

      - `token_name` (string): A name for the initial token. Defaults to `"Default"`.
      - `team_id` (string): Bind the service account to a [Team](https://docs.phase.dev/public-api/teams.md). Team-owned service accounts are visible only to team members (plus Owner / Admin), are auto-added as members of the team, are provisioned `EnvironmentKey` records for every SSE-enabled app the team has access to, and cannot later be transferred to a different team or be removed from the owning team's membership. Requires a Pro or Enterprise plan; the caller must be a member of the team (or hold global access).

> **Note:** Service accounts are visible to all org members with the `ServiceAccounts.read` permission **except** team-owned ones — those are only visible to members of the owning team and to Owner / Admin. The same scoping applies to `GET /v1/service-accounts/` and `GET /v1/service-accounts/:id/`.

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/service-accounts/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "deploy-bot",
        "role_id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
        "token_name": "CI Token"
      }'
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/service-accounts/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'deploy-bot',
        'role_id': 'd3a2124c-9770-42d5-abf8-599b4a372e9d',
        'token_name': 'CI Token'
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "8ab27128-02d8-42c1-b893-12acaffbbd4b",
        "name": "deploy-bot",
        "role": {
            "id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
            "name": "Service"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z",
        "initialToken": {
            "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
            "name": "Default",
            "createdAt": "2024-06-01T12:00:00Z",
            "expiresAt": null,
            "token": "pss_service:v2:<token_value>:<kx_pub>:<share_a>:<wrap_key>",
            "bearerToken": "ServiceAccount <token_value>"
        }
    }
    ```

    The `initialToken.token` and `initialToken.bearerToken` strings are only returned in this response — there's no way to recover them later. The `initialToken.id` is the same identifier used by the [Delete Token](#delete-token) endpoint to revoke this specific token.

---

## Get Service Account

    Retrieve a single service account with full detail, including tokens and app/environment access.

    ### URL parameters

      - `id` (string): The unique identifier of the service account.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    sa_id = '8ab27128-02d8-42c1-b893-12acaffbbd4b'
    url = f'https://api.phase.dev/v1/service-accounts/{sa_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "8ab27128-02d8-42c1-b893-12acaffbbd4b",
        "name": "deploy-bot",
        "role": {
            "id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
            "name": "Service"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z",
        "tokens": [
            {
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "name": "CI Token",
                "createdAt": "2024-06-01T12:00:00Z",
                "expiresAt": null
            }
        ],
        "apps": [
            {
                "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
                "name": "My App",
                "environments": [
                    {
                        "id": "af6b7a8e-c268-48c2-967c-032e86e26110",
                        "name": "Development",
                        "envType": "dev"
                    },
                    {
                        "id": "c23d4e5f-6789-01bc-def2-3456789012cd",
                        "name": "Production",
                        "envType": "prod"
                    }
                ]
            }
        ]
    }
    ```

---

## Update Service Account

    Update a service account's name and/or role. At least one field must be provided.

    ### URL parameters

      - `id` (string): The unique identifier of the service account.

    ### JSON Body

      - `name` (string): The new name. Maximum 64 characters. HTML tags and ASCII control characters are stripped; whitespace is trimmed.
      - `role_id` (string): The ID of the new role. Must not be a global-access role — service accounts cannot hold roles with `global_access: true`. If the role changes, the new role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` and the error lists each extra permission. For a team-owned service account, the caller's permissions also include the team's `memberRole` override (or `serviceAccountRole` for service account callers). Callers with a global-access role are exempt.

**Request**

    **cURL**

    ```fish
    curl -X PUT https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "deploy-bot-v2",
        "role_id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6"
      }'
    ```

    ```python
    import requests

    sa_id = '8ab27128-02d8-42c1-b893-12acaffbbd4b'
    url = f'https://api.phase.dev/v1/service-accounts/{sa_id}/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'deploy-bot-v2'
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "8ab27128-02d8-42c1-b893-12acaffbbd4b",
        "name": "deploy-bot-v2",
        "role": {
            "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
            "name": "Developer"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-02T14:00:00Z",
        "tokens": [],
        "apps": []
    }
    ```

---

## Delete Service Account

    Delete a service account. All associated tokens are immediately invalidated (subsequent requests with those tokens return `401 Unauthorized` with `{"error": "Token expired or deleted"}`), and all app/environment access grants are removed.

    ### URL parameters

      - `id` (string): The unique identifier of the service account.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    sa_id = '8ab27128-02d8-42c1-b893-12acaffbbd4b'
    url = f'https://api.phase.dev/v1/service-accounts/{sa_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.delete(url, headers=headers)
    # Returns 204 No Content on success
    ```

    **Response**

    ```text
    204 No Content
    ```

---

## Manage Access

    Set the app and environment access for a service account. This is a **declarative** endpoint — the request body represents the entire desired access state.

    - Apps not in the list will have their access revoked.
    - Each app entry must include at least one environment.
    - To revoke all access for a service account, send an empty `apps` array.
    - Only apps with **Server-side Encryption (SSE)** enabled are supported; the endpoint returns `400 Bad Request` for non-SSE apps.
    - The service account's `identity_key` must be set (server-generated at creation). The endpoint returns `400 Bad Request` if it is missing or blank.

    The server automatically handles cryptographic key wrapping for each environment — decrypting environment keys with the server key and re-encrypting them for the service account's identity key.

    ### URL parameters

      - `id` (string): The unique identifier of the service account.

    ### JSON Body

      - `apps` (array): An array of app access objects. Each object must have:
          - `id` (string): The app ID.
          - `environments` (array): A list of environment IDs to grant access to. Must not be empty.

**Request**

    **cURL (grant access)**

    ```fish
    curl -X PUT https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/access/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "apps": [
          {
            "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
            "environments": [
              "af6b7a8e-c268-48c2-967c-032e86e26110",
              "c23d4e5f-6789-01bc-def2-3456789012cd"
            ]
          }
        ]
      }'
    ```

    **cURL (revoke all access)**

    ```fish
    curl -X PUT https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/access/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "apps": []
      }'
    ```

    ```python
    import requests

    sa_id = '8ab27128-02d8-42c1-b893-12acaffbbd4b'
    url = f'https://api.phase.dev/v1/service-accounts/{sa_id}/access/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'apps': [
            {
                'id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552',
                'environments': [
                    'af6b7a8e-c268-48c2-967c-032e86e26110',
                    'c23d4e5f-6789-01bc-def2-3456789012cd'
                ]
            }
        ]
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "8ab27128-02d8-42c1-b893-12acaffbbd4b",
        "name": "deploy-bot",
        "role": {
            "id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
            "name": "Service"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-02T15:00:00Z",
        "tokens": [
            {
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "name": "CI Token",
                "createdAt": "2024-06-01T12:00:00Z",
                "expiresAt": null
            }
        ],
        "apps": [
            {
                "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
                "name": "My App",
                "environments": [
                    {
                        "id": "af6b7a8e-c268-48c2-967c-032e86e26110",
                        "name": "Development",
                        "envType": "dev"
                    },
                    {
                        "id": "c23d4e5f-6789-01bc-def2-3456789012cd",
                        "name": "Production",
                        "envType": "prod"
                    }
                ]
            }
        ]
    }
    ```

---

## Create Token

    Mint an additional bearer token for an existing service account. The server uses its keyring to generate the token end-to-end, so the caller only needs to supply a name and an optional expiry.

    - Requires the service account to have **server-side key management (SSK)** enabled. SAs created via this API always do; client-side-only SAs return `400 Bad Request`.
    - The `token` and `bearerToken` values in the response are only ever returned at creation time — store them securely.
    - Expiry can be set as either an absolute timestamp (`expires_at`) or a relative TTL (`expires_in`). If both are supplied, `expires_at` takes priority. If neither is supplied, the token does not expire.

    ### URL parameters

      - `id` (string): The unique identifier of the service account.

    ### JSON Body

    #### Required fields

      - `name` (string): A human-readable name for the token. Maximum 64 characters.

    #### Optional fields

      - `expires_at` (string): Absolute expiry as an ISO-8601 datetime **with a timezone offset** (e.g. `2026-12-31T23:59:59Z` or `2026-12-31T23:59:59+00:00`). Must be in the future. Naive datetimes (no offset) are rejected.
      - `expires_in` (integer): Token lifetime in seconds (positive integer). The server converts this to an absolute expiry at request time as `now + expires_in`. Ignored if `expires_at` is also supplied.

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/tokens/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "CI Token",
        "expires_at": "2026-12-31T23:59:59Z"
      }'
    ```

    ```python
    import requests

    sa_id = '8ab27128-02d8-42c1-b893-12acaffbbd4b'
    url = f'https://api.phase.dev/v1/service-accounts/{sa_id}/tokens/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    payload = {
        'name': 'CI Token',
        'expires_at': '2026-12-31T23:59:59Z',
        # Or use a relative TTL instead:
        # 'expires_in': 2592000,  # 30 days
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    ```json
    {
        "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
        "name": "CI Token",
        "createdAt": "2024-06-01T12:00:00Z",
        "expiresAt": "2025-12-31T00:00:00Z",
        "token": "pss_service:v2:<token>:<saPubKey>:<keyShare0>:<wrapKey>",
        "bearerToken": "ServiceAccount <token>"
    }
    ```

---

## Delete Token

    Revoke a service account token. Any subsequent requests using the token return `401 Unauthorized`.

    Returns `404 Not Found` if the token belongs to a different service account than the `:id` in the path — the API does not reveal token existence across service accounts.

    ### URL parameters

      - `id` (string): The unique identifier of the service account.
      - `token_id` (string): The unique identifier of the token to revoke.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/service-accounts/8ab27128-02d8-42c1-b893-12acaffbbd4b/tokens/f8621d1a-6903-4b60-8e8d-2085a2475871/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    sa_id = '8ab27128-02d8-42c1-b893-12acaffbbd4b'
    token_id = 'f8621d1a-6903-4b60-8e8d-2085a2475871'
    url = f'https://api.phase.dev/v1/service-accounts/{sa_id}/tokens/{token_id}/'
    headers = {'Authorization': f'Bearer {token}'}

    response = requests.delete(url, headers=headers)
    # Returns 204 No Content on success
    ```

    **Response**

    ```text
    204 No Content
    ```
