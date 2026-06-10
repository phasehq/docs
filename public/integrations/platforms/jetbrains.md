import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Inject secrets into JetBrains IDE run configurations (IntelliJ IDEA, PyCharm, GoLand, WebStorm) using the EnvFile plugin'

<Tag variant="small">INTEGRATE</Tag>

# JetBrains IDEs

Inject secrets from Phase directly into your JetBrains IDE run configurations — IntelliJ IDEA, PyCharm, GoLand, WebStorm, RubyMine and others — using the [EnvFile](https://plugins.jetbrains.com/plugin/7861-envfile) plugin. No plaintext `.env` on disk, no code changes, and your existing run configuration stays exactly as-is.

<DocActions />

## Why not `phase run`?

`phase run` works when your application has a single launch command you can prefix. Many JetBrains run configurations don't — managed application servers like **Tomcat**, **Jetty** or **WildFly** start the JVM through the IDE's own integration, so there is no command for you to put `phase run` in front of, and secrets never get injected.

Instead, point the EnvFile plugin at a small script that pulls secrets from Phase at launch. EnvFile injects them as environment variables into the run configuration's process — the same mechanism a static `.env` file uses, but sourced from Phase and never written to disk.

## Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an application
- [Install the CLI](/cli/install) and authenticate with `phase auth`
- Install the [EnvFile plugin](https://plugins.jetbrains.com/plugin/7861-envfile) (**Settings → Plugins → Marketplace → "EnvFile"**)

<Note>
  If you are using a Self-Hosted instance of the Phase Console, supply the
  `PHASE_HOST` environment variable with your URL (`https://<HOST>`) inside the
  script below.
</Note>

## Setup

1. **Link your project**

In the root of your project, link it to a Phase app and environment. This creates a `.phase.json` (it holds the app and environment IDs, not secrets, so it's safe to commit).

```fish
phase init
```

2. **Add an export script**

Create `phase-env.sh` in the root of your project and make it executable. EnvFile runs it on every launch and parses its output as environment variables.

```bash {{ title: 'phase-env.sh' }}
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"          # so .phase.json is picked up
exec phase secrets export --env local
```

```fish
chmod +x phase-env.sh
```

<Note>
  GUI-launched IDEs (especially via JetBrains Toolbox) often start with a
  minimal `PATH` and may not find `phase`. If the script fails, replace `phase`
  with the absolute path from `which phase`.
</Note>

3. **Wire it into your run configuration**

Open your run configuration → **EnvFile** tab → check **Enable EnvFile**. Click **+**, add `phase-env.sh`, and tick the **executable** checkbox for that entry so EnvFile runs it instead of reading it as a static file. Remove any `.env` entry you no longer need.

This produces the following in your run configuration XML:

```xml
<extension name="net.ashald.envfile">
  <option name="IS_ENABLED" value="true" />
  <ENTRIES>
    <ENTRY IS_ENABLED="true" PARSER="runconfig" IS_EXECUTABLE="false" />
    <ENTRY IS_ENABLED="true" PARSER="env" IS_EXECUTABLE="true" PATH="$PROJECT_DIR$/phase-env.sh" />
  </ENTRIES>
</extension>
```

4. **Run**

Start your run configuration as usual. Secrets are pulled fresh from Phase and injected as environment variables — your application reads them with `System.getenv("MY_SECRET")` (or `@Value("${MY_SECRET}")` / `Environment` in Spring) with no code changes.

## Example: Tomcat / Bloomreach

A managed Tomcat run configuration can't be wrapped with `phase run`, but it can use EnvFile. With the entry above in place, the Tomcat JVM and every deployed WAR inherit the injected secrets — your `Run`/`Debug` setup, debugger port and VM arguments stay untouched.

Spring reads the injected variables through its normal property resolution:

```java
@Value("${DB_PASSWORD}")
private String dbPassword;
```

## Sharing with your team

Everything needed is portable and safe to commit, so onboarding a teammate is `phase auth` and nothing else:

- **`phase-env.sh`** — uses `$PROJECT_DIR$`, no machine-specific paths
- **`.phase.json`** — app and environment IDs only, no secret values
- **The run configuration** — store it as a project file (not in `workspace.xml`) so it's shared
- **Pin the plugin** — add `.idea/externalDependencies.xml` so teammates are prompted to install EnvFile on project open:

```xml {{ title: '.idea/externalDependencies.xml' }}
<component name="ExternalDependencies">
  <plugin id="net.ashald.envfile" />
</component>
```

The only per-developer step is `phase auth` — each developer authenticates as themselves, so there is no shared token and every access is attributable.

<div className="not-prose">
  <Button
    href="https://plugins.jetbrains.com/plugin/7861-envfile"
    variant="text"
    arrow="right"
    children="EnvFile plugin — JetBrains Marketplace"
  />
</div>
