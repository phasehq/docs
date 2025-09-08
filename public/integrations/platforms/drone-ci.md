import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with Drone CI'

<Tag variant="small">INTEGRATE</Tag>

# Drone CI

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

1. In your repository on Drone CI, navigate to `Settings`.
2. Under `Secrets`, click `Add Secret` and set the name as `PHASE_SERVICE_TOKEN` and input its value.

## Single staged

```yaml
kind: pipeline
name: default

steps:
  - name: prepare
    image: alpine:latest
    commands:
      - curl -fsSL https://pkg.phase.dev/install.sh | bash
      - export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)

  - name: build_and_push
    image: docker:dind
    volumes:
      - name: dockersock
        path: /var/run
    commands:
      - docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
      - docker build -t my-image .
      - docker push my-image:latest

volumes:
  - name: dockersock
    host:
      path: /var/run
```

## Multi staged

Drone CI supports multi-stage builds where one step's outputs can be used in another. Here's an example:

```yaml
kind: pipeline
name: default

steps:
  - name: prepare
    image: phasehq/cli:latest
    commands:
      - secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN > /shared/envs.txt

  - name: build_and_push
    image: docker:dind
    volumes:
      - name: dockersock
        path: /var/run
      - name: shared
        path: /shared
    commands:
      - export $(cat /shared/envs.txt | xargs)
      - docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
      - docker build -t my-image .
      - docker push my-image:latest

volumes:
  - name: dockersock
    host:
      path: /var/run
  - name: shared
    temp: {}
```
