import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with Claude Code'

<Tag variant="small">INTEGRATE</Tag>

# Claude Code

Manage Phase secrets directly from [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Claude can list, create, update, and delete secrets, run processes with injected secrets, and manage your Phase environments — all from natural language.

<DocActions />

## Prerequisites

- [Phase CLI installed and authenticated](/cli/usage)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed

## Setup

### 1. Enable AI integration

```fish
phase ai enable
```

Select **Claude Code** when prompted. This installs the Phase skill to `~/.claude/skills/phase-cli/SKILL.md` and configures secret visibility.

You'll be asked whether AI agents can see secret values:
- **Mask values** (recommended) — `secret` and `sealed` types show as `[REDACTED]`
- **Show values** — `secret` and `config` types are visible; `sealed` is always hidden

### 2. Start using Phase in Claude Code

Open Claude Code in your project directory. You can immediately start managing secrets:

```
You: list my secrets
You: create a DATABASE_URL as config with value postgres://localhost:5432/mydb
You: rotate the API_KEY as a sealed secret with random base64
You: run npm start with my secrets
```

---

## How it works

The Phase CLI installs a **skill document** that teaches Claude Code how to use the Phase CLI. Claude runs Phase commands directly in your terminal — no separate server or middleware.

```
Claude Code → phase CLI commands → Phase API
```

The skill is installed globally at `~/.claude/skills/phase-cli/SKILL.md` and is automatically loaded by Claude Code for all projects.

---

## Secret types and AI visibility

Phase supports three secret types with different security levels:

| Type | AI visibility | Description |
| ---- | ------------- | ----------- |
| `config` | **Always visible** | Non-sensitive configuration (ports, hosts, flags) |
| `secret` | Controlled by `phase ai enable` | Standard encrypted secrets |
| `sealed` | **Never visible** | Write-only secrets (API keys, tokens, passwords) |

<Warning>
Sealed secret values are **never** exposed to AI agents regardless of configuration. When Claude creates or rotates a sealed secret, it uses `--random` generation — the actual value never appears in the conversation.
</Warning>

---

## Security guardrails

The Phase CLI enforces guardrails when it detects an AI agent:

| Guardrail | Enforcement |
| --------- | ----------- |
| `printenv`, `env`, `export`, `set`, `declare`, `compgen` inside `phase run` | **Blocked by CLI** |
| `phase shell` | **Blocked entirely** in AI mode |
| Sealed secret values in output | **Always redacted** |
| Secret values in `phase secrets export` | **Redacted** based on type and config |
| `phase ai enable` / `phase ai disable` | **Blocked** — must be run by user directly |

### Viewing secrets out-of-band

When values are hidden from the AI, view them directly in your terminal:

```fish
# View all secrets with values
phase secrets list --show

# View a specific secret
phase secrets get SECRET_KEY

# Export secrets
phase secrets export
```

Claude will suggest these commands when it cannot see values itself.

---

## Example use cases

### Managing secrets through conversation

```
You: list my secrets for staging
Claude: [runs phase secrets list --env staging]

You: create STRIPE_SECRET_KEY as a sealed secret with random base64
Claude: [runs phase secrets create STRIPE_SECRET_KEY --random base64 --length 32 --type sealed]

You: import my .env file
Claude: [runs phase secrets import .env]
```

### Running applications with secrets

```
You: start my dev server
Claude: [runs phase run 'npm run dev']

You: run it with staging secrets instead
Claude: [runs phase run --env staging 'npm run dev']
```

### Rotating secrets

```
You: rotate the DATABASE_PASSWORD
Claude: [runs phase secrets update DATABASE_PASSWORD --random hex --length 64]
```

---

## Managing the integration

```fish
# Update the skill (re-run after CLI upgrade)
phase ai enable

# Remove the integration
phase ai disable

# View the skill document
phase ai skill
```

---

## Troubleshooting

### Claude doesn't know about Phase

Make sure the skill is installed:

```fish
ls ~/.claude/skills/phase-cli/SKILL.md
```

If missing, run `phase ai enable` and select Claude Code.

### "auth error" from commands

Ensure you are logged in:

```fish
phase auth
phase users whoami
```

### Project not linked

If commands return "no application found", link your project:

```fish
phase apps list
phase init --app-id "your-app-id" --env Development
```
