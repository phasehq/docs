import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with AWS CodeBuild'

<Tag variant="small">INTEGRATE</Tag>

# AWS CodeBuild

You can use the Phase CLI to effortlessly inject or expose secret inside your CI pipelines or jobs.

## Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an application.
- `PHASE_SERVICE_TOKEN`.

<Note>
  If you are using a Self-Hosted instance of the Phase Console, you may supply
  `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

For detailed cli install options, please see: [Installation](/cli/install)

## Setting `PHASE_SERVICE_TOKEN`:

1. Go to the AWS Management Console.
2. Navigate to `AWS Systems Manager` > `Parameter Store`.
3. Click on `Create Parameter`.
4. Use `PHASE_SERVICE_TOKEN` as the name and provide its value. Remember the parameter type and KMS key if you use one.
5. In CodeBuild, grant permission to the service role to access this SSM parameter.

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - curl -fsSL https://pkg.phase.dev/install.sh | bash
      - export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)
  build:
    commands:
      - docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
      - docker build -t my-image .
      - docker push my-image:latest
```
