import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Azure Pipelines'

<Tag variant="small">INTEGRATE</Tag>

# Azure Pipelines

You can use the Phase CLI to effortlessly inject or expose secret inside your CI pipelines or jobs.

<DocActions />

## Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an application.
- `PHASE_SERVICE_TOKEN`.

<Note>
  If you are using a Self-Hosted instance of the Phase Console, you may supply
  `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

For detailed cli install options, please see: [Installation](/cli/install)

### Setting `PHASE_SERVICE_TOKEN`:

1. Go to Azure DevOps Dashboard.
2. Select your project, and click on `Project Settings`.
3. Under `Pipelines`, select `Service connections`.
4. Add a new service connection of type `Environment Variable` and set `PHASE_SERVICE_TOKEN`.

## Example:

```yaml
trigger:
  - master

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: BuildAndPush
    jobs:
      - job: Prepare
        steps:
          - script: curl -fsSL https://pkg.phase.dev/install.sh | bash
            displayName: 'Install phase-cli'
          - script: |
              echo "##vso[task.setvariable variable=DOCKERHUB_USERNAME;]$(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME | cut -d '=' -f2)"
              echo "##vso[task.setvariable variable=DOCKERHUB_TOKEN;]$(phase secrets export --app "my application name" --env prod DOCKERHUB_TOKEN | cut -d '=' -f2)"
            displayName: 'Export and set environment variables'
      - job: BuildAndPush
        dependsOn: Prepare
        steps:
          - script: |
              docker login -u $(DOCKERHUB_USERNAME) -p $(DOCKERHUB_TOKEN)
              docker build -t my-image .
              docker push my-image:latest
            displayName: 'Build and Push Docker image'
```
