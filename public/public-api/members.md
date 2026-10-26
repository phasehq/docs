---
title: "Members"
description: "Explore the Phase Members API for managing organisation members and their access programmatically."
url: https://docs.phase.dev/public-api/members
---

# Members

Organisation members are human users who belong to your Phase organisation, each assigned a Role that governs their permissions. On this page, we'll look at the API endpoints for listing members, updating roles, managing app and environment access, and removing members.

> **Note:** To add a new member, send an invite via the [Invites API](https://docs.phase.dev/public-api/invites.md) — the invitee accepts the invite and completes a client-side key ceremony before they become an active organisation member. The `POST /v1/members/` endpoint is reserved for the future direct-member-creation flow and currently returns `405 Method Not Allowed`.

## The Member model

### Properties

  - `id` (string): Unique identifier for the organisation membership.
  - `username` (string): The member's username.
  - `fullName` (string): The member's full name, populated from their OAuth profile if available.
  - `email` (string): The member's email address.
  - `role` (object): The assigned role, with `id` and `name`.
  - `createdAt` (timestamp): Timestamp of when the member joined the organisation.
  - `updatedAt` (timestamp): Timestamp of when the membership was last updated.

---

## List Members

    Retrieve all active members of the organisation.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/members/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/members/'
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
                "id": "3f2e1d0c-9b8a-7654-3210-fedcba987654",
                "username": "alice",
                "fullName": "Alice Smith",
                "email": "alice@example.com",
                "role": {
                    "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
                    "name": "Developer"
                },
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            }
        ]
    }
    ```

---

## Get Member

    Retrieve a single member by their membership ID.

    ### URL parameters

      - `id` (string): The unique identifier of the organisation membership.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    member_id = '3f2e1d0c-9b8a-7654-3210-fedcba987654'
    url = f'https://api.phase.dev/v1/members/{member_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "3f2e1d0c-9b8a-7654-3210-fedcba987654",
        "username": "alice",
        "fullName": "Alice Smith",
        "email": "alice@example.com",
        "role": {
            "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
            "name": "Developer"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z"
    }
    ```

---

## Update Member Role

    Update a member's assigned role.

    ### Constraints

    - **The Owner's role is immutable via the API.** Any attempt to PUT the Owner's membership returns `403 Forbidden` with `{"error": "The Owner's role cannot be changed via the API. Use the ownership transfer flow."}`. Ownership transfer is a console-only flow.
    - Users cannot update their own role (`403`).
    - Callers cannot assign a role that includes permissions their own role does not have. The request returns `403 Forbidden` with `{"error": "You cannot assign the '<role>' role: it includes permissions your own role does not: <permissions>"}`. Callers with a global-access role are exempt.
    - User callers cannot update a member who holds a global-access role (e.g. Admin) unless they themselves hold a global-access role (`403`).
    - Service Account callers cannot update any member who holds a global-access role (`403`), nor can they assign a global-access role to any member (`403`).

    ### URL parameters

      - `id` (string): The unique identifier of the organisation membership.

    ### JSON Body

    #### Required fields

      - `role_id` (string): The ID of the new role to assign.

**Request**

    **cURL**

    ```fish
    curl -X PUT https://api.phase.dev/v1/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "role_id": "d3a2124c-9770-42d5-abf8-599b4a372e9d"
      }'
    ```

    ```python
    import requests

    member_id = '3f2e1d0c-9b8a-7654-3210-fedcba987654'
    url = f'https://api.phase.dev/v1/members/{member_id}/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'role_id': 'd3a2124c-9770-42d5-abf8-599b4a372e9d'
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "3f2e1d0c-9b8a-7654-3210-fedcba987654",
        "username": "alice",
        "fullName": "Alice Smith",
        "email": "alice@example.com",
        "role": {
            "id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
            "name": "Manager"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-03T09:00:00Z"
    }
    ```

---

## Remove Member

    Remove a member from the organisation. The user retains their account and can be re-invited later.

    ### Constraints

    - **The Owner cannot be removed via the API** (`403`). Ownership must be transferred first via the console.
    - Users cannot remove themselves from the organisation (`403`).
    - Service Account callers cannot remove a member who holds a global-access role (`403`).

> **Note:** Members provisioned via SCIM are routed through the SCIM deactivation flow on removal. This revokes all of the member's team-granted environment keys, wipes their wrapped keyring, and detaches their SCIM identity so the next provider sync can cleanly re-adopt them. Org owners cannot be deactivated this way (`403`); transfer ownership first.

    ### URL parameters

      - `id` (string): The unique identifier of the organisation membership.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    member_id = '3f2e1d0c-9b8a-7654-3210-fedcba987654'
    url = f'https://api.phase.dev/v1/members/{member_id}/'
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

    Set the app and environment access for a member. This is a **declarative** endpoint — the request body represents the entire desired access state.

    - Apps not in the list will have their access revoked.
    - Each app entry must include at least one environment.
    - To revoke all access for a member, send an empty `apps` array.

    The server handles cryptographic key wrapping for each environment — it re-encrypts environment keys for the member's identity key using server-side encryption.

> **Note:** This endpoint only works for apps with **Server-side Encryption (SSE) enabled**. SSE can be enabled from the App settings page. Non-SSE apps return `400 Bad Request`.
>
>     The target member must also have logged in to the Phase console at least once so their identity key is registered. If the member's identity key is missing or blank, the endpoint returns `400 Bad Request` with `{"error": "Member has not set up their identity key yet. They must log in to the console first."}`.

    ### URL parameters

      - `id` (string): The unique identifier of the organisation membership.

    ### JSON Body

      - `apps` (array): An array of app access objects. Each object must have:
          - `id` (string): The app ID.
          - `environments` (array): A list of environment IDs to grant access to. Must not be empty.

          To revoke all access, pass an empty array.

**Request**

    **cURL (grant access)**

    ```fish
    curl -X PUT https://api.phase.dev/v1/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/access/ \
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
    curl -X PUT https://api.phase.dev/v1/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/access/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "apps": []
      }'
    ```

    ```python
    import requests

    member_id = '3f2e1d0c-9b8a-7654-3210-fedcba987654'
    url = f'https://api.phase.dev/v1/members/{member_id}/access/'
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
        "id": "3f2e1d0c-9b8a-7654-3210-fedcba987654",
        "username": "alice",
        "fullName": "Alice Smith",
        "email": "alice@example.com",
        "role": {
            "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
            "name": "Developer"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-03T10:00:00Z",
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

## Get Access

    Read the current app and environment access for a member.

    ### URL parameters

      - `id` (string): The unique identifier of the organisation membership.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/access/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    member_id = '3f2e1d0c-9b8a-7654-3210-fedcba987654'
    url = f'https://api.phase.dev/v1/members/{member_id}/access/'
    headers = {'Authorization': f'Bearer {token}'}

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "3f2e1d0c-9b8a-7654-3210-fedcba987654",
        "username": "alice",
        "fullName": "Alice Smith",
        "email": "alice@example.com",
        "role": {
            "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
            "name": "Developer"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-03T10:00:00Z",
        "apps": [
            {
                "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
                "name": "My App",
                "environments": [
                    {
                        "id": "af6b7a8e-c268-48c2-967c-032e86e26110",
                        "name": "Development",
                        "envType": "dev"
                    }
                ]
            }
        ]
    }
    ```
