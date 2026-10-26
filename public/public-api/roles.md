---
title: "Roles"
description: "Explore the Phase Roles API for managing roles and permissions programmatically."
url: https://docs.phase.dev/public-api/roles
---

# Roles

Roles define the set of permissions granted to users and service accounts within your organisation. Phase includes five default roles (Owner, Admin, Manager, Developer, Service) and supports creating custom roles on paid plans. On this page, we'll look at the Roles API endpoints for listing, creating, updating, and deleting roles.

## The Role model

### Properties

  - `id` (string): Unique identifier for the role.
  - `name` (string): The name of the role.
  - `description` (string): An optional description for the role.
  - `color` (string): A hex color code for the role (e.g. `#FF0000`).
  - `isDefault` (boolean): Whether this is a built-in default role. Default roles cannot be modified or deleted.
  - `createdAt` (timestamp): Timestamp of when the role was created.

### Permissions object

When fetching a single role, the full permissions object is included. The permissions structure contains:

  - `permissions` (object): Organisation-level permissions. Keys are resource class names, values are arrays of allowed actions (`create`, `read`, `update`, `delete`). See [Roles & Permissions](https://docs.phase.dev/access-control/roles.md) for the full list of valid resource classes.
  - `appPermissions` (object): App-level permissions. Keys are resource class names, values are arrays of allowed actions. See [Roles & Permissions](https://docs.phase.dev/access-control/roles.md) for the full list.
  - `globalAccess` (boolean): Read-only. Returned as `true` for the built-in `Owner` and `Admin` roles and `false` otherwise. Cannot be set on custom roles — POST and PUT reject requests that include `global_access` (or `globalAccess`) under `permissions`.

> **Note:** Responses use camelCase keys (`appPermissions`, `globalAccess`). On POST and PUT, `app_permissions` snake_case is also accepted; the `permissions` payload must contain only `permissions` and `app_permissions` keys.

---

## List Roles

    Retrieve all roles in the organisation, including both default and custom roles.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/roles/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/roles/'
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
                "id": "226bf078-74d5-406e-ba5b-dd68bf23326c",
                "name": "Owner",
                "description": null,
                "color": "",
                "isDefault": true,
                "createdAt": "2024-01-01T00:00:00Z"
            },
            {
                "id": "151e4e7b-6e39-4ede-a064-1f7d228723c5",
                "name": "Admin",
                "description": null,
                "color": "",
                "isDefault": true,
                "createdAt": "2024-01-01T00:00:00Z"
            },
            {
                "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
                "name": "Developer",
                "description": null,
                "color": "",
                "isDefault": true,
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ]
    }
    ```

---

## Get Role

    Retrieve a single role with its full permissions object. For default roles, the permissions are resolved from the built-in role definitions. For custom roles, the stored permissions are returned directly.

    ### URL parameters

      - `id` (string): The unique identifier of the role.

**Request**

    **cURL**

    ```fish
    curl https://api.phase.dev/v1/roles/6aec9df5-cd75-4645-a9d0-8b6f6aff78d6/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    role_id = '6aec9df5-cd75-4645-a9d0-8b6f6aff78d6'
    url = f'https://api.phase.dev/v1/roles/{role_id}/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "6aec9df5-cd75-4645-a9d0-8b6f6aff78d6",
        "name": "Developer",
        "description": null,
        "color": "",
        "isDefault": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "permissions": {
            "permissions": {
                "Organisation": [],
                "Billing": [],
                "Apps": ["read"],
                "Members": ["read"],
                "ServiceAccounts": [],
                "Roles": ["read"]
            },
            "appPermissions": {
                "Environments": ["read", "create", "update"],
                "Secrets": ["create", "read", "update", "delete"],
                "Members": ["read"]
            },
            "globalAccess": false
        }
    }
    ```

---

## Create Role

    Create a custom role with a specified set of permissions.

> **Note:** Custom roles are not available on the Free plan. You must be on a Pro or Enterprise plan to create custom roles.

    - The role can only include permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` with `{"error": "You cannot grant permissions your own role does not include: <permissions>"}`. The error lists each extra permission as `<scope>:<resource>:<action>`, for example `permissions:SSO:create`. Callers with a global-access role (Owner or Admin) are exempt.

    ### JSON Body

    #### Required fields

      - `name` (string): The role name. Maximum 64 characters. Must be unique within the organisation (case-insensitive).
      - `permissions` (object): The permissions object. Must contain exactly two keys: `permissions` (org-level) and `app_permissions` (app-level). The `global_access` flag cannot be set on custom roles — POST and PUT reject requests that include `global_access` (or `globalAccess`) under `permissions` with `400 Bad Request`.

    #### Optional fields

      - `description` (string): A description for the role. Maximum 500 characters.
      - `color` (string): A hex color code. Maximum 7 characters (e.g. `#FF0000`).

