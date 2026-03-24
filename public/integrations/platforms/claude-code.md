import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Claude Code via MCP'

<Tag variant="small">INTEGRATE</Tag>

# Claude Code

Use Phase secrets directly from [Claude Code](https://docs.anthropic.com/en/docs/claude-code) via the Model Context Protocol (MCP). Claude can list, create, update, and delete secrets, run processes with secrets injected, and manage your Phase environment — all from natural language.

<DocActions />

<Note>
This feature is in **Beta**. The Phase MCP server requires Phase CLI version **2.1.0** or later.
</Note>

## Prerequisites

- [Phase CLI](/cli/install) installed (version >= 2.1.0)
- Authenticated with Phase: `phase auth`
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed
- A Phase application with at least one environment

## Setup

### 1. Install the Phase CLI

<CodeGroup>

```fish {{ title: 'MacOS' }}
brew install phasehq/cli/phase
```

```fish {{ title: 'Linux' }}
curl -fsSL https://pkg.phase.dev/install.sh | sh
```

</CodeGroup>

Verify you have the right version:

```fish
> phase --version
phase version 2.1.0
```

### 2. Authenticate

```fish
> phase auth
```

This opens the Phase Console in your browser for authentication. For self-hosted instances, you'll be prompted for your host URL.

### 3. Link your project

```fish
> cd /path/to/your/project
> phase init
```

Select your application and environment. This creates a `.phase.json` in your project directory.

### 4. Install the MCP server

```fish
> phase ai mcp install
✅ Phase MCP server registered with Claude Code.
   Restart Claude Code to activate.
```

### 5. Configure AI secret visibility

```fish
> phase ai enable
```

Choose whether AI tools can see secret values. By default, values are masked.

### 6. Restart Claude Code

Close and reopen Claude Code (or your IDE with the Claude Code extension). The Phase tools will be available immediately.

---

## How it works

The Phase CLI ships a built-in MCP server that Claude Code launches automatically via stdio when a session starts. You never need to run the server manually — Claude Code handles the lifecycle.

```
Claude Code ←(stdio/JSON-RPC)→ phase ai mcp serve ←(HTTPS)→ Phase API
```

The MCP server exposes 10 tools that Claude can call:

| Tool | What it does |
| ---- | ------------ |
| `phase_get_context` | Check if the project is linked to a Phase app |
| `phase_init` | Link the project to an app and environment |
| `phase_list_secrets` | List all secrets with metadata |
| `phase_get_secret` | Fetch a single secret's details |
| `phase_create_secrets` | Create one or more secrets |
| `phase_update_secret` | Update a secret's value, type, or path |
| `phase_delete_secrets` | Delete secrets by key |
| `phase_run` | Start a process with secrets injected as environment variables |
| `phase_stop` | Stop a running process |
| `phase_run_logs` | Read stdout/stderr from a managed process |

---

## Secret types and AI visibility

Phase supports three secret types with different security characteristics:

| Type | Purpose | AI visibility | Value handling |
| ---- | ------- | ------------- | -------------- |
| `secret` | Standard encrypted secrets | Controlled by `phase ai enable` | Encrypted at rest, can be read/written with literal values |
| `sealed` | Write-only secrets (API keys, tokens, passwords) | **Always hidden** | Can only be created/updated with random generation — literal values are rejected |
| `config` | Non-sensitive configuration (ports, hosts, flags) | **Always visible** | Stored as configuration values |

<Warning>
Sealed secret values are **never** exposed to AI tools regardless of configuration. When Claude creates or rotates a sealed secret, it uses cryptographic random generation — the actual value never appears in the conversation.
</Warning>

### Configuring visibility

Run `phase ai enable` to toggle whether `secret`-type values are visible to AI:

```fish
> phase ai enable
🤖 Allow AI agents to see values of secrets and configs?
❯ No — mask secret values (recommended)
  Yes — allow AI to read secret values (suitable for development environments)
```

This setting is stored in `~/.phase/ai.json` and applies globally. Sealed secrets remain hidden regardless.

---

## Example use cases

### Managing secrets through conversation

```
You: list my secrets
Claude: [calls phase_list_secrets]

You: create a new secret called STRIPE_SECRET_KEY as sealed with a random base64 value
Claude: [calls phase_create_secrets with type=sealed, random_type=base64]
  → Created STRIPE_SECRET_KEY (sealed, random base64, 32 chars)

You: change AI_SECRET_2 from config to sealed
Claude: [calls phase_update_secret with type=sealed]
  → Updated AI_SECRET_2 type to sealed
```

### Running applications with secrets

```
You: start my dev server
Claude: [calls phase_run with command="npm run dev"]
  → Started process (handle: 1, PID: 12345, 15 secrets injected)

You: is it running ok?
Claude: [calls phase_run_logs with handle=1]
  → Server listening on port 3000...

You: stop it
Claude: [calls phase_stop with handle=1]
  → Stopped process
```

### Adding new environment variables

When you implement a feature that needs new configuration:

```
You: I just added Redis caching, I need REDIS_HOST and REDIS_PORT as config,
     and REDIS_PASSWORD as sealed

Claude: [calls phase_create_secrets with 3 secrets]
  → Created REDIS_HOST (config), REDIS_PORT (config), REDIS_PASSWORD (sealed, random hex)
```

---

## Security design

### What the AI can and cannot do

| Action | Allowed | Notes |
| ------ | ------- | ----- |
| List secret keys and metadata | Yes | Type, path, tags, comments |
| Read `config` values | Yes | Always visible |
| Read `secret` values | Configurable | Controlled by `phase ai enable` |
| Read `sealed` values | **Never** | Hard security boundary |
| Create/update with literal values | Yes (except sealed) | Sealed must use `random_type` |
| Create/update sealed with random generation | Yes | `hex`, `alphanumeric`, `base64`, `base64url`, `key128`, `key256` |
| Run processes with secrets injected | Yes | All types injected at runtime, AI sees only process output |
| Run `env`, `printenv`, or similar | **Blocked** | Commands that dump environment variables are refused |
| Run Phase CLI commands via shell | **Blocked by policy** | AI is instructed to only use MCP tools, not shell commands |

### Viewing secrets out-of-band

When values are hidden from the AI, you can always view them directly:

```fish
# View all secrets with values in your terminal
> phase secrets list --show

# View a specific secret
> phase secrets get SECRET_KEY

# Export secrets
> phase secrets export
```

The AI will suggest these commands when it cannot see values itself.

---

## Troubleshooting

### MCP server not connecting

Check registration:

```fish
> claude mcp list
```

If `phase-secrets` shows as "Failed to connect", try reinstalling:

```fish
> phase ai mcp uninstall
> phase ai mcp install
```

Then restart Claude Code.

### Tools not appearing

Make sure you fully restart Claude Code after installing the MCP server. A new conversation in an existing session is not sufficient — close and reopen the application.

### "auth error" from tools

Ensure you are logged in:

```fish
> phase auth
> phase users whoami
```

### Project not linked

If tools return "project not linked", run:

```fish
> phase init
```

Or ask Claude to do it: "link this project to my Phase app".
