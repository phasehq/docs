'use strict'

const fs = require('fs')
const path = require('path')
const vm = require('vm')

// Links always point at the production docs, never a preview deployment.
const BASE_URL = 'https://docs.phase.dev'
const PAGES_DIR = path.join(process.cwd(), 'src', 'pages')

// A quoted JS string literal: '...', "..." or `...`, allowing escapes.
const STRING = String.raw`(['"\x60])((?:\\.|(?!\1)[^\\])*)\1`

function readNavigation() {
  const navFile = path.join(process.cwd(), 'src', 'components', 'Navigation.jsx')
  const src = fs.readFileSync(navFile, 'utf8')
  const match = src.match(/export const navigation = (\[[\s\S]*?\n\])/)
  if (!match) return []
  // The navigation is a plain array literal of titles and hrefs.
  return vm.runInNewContext(match[1])
}

function pageFile(href) {
  const route = href === '/' ? 'index' : href.replace(/^\//, '')
  return [`${route}.mdx`, path.join(route, 'index.mdx')]
    .map((candidate) => path.join(PAGES_DIR, candidate))
    .find((file) => fs.existsSync(file))
}

// The page's `description` export, or `metadata.description` on the API pages.
function readDescription(href) {
  const file = pageFile(href)
  if (!file) return ''
  const src = fs.readFileSync(file, 'utf8')
  const match =
    src.match(new RegExp(String.raw`export const description\s*=\s*` + STRING)) ||
    src.match(
      new RegExp(String.raw`export const metadata\s*=\s*\{[\s\S]*?description:\s*` + STRING)
    )
  if (!match) return ''
  return match[2].replace(/\\(.)/g, '$1').replace(/\s+/g, ' ').trim()
}

function buildLlmsText(navigation) {
  const lines = [
    '# Phase Docs',
    '',
    `> ${readDescription('/')}`,
    '',
    'Each link points to the Markdown version of a page. Remove `.md` from the URL for the HTML page.',
    '',
  ]
  const seen = new Set()
  for (const group of navigation) {
    const links = group.links.filter((link) => !seen.has(link.href))
    if (links.length === 0) continue
    lines.push(`## ${group.title}`, '')
    for (const link of links) {
      seen.add(link.href)
      const mdPath = link.href === '/' ? '/index.md' : `${link.href}.md`
      const description = readDescription(link.href)
      lines.push(`- [${link.title}](${BASE_URL}${mdPath})${description ? `: ${description}` : ''}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function main() {
  const navigation = readNavigation()
  const content = buildLlmsText(navigation)
  // Runs in postbuild, after `next build` has already copied public/ into
  // the export, so the file is written straight into out/.
  const outFile = path.join(process.cwd(), 'out', 'llms.txt')
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, content, 'utf8')
  const count = navigation.reduce((n, group) => n + group.links.length, 0)
  console.log(`llms.txt generated with ${count} links -> ${outFile}`)
}

main()
