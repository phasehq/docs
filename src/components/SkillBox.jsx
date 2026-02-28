'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { siClaude, siWindsurf, siGithubcopilot } from 'simple-icons'

function ClaudeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siClaude.path} />
    </svg>
  )
}

function CursorIcon(props) {
  return (
    <svg viewBox="0 0 466.73 532.09" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z" />
    </svg>
  )
}

function WindsurfIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siWindsurf.path} />
    </svg>
  )
}

function CopilotIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siGithubcopilot.path} />
    </svg>
  )
}

function ClipboardIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  )
}

const agents = [
  { name: 'Claude Code', icon: ClaudeIcon, href: 'https://claude.ai/download' },
  { name: 'Cursor', icon: CursorIcon, href: 'https://cursor.com' },
  { name: 'Windsurf', icon: WindsurfIcon, href: 'https://windsurf.com' },
  { name: 'GitHub Copilot', icon: CopilotIcon, href: 'https://github.com/features/copilot' },
]

export function SkillBox({ skill, triggerPhrase }) {
  const [copyCount, setCopyCount] = useState(0)
  const copied = copyCount > 0

  const command = skill
    ? `npx skills add phasehq/ai -s ${skill}`
    : 'npx skills add phasehq/ai'

  const headerLabel = skill || 'phasehq/ai'

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopyCount((c) => c + 1)
      setTimeout(() => setCopyCount(0), 1000)
    })
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl bg-zinc-900 shadow-md ring-1 ring-emerald-500/20 dark:ring-emerald-500/30 dark:shadow-emerald-500/5">
      {/* Header */}
      <div className="flex min-h-[calc(theme(spacing.12)+1px)] items-center justify-between gap-x-4 border-b border-emerald-500/20 bg-zinc-800 px-4 dark:border-emerald-500/20 dark:bg-emerald-500/[0.03]">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-emerald-400">
            AI Deployment Skill
          </h3>
          <span className="h-0.5 w-0.5 rounded-full bg-emerald-500/50" />
          <span className="font-mono text-xs text-zinc-400">{headerLabel}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {agents.map((agent) => (
            <a
              key={agent.name}
              href={agent.href}
              target="_blank"
              rel="noopener noreferrer"
              title={agent.name}
              className="rounded-md p-1 text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <agent.icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="group relative">
        <pre className="overflow-x-auto p-4 text-xs text-white">
          <code>
            <span className="text-emerald-400">$</span>{' '}
            <span className="text-zinc-300">{command}</span>
          </code>
        </pre>
        <div
          className={clsx(
            'absolute right-4 top-3.5 backdrop-blur transition',
            !copied && 'opacity-0 focus-within:opacity-100 group-hover:opacity-100'
          )}
        >
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="flex items-center gap-1 text-xs"
          >
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden={copied}
                className={clsx(
                  'pointer-events-none flex items-center gap-1 transition duration-300',
                  copied && '-translate-y-1.5 opacity-0'
                )}
              >
                <ClipboardIcon className="h-5 w-5 fill-zinc-500/20 stroke-zinc-500 transition-colors hover:stroke-zinc-400" />
                <span className="text-zinc-400">Copy</span>
              </div>
              <span
                aria-hidden={!copied}
                className={clsx(
                  'pointer-events-none absolute inset-0 flex items-center justify-center text-emerald-400 transition duration-300',
                  !copied && 'translate-y-1.5 opacity-0'
                )}
              >
                Copied!
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      {triggerPhrase && (
        <div className="border-t border-emerald-500/20 bg-zinc-800 px-4 py-2.5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.03]">
          <p className="text-xs leading-5 text-zinc-400">
            Then ask your agent to{' '}
            <code className="rounded-md bg-emerald-400/10 px-1.5 py-0.5 font-mono text-2xs font-semibold text-emerald-400">
              {triggerPhrase}
            </code>
          </p>
        </div>
      )}
    </div>
  )
}
