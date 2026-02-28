'use client'

import { useState } from 'react'
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

function TerminalIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" {...props}>
      <path
        d="M3.5 5.5L6.5 8L3.5 10.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current"
      />
      <path
        d="M8 10.5H12"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="stroke-current"
      />
    </svg>
  )
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" {...props}>
      <path
        d="M4 4.5V11a1.5 1.5 0 0 0 1.5 1.5H10"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current"
      />
      <rect x="5.5" y="2" width="8" height="9.5" rx="1.5" strokeWidth="1.25" className="stroke-current" />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" {...props}>
      <path
        d="M3 8.5L6.5 12L13 5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current"
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
  const [copied, setCopied] = useState(false)

  const command = `npx @phasehq/ai install ${skill}`

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-50/50 dark:border-violet-500/30 dark:bg-violet-500/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-violet-500/20 px-4 py-3 dark:border-violet-500/30">
        <div className="flex items-center gap-2.5">
          <TerminalIcon className="h-4 w-4 flex-none text-violet-500 dark:text-violet-400" />
          <span className="text-sm font-semibold text-violet-900 dark:text-violet-200">
            AI Deployment Skill
          </span>
        </div>
        <div className="flex items-center gap-1">
          {agents.map((agent) => (
            <a
              key={agent.name}
              href={agent.href}
              target="_blank"
              rel="noopener noreferrer"
              title={agent.name}
              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-violet-500/10 hover:text-violet-600 dark:text-zinc-500 dark:hover:text-violet-300"
            >
              <agent.icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="mb-3 text-sm leading-6 text-violet-900 dark:text-violet-200">
          Automate this deployment with an AI coding agent.
          Install the skill, then ask your agent to{' '}
          <code className="rounded-md bg-violet-500/10 px-1.5 py-0.5 font-mono text-xs font-medium dark:bg-violet-500/20">
            {triggerPhrase}
          </code>
          .
        </p>

        {/* Code block */}
        <div className="relative">
          <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-4 pr-24 text-sm leading-6 text-zinc-300 dark:bg-zinc-950">
            <code>
              <span className="text-zinc-500">$ </span>{command}
            </code>
          </pre>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-zinc-700/80 px-2 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
