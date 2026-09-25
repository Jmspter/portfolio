import { queryCollection } from '@nuxt/content/nitro'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Data "03 Dez 2025" / ISO → ISO 8601 (para <lastmod>). */
function isoOf(date?: string) {
  if (!date) return ''
  const parsed = Date.parse(date)
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString()
  const match = date.match(/^(\d{1,2})(?:\s+de)?\s+([a-z]{3})(?:\s+de)?\s+(\d{4})$/i)
  if (!match) return ''
  const months: Record<string, number> = {
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
    feb: 1, apr: 3, aug: 8, sep: 9, oct: 10, dec: 11,
  }
  const month = months[match[2].toLowerCase()]
  return month === undefined ? '' : new Date(Date.UTC(Number(match[3]), month, Number(match[1]))).toISOString()
}

export default defineEventHandler(async (event) => {
  const base = String(useRuntimeConfig(event).public.siteUrl || '').replace(/\/+$/, '')

  const [posts, projects] = await Promise.all([
    queryCollection(event, 'blog_pt').all(),
    queryCollection(event, 'projects_pt').all(),
  ])

  const staticPaths = ['/', '/about', '/contact', '/blog', '/projects']
  const urls = new Map<string, string>()

  staticPaths.forEach(path => urls.set(path, ''))

  posts.forEach((post) => {
    urls.set((post.path ?? '').replace(/^\/pt/, '') || '/', isoOf(post.date))
  })

  projects.forEach((project) => {
    urls.set((project.path ?? '').replace(/^\/pt/, '') || '/projects', '')
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls.entries()]
    .map(([path, lastmod]) => {
      const loc = `${base}${path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`}`
      const lastmodTag = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : ''
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodTag}\n  </url>`
    })
    .join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})