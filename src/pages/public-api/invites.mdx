import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const metadata = {
  title: 'Invites API',
  description:
    'Explore the Phase Invites API for creating, listing, and cancelling pending organisation member invitations.',
}

<Tag variant="small">API</Tag>

# Invites

Invites are pending membership requests sent to an email address. When an invite is accepted through the Phase console, the recipient becomes an organisation member with the assigned role. On this page, we'll look at the API endpoints for creating, listing, and cancelling pending invites. {{ className: 'lead' }}

<Note>
Invites live under the Members resource — all endpoints are namespaced as `/v1/members/invites/`. The `POST /v1/members/` endpoint is reserved for the future direct-member-creation flow and currently returns `405 Method Not Allowed`.
</Note>

<DocActions />

## The Invite model

### Properties

<Properties>
  <Property name="id" type="string">
    Unique identifier for the invite.
  </Property>
  <Property name="inviteeEmail" type="string">
    The email address the invite was sent to.
  </Property>
  <Property name="role" type="object">
    The role that will be assigned on acceptance, with `id` and `name`.
  </Property>
  <Property name="invitedBy" type="object">
    Who sent the invite. Contains `type` (`"member"` or `"service_account"`) and either `email` (for members) or `name` (for service accounts). `null` if the sender has since been removed.
  </Property>
  <Property name="createdAt" type="timestamp">
    Timestamp of when the invite was created.
  </Property>
  <Property name="expiresAt" type="timestamp">
    Timestamp of when the invite expires. Invites are valid for 14 days.
  </Property>
  <Property name="valid" type="boolean">
    Whether the invite is still valid (has not been cancelled or accepted).
  </Property>
</Properties>

---

## Create Invite {{ tag: 'POST', label: '/v1/members/invites' }}

<Row>
  <Col>

    Send an invitation to a new member. An invite email is sent to the specified address, and the invite expires after 14 days.

    <Note>
    This endpoint creates an **invite**, not a direct membership. The invited user must accept the invite via the console to become a member.
    </Note>

    ### Constraints

    - The role must not have global access (i.e. Owner and Admin roles cannot be invited to).
    - The role must not permit creating service account tokens.
    - The email is validated against RFC format; whitespace is trimmed and the local + domain parts are lowercased. Invalid emails return `400 Bad Request`.
    - The email must not already belong to an active member or a pending invite. Duplicate invites return `409 Conflict` with `{"error": "An active invite already exists for '<email>'."}`.

    <Note>
    App and environment access cannot be scoped at invite time. Because Phase is end-to-end encrypted, granting access requires the invitee's identity key, which doesn't exist until they accept the invite and complete their key ceremony. Use [Manage Access](/public-api/members#manage-access) after acceptance. Sending an `apps` field returns `400 Bad Request`.
    </Note>

    ### JSON Body

    #### Required fields

    <Properties>
      <Property name="email" type="string">
        The email address of the person to invite.
      </Property>
      <Property name="role_id" type="string">
        The ID of the role to assign on acceptance.
      </Property>
    </Properties>

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="POST" label="/v1/members/invites">

    ```fish {{ title: 'cURL' }}
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

    </CodeGroup>

    ```json {{ title: 'Response', statusCode: '201' }}
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

  </Col>
</Row>

---

## List Invites {{ tag: 'GET', label: '/v1/members/invites' }}

<Row>
  <Col>

    Retrieve all pending (valid, non-expired) invites for the organisation, ordered by most recent first.

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="GET" label="/v1/members/invites">

    ```fish {{ title: 'cURL' }}
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

    </CodeGroup>

    ```json {{ title: 'Response' }}
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

  </Col>
</Row>

---

## Cancel Invite {{ tag: 'DELETE', label: '/v1/members/invites/:id' }}

<Row>
  <Col>

    Cancel a pending invite. The invite is immediately invalidated and the invitee can no longer use the invite link to join the organisation.

    ### URL parameters

    <Properties>
      <Property name="id" type="string">
        The unique identifier of the invite.
      </Property>
    </Properties>

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="DELETE" label="/v1/members/invites/:id">

    ```fish {{ title: 'cURL' }}
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

    </CodeGroup>

    ```text {{ title: 'Response' }}
    204 No Content
    ```

  </Col>
</Row>
