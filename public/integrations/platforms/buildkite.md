import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with Buildkite'

<Tag variant="small">INTEGRATE</Tag>

# Buildkite

You can use the Phase CLI to effortlessly inject or expose secret inside your CI pipelines or jobs.

## Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an application.
- `PHASE_SERVICE_TOKEN`.

<Note>
  If you are using a Self-Hosted instance of the Phase Console, you may supply
  `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

For detailed cli install options, please see: [Installation](/cli/install)

### Setting `PHASE_SERVICE_TOKEN`:

1. In your Buildkite Dashboard, navigate to the desired pipeline's settings.
2. Click on `Environment Variables`.
3. Add a new environment variable named `PHASE_SERVICE_TOKEN` and set its value.

## Single staged

In your `pipeline.yml`:

```yaml
steps:
  - label: 'Prepare'
    command:
      - 'curl -fsSL https://pkg.phase.dev/install.sh | bash'
      - 'export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)'

  - label: 'Build and Push'
    command:
      - 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN'
      - 'docker build -t my-image .'
      - 'docker push my-image:latest'
```
