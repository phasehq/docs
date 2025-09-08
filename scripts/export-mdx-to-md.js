'use strict'

const fs = require('fs')
const path = require('path')

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

function main() {
  const repoRoot = process.cwd()
  const pagesRoot = path.join(repoRoot, 'src', 'pages')
  const publicRoot = path.join(repoRoot, 'public')

  if (!fs.existsSync(pagesRoot)) {
    console.error('src/pages directory not found. Nothing to do.')
    process.exit(0)
  }

  const mdxFiles = listMdxFilesRecursively(pagesRoot)

  for (const mdxFileAbsolutePath of mdxFiles) {
    const destinationMarkdownAbsolutePath = convertMdxPathToMarkdownPublicPath(
      mdxFileAbsolutePath,
      pagesRoot,
      publicRoot
    )

    const destinationDirectory = path.dirname(destinationMarkdownAbsolutePath)
    ensureDirectoryExists(destinationDirectory)

    const mdxContents = fs.readFileSync(mdxFileAbsolutePath, 'utf8')
    fs.writeFileSync(destinationMarkdownAbsolutePath, mdxContents, 'utf8')
  }
}

main()


