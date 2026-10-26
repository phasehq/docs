---
title: "Teams"
description: "Explore the Phase Teams API for managing teams, team membership, and team-scoped app access programmatically."
url: https://docs.phase.dev/public-api/teams
---

# Teams

Teams group users and service accounts together and grant shared, scoped access to specific app environments. Each team can carry optional role overrides that apply only to apps accessed via that team's grants, so the same member can hold different effective permissions in different teams. On this page, we'll look at the Teams API endpoints for managing teams, their membership, and their app-environment scope.

> **Note:** Teams require a Pro or Enterprise plan. `POST /v1/teams/` returns `403` on the Free plan.

## The Team model

### Properties

  - `id` (string): Unique identifier for the team.
  - `name` (string): The team name. Maximum 64 characters.
  - `description` (string): An optional team description.
  - `isScimManaged` (boolean): Whether this team is provisioned and synced by your SCIM identity provider. SCIM-managed teams cannot be renamed, deleted, or have user members added or removed via this API — those operations must be performed through the SCIM provider. Service account membership is unaffected and remains manageable via the API.
  - `memberRole` (object): The optional role override for human members of the team. When set, the role unions with each member's organisation role for app-level permissions on apps the team has access to. `null` means no override — members keep their organisation role on team-accessed apps.
  - `serviceAccountRole` (object): The optional role override for service-account members of the team. Same semantics as `memberRole`, applied to service accounts.
  - `owner` (object): The OrganisationMember that owns the team (the team creator by default). Team owners can transfer access scope and add other members. Team owners retain their organisation role on team-accessed apps regardless of `memberRole`.
  - `createdAt` (timestamp): Timestamp of when the team was created.
  - `updatedAt` (timestamp): Timestamp of when the team was last updated.

### Permission model

Team access is **additive**: granting team membership never reduces a member's effective permissions. For each app the team has access to, the request is permitted if **either** the member's individual organisation role grants the action **or** the team's effective role (override → org role) grants it. The same member can be in multiple teams; permissions union across all of them.

Server-side Encryption (SSE) is required for an app to be granted to a team — the server provisions per-member `EnvironmentKey` records when teams are attached to apps or members are added to teams. Apps without SSE return `400 Bad Request` when added to a team's scope.

---

## List Teams

    Retrieve all teams in the organisation. Requires the `Teams.read` org permission. Teams are returned without `members` or `apps` detail — fetch the [Team Detail](#get-team) endpoint for those.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/teams/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/teams/'
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
                "id": "cf3c159d-3edb-4da6-8dbf-0af4959dabf4",
                "name": "backend-eng",
                "description": "Backend engineering team",
                "isScimManaged": false,
                "memberRole": null,
                "serviceAccountRole": null,
                "owner": {
                    "id": "99e37555-108d-4331-a385-6db971bbd617",
                    "email": "alice@example.com"
                },
                "createdAt": "2024-06-01T12:00:00Z",
                "updatedAt": "2024-06-01T12:00:00Z"
            }
        ]
    }
    ```

---

## Create Team

    Create a new team. The calling user becomes the team's owner and is automatically added as a member. Service-account callers create the team without an owner and no auto-membership.

    Requires the `Teams.create` org permission and a Pro or Enterprise plan.

    ### JSON Body

    #### Required fields

      - `name` (string): The team name. Maximum 64 characters. HTML tags and ASCII control characters are stripped; whitespace is trimmed.

    #### Optional fields

      - `description` (string): A description for the team. Maximum 10,000 characters.
      - `member_role_id` (string): Role ID to apply as the team's `memberRole` override. Must reference a role in the same organisation. The role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` and the error lists each extra permission. Callers with a global-access role are exempt. Phase adds this override to the permissions of a user caller who creates or updates a team-owned service account.
      - `service_account_role_id` (string): Role ID to apply as the team's `serviceAccountRole` override. Must reference a role in the same organisation. The role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` and the error lists each extra permission. Callers with a global-access role are exempt. Phase adds this override to the permissions of a service account caller who creates or updates a team-owned service account.

> **Note:** The `is_scim_managed` flag is set automatically by the SCIM provisioning flow. Passing it in the request body returns `400 Bad Request`.

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/teams/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "backend-eng",
        "description": "Backend engineering team"
      }'
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/teams/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'backend-eng',
        'description': 'Backend engineering team'
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    ```json
    {
        "id": "cf3c159d-3edb-4da6-8dbf-0af4959dabf4",
        "name": "backend-eng",
        "description": "Backend engineering team",
        "isScimManaged": false,
        "memberRole": null,
        "serviceAccountRole": null,
        "owner": {
            "id": "99e37555-108d-4331-a385-6db971bbd617",
            "email": "alice@example.com"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-01T12:00:00Z",
        "members": [
            {
                "type": "user",
                "id": "99e37555-108d-4331-a385-6db971bbd617",
                "email": "alice@example.com",
                "fullName": "Alice Smith"
            }
        ],
        "apps": []
    }
    ```

---

