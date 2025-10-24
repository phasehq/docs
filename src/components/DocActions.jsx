import { useEffect, useMemo, useState } from 'react'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { siOpenai, siMarkdown, siClaude } from 'simple-icons'
import { Button } from '@/components/Button'
import { CopyButton } from '@/components/CopyButton'

function OpenAIIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siOpenai.path} />
    </svg>
  )
}

function ClaudeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d={siClaude.path} />
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

function CursorIcon(props) {
  return (
    <svg viewBox="0 0 466.73 532.09" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z" />
    </svg>
  )
}

function generatePromptDeeplink(promptText) {
  const url = new URL('cursor://anysphere.cursor-deeplink/prompt')
  url.searchParams.set('text', promptText)
  return url.toString()
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

  let chatGptUrl = useMemo(() => {
    if (!mdUrl) return ''
    let query = `This is the official docs for Phase, an open source application secrets manager. Please read and understand it carefully; once done, say you are ready and await user queries.\n\n${mdUrl}`
    let encoded = encodeURIComponent(query)
    return `https://chat.openai.com/?q=${encoded}`
  }, [mdUrl])

  let claudeUrl = useMemo(() => {
    if (!mdUrl) return ''
    let query = `This is the official docs for Phase, an open source application secrets manager. Please read and understand it carefully; once done, say you are ready and await user queries.\n\n${mdUrl}`
    let encoded = encodeURIComponent(query)
    return `https://claude.ai/new?q=${encoded}`
  }, [mdUrl])

  let cursorUrl = useMemo(() => {
    if (!mdUrl) return ''
    let promptText = `This is the official docs for Phase, an open source application secrets manager. Please read and understand it carefully; once done, say you are ready and await user queries.\n\n${mdUrl}`
    return generatePromptDeeplink(promptText)
  }, [mdUrl])

  return (
    <div className="not-prose mx-auto mb-2 w-full max-w-[calc(theme(maxWidth.xl)-theme(spacing.8))]">
      <div className="inline-flex flex-nowrap items-center gap-1 overflow-x-auto">
        <CopyButton
          value={mdUrl}
          title="Copy .md link"
          className="flex-shrink-0"
        ><div className="flex items-center gap-1 whitespace-nowrap"><LinkIcon className="h-4 w-4 stroke-zinc-500" /><span className="hidden sm:inline">Copy .md link</span></div></CopyButton>

        <CopyButton
          title="Copy for LLM"
          className="flex-shrink-0"
          onCopy={async () => {
            let res = await fetch(mdUrl)
            let text = await res.text()
            await navigator.clipboard.writeText(text)
          }}
        ><div className="flex items-center gap-1 whitespace-nowrap"><MarkdownIcon className="h-4 w-4 stroke-zinc-500" /><span className="hidden sm:inline">Copy for LLM</span></div></CopyButton>
        
        <Button
          variant="outline"
          className="!h-7 !py-0 !px-2 text-2xs whitespace-nowrap flex-shrink-0"
          onClick={() => {
            window.open(chatGptUrl, '_blank', 'noopener')
          }}
        >
          <span className="flex items-center gap-1">
            <OpenAIIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden sm:inline">Ask ChatGPT</span>
          </span>
        </Button>

        <Button
          variant="outline"
          className="!h-7 !py-0 !px-2 text-2xs whitespace-nowrap flex-shrink-0"
          onClick={() => {
            window.open(cursorUrl, '_blank', 'noopener')
          }}
        >
          <span className="flex items-center gap-1">
            <CursorIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden sm:inline">Add to Cursor</span>
          </span>
        </Button>

        <Button
          variant="outline"
          className="!h-7 !py-0 !px-2 text-2xs whitespace-nowrap flex-shrink-0"
          onClick={() => {
            window.open(claudeUrl, '_blank', 'noopener')
          }}
        >
          <span className="flex items-center gap-1">
            <ClaudeIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden sm:inline">Ask Claude</span>
          </span>
        </Button>


      </div>
    </div>
  )
}
