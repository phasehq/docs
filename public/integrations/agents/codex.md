import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Integrate Phase with OpenAI Codex'

<Tag variant="small">INTEGRATE</Tag>

# OpenAI Codex

Manage Phase secrets directly from [OpenAI Codex](https://developers.openai.com/codex/cli). Codex can list, create, update, and delete secrets, run processes with injected secrets, and manage your Phase environments — all from natural language.

<DocActions />

## Prerequisites

- [Phase CLI installed and authenticated](/cli/usage)
- [OpenAI Codex CLI](https://developers.openai.com/codex/cli) installed

## Setup

### 1. Enable AI integration

```fish
phase ai enable
```

Select **Codex** when prompted. This installs the Phase skill to `~/.agents/skills/phase-cli/SKILL.md` and configures secret visibility.

You'll be asked whether AI agents can see secret values:
- **Mask values** (recommended) — `secret` and `sealed` types show as `[REDACTED]`
- **Show values** — `secret` and `config` types are visible; `sealed` is always hidden

### 2. Start using Phase in Codex

Invoke the skill explicitly with `$phase-cli` or let Codex auto-detect it from task context:

```
You: $phase-cli list my secrets
You: create a DATABASE_URL as config with value postgres://localhost:5432/mydb
You: rotate the API_KEY as a sealed secret with random base64
```

---

## How it works

The Phase CLI installs a **skill document** that teaches Codex how to use the Phase CLI. Codex runs Phase commands directly — no separate server or middleware.

The skill is installed at `~/.agents/skills/phase-cli/SKILL.md`, which is the user-level skill directory scanned by Codex for all projects.

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