## Get Team

    Retrieve a single team with its members and app-environment scope. Non-team-members can list teams via [List Teams](#list-teams) but cannot fetch detail unless they hold a global-access role (Owner or Admin).

    ### URL parameters

      - `id` (string): The unique identifier of the team.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    team_id = 'cf3c159d-3edb-4da6-8dbf-0af4959dabf4'
    url = f'https://api.phase.dev/v1/teams/{team_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "cf3c159d-3edb-4da6-8dbf-0af4959dabf4",
        "name": "backend-eng",
        "description": "Backend engineering team",
        "isScimManaged": false,
        "memberRole": {
            "id": "5d880011-2fc9-4e78-9be2-80f4183c0eea",
            "name": "Developer"
        },
        "serviceAccountRole": null,
        "owner": {
            "id": "99e37555-108d-4331-a385-6db971bbd617",
            "email": "alice@example.com"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-02T09:00:00Z",
        "members": [
            {
                "type": "user",
                "id": "99e37555-108d-4331-a385-6db971bbd617",
                "email": "alice@example.com",
                "fullName": "Alice Smith"
            },
            {
                "type": "service_account",
                "id": "0df24d46-e057-4695-a519-eee3d34e291c",
                "name": "deploy-bot"
            }
        ],
        "apps": [
            {
                "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
                "name": "web-frontend",
                "environments": [
                    { "id": "af6b7a8e-c268-48c2-967c-032e86e26110", "name": "Development" },
                    { "id": "b12c3d4e-5678-90ab-cdef-1234567890ab", "name": "Staging" }
                ]
            }
        ]
    }
    ```

---

## Update Team

    Update a team's name, description, or role overrides. At least one field must be provided.

    - SCIM-managed teams reject all field updates — name and description are synced from the SCIM provider, and role overrides are managed via the console.
    - Pass an empty string (`""`) for `member_role_id` or `service_account_role_id` to clear an existing override and fall back to the org role on team-accessed apps.

    ### URL parameters

      - `id` (string): The unique identifier of the team.

    ### JSON Body

      - `name` (string): The new team name. Maximum 64 characters.
      - `description` (string): The new description. Maximum 10,000 characters.
      - `member_role_id` (string): New role override for human members. Pass `""` to clear the existing override. If the override changes, the new role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` and the error lists each extra permission. Callers with a global-access role are exempt. Phase adds this override to the permissions of a user caller who creates or updates a team-owned service account.
      - `service_account_role_id` (string): New role override for service-account members. Pass `""` to clear the existing override. If the override changes, the new role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` and the error lists each extra permission. Callers with a global-access role are exempt. Phase adds this override to the permissions of a service account caller who creates or updates a team-owned service account.

**Request**

    **cURL**

    ```fish
    curl -X PUT https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "backend-engineering",
        "member_role_id": "5d880011-2fc9-4e78-9be2-80f4183c0eea"
      }'
    ```

    ```python
    import requests

    team_id = 'cf3c159d-3edb-4da6-8dbf-0af4959dabf4'
    url = f'https://api.phase.dev/v1/teams/{team_id}/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'backend-engineering',
        'member_role_id': '5d880011-2fc9-4e78-9be2-80f4183c0eea'
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "cf3c159d-3edb-4da6-8dbf-0af4959dabf4",
        "name": "backend-engineering",
        "description": "Backend engineering team",
        "isScimManaged": false,
        "memberRole": {
            "id": "5d880011-2fc9-4e78-9be2-80f4183c0eea",
            "name": "Developer"
        },
        "serviceAccountRole": null,
        "owner": {
            "id": "99e37555-108d-4331-a385-6db971bbd617",
            "email": "alice@example.com"
        },
        "createdAt": "2024-06-01T12:00:00Z",
        "updatedAt": "2024-06-03T14:00:00Z",
        "members": [],
        "apps": []
    }
    ```

---

## Delete Team

    Delete a team. This soft-deletes the team and cascades:

    - All team-granted `EnvironmentKey` rows are revoked. Keys carrying an additional individual grant survive (their team grant is removed but the key itself is preserved).
    - All team-owned service accounts are soft-deleted, including their tokens.

    SCIM-managed teams cannot be deleted via this endpoint — delete the corresponding group in your SCIM provider instead.

    ### URL parameters

      - `id` (string): The unique identifier of the team.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    team_id = 'cf3c159d-3edb-4da6-8dbf-0af4959dabf4'
    url = f'https://api.phase.dev/v1/teams/{team_id}/'
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

## Add Team Members

    Add one or more members (users or service accounts) to a team. The server provisions per-member `EnvironmentKey` records for every SSE-enabled app the team already has access to.

    - **SCIM-managed teams** reject `user` additions — user membership is controlled by the SCIM provider. Service-account additions are permitted on SCIM-managed teams since service accounts are outside the SCIM scope.
    - **Team-owned service accounts** (SAs created with a `team_id`) cannot be added to a different team — returns `409 Conflict`. The SA must first be transferred to org-level ownership.

    ### URL parameters

      - `id` (string): The unique identifier of the team.

    ### JSON Body

      - `member_type` (string): Either `user` or `service_account`. Defaults to `user`.
      - `member_ids` (array): Array of OrganisationMember IDs (for `user`) or ServiceAccount IDs (for `service_account`). Must be a non-empty list.

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/members/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "member_type": "user",
        "member_ids": [
          "3f2e1d0c-9b8a-7654-3210-fedcba987654"
        ]
      }'
    ```

    ```python
    import requests

    team_id = 'cf3c159d-3edb-4da6-8dbf-0af4959dabf4'
    url = f'https://api.phase.dev/v1/teams/{team_id}/members/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'member_type': 'user',
        'member_ids': ['3f2e1d0c-9b8a-7654-3210-fedcba987654']
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "cf3c159d-3edb-4da6-8dbf-0af4959dabf4",
        "name": "backend-engineering",
        "members": [
            {
                "type": "user",
                "id": "99e37555-108d-4331-a385-6db971bbd617",
                "email": "alice@example.com",
                "fullName": "Alice Smith"
            },
            {
                "type": "user",
                "id": "3f2e1d0c-9b8a-7654-3210-fedcba987654",
                "email": "bob@example.com",
                "fullName": "Bob Jones"
            }
        ]
    }
    ```

