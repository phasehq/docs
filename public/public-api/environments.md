---
title: "Environments"
description: "Explore the Phase Environments API for managing environments programmatically."
url: https://docs.phase.dev/public-api/environments
---

# Environments

Environments represent deployment stages within an App (e.g. Development, Staging, Production). Each Environment contains its own set of Secrets. On this page, we'll look at the Environments API endpoints for listing, creating, updating, and deleting Environments.

> **Note:** The Environments API requires server-side encryption (SSE) to be enabled for the parent App. An `app_id` query parameter is required for list and create operations — omitting it returns `403` as the API cannot resolve the app context.

## The Environment model

### Properties

  - `id` (string): Unique identifier for the environment.
  - `name` (string): The name of the environment.
  - `envType` (string): The type of environment: `dev`, `staging`, `prod`, or `custom`.
  - `index` (integer): The display order of the environment within its app.
  - `createdAt` (timestamp): Timestamp of when the environment was created.
  - `updatedAt` (timestamp): Timestamp of when the environment was last updated.

---

## List Environments

    Retrieve all environments for a given app that the authenticated account has access to.

    ### Required parameters

      - `app_id` (string): Unique identifier for the Phase App.

**Request**

    **cURL**

    ```fish
    curl "https://api.phase.dev/v1/environments/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552" \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/environments/'
    params = {
        'app_id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552'
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "data": [
            {
                "id": "af6b7a8e-c268-48c2-967c-032e86e26110",
                "name": "Development",
                "envType": "dev",
                "index": 0,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            },
            {
                "id": "b12c3d4e-5678-90ab-cdef-1234567890ab",
                "name": "Staging",
                "envType": "staging",
                "index": 1,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            },
            {
                "id": "c23d4e5f-6789-01bc-def2-3456789012cd",
                "name": "Production",
                "envType": "prod",
                "index": 2,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            }
        ]
    }
    ```

---

## Create Environment

    Create a new environment within an app. The environment name must contain only letters, numbers, hyphens, and underscores (max 64 characters).

    ### Required parameters

      - `app_id` (string): Unique identifier for the Phase App.

    ### JSON Body

    #### Required fields

      - `name` (string): The environment name. Must match `[a-zA-Z0-9\-_]{1,64}`.

**Request**

    **cURL**

    ```fish
    curl -X POST "https://api.phase.dev/v1/environments/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552" \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "canary"
      }'
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/environments/'
    params = {
        'app_id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552'
    }
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'canary'
    }

    response = requests.post(url, params=params, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "d34e5f6a-7890-12cd-ef34-567890123456",
        "name": "canary",
        "envType": "custom",
        "index": 3,
        "createdAt": "2024-06-02T10:00:00Z",
        "updatedAt": "2024-06-02T10:00:00Z"
    }
    ```

---

## Get Environment

    Retrieve a single environment by its ID.

    ### URL parameters

      - `id` (string): The unique identifier of the environment.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/environments/af6b7a8e-c268-48c2-967c-032e86e26110/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    env_id = 'af6b7a8e-c268-48c2-967c-032e86e26110'
    url = f'https://api.phase.dev/v1/environments/{env_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "af6b7a8e-c268-48c2-967c-032e86e26110",
        "name": "Development",
        "envType": "dev",
        "index": 0,
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z"
    }
    ```

---

## Update Environment

    Update an environment's name.

    ### URL parameters

      - `id` (string): The unique identifier of the environment.

    ### JSON Body

      - `name` (string): The new environment name. Must match `[a-zA-Z0-9\-_]{1,64}`.

**Request**

    **cURL**

    ```fish
    curl -X PUT https://api.phase.dev/v1/environments/af6b7a8e-c268-48c2-967c-032e86e26110/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "dev-v2"
      }'
    ```

    ```python
    import requests

    env_id = 'af6b7a8e-c268-48c2-967c-032e86e26110'
    url = f'https://api.phase.dev/v1/environments/{env_id}/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'dev-v2'
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "af6b7a8e-c268-48c2-967c-032e86e26110",
        "name": "dev-v2",
        "envType": "dev",
        "index": 0,
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-02T11:00:00Z"
    }
    ```

---

## Delete Environment

    Permanently delete an environment and all its secrets.

> **Note:** This action is irreversible. All secrets and access keys in the environment will be permanently deleted.

    ### URL parameters

      - `id` (string): The unique identifier of the environment.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/environments/af6b7a8e-c268-48c2-967c-032e86e26110/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    env_id = 'af6b7a8e-c268-48c2-967c-032e86e26110'
    url = f'https://api.phase.dev/v1/environments/{env_id}/'
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
