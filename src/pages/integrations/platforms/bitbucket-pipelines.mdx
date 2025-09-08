import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Bitbucket Pipelines'

<Tag variant="small">INTEGRATE</Tag>

# Bitbucket Pipelines

You can use the Phase CLI to effortlessly inject or expose secret inside your CI pipelines or jobs.

<DocActions />

### Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an application.
- `PHASE_SERVICE_TOKEN`.

<Note>
  If you are using a Self-Hosted instance of the Phase Console, you may supply
  `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

For detailed cli install options, please see: [Installation](/cli/install)

### Setting `PHASE_SERVICE_TOKEN`:

1. Go to your Bitbucket repository.
2. Click on `Repository settings`.
3. Under `Pipeline`, select `Environment variables`.
4. Add `PHASE_SERVICE_TOKEN` and set its value.

### Example:

```yaml
image: atlassian/default-image:2

pipelines:
  default:
    - step:
        name: Prepare
        script:
          - curl -fsSL https://pkg.phase.dev/install.sh | bash
          - export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)
    - step:
        name: Build and Push
        script:
          - docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
          - docker build -t my-image .
          - docker push my-image:latest
```
