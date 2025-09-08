import { Tag } from '@/components/Tag'

export const description =
  'This guide will get you all set up and ready to use the Phase console.'

<Tag variant="small">GET STARTED</Tag>

# Quickstart

Set up your account and start using Phase to manage your application secrets in just a few minutes. This guide will walk you through the following:

- Create a new account on the [Phase Console](https://console.phase.dev)
- Create an [App](/console/apps)
- Link the [Phase CLI](/cli/commands) it to your local project and import [Secrets](/console/secrets)
- Inject secrets to your app at runtime

## 1. Login and create an Organisation

You can login to the <a href="https://console.phase.dev" target="_blank"> Phase Console</a> with Google, GitHub or GitLab.

[Setup your account](/console/users#account-keys-and-setup) and [create an Organisation](/console/organisation#create-an-organisation).

## 1.1 Create an App

In order to use Phase with your application, you'll need to [create an App](/console/apps#create-an-app).

Enter a suitable name for your App, such as  Click "Create".

![create an app](/assets/images/console/quickstart/quickstart-create-app.png)

## 2. Install the CLI

Next, install the Phase CLI on the platform or operating system of your choice.

<CodeGroup>

```fish {{ title: 'MacOS' }}
brew install phasehq/cli/phase
```

```fish {{ title: 'Linux' }}
curl -fsSL https://pkg.phase.dev/install.sh | bash
```

```fish {{ title: 'Windows' }}
scoop bucket add phasehq https://github.com/phasehq/scoop-cli.git
scoop install phase
```

```fish {{ title: 'Alpine Linux' }}
curl -fsSL https://pkg.phase.dev/install.sh | bash
```

```fish {{ title: 'NixOS' }}
nix-shell -p phase-cli
```

```fish {{ title: 'Python pip' }}
pip install phase-cli
```

```fish {{ title: 'Docker' }}
# Run the latest version
docker run phasehq/cli

# Optional: run a specific version - docker run phasehq/cli:<version>
```

```fish {{ title: 'Raspberry Pi' }}
curl -fsSL https://pkg.phase.dev/install.sh | bash
```

```fish {{ title: 'ARM64' }}
curl -fsSL https://pkg.phase.dev/install.sh | bash
```

</CodeGroup>

<div className="not-prose">
  <Button
    href="/cli/install"
    variant="text"
    arrow="right"
    children="Explore CLI Installation"
  />
</div>

## 2.1 Authenticate the CLI

Once the CLI is installed, you need to authenticate it with your Phase account and App.

Run `phase auth` and choose the "Phase Cloud" option:

```
» phase auth
? Choose your Phase instance type: (Use arrow keys)
 » ☁️ Phase Cloud
   🛠️ Self Hosted
```

This will open the Phase Console in a new tab. Enter your `sudo` password when prompted.

![webauth password](/assets/images/console/quickstart/webauth-password.png)

Once completed, you should see the success screen:

![webauth success](/assets/images/console/quickstart/webauth-success.png)

Go back to your terminal. You should see the following:

```
✅ Authentication successful. Credentials saved in the Phase keyring.
🎉 Welcome to Phase CLI!

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
🙋 Need help?: https://slack.phase.dev
💻 Bug reports / feature requests: https://github.com/phasehq/cli
```

<div className="not-prose">
  <Button
    href="/cli/commands"
    variant="text"
    arrow="right"
    children="Explore CLI Usage"
  />
</div>

## 2.2 Link your project with Phase

Lastly, run `phase init` and select 'TestApp' or the name of the App you created.

```sh
»  phase init
? Select an App: (Use arrow keys)
 » TestApp
   Landing page
   Exit
```

## 2.3 Import your secrets into Phase - **_Optional_**

Next, import your secrets from your `.env` file.

```fish
cat .env

HOST=localhost
HTTP_PROTOCOL=https://
# WARNING: Replace these with a cryptographically strong random values. You can use `openssl rand -hex 32` to generate these.
NEXTAUTH_SECRET=82031b3760ac58352bb2d48fd9f32e9f72a0614343b669038139f18652ed1447
SECRET_KEY=92d44efc4f9a4c0556cc67d2d033d3217829c263d5ab7d1954cf4b5bfd533e58
SERVER_SECRET=9e760539415af07b22249b5878593bd4deb9b8961c7dd0570117549f2c4f32a2
# OAuth providers to enable on sign-in page (remove any that aren't required)
# Example: SSO_PROVIDERS=google,github,gitlab
SSO_PROVIDERS=google,github,gitlab
# Database credentials. Change all these values as required, except DATABASE_HOST
DATABASE_HOST=postgres # don't change this
DATABASE_PORT=5432
DATABASE_NAME=postgres-db-name
DATABASE_USER=postgres-user
DATABASE_PASSWORD=a765b221799be364c53c8a32acccf5dd90d5fc832607bdd14fccaaaa0062adfd
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
NEXT_TELEMETRY_DISABLED=1
```

Run `phase secrets import .env`

```
»  phase secrets import .env
Successfully imported and encrypted 23 secrets.
To view them please run: phase secrets list
```

Once done, remove your `.env` file, as it is best practice not to leave secrets in plain text on disk:

```fish
rm .env
```

Alternatively, you can import your secrets by dragging and dropping your `.env` file into the App's *Secrets* tab or a specific environment in the Phase Console. This may be more suitable if you want to quickly import secrets from your `.env` file across multiple environments.

<div className="video-container">
  <video controls>
    <source src="/assets/images/console/secrets/import/single-env-drag-drop-demo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

## 3. Inject secrets

To inject secrets locally into your application, simply prefix the normal command you would use with

```fish
phase run [command]

# Start node dev server
phase run yarn dev

# Chaining multiple commands together
phase run "printenv | grep AWS_ACCESS_KEY_ID"
```

For example, instead of `yarn dev`, simply run `phase run yarn dev`. Your secrets will be decrypted and injected into your application process at runtime, and you can access them in your code as usual.

## Next steps

Now that you have setup your account and connected it to your local project, you can explore all that Phase has to offer.

<div className="not-prose mb-16 mt-6 flex gap-3">
  <Button
    href="/console"
    variant="secondary"
    arrow="right"
    children="🎛️ Phase Console"
  />
  <Button
    href="/cli/commands"
    variant="secondary"
    arrow="right"
    children="⌨ Phase CLI"
  />
</div>
