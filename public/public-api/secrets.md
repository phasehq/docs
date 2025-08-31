import { Tag } from '@/components/Tag'

export const metadata = {
  title: 'Secrets API',
  description:
    'Explore the Phase Secrets API.',
}


<Tag variant="small">API</Tag>

# Secrets 

Secrets are key/value pairs used to store application secrets or environment variables for your applications. Secrets in Phase can additionally have tags and comments associated with them. On this page, we'll dive into the Secrets API and how you can use it to manage your application secrets programmatically. We'll look at how to query, create, update, and delete secrets. {{ className: 'lead' }}

<Note>
To use the Secrets API to manage secrets in an App, you must enable server-side encryption (SSE) from the [App settings page](/console/apps#settings). 
</Note>

## The Secret model

The secret model contains the basic key / value pairs that define your environment variable or application secret, as well as additional information such as tags, comments, personal overrides and metadata.

### Properties

<Properties>
  <Property name="id" type="string">
    Unique identifier for the secret.
  </Property>
  <Property name="environment" type="string">
    Unique identifier for the environment in which this secret exists.
  </Property>
  <Property name="key" type="string">
    The key of the secret, in plaintext.
  </Property>
  <Property name="value" type="string">
    The value of the secret, in plaintext.
  </Property>
  <Property name="comment" type="string">
    The comment for the secret, if provided.
  </Property>
  <Property name="tags" type="array">
    An array of tag names associated with the secret.
  </Property>
  <Property name="override" type="object">
    A personal secret override, if set by the authenticated user making the request. Overrides are only returned when authenticating via a Personal Access Token.
  </Property>
  <Property name="path" type="string">
    The absolute path for the secret.
  </Property>
  <Property name="version" type="number">
    The secret version.
  </Property>
  <Property name="keyDigest" type="string">
    The hash of the secret key.
  </Property>
  <Property name="createdAt" type="timestamp">
    Timestamp of when the secret was created.
  </Property>
  <Property name="updatedAt" type="timestamp">
    Timestamp of when the secret was last updated.
  </Property>
</Properties>

---

## Get Secrets {{ tag: 'GET', label: '/v1/secrets' }}

<Row>
  <Col>

    Retrieve all secrets in a given environment. You can optionally filter secrets by a specific path and / or secret key.

    ### Required parameters

    <Properties>
      <Property name="app_id" type="string">
        Unique identifier for the Phase App you wish to get secrets from.
      </Property>
      <Property name="env" type="string">
        The environment name, ex: `development`
      </Property>
    </Properties>
    
    ### Optional parameters

    <Properties>
      <Property name="path" type="string">
        Get secrets at a specific path.
      </Property>
      <Property name="key" type="string">
        The key of a specific secret to fetch.
      </Property>
      <Property name="tags" type="string">
        A comma separated list of tags (ex: `aws`, `aws,postgres`). Returns secrets that match ANY of the specified tags.
      </Property>
    </Properties>

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="GET" label="/v1/secrets">

    ```fish {{ title: 'cURL' }}
    curl -G https://api.phase.dev/v1/secrets/ \
      -H "Authorization: Bearer {token}" \
      -d app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552 \
      -d env=development \
      -d path=/backend \
      -d key=DEBUG \
      -d tags=aws,postgres
    ```

    ```js
    const url = new URL('https://api.phase.dev/v1/secrets/');
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const params = {
        app_id: '72b9ddd5-8fce-49ab-89d9-c431d53a9552',
        env: 'development',
        path: '/backend',
        key: 'DEBUG',
        tags: 'aws,postgres'
    };

    fetch(url + new URLSearchParams(params), {
        method: 'GET', 
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    ```

    ```python
    import requests

    url = 'https://api.phase.dev/v1/secrets/'
    params = {
        'app_id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552',
        'env': 'development',
        'path': '/backend',
        'key': 'DEBUG',
        'tags': 'aws,postgres'
    }
    headers = {
        'Authorization': f"Bearer {token}"  
    }

    response = requests.get(url, params=params, headers=headers)

    try:
        response.raise_for_status()
        data = response.json()
        print(data)
    except requests.exceptions.RequestException as e:
        print(f'Request failed: {e}')

    ```

    ```go
    package main

    import (
      "fmt"
      "net/http"
      "io/ioutil"
    )

    func main() {

      url := "https://api.phase.dev/v1/secrets/?env=development&path=%2Fbackend&key=DEBUG&app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&tags=aws,postgres"
      method := "GET"

      client := &http.Client {
      }
      req, err := http.NewRequest(method, url, nil)

      if err != nil {
        fmt.Println(err)
        return
      }
      req.Header.Add("Authorization", "Bearer {token}")

      res, err := client.Do(req)
      if err != nil {
        fmt.Println(err)
        return
      }
      defer res.Body.Close()

      body, err := ioutil.ReadAll(res.Body)
      if err != nil {
        fmt.Println(err)
        return
      }
      fmt.Println(string(body))
    }
    ```

    ```ruby
    require "uri"
    require "net/http"

    url = URI("https://api.phase.dev/v1/secrets/?env=development&path=/backend&key=DEBUG&app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&tags=aws,postgres")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Authorization"] = "Bearer {token}"

    response = https.request(request)
    puts response.read_body

    ```

    </CodeGroup>

    ```json {{ title: 'Response' }}
    [
        {
            "id": "36fc2244-47f5-4ff4-8b72-deed1bf876da",
            "key": "DEBUG",
            "value": "False",
            "comment": "Debug mode for the backend app",
            "tags": ["config"],
            "override": {
                "id": "904a64c7-95df-470f-aa58-6beaa55dea3c",
                "value": "True",
                "isActive": true,
                "createdAt": "2024-04-11T15:03:02.029689Z",
                "updatedAt": "2024-04-11T15:03:02.032630Z"
            },
            "path": "/backend",
            "keyDigest": "2bba3630bec4829f3f98b9fd7548e4f782df43a24ba5d94c2dd80e1fe618c65e",
            "version": 2,
            "createdAt": "2024-02-13T13:41:45.551255Z",
            "updatedAt": "2024-02-14T07:44:10.926591Z",
            "environment": "af6b7a8e-c268-48c2-967c-032e86e26110",
        }
    ]
    ```

  </Col>
</Row>

---

## Create Secrets {{ tag: 'POST', label: '/v1/secrets' }}

<Row>
  <Col>

    Create one or more secrets in a specific environment. You can optionally supply a path, comment and tags for the secret. 

    ### Required parameters

    <Properties>
      <Property name="app_id" type="string">
        Unique identifier for the Phase App.
      </Property>
      <Property name="env" type="string">
        The environment name, ex: `development`
      </Property>
    </Properties>

    ### JSON Body
    
    Secret data must be supplied in the JSON request body as an array in the `secrets` field. Each secret must have a key and value, and you can optionally add a comment, list of tags and a specified path.
    You can add multiple secrets in the `secrets` array to create multiple secrets in a single request.
    
    #### **Required fields**

    <Properties>
      <Property name="key" type="string">
        The secret key.
      </Property>
      <Property name="value" type="string">
        The secret value.
      </Property>
    </Properties>

    #### **Optional fields**

    <Properties>
      <Property name="comment" type="string">
        A comment to associate with the secret.
      </Property>
      <Property name="tags" type="array">
        A list of tags to associate with the secret. Tag names must be valid.
      </Property>
      <Property name="path" type="string">
        The path at which to create this secret. Defaults to `/` if not provided.
      </Property>
      <Property name="override" type="object">
        A personal secret override to be used in place of the default value. The override must be suppled with fields `value` and `isActive`
      </Property>
    </Properties>

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="POST" label="/v1/secrets">

    ```fish {{ title: 'cURL' }}
    curl --location 'https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development' \
    --header 'Authorization: Bearer {token}' \
    --header 'Content-Type: application/json' \
    --data '{
        "secrets": [
            {
                "key": "DB_NAME",
                "value": "postgres",
                "comment": "primary db name",
                "tags": ["db"],
                "path": "/backend",
                "override": {
                    "value": "postgres-dev",
                    "isActive": true
                }
            }
        ]
    }'
    ```

    ```js
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    const params = {
        'app_id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552',
        'env': 'development',
    }
    
    const raw = JSON.stringify({
    "secrets": [
        {
            "key": "DB_NAME",
            "value": "postgres",
            "comment": "primary db name",
            "tags": [
                "db"
            ],
            "path": "/backend",
            "override": {
                "value": "postgres-dev",
                "isActive": true
            }
        }
    ]
    });

    const requestOptions = {
    method: "POST",
    headers,
    body: raw,
    redirect: "follow"
    };

    fetch("https://api.phase.dev/v1/secrets/?" + new URLSearchParams(params), requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    ```

    ```python
    import requests
    import json

    url = "https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development"

    payload = json.dumps({
    "secrets": [
        {
            "key": "DB_NAME",
            "value": "postgres",
            "comment": "primary db name",
            "tags": [
                "db"
            ],
            "path": "/backend",
            "override": {
                "value": "postgres-dev",
                "isActive": true
            }
        }
    ]
    })
    headers = {
    'Authorization': f"Bearer {token} ",
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    ```

    ```go
    package main

    import (
      "fmt"
      "strings"
      "net/http"
      "io/ioutil"
    )

    func main() {

      url := "https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development"
      method := "POST"

      payload := strings.NewReader(`{
        "secrets": [
            {
                "key": "DB_NAME",
                "value": "postgres",
                "comment": "primary db name",
                "tags": [
                    "db"
                ],
                "path": "/backend",
                "override": {
                    "value": "postgres-dev",
                    "isActive": true
                }
            }
        ]
    }`)

      client := &http.Client {
      }
      req, err := http.NewRequest(method, url, payload)

      if err != nil {
        fmt.Println(err)
        return
      }
      req.Header.Add("Authorization", "Bearer {token}")
      req.Header.Add("Content-Type", "application/json")

      res, err := client.Do(req)
      if err != nil {
        fmt.Println(err)
        return
      }
      defer res.Body.Close()

      body, err := ioutil.ReadAll(res.Body)
      if err != nil {
        fmt.Println(err)
        return
      }
      fmt.Println(string(body))
    }
    ```

    ```ruby
    require "uri"
    require "json"
    require "net/http"

    url = URI("https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer {token}"
    request["Content-Type"] = "application/json"
    request.body = JSON.dump({
      "secrets": [
        {
          "key": "DB_NAME",
          "value": "postgres",
          "comment": "primary db name",
          "path": "/backend",
          "tags": [
              "db"
          ],
          "override": {
              "value": "postgres-dev",
              "isActive": true
          }
        }
      ]
    })

    response = https.request(request)
    puts response.read_body

    ```

    </CodeGroup>

    ```json {{ title: 'Response' }}
    [
        {
            "id": "36fc2244-47f5-4ff4-8b72-deed1bf876da",
            "key": "DB_NAME",
            "value": "postgres",
            "comment": "primary db name",
            "tags": ["db"],
            "path": "/backend",
            "override": {
                "id": "904a64c7-95df-470f-aa58-6beaa55dea3c",
                "value": "postgres-dev",
                "isActive": true,
                "createdAt": "2024-04-11T15:03:02.029689Z",
                "updatedAt": "2024-04-11T15:03:02.032630Z"
            },
            "keyDigest": "2bba3630bec4829f3f98b9fd7548e4f782df43a24ba5d94c2dd80e1fe618c65e",
            "version": 1,
            "createdAt": "2024-02-13T13:41:45.551255Z",
            "updatedAt": "2024-02-14T07:44:10.926591Z",
            "environment": "af6b7a8e-c268-48c2-967c-032e86e26110",
        }
    ]
    ```

  </Col>
</Row>

---

## Update Secrets {{ tag: 'PUT', label: '/v1/secrets' }}

<Row>
  <Col>

    Update one or more secrets in an environment.

    ### Required parameters

    <Properties>
      <Property name="app_id" type="string">
        Unique identifier for the Phase App.
      </Property>
      <Property name="env" type="string">
        The environment name, ex: `development`
      </Property>
    </Properties>

    ### JSON Body
    
    Secret data must be supplied in the JSON request body as an array in the `secrets` field. You must supply an `id` for each secret you want to update. Optionally you can supply the specific fields you wish to update for this secret.
    You can add multiple secrets in the `secrets` array to update multiple secrets in a single request.
    
    #### **Required fields**

    <Properties>
      <Property name="id" type="string">
        Unique identifier for the Secret.
      </Property>
    </Properties>

    #### **Optional fields**

    <Properties>
      <Property name="key" type="string">
        The secret key.
      </Property>
      <Property name="value" type="string">
        The secret value.
      </Property>
      <Property name="comment" type="string">
        A comment to associate with the secret.
      </Property>
      <Property name="tags" type="array">
        A list of tags to associate with the secret. Tag names must be valid. The supplied list will overwrite any existing tags.
      </Property>
      <Property name="path" type="string">
        The path for this secret.
      </Property>
      <Property name="override" type="object">
        A personal secret override to be used in place of the default value. The override must be suppled with fields `value` and `isActive`
      </Property>
    </Properties>

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="PUT" label="/v1/secrets">

    ```fish {{ title: 'cURL' }}
    curl --location --request PUT 'https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development' \
    --header 'Authorization: Bearer {token}' \
    --header 'Content-Type: application/json' \
    --data '{
        "secrets": [
            {
                "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
                "key": "DB_NAME_POSTGRES",
                "value": "postgres-primary",
                "comment": "primary db name",
                "path": "/backend/db",
                "override": {
                    "value": "postgres-dev",
                    "isActive": true
                }
            }
        ]
    }'
    ```

    ```js
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    const params = {
        'app_id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552',
        'env': 'development',
    }
    
    const raw = JSON.stringify({
    "secrets": [
        {
            "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
            "key": "DB_NAME_POSTGRES",
            "value": "postgres-primary",
            "comment": "primary db name",
            "path": "/backend/db",
            "override": {
                "value": "postgres-dev",
                "isActive": true
            }
        }
    ]
    });

    const requestOptions = {
        method: "PUT",
        headers,
        body: raw,
        redirect: "follow"
    };

    fetch("https://api.phase.dev/v1/secrets/?" + new URLSearchParams(params), requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    ```

    ```python
    import requests
    import json

    url = "https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development"

    payload = json.dumps({
    "secrets": [
        {
            "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
            "key": "DB_NAME_POSTGRES",
            "value": "postgres-primary",
            "comment": "primary db name",
            "path": "/backend/db",
            "override": {
                "value": "postgres-dev",
                "isActive": true
            }
        }
    ]
    })
    headers = {
    'Authorization': f"Bearer {token} ",
    'Content-Type': 'application/json'
    }

    response = requests.request("PUT", url, headers=headers, data=payload)
    ```

    ```go
    package main

    import (
      "fmt"
      "strings"
      "net/http"
      "io/ioutil"
    )

    func main() {

      url := "https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development"
      method := "PUT"

      payload := strings.NewReader(`{
        "secrets": [
            {
                "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
                "key": "DB_NAME_POSTGRES",
                "value": "postgres-primary",
                "comment": "primary db name",
                "path": "/backend/db",
                "override": {
                    "value": "postgres-dev",
                    "isActive": true
                }
            }
        ]
    }`)

      client := &http.Client {
      }
      req, err := http.NewRequest(method, url, payload)

      if err != nil {
        fmt.Println(err)
        return
      }
      req.Header.Add("Authorization", "Bearer {token}")
      req.Header.Add("Content-Type", "application/json")

      res, err := client.Do(req)
      if err != nil {
        fmt.Println(err)
        return
      }
      defer res.Body.Close()

      body, err := ioutil.ReadAll(res.Body)
      if err != nil {
        fmt.Println(err)
        return
      }
      fmt.Println(string(body))
    }
    ```

    ```ruby
    require "uri"
    require "json"
    require "net/http"

    url = URI("https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Put.new(url)
    request["Authorization"] = "Bearer {token}"
    request["Content-Type"] = "application/json"
    request.body = JSON.dump({
      "secrets": [
        {
          "id": "f8621d1a-6903-4b60-8e8d-2085a2475871",
          "key": "DB_NAME_POSTGRES",
          "value": "postgres-primary",
          "comment": "primary db name",
          "path": "/backend/db",
          "override": {
              "value": "postgres-dev",
              "isActive": true
          }
        }
      ]
    })

    response = https.request(request)
    puts response.read_body

    ```

    </CodeGroup>

    ```json {{ title: 'Response' }}
    [
        {
            "id": "36fc2244-47f5-4ff4-8b72-deed1bf876da",
            "key": "DB_NAME_POSTGRES",
            "value": "postgres-primary",
            "comment": "primary db name",
            "tags": ["db"],
            "path": "/backend/db",
            "override": {
                "id": "904a64c7-95df-470f-aa58-6beaa55dea3c",
                "value": "postgres-dev",
                "isActive": true,
                "createdAt": "2024-04-11T15:03:02.029689Z",
                "updatedAt": "2024-04-11T15:05:026.032630Z"
            },
            "keyDigest": "2bba3630bec4829f3f98b9fd7548e4f782df43a24ba5d94c2dd80e1fe618c65e",
            "version": 2,
            "createdAt": "2024-02-13T13:41:45.551255Z",
            "updatedAt": "2024-02-14T07:44:10.926591Z",
            "environment": "af6b7a8e-c268-48c2-967c-032e86e26110",
        }
    ]
    ```

  </Col>
</Row>

---

## Delete Secrets {{ tag: 'DELETE', label: '/v1/secrets' }}

<Row>
  <Col>

    Delete one or more secrets from an environment.

    ### Required parameters
    
    <Properties>
      <Property name="app_id" type="string">
        Unique identifier for the Phase App you wish to delete secrets from.
      </Property>
      <Property name="env" type="string">
        The environment name, ex: `development`
      </Property>
    </Properties>

    ### JSON Body
    
    Data must be supplied in the JSON request body as an array in the `secrets` field. You must supply an `id` for each secret you want to delete.
    
    #### **Required fields**

    <Properties>
      <Property name="id" type="string">
        Unique identifier for the secret.
      </Property>
    </Properties>

  </Col>
  <Col sticky>

    <CodeGroup title="Request" tag="DELETE" label="/v1/secrets">

    ```fish {{ title: 'cURL' }}
    curl --location --request DELETE 'https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development' \
    --header 'Authorization: Bearer {token}' \
    --header 'Content-Type: application/json' \
    --data '{
        "secrets": ["fad9b534-792a-425b-bfa6-00c26a60f36d"]
    }'
    ```

    ```js
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    const params = {
        'app_id': '72b9ddd5-8fce-49ab-89d9-c431d53a9552',
        'env': 'development',
    }
    
    const raw = JSON.stringify({
        "secrets": ["f8621d1a-6903-4b60-8e8d-2085a2475871"]
    });

    const requestOptions = {
        method: "DELETE",
        headers,
        body: raw,
        redirect: "follow"
    };

    fetch("https://api.phase.dev/v1/secrets/?" + new URLSearchParams(params), requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    ```

    ```python
    import requests
    import json

    url = "https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development"

    payload = json.dumps({
    "secrets": ["f8621d1a-6903-4b60-8e8d-2085a2475871"]
    })
    headers = {
    'Authorization': f"Bearer {token}",
    'Content-Type': 'application/json'
    }

    response = requests.request("DELETE", url, headers=headers, data=payload)
    ```

    ```go
    package main

    import (
      "fmt"
      "strings"
      "net/http"
      "io/ioutil"
    )

    func main() {

      url := "https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development"
      method := "DELETE"

      payload := strings.NewReader(`{
        "secrets": ["fad9b534-792a-425b-bfa6-00c26a60f36d"]
    }`)

      client := &http.Client {
      }
      req, err := http.NewRequest(method, url, payload)

      if err != nil {
        fmt.Println(err)
        return
      }
      req.Header.Add("Authorization", "Bearer {token}")
      req.Header.Add("Content-Type", "application/json")

      res, err := client.Do(req)
      if err != nil {
        fmt.Println(err)
        return
      }
      defer res.Body.Close()

      body, err := ioutil.ReadAll(res.Body)
      if err != nil {
        fmt.Println(err)
        return
      }
      fmt.Println(string(body))
    }
    ```

    ```ruby
    require "uri"
    require "json"
    require "net/http"

    url = URI("https://api.phase.dev/v1/secrets/?app_id=72b9ddd5-8fce-49ab-89d9-c431d53a9552&env=development")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Delete.new(url)
    request["Authorization"] = "Bearer {token}"
    request["Content-Type"] = "application/json"
    request.body = JSON.dump({
      "secrets": [
        "fad9b534-792a-425b-bfa6-00c26a60f36d"
      ]
    })

    response = https.request(request)
    puts response.read_body

    ```
    </CodeGroup>

    ```json {{ title: 'Response' }}
    {
        "message": "Deleted 1 secret"
    }
    ```

  </Col>
</Row>
