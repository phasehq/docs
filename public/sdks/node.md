import { Tag } from '@/components/Tag'

export const description =
  'SDK to integrate Phase in applications running Node.js.'

export const sections = [
  { title: 'Install', id: 'install-the-sdk' },
  { title: 'Import', id: 'import-the-sdk' },
  { title: 'Initialize', id: 'initialize-the-sdk' },
  { title: 'Usage', id: 'usage' },
  { title: 'Types', id: 'type-reference' }
]

<Tag variant="small">SDK</Tag>

# Node.js SDK

The Node.js SDK allows you to securely manage secrets in your applications, from simple scripts, to complex systems.

- [@phase.dev/phase-node](https://www.npmjs.com/package/@phase.dev/phase-node)
- [github.com/phasehq/node-sdk](https://github.com/phasehq/node-sdk)

<Note>
The secret management tools documented here are only available in SDK version `3.0.0` or higher. Please make sure to install the most recent version of the SDK, or upgrade if using an older version.
</Note>


To use the Node SDK, you need to create a new App on the Phase Console. Add the service account token or user token (PAT) to your application, preferably using environment variables. [Quick start &raquo;](/quickstart)

---

## Install the SDK

The Node.js SDK is distributed via [npm](https://www.npmjs.com/package/@phase.dev/phase-node). You can install it using the following command for your preferred package manager.

<CodeGroup title="Install">

    ```fish {{ title: 'npm' }}
    npm i @phase.dev/phase-node
    ```

    ```fish {{ title: 'yarn' }}
    yarn add @phase.dev/phase-node
    ```

    ```fish {{ title: 'pnpm' }}
    pnpm i @phase.dev/phase-node
    ```

</CodeGroup>

---

## Import the SDK

Once installed, you can import the Node.js SDK into your project.

```typescript
const Phase = require('@phase.dev/phase-node')
```

---

## Initialize the SDK

Initialize the SDK with your `token`

```typescript
const token = 'pss_service...' // or process.env.PHASE_TOKEN

const phase = new Phase(token)

await phase.init()
```

<Note>
If you are self-hosting Phase, you must also provide the protocol and host for your Phase instance:

```typescript
const token = 'pss_service...' // or process.env.PHASE_TOKEN
const host = 'https://console.phase.dev' // default

const phase = new Phase(token, host)

await phase.init()
```
</Note>

## Usage

### Get Secrets

You can get secrets by using the `get(options)` class method, where `options` are of type [GetSecretOptions](#get-secret-options). The method resolves with an array of [Secret](#secret) objects.

<Note>
The `override` field is only returned when using a Personal Access Token.
</Note>

Get all secrets in an environment:

```typescript
const getOptions: GetSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
};

const secrets = await phase.get(getOptions);
```
Get all secrets in an environment, at a specified path:

```typescript
const getOptions: GetSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  path: "/backend"
};

const secrets = await phase.get(getOptions);
```
Get all secrets in an environment that match specified tags:

```typescript
const getOptions: GetSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  tags: ['aws', 'db']
};

const secrets = await phase.get(getOptions);
```

Get a specific key:

```typescript
const getOptions: GetSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  key: "foo"
};

const secrets = await phase.get(getOptions);
```

### Create Secrets

Create one or more secrets in a specified application and environment using the `create(options)` method, where options are of type [CreateSecretOptions](#create-secret-options)

```typescript
import { CreateSecretOptions } from "@phase.dev/phase-node";

const createOptions: CreateSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  secrets: [
    {
      key: "API_KEY",
      value: "your-api-key",
      comment: 'test key for dev'
    },
    {
      key: "DB_PASSWORD",
      value: "your-db-password",
      path: "/database",
    }
  ]
};

await phase.create(createOptions);
console.log("Secrets created successfully");
```

### Update Secrets

Update existing secrets in a specified application and environment using the `update(options)` method, where options are of type [UpdateSecretOptions](#update-secret-options).

<Note>
The `override` field is only parsed when using a Personal Access Token.
</Note>

Update a secret value:

```typescript
import { UpdateSecretOptions } from "@phase.dev/phase-node";

const updateOptions: UpdateSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  secrets: [
    {
      id: "28f5d66e-b006-4d34-8e32-88e1d3478299",
      value: 'newvalue'
    },
  ],
};

await phase.update(updateOptions);
console.log("Secrets updated successfully");
```
Update a personal secret override:

```typescript
import { UpdateSecretOptions } from "@phase.dev/phase-node";

const updateOptions: UpdateSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  secrets: [
    {
      id: "28f5d66e-b006-4d34-8e32-88e1d3478299",
      override: {
        value: "OVERRIDE",
        isActive: true,
      },
    },
  ],
};

await phase.update(updateOptions);
console.log("Secrets updated successfully");
```

### Delete Secrets

Delete one or more secrets from a specified application and environment using the delete(options) method, where options are of type [DeleteSecretOptions](#delete-secret-options).

```typescript
import { DeleteSecretOptions } from "@phase.dev/phase-node";

const secretsToDelete = secrets.map((secret) => secret.id);

const deleteOptions: DeleteSecretOptions = {
  appId: "3b7443aa-3a7c-4791-849a-42aafc9cbe66",
  envName: "Development",
  secretIds: secretsToDelete,
};

await phase.delete(deleteOptions);
console.log("Secrets deleted successfully");
```


---

## Type Reference

### Secret

The `Secret` object represents a stored secret within a specified application and environment.

| Field       | Type                   | Description |
|------------|------------------------|-------------|
| `id`       | `string`                | UUID for the secret. |
| `key`      | `string`                | The secret key. |
| `value`    | `string`                | The secret value. |
| `comment`  | `string`                | Optional comment or description for the secret. |
| `environment` | `string`             | The UUID of the environment where the secret is stored |
| `folder`   | `string \| undefined`   | The optional folder UUID where the secret is stored. |
| `path`     | `string`                | The full path of the secret. |
| `tags`     | `string[]`              | A list of tags associated with the secret. |
| `keyDigest`| `string`                | A hash digest of the secret key |
| `override` | `SecretValueOverride \| undefined` | An optional override value for the secret. |
| `createdAt`| `string \| undefined`   | The timestamp when the secret was created (ISO 8601 format). |
| `updatedAt`| `string \| undefined`   | The timestamp when the secret was last updated (ISO 8601 format). |
| `version`  | `number`                | The version number of the secret. |

### SecretValueOverride

The `SecretValueOverride` object is used for personal overrides of a secret's value.

| Field       | Type      | Description |
|------------|----------|-------------|
| `value`    | `string` | The overridden secret value. |
| `isActive` | `boolean` | Whether the override is currently active. |

### GetSecretOptions

The `GetSecretOptions` object defines the parameters for retrieving secrets from a specified application and environment.

| Field      | Type       | Description |
|-----------|-----------|-------------|
| `appId`   | `string`  | The UUID of the application. |
| `envName` | `string`  | The environment from which to retrieve secrets (e.g., `Development`, `Production`). |
| `path`    | `string \| undefined` | (Optional) The path to filter secrets by a specific folder or namespace. |
| `key`     | `string \| undefined` | (Optional) The key of a specific secret to retrieve. |
| `tags`    | `string[] \| undefined` | (Optional) A list of tags to filter the retrieved secrets. |

### SecretInput Object Reference

The `SecretInput` object defines the structure for creating a new secret.

| Field     | Type      | Description |
|-----------|----------|-------------|
| `key`     | `string`  | The secret key. |
| `value`   | `string`  | The secret value. |
| `comment` | `string`  | The secret comment. |
| `path`    | `string \| undefined` | (Optional) The path to store the secret. |
| `tags`    | `string[] \| undefined` | (Optional) A list of tags to apply to the secret. |


### CreateSecretOptions Object Reference

The `CreateSecretOptions` object specifies the parameters for creating secrets in a given application and environment.

| Field      | Type            | Description |
|------------|----------------|-------------|
| `appId`    | `string`        | The UUID of the application. |
| `envName`  | `string`        | The environment in which to create secrets (e.g., `Development`, `Production`). |
| `secrets`  | `SecretInput[]` | An array of secrets to be created. |

### UpdateSecretOptions

| Property   | Type   |  Description |
|------------|--------|-------------|
| `appId`    | `string` |  The ID of the application where the secrets are stored. |
| `envName`  | `string` |  The name of the environment where the secrets exist. |
| `secrets`  | `Array<Partial<SecretInput> & { id: string, override?: SecretValueOverride }>` |  An array of secret objects to update. Each object must include the secret ID, and optionally, updated values or an override. |



### DeleteSecretOptions

| Property   | Type       |  Description |
|------------|-----------|-------------|
| `appId`    | `string`  |  The ID of the application where the secrets are stored. |
| `envName`  | `string`  |  The name of the environment from which secrets will be deleted. |
| `secretIds` | `string[]` |  An array of secret UUIDs to delete. |

