import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with OpenCode'

<Tag variant="small">INTEGRATE</Tag>

# OpenCode

Manage Phase secrets directly from [OpenCode](https://opencode.ai). OpenCode can list, create, update, and delete secrets, run processes with injected secrets, and manage your Phase environments — all from natural language.

<DocActions />

## Prerequisites

- [Phase CLI installed and authenticated](/cli/usage)
- [OpenCode](https://opencode.ai) installed

## Setup

### 1. Enable AI integration

```fish
phase ai enable
```

Select **OpenCode** when prompted. This installs the Phase skill to `~/.config/opencode/skills/phase-cli/SKILL.md` and configures secret visibility.

You'll be asked whether AI agents can see secret values:
- **Mask values** (recommended) — `secret` and `sealed` types show as `[REDACTED]`
- **Show values** — `secret` and `config` types are visible; `sealed` is always hidden

<Note>
OpenCode also reads skills from `~/.claude/skills/` and `~/.agents/skills/`. If you've already installed the Phase skill for Claude Code or Codex, OpenCode will pick it up automatically.
</Note>

### 2. Start using Phase in OpenCode

You can immediately start managing secrets:

```
You: list my secrets
You: create a DATABASE_URL as config with value postgres://localhost:5432/mydb
You: rotate the API_KEY as a sealed secret with random base64
You: run npm start with my secrets
```

---

## How it works

The Phase CLI installs a **skill document** that teaches OpenCode how to use the Phase CLI. OpenCode runs Phase commands directly in your terminal — no separate server or middleware.

The skill is installed at `~/.config/opencode/skills/phase-cli/SKILL.md`, the user-level skill directory for OpenCode.

---

## Secret types and AI visibility

| Type | AI visibility | Description |
| ---- | ------------- | ----------- |
| `config` | **Always visible** | Non-sensitive configuration (ports, hosts, flags) |
| `secret` | Controlled by `phase ai enable` | Standard encrypted secrets |
| `sealed` | **Never visible** | Write-only secrets (API keys, tokens, passwords) |

<Warning>
Sealed secret values are **never** exposed to AI agents regardless of configuration.
</Warning>

---

## Security guardrails

The Phase CLI enforces guardrails when it detects an AI agent:

- `printenv`, `env`, `export`, `set`, `declare`, `compgen` are **blocked** inside `phase run`
- `phase shell` is **blocked entirely** in AI mode
- Sealed secret values are **always redacted** in output
- `phase ai enable` / `phase ai disable` **must be run by the user** directly

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
