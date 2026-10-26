'use strict'

const fs = require('fs')
const path = require('path')
const acorn = require('acorn')

// Writes a Markdown copy of every MDX page to public/<route>.md. MDX syntax
// (imports, exports, JSX components) is converted to plain Markdown so the
// copies read cleanly as text.

const BASE_URL = 'https://docs.phase.dev'

function ensureDirectoryExists(directoryPath) {
  if (fs.existsSync(directoryPath)) return
  fs.mkdirSync(directoryPath, { recursive: true })
}

function listMdxFilesRecursively(rootDirectory) {
  /** @type {string[]} */
  const mdxFilePaths = []

  /** @param {string} currentDirectory */
  function walk(currentDirectory) {
    const entries = fs.readdirSync(currentDirectory, { withFileTypes: true })
    for (const entry of entries) {
      const absoluteEntryPath = path.join(currentDirectory, entry.name)
      if (entry.isDirectory()) {
        walk(absoluteEntryPath)
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        mdxFilePaths.push(absoluteEntryPath)
      }
    }
  }

  walk(rootDirectory)
  return mdxFilePaths
}

function convertMdxPathToMarkdownPublicPath(mdxAbsolutePath, pagesRootAbsolutePath, publicRootAbsolutePath) {
  const relativeFromPages = path.relative(pagesRootAbsolutePath, mdxAbsolutePath)
  const withoutExtension = relativeFromPages.replace(/\.mdx$/, '')
  const withoutIndex = withoutExtension.endsWith(path.sep + 'index')
    ? withoutExtension.slice(0, -('index'.length + 1))
    : withoutExtension

  const markdownRelativePath = `${withoutIndex}.md`
  return path.join(publicRootAbsolutePath, markdownRelativePath)
}

function routeForMdxPath(mdxAbsolutePath, pagesRootAbsolutePath) {
  const relative = path.relative(pagesRootAbsolutePath, mdxAbsolutePath).split(path.sep).join('/')
  const route = '/' + relative.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')
  return route === '/' ? '/' : route.replace(/\/$/, '')
}

/* ── Imports and exports ─────────────────────────────────────────────── */

/** Offsets of fenced code blocks, so ESM-looking lines inside examples stay. */
function fencedRanges(source) {
  const ranges = []
  const fence = /^[ \t]*(```|~~~)[^\n]*\n[\s\S]*?^[ \t]*\1[^\n]*$/gm
  let match
  while ((match = fence.exec(source))) ranges.push([match.index, match.index + match[0].length])
  return ranges
}

/** End offset of the value that starts at `start`: one literal, or a
    balanced [...] / {...} / (...) group. Exports here have no semicolons
    and are followed by JSX, so parsing on would read `'text' <Tag` as a
    comparison. */
function valueEnd(source, start) {
  let depth = 0
  let inTemplate = false
  for (const token of acorn.tokenizer(source.slice(start), { ecmaVersion: 'latest' })) {
    const label = token.type.label
    if (label === '`') inTemplate = !inTemplate
    else if (label === '{' || label === '[' || label === '(' || label === '${') depth += 1
    else if (label === '}' || label === ']' || label === ')') depth -= 1
    if (depth === 0 && !inTemplate) return start + token.end
  }
  return source.length
}

/** Remove top-level `import` and `export const` statements, returning the
    page's description from `description` or `metadata.description`. */
function stripEsm(source) {
  const ranges = fencedRanges(source)
  const inFence = (offset) => ranges.some(([start, end]) => offset >= start && offset < end)
  const removals = []
  let description = ''

  for (const match of source.matchAll(/^import\s[\s\S]*?(?:from\s*)?['"][^'"\n]+['"];?[ \t]*$/gm)) {
    if (!inFence(match.index)) removals.push([match.index, match.index + match[0].length])
  }

  for (const match of source.matchAll(/^export const (\w+)\s*=\s*/gm)) {
    if (inFence(match.index)) continue
    const start = match.index + match[0].length
    let end = valueEnd(source, start)
    const node = acorn.parseExpressionAt(source.slice(start, end), 0, { ecmaVersion: 'latest' })
    if (source[end] === ';') end += 1
    removals.push([match.index, end])

    const value = (expression) =>
      expression && expression.type === 'Literal'
        ? String(expression.value)
        : expression && expression.type === 'TemplateLiteral' && expression.expressions.length === 0
          ? expression.quasis[0].value.cooked
          : ''
    if (match[1] === 'description') description = value(node)
    if (match[1] === 'metadata' && node.type === 'ObjectExpression' && !description) {
      const property = node.properties.find((p) => p.key && (p.key.name || p.key.value) === 'description')
      description = value(property && property.value)
    }
  }

  let output = source
  for (const [start, end] of removals.sort((a, b) => b[0] - a[0])) {
    output = output.slice(0, start) + output.slice(end)
  }
  return { body: output, description: description.replace(/\s+/g, ' ').trim() }
}

/* ── Links ───────────────────────────────────────────────────────────── */

