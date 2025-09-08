import { Tag } from '@/components/Tag'

export const description =
  'SDK to integrate Phase in server-side applications running GoLang.'

export const sections = [
  { title: 'Install', id: 'install-the-sdk' },
  { title: 'Import', id: 'import-the-sdk' },
  { title: 'Initialize', id: 'initialize-the-sdk' },
  { title: 'Usage', id: 'usage' },
]

<Tag variant="small">RESOURCES</Tag>

# GoLang SDK

SDK to integrate Phase in server-side applications running GoLang.

- [github.com/phasehq/golang-sdk](https://github.com/phasehq/golang-sdk)

## Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an App
- Get a [`PHASE_SERVICE_TOKEN`](/access-control/authentication/tokens#creating-a-service-account-token)

---

### Install `libsodium` dependency

<Note>
  To utilize the GoLang SDK, ensure you have `libsodium` installed on your
  system as it's required for cryptographic operations.
</Note>

<CodeGroup>

```fish {{ title: 'macOS' }}
brew install libsodium
```

```fish {{ title: 'Fedora' }}
sudo dnf install libsodium-devel
```

```fish {{ title: 'Ubuntu and Debian' }}
sudo apt-get update && sudo apt-get install libsodium-dev
```

```fish {{ title: 'Arch Linux' }}
sudo pacman -Syu libsodium
```

```fish {{ title: 'Alpine Linux' }}
sudo apk add libsodium-dev
```

```fish {{ title: 'Windows - vcpkg' }}
vcpkg install libsodium
```

```fish {{ title: 'Windows - choco' }}
choco install libsodium
```

```plaintext {{ title: 'Windows (manual)' }}
Download pre-built binaries from the official libsodium GitHub releases page (https://github.com/jedisct1/libsodium/releases). Follow the included instructions to integrate `libsodium` with your development environment.
```

</CodeGroup>

---

## Install the SDK

Install the SDK using `go get`.

<CodeGroup title="Install">

    ```bash {{ title: 'Go Get' }}
    go get github.com/phasehq/golang-sdk/phase
    ```

</CodeGroup>

---

## Import the SDK

Import the SDK in your Go files to start using its features.

```go
import "github.com/phasehq/golang-sdk/phase"
```

---

## Initialize the SDK

Before interacting with the Phase service, initialize the SDK with your service token and the host information.

Parameters:

- `serviceToken` type `string`: Your Phase Service Token used to authenticate with the service and decrypt secrets
- `host` type `string`: The URL of the Phase Console instance
- `debug` type `bool`: Setting to true will result in a higher level of log verbosity useful when debugging

```go
package main

import (
    "log"
    "github.com/phasehq/golang-sdk/phase"
)

func main() {
    serviceToken := "pss_service:v1:....."
    host := "https://console.phase.dev" // Adjust this for a self-hosted instance of Phase
    debug := false // For logging verbosity, disable in production

    phaseClient := phase.Init(serviceToken, host, debug)
    if phaseClient == nil {
        log.Fatal("Failed to initialize Phase client")
    }
}
```

---

## Usage

<Note>
  Using the AppID ensures precise targeting of the intended application, especially in scenarios where multiple applications might share the same name.
</Note>

You can get the AppID by going to your application settings in the Phase Console, hovering over UUID under the App section and clicking the `Copy` button:

![hello world](/assets/images/console/settings/application-id.png)

### Creating a Secret

Define key-value pairs and specify the Environment, App name or ID, and path (optional) for each key to create new Secrets.

Options:

```go
type CreateSecretsOptions struct {
    KeyValuePairs []map[string]string
    EnvName       string
    AppName       string
    AppID         string
    SecretPath    map[string]string
}
```

```go
opts := phase.CreateSecretsOptions{
    KeyValuePairs: []map[string]string{
        {"API_KEY": "api_secret"},
    },
    EnvName:    "Production",
    AppName:    "MyApp", // Or use AppID: "app-id-here"
    SecretPath: map[string]string{"API_KEY": "/api/keys"}, // Optional, default path: /
}

err := phaseClient.Create(opts)
if err != nil {
    log.Fatalf("Failed to create secret: %v", err)
}
```

### Retrieving a Secret

To retrieve the value of a single Secret, provide the Environment name, App name or ID, Key, and optionally a tag and path.

Options:

```go
type GetSecretOptions struct {
    EnvName    string
    AppName    string
    AppID      string
    KeyToFind  string
    Tag        string
    SecretPath string
}
```

```go
getOpts := phase.GetSecretOptions{
    EnvName:   "Production",
    AppName:   "MyApp", // Or use AppID: "app-id-here"
    KeyToFind: "API_KEY",
}

secret, err := phaseClient.Get(getOpts)
if err != nil {
    log.Fatalf("Failed to get secret: %v", err)
} else {
    log.Printf("Secret: %+v", secret)
}
```

### Retrieving all Secrets

To retrieve all Secrets, provide the Environment name, App name or ID, and optionally a tag and path.

Options:

```go
type GetAllSecretsOptions struct {
    EnvName    string
    AppName    string
    AppID      string
    Tag        string
    SecretPath string
}
```

```go
getOpts := phase.GetAllSecretsOptions{
    EnvName:    "Production",
    AppName:    "MyApp", // Or use AppID: "app-id-here"
    Tag:        "",
    SecretPath: "",
}

secrets, err := phaseClient.GetAll(getOpts)
if err != nil {
    log.Fatalf("Failed to fetch all secrets: %v", err)
} else {
    log.Printf("Secrets: %+v", secrets)
}
```

### Updating a Secret

Provide the new value along with the environment name, application name or ID, key, and optionally the path to update an existing secret.

Options:

```go
type SecretUpdateOptions struct {
    EnvName    string
    AppName    string
    AppID      string
    Key        string
    Value      string
    SecretPath string
}
```

```go
updateOpts := phase.SecretUpdateOptions{
    EnvName:    "Production",
    AppName:    "MyApp", // Or use AppID: "app-id-here"
    Key:        "API_KEY",
    Value:      "my_updated_api_secret",
    SecretPath: "/api/keys", // Optional, default path: /
}

err := phaseClient.Update(updateOpts)
if err != nil {
    log.Fatalf("Failed to update secret: %v", err)
}
```

### Deleting a Secret

Specify the environment name, application name or ID, key to delete, and optionally the path to delete a secret.

Options:

```go
type DeleteSecretOptions struct {
    EnvName     string
    AppName     string
    AppID       string
    KeyToDelete string
    SecretPath  string
}
```

```go
deleteOpts := phase.DeleteSecretOptions{
    EnvName:     "Production",
    AppName:     "MyApp", // Or use AppID: "app-id-here"
    KeyToDelete: "API_KEY",
    SecretPath:  "/api/keys", // Optional, default path: /
}

err := phaseClient.Delete(deleteOpts)
if err != nil {
    log.Fatalf("Failed to delete secret: %v", err)
}
```
