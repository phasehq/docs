/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://docs.phase.dev',
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: false,
}
