'use client'

import { useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
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
    <div className="not-prose my-6 border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header strip */}
      <div className="flex h-8 items-center justify-between gap-x-4 border-b border-zinc-200 px-3 dark:border-zinc-800">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            AI deployment skill
          </span>
          <span aria-hidden="true" className="h-0.5 w-0.5 bg-zinc-400 dark:bg-zinc-600" />
          <span className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {headerLabel}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {agents.map((agent) => (
            <a
              key={agent.name}
              href={agent.href}
              target="_blank"
              rel="noopener noreferrer"
              title={agent.name}
              className="p-1 text-zinc-400 transition-colors duration-150 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <agent.icon className="h-3.5 w-3.5" />
            </a>
          ))}
          <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <button
            type="button"
            onClick={handleCopy}
            title="Copy command"
            aria-label="Copy command to clipboard"
            className="p-1 text-zinc-500 transition-colors duration-150 hover:text-zinc-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400 dark:hover:text-zinc-300"
          >
            {copied ? (
              <FiCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FiCopy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Command line */}
      <div translate="no" className="overflow-x-auto p-4 font-mono text-xs text-zinc-800 dark:text-zinc-200">
        <span className="text-emerald-600 dark:text-emerald-400">$</span>{' '}
        <span>{command}</span>
      </div>

      {/* Footer */}
      {triggerPhrase && (
        <div className="border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
          <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            Then ask your agent to{' '}
            <code translate="no" className="font-mono text-2xs text-emerald-600 dark:text-emerald-400">
              {triggerPhrase}
            </code>
          </p>
        </div>
      )}
    </div>
  )
}
