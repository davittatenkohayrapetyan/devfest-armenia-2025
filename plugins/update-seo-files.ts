import { Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export function updateSeoFiles(basePath: string): Plugin {
  return {
    name: 'update-seo-files',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist')
      const baseUrl = 'https://devfest.am'
      const fullUrl = basePath === '/' ? baseUrl : `${baseUrl}${basePath.replace(/\/$/, '')}`
      
      // Update index.html meta tags
      const indexPath = resolve(outDir, 'index.html')
      try {
        let htmlContent = readFileSync(indexPath, 'utf-8')
        
        // Update og:url
        htmlContent = htmlContent.replace(
          /<meta property="og:url" content="[^"]*">/,
          `<meta property="og:url" content="${fullUrl}/">`
        )
        
        // Update twitter:url
        htmlContent = htmlContent.replace(
          /<meta property="twitter:url" content="[^"]*">/,
          `<meta property="twitter:url" content="${fullUrl}/">`
        )
        
        // Update canonical
        htmlContent = htmlContent.replace(
          /<link rel="canonical" href="[^"]*">/,
          `<link rel="canonical" href="${fullUrl}/">`
        )
        
        // Update JSON-LD structured data image URL
        htmlContent = htmlContent.replace(
          /"image":\s*"[^"]*og-image\.png"/,
          `"image": "${fullUrl}/og-image.png"`
        )
        
        writeFileSync(indexPath, htmlContent)
        console.log(`✓ Updated index.html meta tags with base URL: ${fullUrl}`)
      } catch (error) {
        console.error('Failed to update index.html:', error)
      }
      
      // Update robots.txt
      const robotsPath = resolve(outDir, 'robots.txt')
      try {
        const robotsContent = `User-agent: *
Allow: /

Sitemap: ${fullUrl}/sitemap.xml
`
        writeFileSync(robotsPath, robotsContent)
        console.log(`✓ Updated robots.txt with sitemap URL: ${fullUrl}/sitemap.xml`)
      } catch (error) {
        console.error('Failed to update robots.txt:', error)
      }
      
      // Update sitemap.xml
      const sitemapPath = resolve(outDir, 'sitemap.xml')
      try {
        const now = new Date().toISOString().split('T')[0]
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${fullUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${fullUrl}/#about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${fullUrl}/#agenda</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${fullUrl}/#sessions</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${fullUrl}/#workshops</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${fullUrl}/#speakers</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${fullUrl}/#location</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${fullUrl}/#partners</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${fullUrl}/#organizers</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`
        writeFileSync(sitemapPath, sitemapContent)
        console.log(`✓ Updated sitemap.xml with base URL: ${fullUrl}`)
      } catch (error) {
        console.error('Failed to update sitemap.xml:', error)
      }
    }
  }
}
