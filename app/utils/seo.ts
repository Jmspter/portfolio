/** Helpers de SEO: URLs absolutas (canonical/og/sitemap) e datas ISO. */

export const siteName = 'James Peter'

/** Nome do site e título em template de página: "Página · James Peter". */
export function withSiteTitle(title: string) {
  return `${title} · ${siteName}`
}

/**
 * Liga os helpers a uma base fixa, capturada AQUI (no setup) — NUNCA dentro
 * de um `computed`/getter resolvido pela unhead, que roda fora do contexto
 * Nuxt e quebraria com `useRuntimeConfig()` (NUXT_E1001).
 */
export function resolveSiteUrl() {
  const base = String(useRuntimeConfig().public.siteUrl || '').replace(/\/+$/, '')

  /** Converte um caminho interno em URL absoluta. */
  function absoluteUrl(path = '/') {
    if (/^https?:\/\//i.test(path)) return path
    if (!base) return path
    return `${base}${path.startsWith('/') ? path : `/${path}`}`
  }

  /** Imagem absoluta para og:image/twitter:image (null → undefined). */
  function absoluteImage(src?: string | null) {
    if (!src) return undefined
    return /^(https?:)?\/\//i.test(src) ? src : absoluteUrl(src)
  }

  return { absoluteUrl, absoluteImage }
}

/** Data do frontmatter ("03 Dez 2025") → ISO 8601 para schema.org. */
export function publishedIso(date?: string) {
  const ts = date ? dateKey(date) : 0
  return ts ? new Date(ts).toISOString() : undefined
}