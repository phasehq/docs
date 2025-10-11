import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with AWS Elastic Container Service'

<Tag variant="small">INTEGRATE</Tag>

# AWS Elastic Container Service

You can use Phase to securely supply secrets to your AWS Elastic Container Service (ECS) Tasks.

<DocActions /> 

## Prerequisites

- An AWS account with full access to:
  - Elastic Container Service (ECS)
  - Identity and Access Management (IAM)
  - EC2 Services
- Sign up for the [Phase Console](/quickstart) and [create an App](/console/apps#create-an-app).
- Obtain a [`PHASE_SERVICE_TOKEN`](/access-control/authentication/tokens#creating-a-service-account-token) for your application, that has access to the environment you are trying to fetch secrets from.
- Your Phase Application ID (found in your application settings under the App section UUID)

## Init Container

This method uses the Phase CLI Docker image as an init container in your ECS task. The init container fetches secrets and stores them in a shared ephemeral volume, making them accessible to your application container through a secrets file.

If your application only supports environment variables for accessing secrets, you can run `export $(cat /tmp/secrets | xargs)` in your application container before the CMD. This command reads secrets from the filesystem and sets them as environment variables before starting your application. However, we recommend configuring your application to read secrets directly from the filesystem for enhanced security.

### How It Works

1. ECS pulls and runs the `phasehq/cli` container
2. The Phase CLI authenticates using your provided credentials (`PHASE_HOST` and `PHASE_SERVICE_TOKEN`)
3. The CLI retrieves secrets from your specified Phase application and environment
4. Secrets are written to a shared volume as key-value pairs
5. Your application container loads the secrets

### Task Definition

Here's a complete ECS task definition implementing this approach:

```json
{
    "family": "phase-ecs-secrets-example",
    "containerDefinitions": [
        {
            "name": "secrets-init",
            "image": "phasehq/cli:1.18.6", // 👈 Specify Phase CLI version
            "cpu": 0,
            "essential": true,
            "entryPoint": [
                "/bin/sh", 
                "-c"
            ],
            "command": [
                "phase secrets export --app-id 00000000-0000-0000-0000-000000000000 --env production > /tmp/secrets"
                // Specify your Phase application ID ☝️, environment and output path
            ],
            "environment": [
                {
                    "name": "PHASE_HOST", // Optional - Specify PHASE_HOST URL for self-hosted instances
                    "value": "https://console.phase.dev"
                },
                {
                    "name": "PHASE_SERVICE_TOKEN", // Your Phase Service Account Token
                    "value": "pss_service:v2:..."
                }
            ],
            "mountPoints": [
                {
                    "sourceVolume": "secrets-store",
                    "containerPath": "/tmp",
                    "readOnly": false
                }
            ]
        },
        {
            "name": "app",
            "image": "mendhak/http-https-echo:35",
            "cpu": 0,
            "portMappings": [
                {
                    "containerPort": 8080,
                    "hostPort": 8080,
                    "protocol": "tcp"
                },
                {
                    "containerPort": 8443,
                    "hostPort": 8443,
                    "protocol": "tcp"
                }
            ],
            "essential": true,
            "entryPoint": [
                "/bin/sh",
                "-c"
            ],
            "command": [
                "export $(cat /tmp/secrets | xargs) && docker-entrypoint.sh node ./index.js"
                // ☝️ Read secrets from file, set as environment variables, and start the app
            ],
            "environment": [
                {
                    "name": "ECHO_INCLUDE_ENV_VARS",
                    "value": "1"
                }
            ],
            "mountPoints": [
                {
                    "sourceVolume": "secrets-store",
                    "containerPath": "/tmp",
                    "readOnly": true
                }
            ],
            "dependsOn": [
                {
                    "containerName": "secrets-init",
                    "condition": "COMPLETE"
                }
            ]
        }
    ],
    "executionRoleArn": "arn:aws:iam::012345678910:role/ecsTaskExecutionRole",
    // ☝️ Replace with your ECS task execution ARN
    "networkMode": "awsvpc",
    "volumes": [
        {
            "name": "secrets-store"
        }
    ],
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "1024",
    "memory": "3072",
    "ephemeralStorage": {
        "sizeInGiB": 21
    }
}
```

### Configuration

<Properties>
  <Property name="--app-id" type="required">
    Your Phase application ID. Replace `00000000-0000-0000-0000-000000000000` with your actual application ID from the Phase console.
  </Property>
  <Property name="--env" type="optional">
    The Phase application secrets environment to deploy from. Defaults to `development`.
  </Property>
  <Property name="--format" type="optional">
    The output format for secrets. Available options: `json`, `csv`, `yaml`, `xml`, `toml`, `hcl`, `ini`, `java_properties`. Defaults to `dotenv`.
  </Property>
  <Property name="PHASE_SERVICE_TOKEN" type="required">
    Your Phase service token. Update this environment variable with a valid service token from your Phase account.
  </Property>
  <Property name="PHASE_HOST" type="optional">
    The Phase host URL. Only modify this if you're using a self-hosted Phase instance. Defaults to `https://console.phase.dev`.
  </Property>
  <Property name="executionRoleArn" type="required">
    AWS IAM execution role ARN. Update this to match your ECS execution role.
  </Property>
</Properties>

### Important Considerations

1. **Service Token Management**: Currently, the Phase Account Service Token must be supplied in the task definition. Service tokens require manual provisioning and rotation to maintain security best practices. This requirement will be addressed soon with the addition of AWS IAM authentication as a native authentication method for Phase, eliminating the need for manual token management.

2. **Special Characters**: Be cautious with special characters in secret keys or values, as they can cause export failures. For example:

```fish
/bin/sh: export: line 0: SECRET_KEY?: bad variable name
```
