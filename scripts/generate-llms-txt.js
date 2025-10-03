'use strict'

const fs = require('fs')
const path = require('path')

function readNavigation() {
  const navFile = path.join(process.cwd(), 'src', 'components', 'Navigation.jsx')
  const src = fs.readFileSync(navFile, 'utf8')
  const match = src.match(/export const navigation = \[(.|\n|\r)*?\n\]/)
  if (!match) return []
  // Very light parsing: find all href: '...'
  const hrefs = [...match[0].matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1])
  // Deduplicate while preserving order
  const seen = new Set()
  const unique = []
  for (const h of hrefs) {
    if (!seen.has(h)) {
      seen.add(h)
      unique.push(h)
    }
  }
  return unique
}

function buildLlmsText(baseUrl, routes) {
  // Follow llms.txt simple convention: markdown links to canonical .md copies
  // Root-like sections get .md directly; nested already handled by exporter
  const lines = []
  lines.push(`# Phase Documentation llms.txt`) 
  lines.push(``) 
  for (const route of routes) {
    const mdPath = route === '/' ? '/index.md' : `${route}.md`
    lines.push(`- [${route === '/' ? 'Home' : route.replace(/^\//, '')}](${baseUrl}${mdPath})`)
  }
  lines.push('')
  return lines.join('\n')
}

function main() {
  const baseUrl = process.env.CF_PAGES_URL || 'https://docs.phase.dev'
  const routes = readNavigation()
  const content = buildLlmsText(baseUrl, routes)
  const outFile = path.join(process.cwd(), 'public', 'llms.txt')
  fs.writeFileSync(outFile, content, 'utf8')
  console.log(`llms.txt generated with ${routes.length} routes -> ${outFile}`)
}

main()

