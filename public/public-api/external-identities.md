---
title: "External Identities"
description: "Authenticate with Phase using external identity providers (AWS IAM, Azure)."
url: https://docs.phase.dev/public-api/external-identities
---

# External Identities

Authenticate to Phase using external identity providers. Each provider returns a Phase authentication token scoped to the specified Service Account, with an optional TTL.

---

## AWS IAM

### Authenticate with AWS IAM

    Exchange an AWS STS SigV4-signed GetCallerIdentity request for a Phase token.

    ### JSON Body

    Supply the Service Account to authenticate and the signed AWS request data.

    #### **Required fields**

      - `account.id` (string): Service Account ID (UUID) to authenticate.
      - `awsIam.httpRequestUrl` (string): Base64-encoded signed request URL (from SigV4 prepared request).
      - `awsIam.httpRequestHeaders` (string): Base64-encoded JSON of signed request headers.
      - `awsIam.httpRequestBody` (string): Base64-encoded request body used to sign the GetCallerIdentity call.

    #### **Optional fields**

      - `account.type` (string): Defaults to `service`. Only `service` is supported currently.
      - `awsIam.httpRequestMethod` (string): HTTP method used when signing. Defaults to `POST`.
      - `tokenRequest.ttl` (number): Requested token TTL in seconds. If omitted, the default identity TTL is used.

> **Note:** To create the signed values, sign an AWS STS `GetCallerIdentity` request with SigV4 for your region/endpoint. Use the STS Query API body `Action=GetCallerIdentity&Version=2011-06-15` and header `Content-Type: application/x-www-form-urlencoded; charset=utf-8`. Then Base64-encode the prepared URL, headers (as JSON), and body.

