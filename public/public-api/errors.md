---
title: "Errors"
description: "In this guide, we will talk about what happens when something goes wrong while you work with the API."
url: https://docs.phase.dev/public-api/errors
---

# Errors

The Phase API will return appropriate status codes and error messages when something goes wrong or a request cannot be processed. Let's look at some status codes and error messages you might encounter.

You can tell if your request was successful by checking the status code when receiving an API response. If a response comes back unsuccessful, you can use the status code and error message to figure out what has gone wrong and do some rudimentary debugging.

---

## Status codes

Here is a list of the different categories of status codes returned by the Protocol API. Use these to understand if a request was successful.

  - `200`: A 200 status code indicates a successful response.
  - `201`: A 201 status code indicates that a new resource was created successfully (returned by POST endpoints).
  - `204`: A 204 status code indicates that the request succeeded with no response body. Used for DELETE endpoints.
  - `400`: A 400 status code indicates a bad request. This is typically due to missing required fields, invalid input types, values exceeding length limits, or invalid email formats.
  - `401`: A 401 status code indicates that no authentication credentials were provided or the token has expired or been deleted.
  - `403`: A 403 status code indicates an authentication or access error. Check your [authentication](https://docs.phase.dev/public-api.md#authentication) credentials if you see this error, and make sure the token you're using has the appropriate scope for the App and Environment you're trying to access.

      This error may also occur due to a [Network Access Policy](https://docs.phase.dev/access-control/network.md#network-access-policies) that restricts access from your IP address.
      [Read more](https://docs.phase.dev/access-control/network#access-denied-exceptions) about Network Access Policy exceptions.

      When a role holds permissions that the caller's own role does not have, a create or assign request returns this error. Assignment covers members, invites, service accounts, and team role overrides. A request that updates a role returns this error only when the update adds such a permission.
  - `404`: A 404 status code indicates that the requested resource does not exist, has been deleted, or belongs to a different organisation. The API does not distinguish between these cases to avoid leaking cross-organisation information.
  - `405`: A 405 status code indicates that the HTTP method is not supported by the endpoint. The Phase API supports `GET`, `POST`, `PUT`, and `DELETE` only — `PATCH` is not supported on any endpoint.
  - `409`: A 409 status code indicates that the requested operation would conflict with the current state of the resource. Examples: attempting to set a secret `key` at a path where it already exists; inviting an email that already has a pending invite; deleting a role that has members or service accounts assigned to it.
  - `429`: A 429 status code indicates that you have exceeded the rate limit for your plan. The `retry-after` response header indicates how long to wait before retrying. See [rate limits](https://docs.phase.dev/public-api.md#rate-limits) for per-plan thresholds.
  - `5xx`: A 5xx status code indicates a server error — something went wrong with the Phase API.

---

## Error types

    Whenever a request is unsuccessful, the Phase API will return an error response with a message. You can use this information to understand better what has gone wrong and how to fix it.

    **Error response**

    ```bash
    {
      "error": "Duplicate secret found",
    }
    ```
