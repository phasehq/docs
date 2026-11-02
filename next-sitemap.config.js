/** @type {import('next-sitemap').IConfig} */
const path = require('path')
const glob = require('fast-glob')

module.exports = {
  // Not CF_PAGES_URL: on Cloudflare that's the pages.dev URL of the deployment
  siteUrl: 'https://docs.phase.dev',
  // We maintain robots.txt ourselves in public/robots.txt
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  // Runs in postbuild, after public/ has been copied into the export
  outDir: 'out',
  additionalPaths: async (config) => {
    const pagesDir = path.join(process.cwd(), 'src', 'pages')
    const files = glob.sync('**/*.mdx', {
      cwd: pagesDir,
      ignore: ['**/api/**'],
    })
    const urls = files
      .map((file) => {
        let route = '/' + file.replace(/\.mdx$/, '')
        route = route.replace(/(^|\/)index$/, '') || '/'
        return route
      })
      // Deduplicate and sort for stability
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort()

    return urls.map((loc) => ({ loc }))
  },
}
