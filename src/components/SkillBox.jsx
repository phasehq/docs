'use client'

import { useState } from 'react'

function TerminalIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" {...props}>
      <rect width="16" height="16" rx="4" className="fill-current opacity-10" />
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

export function SkillBox({ skill, refs = [], triggerPhrase }) {
  const [copied, setCopied] = useState(false)

  const baseUrl = `https://docs.phase.dev/self-hosting/skills/${skill}`
  const dir = `.claude/skills/${skill}`

  const commands = [
    `mkdir -p ${dir}/refs`,
    `curl -sL ${baseUrl}/SKILL.md -o ${dir}/SKILL.md`,
    ...refs.map(
      (ref) => `curl -sL ${baseUrl}/refs/${ref}.md -o ${dir}/refs/${ref}.md`
    ),
  ].join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(commands).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-50/50 dark:border-violet-500/30 dark:bg-violet-500/5">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-violet-500/20 px-4 py-3 dark:border-violet-500/30">
        <TerminalIcon className="h-4 w-4 flex-none text-violet-500 dark:text-violet-400" />
        <span className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          Deploy with Claude Code
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="mb-3 text-sm leading-6 text-violet-900 dark:text-violet-200">
          Automate this entire deployment interactively with{' '}
          <a
            href="https://claude.ai/download"
            className="font-medium underline underline-offset-2 hover:text-violet-700 dark:hover:text-violet-100"
          >
            Claude Code
          </a>
          . Install the skill below, then ask Claude to{' '}
          <code className="rounded-md bg-violet-500/10 px-1.5 py-0.5 font-mono text-xs font-medium dark:bg-violet-500/20">
            {triggerPhrase}
          </code>
          .
        </p>

        {/* Code block */}
        <div className="relative">
          <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-4 pr-16 text-xs leading-6 text-zinc-300 dark:bg-zinc-950">
            <code>{commands}</code>
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
