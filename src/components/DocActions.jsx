import { useEffect, useMemo, useState } from 'react'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { siOpenai, siMarkdown } from 'simple-icons'
import { Button } from '@/components/Button'
import { CopyButton } from '@/components/CopyButton'

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
          value={mdUrl}
          title="Copy .md link"
          
        ><div className="flex items-center gap-1"><LinkIcon className="h-4 w-4 stroke-zinc-500" />Copy .md link </div></CopyButton>

        <CopyButton
          title="Copy for LLM"
          
          onCopy={async () => {
            let res = await fetch(mdUrl)
            let text = await res.text()
            await navigator.clipboard.writeText(text)
          }}
        ><div className="flex items-center gap-1"><MarkdownIcon className="h-4 w-4 stroke-zinc-500" />Copy for LLM </div></CopyButton>
        
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
