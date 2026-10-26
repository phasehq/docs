---
title: "Invites"
description: "Explore the Phase Invites API for creating, listing, and cancelling pending organisation member invitations."
url: https://docs.phase.dev/public-api/invites
---

# Invites

Invites are pending membership requests sent to an email address. When an invite is accepted through the Phase console, the recipient becomes an organisation member with the assigned role. On this page, we'll look at the API endpoints for creating, listing, and cancelling pending invites.

> **Note:** Invites live under the Members resource — all endpoints are namespaced as `/v1/members/invites/`. The `POST /v1/members/` endpoint is reserved for the future direct-member-creation flow and currently returns `405 Method Not Allowed`.

## The Invite model

### Properties

  - `id` (string): Unique identifier for the invite.
  - `inviteeEmail` (string): The email address the invite was sent to.
  - `role` (object): The role that will be assigned on acceptance, with `id` and `name`.
  - `invitedBy` (object): Who sent the invite. Contains `type` (`"member"` or `"service_account"`) and either `email` (for members) or `name` (for service accounts). `null` if the sender has since been removed.
  - `createdAt` (timestamp): Timestamp of when the invite was created.
  - `expiresAt` (timestamp): Timestamp of when the invite expires. Invites are valid for 14 days.
  - `valid` (boolean): Whether the invite is still valid (has not been cancelled or accepted).

---

## Create Invite

    Send an invitation to a new member. An invite email is sent to the specified address, and the invite expires after 14 days.

> **Note:** This endpoint creates an **invite**, not a direct membership. The invited user must accept the invite via the console to become a member.

    ### Constraints

    - The role must not have global access (i.e. Owner and Admin roles cannot be invited to).
    - The role must not permit creating service account tokens.
    - The role must not include permissions that the caller's own role does not have. Otherwise the request returns `403 Forbidden` with `{"error": "You cannot assign the '<role>' role: it includes permissions your own role does not: <permissions>"}`. Callers with a global-access role are exempt.
    - The email is validated against RFC format; whitespace is trimmed and the local + domain parts are lowercased. Invalid emails return `400 Bad Request`.
    - The email must not already belong to an active member or a pending invite. Duplicate invites return `409 Conflict` with `{"error": "An active invite already exists for '<email>'."}`.

> **Note:** App and environment access cannot be scoped at invite time. Because Phase is end-to-end encrypted, granting access requires the invitee's identity key, which doesn't exist until they accept the invite and complete their key ceremony. Use [Manage Access](https://docs.phase.dev/public-api/members.md#manage-access) after acceptance. Sending an `apps` field returns `400 Bad Request`.

    ### JSON Body

    #### Required fields

      - `email` (string): The email address of the person to invite.
      - `role_id` (string): The ID of the role to assign on acceptance.

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/members/invites/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "bob@example.com",
        "role_id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6"
      }'
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/members/invites/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'email': 'bob@example.com',
        'role_id': '6aec9df5-cd75-4645-a9d0-8b6f6aff78d6'
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    ```json
    {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "inviteeEmail": "bob@example.com",
        "role": {
            "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
            "name": "Developer"
        },
        "invitedBy": {
            "type": "member",
            "email": "alice@example.com"
        },
        "createdAt": "2024-06-02T10:00:00Z",
        "expiresAt": "2024-06-16T10:00:00Z",
        "valid": true
    }
    ```

---

## List Invites

    Retrieve all pending (valid, non-expired) invites for the organisation, ordered by most recent first.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/members/invites/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/members/invites/'
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
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "inviteeEmail": "bob@example.com",
                "role": {
                    "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
                    "name": "Developer"
                },
                "invitedBy": {
                    "type": "member",
                    "email": "alice@example.com"
                },
                "createdAt": "2024-06-02T10:00:00Z",
                "expiresAt": "2024-06-16T10:00:00Z",
                "valid": true
            },
            {
                "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                "inviteeEmail": "carol@example.com",
                "role": {
                    "id": "d3a2124c-9770-42d5-abf8-599b4a372e9d",
                    "name": "Manager"
                },
                "invitedBy": {
                    "type": "service_account",
                    "name": "deploy-bot"
                },
                "createdAt": "2024-06-01T08:00:00Z",
                "expiresAt": "2024-06-15T08:00:00Z",
                "valid": true
            }
        ]
    }
    ```

---

## Cancel Invite

    Cancel a pending invite. The invite is immediately invalidated and the invitee can no longer use the invite link to join the organisation.

    ### URL parameters

      - `id` (string): The unique identifier of the invite.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/members/invites/a1b2c3d4-e5f6-7890-abcd-ef1234567890/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    invite_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    url = f'https://api.phase.dev/v1/members/invites/{invite_id}/'
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
