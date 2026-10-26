---
title: "Apps"
description: "Explore the Phase Apps API for managing applications programmatically."
url: https://docs.phase.dev/public-api/apps
---

# Apps

Apps are the top-level organizational unit in Phase. Each App contains Environments, which in turn hold Secrets. On this page, we'll look at the Apps API endpoints for listing, creating, updating, and deleting Apps.

> **Note:** Apps created via the API are SSE-enabled by default. The list endpoint returns metadata for all apps you have access to (SSE and E2EE) — check the `sseEnabled` field. Write operations against secrets and environments via the REST API require SSE; E2EE apps return `400 Bad Request`.

## The App model

### Properties

  - `id` (string): Unique identifier for the app.
  - `name` (string): The name of the app.
  - `description` (string): An optional description for the app.
  - `sseEnabled` (boolean): Whether server-side encryption is enabled for this app.
  - `createdAt` (timestamp): Timestamp of when the app was created.
  - `updatedAt` (timestamp): Timestamp of when the app was last updated.

---

## List Apps

    Retrieve metadata for all apps (SSE and E2EE) that the authenticated account has access to. Use the `sseEnabled` field to distinguish; only SSE apps support secrets and environment writes via the REST API.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/apps/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/apps/'
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
                "id": "58006442-007b-4625-b8e2-80f7606484a0",
                "name": "My App",
                "description": "Production application",
                "sseEnabled": true,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            }
        ]
    }
    ```

---

## Create App

    Create a new SSE-enabled App. By default, three environments are created automatically: Development, Staging, and Production. You can optionally supply a custom list of environment names.

    ### JSON Body

    #### Required fields

      - `name` (string): The app name. Maximum 64 characters.

    #### Optional fields

      - `description` (string): A description for the app. Maximum 10,000 characters.
      - `environments` (array): A list of custom environment names to create instead of the defaults. Each name must contain only letters, numbers, hyphens, and underscores. Requires a paid plan.

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/apps/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "My New App",
        "description": "A new application"
      }'
    ```

    **cURL (custom environments)**

    ```fish
    curl -X POST https://api.phase.dev/v1/apps/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "My New App",
        "environments": ["dev", "test", "staging", "prod"]
      }'
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/apps/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'My New App',
        'description': 'A new application'
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
        "name": "My New App",
        "description": "A new application",
        "sseEnabled": true,
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z",
        "environments": [
            {
                "id": "e7d9cc21-f83c-441f-8887-8720ceab4c7e",
                "name": "Development",
                "envType": "dev",
                "index": 0,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            },
            {
                "id": "c5b998fb-09cf-48ef-808a-46ed08a1f0ab",
                "name": "Staging",
                "envType": "staging",
                "index": 1,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            },
            {
                "id": "538ac0e3-236a-48af-962f-69fab6449c2e",
                "name": "Production",
                "envType": "prod",
                "index": 2,
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            }
        ]
    }
    ```

    The `environments` array reflects whatever was created — either the three defaults (Development/Staging/Production) or the custom names from the request body, in request order. Each entry has the same shape as `GET /v1/environments/:id`.

---

## Get App

    Retrieve a single app by its ID.

    ### URL parameters

      - `id` (string): The unique identifier of the app.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/apps/72b9ddd5-8fce-49ab-89d9-c431d53a9552/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    app_id = '72b9ddd5-8fce-49ab-89d9-c431d53a9552'
    url = f'https://api.phase.dev/v1/apps/{app_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
        "name": "My App",
        "description": "Production application",
        "sseEnabled": true,
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z"
    }
    ```

---

## Update App

    Update an app's name and/or description. At least one field must be provided.

    ### URL parameters

      - `id` (string): The unique identifier of the app.

    ### JSON Body

      - `name` (string): The new app name. Maximum 64 characters.
      - `description` (string): The new app description. Maximum 10,000 characters.

**Request**

    **cURL**

    ```fish
    curl -X PUT https://api.phase.dev/v1/apps/72b9ddd5-8fce-49ab-89d9-c431d53a9552/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Updated App Name",
        "description": "Updated description"
      }'
    ```

    ```python
    import requests

    app_id = '72b9ddd5-8fce-49ab-89d9-c431d53a9552'
    url = f'https://api.phase.dev/v1/apps/{app_id}/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'Updated App Name'
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
        "name": "Updated App Name",
        "description": "Updated description",
        "sseEnabled": true,
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-02T10:30:00Z"
    }
    ```

---

## Delete App

    Permanently delete an app and all its associated data.

> **Note:** This action is irreversible. All environments, secrets, and access configurations associated with the app will be permanently deleted.

    ### URL parameters

      - `id` (string): The unique identifier of the app.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/apps/72b9ddd5-8fce-49ab-89d9-c431d53a9552/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    app_id = '72b9ddd5-8fce-49ab-89d9-c431d53a9552'
    url = f'https://api.phase.dev/v1/apps/{app_id}/'
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
