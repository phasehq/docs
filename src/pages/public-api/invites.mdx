import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const metadata = {
  title: 'Invites API',
  description:
    'Explore the Phase Invites API for listing and cancelling pending organisation member invitations.',
}

<Tag variant="small">API</Tag>

# Invites

Invites are pending membership requests sent to an email address. When an invite is accepted through the Phase console, the recipient becomes an organisation member with the assigned role. On this page, we'll look at the API endpoints for listing and cancelling pending invites. {{ className: 'lead' }}

<Note>
To **send** an invite, use the [Members API](/public-api/members#invite-member) (`POST /v1/members/`).
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

## List Invites {{ tag: 'GET', label: '/v1/invites' }}

<Row>
  <Col>

    Retrieve all pending (valid, non-expired) invites for the organisation, ordered by most recent first.

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="GET" label="/v1/invites">

    ```fish {{ title: 'cURL' }}
    curl https://api.phase.dev/v1/invites/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/invites/'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)
    data = response.json()
    ```

    </CodeGroup>

    ```json {{ title: 'Response' }}
    [
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
    ```

  </Col>
</Row>

---

## Cancel Invite {{ tag: 'DELETE', label: '/v1/invites/:id' }}

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

    <CodeGroup title="Request" tag="DELETE" label="/v1/invites/:id">

    ```fish {{ title: 'cURL' }}
    curl -X DELETE https://api.phase.dev/v1/invites/a1b2c3d4-e5f6-7890-abcd-ef1234567890/ \
      -H "Authorization: Bearer {token}"
    ```

    ```python
    import requests

    invite_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    url = f'https://api.phase.dev/v1/invites/{invite_id}/'
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
