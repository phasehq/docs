import { Tag } from '@/components/Tag'

export const description =
  'SDK to integrate Phase secret management in Python applications.'

export const sections = [
  { title: 'Install', id: 'install-the-sdk' },
  { title: 'Import', id: 'import-the-sdk' },
  { title: 'Initialize', id: 'initialize-the-sdk' },
  { title: 'Usage', id: 'usage' },
]

<Tag variant="small">SDK</Tag>

# Python SDK

The Python SDK allows you to securely manage secrets in your applications, from simple scripts to complex server-side systems.

- [phase-dev](https://pypi.org/project/phase-dev/) on PyPI
- [github.com/phasehq/python-sdk](https://github.com/phasehq/python-sdk)

<Note>
  To use the Python SDK, you need to create a new App on the Phase Console. Add the service token or user token (PAT) to your application, preferably using environment variables. [Quick start &raquo;](/quickstart)
</Note>

---

## Install the SDK

The Python SDK is distributed via [PyPI](https://pypi.org/project/phase-dev/). You can install it using the following command:

<CodeGroup title="Install">
  ```fish {{ title: 'pip' }}
  pip install phase-dev
  ```
</CodeGroup>

---

## Import the SDK

Once installed, you can import the necessary components from the Python SDK into your project:

```python
from phase import Phase, CreateSecretsOptions, GetAllSecretsOptions, GetSecretOptions, UpdateSecretOptions, DeleteSecretOptions
```

---

## Initialize the SDK

Initialize the SDK with your Phase service token or user token and the host URL:

```python
phase = Phase(
    init=False,
    host='https://console.phase.dev',
    pss=PHASE_SERVICE_TOKEN

)
```

<Note>
  If you are self-hosting Phase, make sure to use the correct host URL for your Phase instance.
</Note>

---

## Usage

### Create Secrets

Create one or more secrets in a specified application and environment:

```python
create_options = CreateSecretsOptions(
    env_name="Development",
    app_name="Your App Name",
    key_value_pairs=[
        {"API_KEY": "your-api-key"},
        {"DB_PASSWORD": "your-db-password"}
    ],
    secret_path="/api"
)
result = phase.create_secrets(create_options)
print(f"Create secrets result: {result}")
```

### Get Secrets

Fetch all secrets from a specified application and environment:

```python
get_options = GetAllSecretsOptions(
    env_name="Development",
    app_name="Your App Name",
    tag="api",  # Optional: filter by tag
    secret_path="/api"  # Optional: specify the path. Use a blank string e.g., "" to fetch all secrets in your environment across all paths
)
secrets = phase.get_all_secrets(get_options)
for secret in secrets:
    print(f"Key: {secret.key}, Value: {secret.value}")
```

To get a specific secret:

```python
get_options = GetSecretOptions(
    env_name="Development",
    app_name="Your App Name",
    key_to_find="API_KEY",
    secret_path="/api"
)
secret = phase.get_secret(get_options)
if secret:
    print(f"Key: {secret.key}, Value: {secret.value}")
```

### Update Secrets

Update an existing secret in a specified application and environment:

```python
update_options = UpdateSecretOptions(
    env_name="Development",
    app_name="Your App Name",
    key="API_KEY",
    value="new-api-key-value",
    secret_path="/api",
    destination_path="/new-api",  # Optional: move secret to a new path
    override=False,  # Optional: create a personal override
    toggle_override=False  # Optional: toggle personal override
)
result = phase.update_secret(update_options)
print(f"Update result: {result}")
```

### Delete Secrets

Delete a secret from a specified application and environment:

```python
delete_options = DeleteSecretOptions(
    env_name="Development",
    app_name="Your App Name",
    key_to_delete="API_KEY",
    secret_path="/api"
)
result = phase.delete_secret(delete_options)
print(f"Delete result: {result}")
```

### Personal Secrets

<Note>
  Personal secrets are only accessible when using a user token (prefixed with `pss_user:v1`). They allow individual users to create and manage their own secret overrides without affecting the shared secrets.
</Note>

To work with personal secrets, first initialize the SDK with a user token:

```python
phase = Phase(
    init=False,
    host='https://console.phase.dev',
    pss=YOUR_PHASE_USER_TOKEN
)
```

Then, you can create and manage personal secret overrides:

```python
# Create a personal override
create_override = UpdateSecretOptions(
    env_name="Development",
    app_name="Your App Name",
    key="API_KEY",
    value="my-personal-api-key",
    secret_path="/api",
    override=True
)
result = phase.update_secret(create_override)
print(f"Create personal override result: {result}")

# Toggle a personal override
toggle_override = UpdateSecretOptions(
    env_name="Development",
    app_name="Your App Name",
    key="API_KEY",
    secret_path="/api",
    toggle_override=True
)
result = phase.update_secret(toggle_override)
print(f"Toggle personal override result: {result}")

# Get a secret (will return personal override if active)
get_options = GetSecretOptions(
    env_name="Development",
    app_name="Your App Name",
    key_to_find="API_KEY",
    secret_path="/api"
)
secret = phase.get_secret(get_options)
if secret:
    print(f"Key: {secret.key}, Value: {secret.value}, Overridden: {secret.overridden}")
```

When using a user token, `get_secret` and `get_all_secrets` will automatically return personal overrides if they exist and are active. The `overridden` attribute indicates whether the returned value is a personal override.

<Note>
  Remember to handle exceptions appropriately in your application. Wrap SDK calls in try-except blocks to handle potential errors.
</Note>