**Request**

    **cURL**

    ```fish
    curl -X POST https://api.phase.dev/v1/roles/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Read Only",
        "description": "Read-only access to all resources",
        "color": "#64748b",
        "permissions": {
          "permissions": {
            "Organisation": ["read"],
            "Apps": ["read"],
            "Members": ["read"],
            "Roles": ["read"]
          },
          "app_permissions": {
            "Secrets": ["read"],
            "Environments": ["read"]
          }
        }
      }'
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/roles/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'Read Only',
        'description': 'Read-only access to all resources',
        'color': '#64748b',
        'permissions': {
            'permissions': {
                'Organisation': ['read'],
                'Apps': ['read'],
                'Members': ['read'],
                'Roles': ['read'],
            },
            'app_permissions': {
                'Secrets': ['read'],
                'Environments': ['read'],
            },
        }
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "name": "Read Only",
        "description": "Read-only access to all resources",
        "color": "#64748b",
        "isDefault": false,
        "createdAt": "2024-06-02T10:00:00Z",
        "permissions": {
            "permissions": {
                "Organisation": ["read"],
                "Apps": ["read"],
                "Members": ["read"],
                "Roles": ["read"]
            },
            "appPermissions": {
                "Secrets": ["read"],
                "Environments": ["read"]
            },
            "globalAccess": false
        }
    }
    ```

---

## Update Role

    Update a custom role's name, description, color, and/or permissions. At least one field must be provided. Default roles cannot be modified (`403 Forbidden`).

    - The request can only add permissions that the caller's own role has. Otherwise the request returns `403 Forbidden` with `{"error": "You cannot grant permissions your own role does not include: <permissions>"}`. This limit applies only to the permissions that the request adds. The caller can change `name`, `description`, or `color`, or remove permissions that the caller does not have. Callers with a global-access role (Owner or Admin) are exempt.

    ### URL parameters

      - `id` (string): The unique identifier of the role.

    ### JSON Body

    When `permissions` is provided, the full object replaces the stored permissions and must contain exactly two keys: `permissions` and `app_permissions`. The camelCase variant `appPermissions` is also accepted on input. Sending `global_access` (or `globalAccess`) under `permissions` returns `400 Bad Request`.

      - `name` (string): The new role name. Maximum 64 characters. Must be unique within the organisation (case-insensitive).
      - `description` (string): The new description. Maximum 500 characters.
      - `color` (string): The new hex color code. Maximum 7 characters.
      - `permissions` (object): The updated permissions object. Replaces the stored permissions in full.

**Request**

    **cURL**

    ```fish
    curl -X PUT https://api.phase.dev/v1/roles/f47ac10b-58cc-4372-a567-0e02b2c3d479/ \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Auditor",
        "description": "Read-only auditor role",
        "permissions": {
          "permissions": {
            "Organisation": ["read"],
            "Apps": ["read"],
            "Members": ["read"],
            "Roles": ["read"],
            "ServiceAccounts": ["read"]
          },
          "app_permissions": {
            "Secrets": ["read"],
            "Environments": ["read"],
            "Logs": ["read"]
          }
        }
      }'
    ```

    ```python
    import requests

    role_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    url = f'https://api.phase.dev/v1/roles/{role_id}/'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'name': 'Auditor',
        'description': 'Read-only auditor role'
    }

    response = requests.put(url, json=payload, headers=headers)
    data = response.json()
    ```

    **Response**

    ```json
    {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "name": "Auditor",
        "description": "Read-only auditor role",
        "color": "#64748b",
        "isDefault": false,
        "createdAt": "2024-06-02T10:00:00Z",
        "permissions": {
            "permissions": {
                "Organisation": ["read"],
                "Apps": ["read"],
                "Members": ["read"],
                "Roles": ["read"],
                "ServiceAccounts": ["read"]
            },
            "appPermissions": {
                "Secrets": ["read"],
                "Environments": ["read"],
                "Logs": ["read"]
            },
            "globalAccess": false
        }
    }
    ```

---

## Delete Role

    Delete a custom role.

    - Default roles (Owner, Admin, Manager, Developer, Service) cannot be deleted — returns `403 Forbidden` with `{"error": "Default roles cannot be deleted."}`.
    - A role with members or service accounts currently assigned to it cannot be deleted — returns `409 Conflict`. Reassign the affected accounts to a different role first.

    ### URL parameters

      - `id` (string): The unique identifier of the role.

**Request**

    **cURL**

    ```fish
    curl -X DELETE https://api.phase.dev/v1/roles/f47ac10b-58cc-4372-a567-0e02b2c3d479/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    role_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    url = f'https://api.phase.dev/v1/roles/{role_id}/'
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