function makeUrlResolver(route, routes) {
  return function resolveUrl(url) {
    if (!url || /^(https?:|mailto:|#)/.test(url)) return url
    const [pathPart, ...rest] = url.split('#')
    const anchor = rest.length ? `#${rest.join('#')}` : ''
    const absolutePath = pathPart.startsWith('/')
      ? pathPart
      : path.posix.join(route === '/' ? '/' : path.posix.dirname(route), pathPart)
    const normalized = absolutePath.replace(/\/$/, '') || '/'
    if (routes.has(normalized)) {
      return `${BASE_URL}${normalized === '/' ? '/index' : normalized}.md${anchor}`
    }
    return `${BASE_URL}${absolutePath}${anchor}`
  }
}

/** Apply `fn` to the parts of a line outside inline code spans. */
function outsideInlineCode(line, fn) {
  return line
    .split(/(`+[^`]*`+)/)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('')
}

function attributes(tag) {
  const attrs = {}
  for (const match of tag.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)'|\{\s*['"`]([^'"`]*)['"`]\s*\})/g)) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4]
  }
  return attrs
}

function convertInline(text, resolveUrl) {
  return outsideInlineCode(text, (part) =>
    part
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/\s*\{\{[^{}]*\}\}/g, '')
      .replace(/<MathSymbol>([\s\S]*?)<\/MathSymbol>/g, '$1')
      .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
      .replace(/<Tag\b[^>]*>[\s\S]*?<\/Tag>/g, '')
      .replace(/<a\s([^>]*)>([\s\S]*?)<\/a>/g, (_, attrs, label) => {
        const href = attributes(attrs).href
        return href ? `[${label.trim()}](${resolveUrl(href)})` : label
      })
      .replace(/<img\s([^>]*?)\/?>/g, (_, attrs) => {
        const { src, alt = '' } = attributes(attrs)
        return src ? `![${alt}](${resolveUrl(src)})` : ''
      })
      .replace(/(!?\[[^\]]*\])\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (_, label, url, title) => `${label}(${resolveUrl(url)}${title})`)
  )
}

/* ── JSX blocks ──────────────────────────────────────────────────────── */

const WRAPPERS = new Set(['CodeGroup', 'Row', 'Col', 'Properties', 'TabGroup'])

function convertBody(body, resolveUrl) {
  const lines = body.split('\n')
  const out = []
  // Open callouts and properties, outermost first. Each one rewrites the
  // lines emitted inside it; emitAt applies them innermost first.
  const contexts = []

  const transform = (context, line) => {
    if (context.type === 'callout') {
      if (context.first && line.trim()) {
        context.first = false
        line = `**${context.label}:** ${line.trim()}`
      }
      return [line ? `> ${line}` : '>']
    }
    // Property: the first text joins the "- `name` (type):" bullet.
    if (context.first) {
      if (!line.trim()) return []
      context.first = false
      const plain = !/^\s*([-*>|#]|\d+\.\s|```|~~~)/.test(line)
      return plain ? [`${context.header} ${line.trim()}`] : [context.header, `  ${line}`]
    }
    return [line ? `  ${line}` : '']
  }

  const emitAt = (line, depth) => {
    let emitted = [line]
    for (let i = depth - 1; i >= 0; i--) {
      emitted = emitted.flatMap((l) => transform(contexts[i], l))
    }
    out.push(...emitted)
  }
  const emit = (line) => emitAt(line, contexts.length)

  const closeContext = () => {
    const context = contexts.pop()
    // A property with no description still gets its bullet.
    if (context && context.type === 'property' && context.first) emitAt(context.header, contexts.length)
  }

  let fence = null
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    const fenceMatch = line.match(/^(\s*)(```+|~~~+)(.*)$/)
    if (fence) {
      emit(line)
      if (fenceMatch && fenceMatch[2].startsWith(fence) && !fenceMatch[3].trim()) fence = null
      continue
    }
    if (fenceMatch) {
      fence = fenceMatch[2]
      const title = fenceMatch[3].match(/\{\{\s*title:\s*['"]([^'"]+)['"]\s*\}\}/)
      const language = fenceMatch[3].replace(/\{\{[\s\S]*?\}\}/, '').trim()
      if (title) {
        emit(`${fenceMatch[1]}**${title[1]}**`)
        emit('')
      }
      emit(`${fenceMatch[1]}${fenceMatch[2]}${language}`)
      continue
    }

    // Join a JSX tag that spans several lines (e.g. <Button\n href=…\n />).
    if (/^\s*<[A-Za-z][\w.]*\b/.test(line)) {
      while (!/>/.test(line.replace(/=>/g, '')) && i + 1 < lines.length) {
        i += 1
        line = `${line} ${lines[i].trim()}`
      }
    }
    const trimmed = line.trim()

    // Diagrams: keep the Mermaid source as a code block.
    if (/^<Diagram\b/.test(trimmed)) {
      const caption = attributes(trimmed).caption
      const block = [line]
      while (!/<\/Diagram>/.test(block[block.length - 1]) && i + 1 < lines.length) {
        i += 1
        block.push(lines[i])
      }
      const source = block.join('\n').match(/\{`([\s\S]*?)`\}/)
      if (caption) {
        emit(`*${caption}*`)
        emit('')
      }
      if (source) {
        emit('```mermaid')
        source[1].trim().split('\n').forEach((sourceLine) => emit(sourceLine))
        emit('```')
      }
      continue
    }

    // <summary>…</summary> becomes a bold line; <details> wrappers go.
    if (/^<summary\b/.test(trimmed)) {
      let text = trimmed
      while (!/<\/summary>/.test(text) && i + 1 < lines.length) {
        i += 1
        text += ` ${lines[i].trim()}`
      }
      emit(`**${text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()}**`)
      continue
    }

    // Callouts become blockquotes.
    const calloutOpen = trimmed.match(/^<(Note|Warning)>(.*)$/)
    if (calloutOpen) {
      contexts.push({ type: 'callout', label: calloutOpen[1], first: true })
      const inline = calloutOpen[2].match(/^(.*)<\/(Note|Warning)>$/)
      if (inline) {
        emit(convertInline(inline[1], resolveUrl))
        closeContext()
      } else if (calloutOpen[2].trim()) {
        emit(convertInline(calloutOpen[2], resolveUrl))
      }
      continue
    }
    if (/^<\/(Note|Warning)>$/.test(trimmed)) {
      closeContext()
      continue
    }

    // Properties become list items: - `name` (type): description.
    const propertyOpen = trimmed.match(/^<Property\b([^>]*)>(.*)$/)
    if (propertyOpen) {
      const { name, type } = attributes(propertyOpen[1])
      const indent = line.match(/^\s*/)[0]
      const header = `${indent}- \`${name}\`${type ? ` (${type})` : ''}:`
      contexts.push({ type: 'property', header, first: true })
      const inline = propertyOpen[2].match(/^(.*)<\/Property>$/)
      if (inline) {
        emit(convertInline(inline[1], resolveUrl))
        closeContext()
      } else if (propertyOpen[2].trim()) {
        emit(convertInline(propertyOpen[2], resolveUrl))
      }
      continue
    }
    if (/^<\/Property>$/.test(trimmed)) {
      closeContext()
      continue
    }

    // Tab panels and titled code groups get a bold label.
    const panel = trimmed.match(/^<(TabPanel|TabGroup|CodeGroup)\b([^>]*)>$/)
    if (panel) {
      const title = attributes(panel[2]).title
      if (title && panel[1] !== 'TabGroup') {
        emit(`**${title}**`)
        emit('')
      }
      continue
    }

    // Buttons are links.
    if (/^<Button\b[\s\S]*\/>$/.test(trimmed)) {
      const { href, children } = attributes(trimmed)
      if (href && children) emit(`[${children}](${resolveUrl(href)})`)
      continue
    }

    // Wrapper and layout tags disappear; their contents stay.
    const tagOnly = trimmed.match(/^<\/?([A-Za-z][\w.]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>$/)
    if (tagOnly && (WRAPPERS.has(tagOnly[1]) || /^(TabPanel|div|span|details|p)$/.test(tagOnly[1]))) {
      continue
    }

    // Other self-closing components are interactive widgets: drop them.
    if (/^<[A-Z][\w.]*\b[^>]*\/>$/.test(trimmed)) continue

    emit(convertInline(line, resolveUrl))
  }

  return out.join('\n')
}

function toMarkdown(source, route, routes) {
  const { body, description } = stripEsm(source)
  const resolveUrl = makeUrlResolver(route, routes)
  const markdown = convertBody(body, resolveUrl)
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  const title = (markdown.match(/^# (.+)$/m) || [])[1] || ''
  const frontMatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `url: ${BASE_URL}${route === '/' ? '' : route}`,
    '---',
  ].join('\n')
  return `${frontMatter}\n\n${markdown}\n`
}

function main() {
  const repoRoot = process.cwd()
  const pagesRoot = path.join(repoRoot, 'src', 'pages')
  const publicRoot = path.join(repoRoot, 'public')

  if (!fs.existsSync(pagesRoot)) {
    console.error('src/pages directory not found. Nothing to do.')
    process.exit(0)
  }

  const mdxFiles = listMdxFilesRecursively(pagesRoot)
  const routes = new Set(mdxFiles.map((file) => routeForMdxPath(file, pagesRoot)))

  for (const mdxFileAbsolutePath of mdxFiles) {
    const destinationMarkdownAbsolutePath = convertMdxPathToMarkdownPublicPath(
      mdxFileAbsolutePath,
      pagesRoot,
      publicRoot
    )

    const destinationDirectory = path.dirname(destinationMarkdownAbsolutePath)
    ensureDirectoryExists(destinationDirectory)

    const mdxContents = fs.readFileSync(mdxFileAbsolutePath, 'utf8')
    const route = routeForMdxPath(mdxFileAbsolutePath, pagesRoot)
    fs.writeFileSync(destinationMarkdownAbsolutePath, toMarkdown(mdxContents, route, routes), 'utf8')
  }
}

main()