**Request**

    **JSON body**

    ```json
    {
      "account": {
        "type": "service",
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "awsIam": {
        "httpRequestMethod": "POST",
        "httpRequestUrl": "<base64>",
        "httpRequestHeaders": "<base64>",
        "httpRequestBody": "<base64>"
      },
      "tokenRequest": {
        "ttl": 3600
      }
    }
    ```

    ```js
    import { SignatureV4 } from '@aws-sdk/signature-v4'
    import { defaultProvider } from '@aws-sdk/credential-provider-node'
    import { Sha256 } from '@aws-crypto/sha256-js'
    import { HttpRequest } from '@aws-sdk/protocol-http'

    const HOST = 'https://api.phase.dev'
    const SERVICE_ACCOUNT_ID = '00000000-0000-0000-0000-000000000000'

    ;(async () => {
      const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1'
      const body = 'Action=GetCallerIdentity&Version=2011-06-15'

      const req = new HttpRequest({
        method: 'POST',
        protocol: 'https:',
        hostname: `sts.${region}.amazonaws.com`,
        path: '/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
        body,
      })

      const signer = new SignatureV4({ service: 'sts', region, credentials: defaultProvider(), sha256: Sha256 })
      const signed = await signer.sign(req)

      const awsIam = {
        httpRequestMethod: 'POST',
        httpRequestUrl: Buffer.from(`https://sts.${region}.amazonaws.com/`).toString('base64'),
        httpRequestHeaders: Buffer.from(JSON.stringify(signed.headers)).toString('base64'),
        httpRequestBody: Buffer.from(body).toString('base64'),
      }

      const payload = { account: { type: 'service', id: SERVICE_ACCOUNT_ID }, awsIam }

      const res = await fetch(`${HOST}/identities/external/v1/aws/iam/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      console.log(await res.json())
    })()
    ```

    ```python
    import base64, json, os
    import requests
    from botocore.session import Session
    from botocore.awsrequest import AWSRequest
    from botocore.auth import SigV4Auth

    HOST = "https://api.phase.dev"
    SERVICE_ACCOUNT_ID = "00000000-0000-0000-0000-000000000000"

    s = Session()
    region = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION") or s.get_config_variable("region") or "us-east-1"
    body = "Action=GetCallerIdentity&Version=2011-06-15"
    req = AWSRequest(method="POST", url=f"https://sts.{region}.amazonaws.com/", data=body, headers={"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"})
    creds = s.get_credentials()
    if not creds:
      raise SystemExit("Missing AWS credentials")
    SigV4Auth(creds, "sts", region).add_auth(req)
    p = req.prepare()
    payload = {
      "account": {"type": "service", "id": SERVICE_ACCOUNT_ID},
      "awsIam": {
        "httpRequestMethod": "POST",
        "httpRequestUrl": base64.b64encode(p.url.encode()).decode(),
        "httpRequestHeaders": base64.b64encode(json.dumps(dict(p.headers)).encode()).decode(),
        "httpRequestBody": base64.b64encode(body.encode()).decode()
      }
    }
    r = requests.post(f"{HOST}/identities/external/v1/aws/iam/auth/", json=payload, headers={"Content-Type": "application/json"}, timeout=30)
    r.raise_for_status()
    print(r.json())
    ```

    ```go
    package main

    import (
      "bytes"
      "encoding/base64"
      "encoding/json"
      "fmt"
      "io"
      "net/http"
      "os"
      "time"

      "github.com/aws/aws-sdk-go/aws"
      "github.com/aws/aws-sdk-go/aws/session"
      v4 "github.com/aws/aws-sdk-go/aws/signer/v4"
    )

    func main() {
      host := "https://api.phase.dev"
      serviceAccount := "00000000-0000-0000-0000-000000000000"

      sess := session.Must(session.NewSession())
      region := aws.StringValue(sess.Config.Region)
      if region == "" {
        region = os.Getenv("AWS_REGION")
        if region == "" {
          region = os.Getenv("AWS_DEFAULT_REGION")
          if region == "" {
            region = "us-east-1"
          }
        }
      }

      body := "Action=GetCallerIdentity&Version=2011-06-15"
      stsURL := fmt.Sprintf("https://sts.%s.amazonaws.com/", region)

      req, _ := http.NewRequest("POST", stsURL, bytes.NewReader([]byte(body)))
      req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")

      signer := v4.NewSigner(sess.Config.Credentials)
      if _, err := signer.Sign(req, bytes.NewReader([]byte(body)), "sts", region, time.Now()); err != nil {
        panic(err)
      }

      headersJSON, _ := json.Marshal(req.Header)
      payload := map[string]any{
        "account": map[string]string{"type": "service", "id": serviceAccount},
        "awsIam": map[string]string{
          "httpRequestMethod":  "POST",
          "httpRequestUrl":     base64.StdEncoding.EncodeToString([]byte(stsURL)),
          "httpRequestHeaders": base64.StdEncoding.EncodeToString(headersJSON),
          "httpRequestBody":    base64.StdEncoding.EncodeToString([]byte(body)),
        },
      }

      b, _ := json.Marshal(payload)
      res, err := http.Post(host+"/identities/external/v1/aws/iam/auth/", "application/json", bytes.NewReader(b))
      if err != nil { panic(err) }
      defer res.Body.Close()
      io.Copy(os.Stdout, res.Body)
    }
    ```

    ```ruby
    require 'base64'
    require 'json'
    require 'net/http'
    require 'uri'
    require 'aws-sigv4'

    HOST = 'https://api.phase.dev'
    SERVICE_ACCOUNT_ID = '00000000-0000-0000-0000-000000000000'

    region = ENV['AWS_REGION'] || ENV['AWS_DEFAULT_REGION'] || 'us-east-1'
    body = 'Action=GetCallerIdentity&Version=2011-06-15'
    sts_url = "https://sts.#{region}.amazonaws.com/"

    signer = Aws::Sigv4::Signer.new(service: 'sts', region: region)
    signed = signer.sign_request(
      http_method: 'POST',
      url: sts_url,
      headers: { 'content-type' => 'application/x-www-form-urlencoded; charset=utf-8' },
      body: body
    )

    aws_iam = {
      httpRequestMethod: 'POST',
      httpRequestUrl: Base64.strict_encode64(sts_url),
      httpRequestHeaders: Base64.strict_encode64(signed.headers.to_json),
      httpRequestBody: Base64.strict_encode64(body)
    }

    payload = { account: { type: 'service', id: SERVICE_ACCOUNT_ID }, awsIam: aws_iam }

    uri = URI("#{HOST}/identities/external/v1/aws/iam/auth/")
    req = Net::HTTP::Post.new(uri)
    req['Content-Type'] = 'application/json'
    req.body = payload.to_json

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    res = http.request(req)
    puts res.body
    ```

    **Response**

    ```json
    {
      "authentication": {
        "tokenType": "ServiceAccount",
        "token": "pss_service:v2:...",
        "bearerToken": "ServiceAccount baca69c634d84e5d3d04d31a487eb1c4c5f2a3ef2a6683f77cf965d3ad7633d3",
        "TTL": 3600,
        "maxTTL": 86400
      }
    }
    ```

---

## Notes on signing the AWS request

    Use AWS SigV4 to sign an STS `GetCallerIdentity` request.

      - `Endpoint` (string): Prefer the regional STS endpoint for your configured AWS region (e.g. `https://sts.eu-central-1.amazonaws.com`). If no region is found, you may use the legacy global endpoint.
      - `Method` (string): `POST` (default) or `GET`. The same method must be used in signing and in `awsIam.httpRequestMethod`.
      - `Body` (string): STS Query API payload: `Action=GetCallerIdentity&Version=2011-06-15`.
      - `Headers` (object): Must include `Content-Type: application/x-www-form-urlencoded; charset=utf-8` and SigV4 headers (e.g. `X-Amz-Date`, `Authorization`).

    Base64-encode the prepared URL, headers (as JSON), and body before submitting to Phase.

---

## Azure

### Authenticate with Azure

    Exchange an Azure AD JWT for a Phase token. The JWT is validated statelessly using Azure AD's public OIDC signing keys — no Azure credentials are stored on the Phase backend.

    ### JSON Body

    Supply the Service Account to authenticate and the base64-encoded Azure AD JWT.

    #### **Required fields**

      - `account.id` (string): Service Account ID (UUID) to authenticate.
      - `azureEntra.jwt` (string): Base64-encoded Azure AD JWT access token.

    #### **Optional fields**

      - `account.type` (string): Defaults to `service`. Only `service` is supported currently.
      - `tokenRequest.ttl` (number): Requested token TTL in seconds. If omitted, the default identity TTL is used.

> **Note:** The JWT must be obtained from Azure AD with a `resource` / `audience` that matches the value configured on the Phase identity (default: `https://management.azure.com/`). The `oid` claim in the JWT (the service principal's object ID) must be in the identity's allowed service principal IDs list.

**Request**

    **JSON body**

    ```json
    {
      "account": {
        "type": "service",
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "azureEntra": {
        "jwt": "<base64-encoded-jwt>"
      },
      "tokenRequest": {
        "ttl": 3600
      }
    }
    ```

    ```js
    import { DefaultAzureCredential } from '@azure/identity'

    const HOST = 'https://api.phase.dev'
    const SERVICE_ACCOUNT_ID = '00000000-0000-0000-0000-000000000000'
    const RESOURCE = 'https://management.azure.com/'

    ;(async () => {
      const credential = new DefaultAzureCredential()
      const token = await credential.getToken(RESOURCE + '.default')
      const encodedJWT = Buffer.from(token.token).toString('base64')

      const payload = {
        account: { type: 'service', id: SERVICE_ACCOUNT_ID },
        azureEntra: { jwt: encodedJWT },
      }

      const res = await fetch(`${HOST}/service/public/identities/external/v1/azure/entra/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      console.log(await res.json())
    })()
    ```

    ```python
    import base64, json
    import requests
    from azure.identity import DefaultAzureCredential

    HOST = "https://api.phase.dev"
    SERVICE_ACCOUNT_ID = "00000000-0000-0000-0000-000000000000"
    RESOURCE = "https://management.azure.com/"

    credential = DefaultAzureCredential()
    token = credential.get_token(RESOURCE + ".default")
    encoded_jwt = base64.b64encode(token.token.encode()).decode()

    payload = {
        "account": {"type": "service", "id": SERVICE_ACCOUNT_ID},
        "azureEntra": {"jwt": encoded_jwt},
    }

    r = requests.post(
        f"{HOST}/service/public/identities/external/v1/azure/entra/auth/",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    r.raise_for_status()
    print(r.json())
    ```

    ```go
    package main

    import (
      "bytes"
      "encoding/base64"
      "encoding/json"
      "fmt"
      "io"
      "net/http"
      "os"
      "context"

      "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
      "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )

    func main() {
      host := "https://api.phase.dev"
      serviceAccount := "00000000-0000-0000-0000-000000000000"
      resource := "https://management.azure.com/"

      cred, err := azidentity.NewDefaultAzureCredential(nil)
      if err != nil { panic(err) }

      token, err := cred.GetToken(context.Background(), policy.TokenRequestOptions{
        Scopes: []string{resource + ".default"},
      })
      if err != nil { panic(err) }

      encodedJWT := base64.StdEncoding.EncodeToString([]byte(token.Token))

      payload := map[string]any{
        "account":    map[string]string{"type": "service", "id": serviceAccount},
        "azureEntra": map[string]string{"jwt": encodedJWT},
      }

      b, _ := json.Marshal(payload)
      res, err := http.Post(host+"/service/public/identities/external/v1/azure/entra/auth/", "application/json", bytes.NewReader(b))
      if err != nil { panic(err) }
      defer res.Body.Close()
      io.Copy(os.Stdout, res.Body)
    }
    ```

    **curl**

    ```bash
    # Get token via Azure CLI (as logged-in user or service principal)
    TOKEN=$(az account get-access-token \
      --resource https://management.azure.com/ \
      --query accessToken -o tsv)
    ENCODED=$(echo -n "$TOKEN" | base64)

    curl -X POST https://api.phase.dev/service/public/identities/external/v1/azure/entra/auth/ \
      -H "Content-Type: application/json" \
      -d "{
        \"account\": {\"type\": \"service\", \"id\": \"00000000-0000-0000-0000-000000000000\"},
        \"azureEntra\": {\"jwt\": \"$ENCODED\"},
        \"tokenRequest\": {\"ttl\": 3600}
      }"
    ```

    **Response**

    ```json
    {
      "authentication": {
        "tokenType": "ServiceAccount",
        "token": "pss_service:v2:...",
        "bearerToken": "ServiceAccount baca69c634d84e5d3d04d31a487eb1c4c5f2a3ef2a6683f77cf965d3ad7633d3",
        "TTL": 3600,
        "maxTTL": 86400
      }
    }
    ```

---

## Notes on Azure JWT tokens

    Azure AD issues two token versions. The version is determined by the `accessTokenAcceptedVersion` on the **resource** app registration, not the client.

      - `v1.0 tokens (default)` (string): Used for `https://management.azure.com/`. Issuer: `https://sts.windows.net/{'{'}tenantId{'}'}/`. Audience: resource URI string.
      - `v2.0 tokens` (string): Used for custom app registrations with `accessTokenAcceptedVersion: 2`. Issuer: `https://login.microsoftonline.com/{'{'}tenantId{'}'}/v2.0`. Audience: client ID GUID.
      - `Credential sources` (string): `DefaultAzureCredential` tries (in order): environment variables (Service Principal), Workload Identity (Kubernetes), Managed Identity (IMDS), Azure CLI, Azure Developer CLI.

    Phase automatically detects the token version and validates accordingly. No configuration is needed.
