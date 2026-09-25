/** Nome da coleção do Nuxt Content para o idioma atual, ex.: blog_pt */
export function useCollectionName(base: 'blog' | 'projects') {
  const { locale } = useI18n()
  return computed(() => `${base}_${locale.value}` as 'blog_pt' | 'blog_en' | 'projects_pt' | 'projects_en')
}

export function readingMinutes(text = '') {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200))
}

const monthsPt: Record<string, number> = {
  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
  jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
}
const monthsEn: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
}

/**
 * Timestamp comparável para datas em ISO ("2026-01-15") ou formatos nominais:
 * "03 Dez 2025", "20 de Ago de 2025", "05 de Nov de 2025" (pt/en).
 */
export function dateKey(date: string) {
  const iso = Date.parse(date)
  if (!Number.isNaN(iso)) return iso
  const match = date.match(/^(\d{1,2})(?:\s+de)?\s+([a-z]{3})(?:\s+de)?\s+(\d{4})$/i)
  if (!match) return 0
  const month = monthsPt[match[2].toLowerCase()] ?? monthsEn[match[2].toLowerCase()]
  return month === undefined ? 0 : Date.UTC(Number(match[3]), month, Number(match[1]))
}

/** postId configurável no frontmatter; sem ele, usa o slug do caminho. */
export function postIdOf(post: { postId?: string; path: string }) {
  return post.postId ?? post.path.split('/').filter(Boolean).pop() ?? post.path
}

export type CoverRef = { kind: 'path'; src: string } | { kind: 'cover'; id: string }

/** Aceita tanto `image: "/blog/x.webp"` (caminho direto) quanto `cover: "chave"` (pipeline gerado). */
export function coverOf(post: { image?: string; cover?: string }): CoverRef | null {
  if (post.image) return { kind: 'path', src: post.image }
  if (post.cover) return { kind: 'cover', id: post.cover }
  return null
}

const readTimeRe = /(\d+)\s*(?:min(?:uto)?s?|min\b|minutos?|minutes?)/i

/** Usa `readTime` do frontmatter ("12 min read") quando presente; senão calcula do corpo. */
export function readMinutesOf(post: { readTime?: string, rawbody?: unknown }) {
  const explicit = post.readTime?.match(readTimeRe)?.[1]
  if (explicit) return Math.max(1, Number(explicit))
  return readingMinutes(String(post.rawbody ?? ''))
}