---

## Remove Team Member

    Remove a single member from a team. The server revokes the member's team-granted `EnvironmentKey` records; keys carrying an additional individual grant are preserved.

    - **SCIM-managed teams** reject `user` removals — user membership is controlled by the SCIM provider.
    - **Team-owned service accounts** cannot be removed from their owning team — returns `409 Conflict`. Delete the service account or transfer ownership to org-level first.

    ### URL parameters

      - `id` (string): The unique identifier of the team.
      - `member_id` (string): The OrganisationMember ID or ServiceAccount ID to remove.

    ### Query parameters

      - `member_type` (string): Either `user` or `service_account`. Defaults to `user`. Required to disambiguate when the same ID exists in both tables.

**Request**

    **cURL**

    ```fish
    curl -X DELETE "https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/members/3f2e1d0c-9b8a-7654-3210-fedcba987654/?member_type=user" \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    team_id = 'cf3c159d-3edb-4da6-8dbf-0af4959dabf4'
    member_id = '3f2e1d0c-9b8a-7654-3210-fedcba987654'
    url = f'https://api.phase.dev/v1/teams/{team_id}/members/{member_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {'member_type': 'user'}

    response = requests.delete(url, params=params, headers=headers)
    # Returns 204 No Content on success
    ```

    **Response**

    ```text
    204 No Content
    ```

---

## Manage Access

    Set the apps and environments the team has access to. This is a **declarative** endpoint — the request body represents the entire desired access state.

    - Apps not in the list have their team grants revoked; orphan `EnvironmentKey` records (no remaining grants) are soft-deleted.
    - Each app entry must include at least one environment. To revoke a team's access to an app entirely, omit it from the body.
    - To revoke all team access, send an empty `apps` array.
    - Only apps with **Server-side Encryption (SSE)** enabled can be granted to a team. Non-SSE apps return `400 Bad Request`.
    - The caller must individually have access to each app being granted to the team — returns `403 Forbidden` otherwise.

    For new (app, environment) pairs added by this call, the server provisions per-member `EnvironmentKey` records for every existing team member.

    ### URL parameters

      - `id` (string): The unique identifier of the team.

    ### JSON Body

      - `apps` (array): An array of app access objects. Each object must have:
          - `id` (string): The app ID.
          - `environments` (array): A list of environment IDs to grant access to. Must not be empty.

          To revoke all team access, pass an empty array.

**Request**

    **cURL (grant access)**

    ```fish
    curl -X PUT https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/access/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "apps": [
          {
            "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
            "environments": [
              "af6b7a8e-c268-48c2-967c-032e86e26110",
              "b12c3d4e-5678-90ab-cdef-1234567890ab"
            ]
          }
        ]
      }'
    ```

    **cURL (revoke all)**

    ```fish
    curl -X PUT https://api.phase.dev/v1/teams/cf3c159d-3edb-4da6-8dbf-0af4959dabf4/access/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{"apps": []}'
    ```

    ```python
    import requests

    team_id = 'cf3c159d-3edb-4da6-8dbf-0af4959dabf4'
    url = f'https://api.phase.dev/v1/teams/{team_id}/access/'
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
                    'b12c3d4e-5678-90ab-cdef-1234567890ab'
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
        "id": "cf3c159d-3edb-4da6-8dbf-0af4959dabf4",
        "name": "backend-engineering",
        "apps": [
            {
                "id": "72b9ddd5-8fce-49ab-89d9-c431d53a9552",
                "name": "web-frontend",
                "environments": [
                    { "id": "af6b7a8e-c268-48c2-967c-032e86e26110", "name": "Development" },
                    { "id": "b12c3d4e-5678-90ab-cdef-1234567890ab", "name": "Staging" }
                ]
            }
        ]
    }
    ```
