import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with TeamCity'

<Tag variant="small">INTEGRATE</Tag>

# TeamCity

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

1. Navigate to your TeamCity project's main page.
2. Click on `Edit Project Settings`.
3. Select `Parameters` on the left menu.
4. Click `Add New Parameter`, set its name to `PHASE_SERVICE_TOKEN`, choose the type as `Password`, and input its value.

## Singed staged

Create a TeamCity build configuration and add the following build steps:

Create a TeamCity build configuration and add the following build steps:

1. **Prepare (Command Line Runner)**:

   - Run: `Custom script`
   - Custom script:
     ```fish
     curl -fsSL https://pkg.phase.dev/install.sh | bash
     export $(phase secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN | xargs)
     ```

2. **Build and Push (Command Line Runner)**:

   - Run: `Custom script`
   - Custom script:
     ```fish
     docker login -u %env.DOCKERHUB_USERNAME% -p %env.DOCKERHUB_TOKEN%
     docker build -t my-image .
     docker push my-image:latest
     ```
