---
title: "Quickstart"
description: "Manage your secrets and environment variables with the Phase CLI"
url: https://docs.phase.dev/cli/usage
---

# Quickstart

The Phase CLI syncs with the [Phase Console](https://github.com/phasehq/console) to provide **end-to-end** encrypted secret management. It pulls, decrypts, and injects secrets into your applications during runtime. Manage secrets for various environments, such as development, staging, production, or custom ones, with ease.

### Prerequisites:

- Sign up for the Phase Console and create an application: [Quickstart](https://docs.phase.dev/quickstart.md)
- [Install the CLI](https://docs.phase.dev/cli/install.md)

---

## 1. Login

Authenticate with Phase as a [User](https://docs.phase.dev/console/users.md). This is suitable for installing the Phase CLI on your local development machine, where you can access a web browser to complete the authentication.

```fish
phase auth
```

This command will give you a dropdown selection between `☁️ Phase Cloud` and `🛠️ Self Hosted`. Simply use the up/down arrow keys (`↑` and `↓`) and hit `enter` to select and follow the instructions.

Alternatively, authenticate with Phase via a [Service Account Token](https://docs.phase.dev/access-control/authentication/tokens.md#creating-a-service-account-token). This is suitable for using the CLI in a headless environment such as on your server, remote machine via SSH, Docker container, etc.

```fish
export PHASE_SERVICE_TOKEN=<YOUR_SERVICE_ACCOUNT_TOKEN>
```

```fish
export PHASE_HOST=<YOUR_SELF_HOSTED_INSTANCE_URL>
```

[Explore Auth](https://docs.phase.dev/cli/commands.md#auth)

---

## 2. Initialize - _optional_

Link the Phase application to your local project. This will create a `.phase.json` file in the root of your application's repository. You may skip this step, but you will have to provide application and environment context by passing `--app` and `--env` flags on the `phase secrets` and `phase run` commands.

```fish
# cd /path/to/your/project
phase init
```

This command will give you a dropdown selection of all the apps you've created on the [Phase Console](https://docs.phase.dev/console/apps.md). Simply use the up/down arrow keys (`↑` and `↓`) and hit `enter` to select the app and the environment.

[Explore Init](https://docs.phase.dev/cli/commands.md#init)

---

## 3. Import your existing secrets - _optional_

Let's say you already have a `.env` file containing your secrets and environment variables for your app.

Example:

```fish
> cat .env
AWS_ACCESS_KEY_ID="AKIA2OGYBAH63UA3VNFG"
AWS_SECRET_ACCESS_KEY="V5yWXDe82Gohf9DYBhpatYZ74a5fiKfJVx8rx6W1"

> phase secrets import .env
Successfully imported and encrypted 2 secrets.
To view them please run: phase secrets list

> phase secrets list
KEY 🗝️                    | VALUE ✨
----------------------------------------------------------------------------------------------------
AWS_ACCESS_KEY_ID        | AKI**************NFG
AWS_SECRET_ACCESS_KEY    | V5y**********************************6W1

🥽 To uncover the secrets, use: phase secrets list --show

> rm .env
```

[Explore Import](https://docs.phase.dev/cli/commands.md#secrets)

---

## 4. Run and inject secrets

```fish
phase run <your_run_command>
```

Let's see it in action:

Example:

```fish
# Chaining multiple commands together
phase run "printenv | grep AWS_ACCESS_KEY_ID"
AWS_ACCESS_KEY_ID=AKIA2OGYBAH63UA3VNFG
```

[Explore Run](https://docs.phase.dev/cli/commands.md#run)
