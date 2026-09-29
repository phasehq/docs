import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const metadata = {
  title: 'API Errors',
  description:
    'In this guide, we will talk about what happens when something goes wrong while you work with the API.',
}

<Tag variant="small">API</Tag>

# Errors

The Phase API will return appropriate status codes and error messages when something goes wrong or a request cannot be processed. Let's look at some status codes and error messages you might encounter. {{ className: 'lead' }}

You can tell if your request was successful by checking the status code when receiving an API response. If a response comes back unsuccessful, you can use the status code and error message to figure out what has gone wrong and do some rudimentary debugging.

<DocActions /> 

---

## Status codes

Here is a list of the different categories of status codes returned by the Protocol API. Use these to understand if a request was successful.

<Properties>
  <Property name="200">
    A 200 status code indicates a successful response.
  </Property>
  <Property name="201">
    A 201 status code indicates that a new resource was created successfully. Returned by the management POST endpoints (apps, environments, service accounts, tokens, invites, roles, teams); `POST /v1/secrets` returns `200` with the created secrets.
  </Property>
  <Property name="204">
    A 204 status code indicates that the request succeeded with no response body. Returned by the management DELETE endpoints; `DELETE /v1/secrets` and lease revocation return `200` with a JSON message.
  </Property>
  <Property name="400">
    A 400 status code indicates a bad request. This is typically due to missing required fields, invalid input types, values exceeding length limits, or invalid email formats.
  </Property>
  <Property name="401">
    A 401 status code indicates that no authentication credentials were provided, the token has expired or been deleted, or a service account token does not have access to the requested App or Environment (`Service account cannot access this environment`).
  </Property>
  <Property name="403">
    A 403 status code indicates an authorization error: the token's role lacks the permission, a network access policy or plan restriction applies, or a Personal Access Token does not have access to the requested App or Environment. Check your [authentication](/public-api#authentication) credentials if you see this error.

    This error may also occur due to a [Network Access Policy](/access-control/network#network-access-policies) that restricts access from your IP address. 
    [Read more](https://docs.phase.dev/access-control/network#access-denied-exceptions) about Network Access Policy exceptions.

    When a role holds permissions that the caller's own role does not have, a create or assign request returns this error. Assignment covers members, invites, service accounts, and team role overrides. A request that updates a role returns this error only when the update adds such a permission.
  </Property>
  <Property name="404">
    A 404 status code indicates that the requested resource does not exist, has been deleted, or belongs to a different organisation. The API does not distinguish between these cases to avoid leaking cross-organisation information.
  </Property>
  <Property name="405">
    A 405 status code indicates that the HTTP method is not supported by the endpoint. The Phase API supports `GET`, `POST`, `PUT`, and `DELETE` only — `PATCH` is not supported on any endpoint.
  </Property>
  <Property name="409">
    A 409 status code indicates that the requested operation would conflict with the current state of the resource. Examples: attempting to set a secret `key` at a path where it already exists; inviting an email that already has a pending invite; deleting a role that has members or service accounts assigned to it.
  </Property>
  <Property name="429">
    A 429 status code indicates that you have exceeded the rate limit for your plan. The `retry-after` response header indicates how long to wait before retrying. See [rate limits](/public-api#rate-limits) for per-plan thresholds.
  </Property>
  <Property name="5xx">
    A 5xx status code indicates a server error — something went wrong with the Phase API.
  </Property>
</Properties>

---

## Error types

<Row>
  <Col>

    Whenever a request is unsuccessful, the Phase API will return an error response with a message. You can use this information to understand better what has gone wrong and how to fix it.

  </Col>
  <Col>

    ```bash {{ title: "Error response" }}
    {
      "error": "Duplicate secret found",
    }
    ```

  </Col>
</Row>
