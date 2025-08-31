import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with CircleCI'

<Tag variant="small">INTEGRATE</Tag>

# CircleCI

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

1. Go to the CircleCI dashboard and select your project.
2. Click on `Project Settings`.
3. Click on `Environment Variables`.
4. Add a new variable with the name `PHASE_SERVICE_TOKEN` and provide its value.

### Example:

```yaml
version: 2.1

jobs:
  prepare:
    docker:
      - image: circleci/python:3.7
    steps:
      - checkout
      - run:
          name: Install phase-cli
          command: curl -fsSL https://pkg.phase.dev/install.sh | bash
      - run:
          name: Export and set environment variables
          command: |
            echo 'export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)' >> $BASH_ENV

  build_and_push:
    docker:
      - image: circleci/python:3.7
    steps:
      - run:
          name: Build and Push Docker image
          command: |
            docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
            docker build -t my-image .
            docker push my-image:latest

workflows:
  version: 2
  pipeline:
    jobs:
      - prepare
      - build_and_push:
          requires:
            - prepare
```
