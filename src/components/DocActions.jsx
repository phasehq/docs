import { useEffect, useMemo, useState } from 'react'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { siOpenai, siMarkdown } from 'simple-icons'
import { Button } from '@/components/Button'

function OpenAIIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siOpenai.path} />
    </svg>
  )
}

function MarkdownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siMarkdown.path} />
    </svg>
  )
}

function CopyButton({ text, label = 'Copy .md link', icon, onCopy }) {
  let [copyCount, setCopyCount] = useState(0)
  let copied = copyCount > 0

  useEffect(() => {
    if (copyCount > 0) {
      let timeout = setTimeout(() => setCopyCount(0), 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [copyCount])

  return (
    <Button
      variant="outline"
      className="relative !h-7 !py-0 !px-2 text-2xs whitespace-nowrap"
      onClick={async () => {
        if (onCopy) {
          await onCopy()
          setCopyCount((count) => count + 1)
          return
        }
        if (!text) return
        window.navigator.clipboard.writeText(text).then(() => {
          setCopyCount((count) => count + 1)
        })
      }}
      aria-label={label}
    >
      <span aria-hidden={copied} className="pointer-events-none flex items-center gap-1 transition-opacity duration-150" style={{opacity: copied ? 0 : 1}}>
        {icon}
        {label}
      </span>
      <span aria-hidden={!copied} className="pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-150" style={{opacity: copied ? 1 : 0}}>
        Copied!
      </span>
    </Button>
  )
}

export function DocActions() {
  let [origin, setOrigin] = useState('')
  let [pathname, setPathname] = useState('/')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setOrigin(window.location.origin)
    setPathname(window.location.pathname || '/')
  }, [])

  let mdUrl = useMemo(() => {
    let path = pathname || '/'
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    let mdPath = path === '/' ? '/index.md' : `${path}.md`
    return origin ? `${origin}${mdPath}` : ''
  }, [origin, pathname])

  let chatUrl = useMemo(() => {
    if (!mdUrl) return ''
    let query = `Summarize the content of this document: ${mdUrl}`
    let encoded = encodeURIComponent(query)
    return `https://chat.openai.com/?q=${encoded}`
  }, [mdUrl])

  return (
    <div className="not-prose mx-auto mb-2 w-full max-w-[calc(theme(maxWidth.xl)-theme(spacing.8))]">
      <div className="inline-flex flex-nowrap items-center gap-1">
        <CopyButton
          text={mdUrl}
          label="Copy .md link"
          icon={<LinkIcon className="h-4 w-4 stroke-zinc-500" />}
        />

        <CopyButton
          label="Copy for LLM"
          icon={<MarkdownIcon className="h-4 w-4 stroke-zinc-500" />}
          onCopy={async () => {
            let res = await fetch(mdUrl)
            let text = await res.text()
            await navigator.clipboard.writeText(text)
          }}
        />
        
        <Button
          variant="outline"
          className="!h-7 !py-0 !px-2 text-2xs whitespace-nowrap"
          onClick={async () => {
            try {
              let response = await fetch(mdUrl)
              let markdown = await response.text()
              let prompt = `This is the official docs for Phase, an open source application secrets manager. Please read and understand it carefully; once done, say you are ready and await user queries.\n\nMarkdown docs content follows:\n\n${markdown}`
              try { await navigator.clipboard.writeText(markdown) } catch {}
              let encoded = encodeURIComponent(prompt)
              window.open(`https://chat.openai.com/?q=${encoded}`, '_blank', 'noopener')
            } catch {
              window.open(chatUrl, '_blank', 'noopener')
            }
          }}
        >
          <span className="flex items-center gap-1">
            <OpenAIIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            Ask ChatGPT
          </span>
        </Button>


      </div>
    </div>
  )
}
