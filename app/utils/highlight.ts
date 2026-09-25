/** Escapa HTML para exibição segura em v-html. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Envolve as ocorrências de `query` em <mark> dentro do texto, com escape
 * completo do conteúdo (seguro para v-html). Comparação case-insensitive.
 */
export function highlightMatches(text: string | undefined, query: string) {
  if (!text) return ''
  const escaped = escapeHtml(text)
  const q = query.trim().toLocaleLowerCase()
  if (!q) return escaped
  const lower = text.toLocaleLowerCase()
  const out: string[] = []
  let index = 0
  while (index < text.length) {
    const hit = lower.indexOf(q, index)
    if (hit === -1) {
      out.push(escapeHtml(text.slice(index)))
      break
    }
    if (hit > index) out.push(escapeHtml(text.slice(index, hit)))
    out.push(`<mark>${escapeHtml(text.slice(hit, hit + q.length))}</mark>`)
    index = hit + q.length
  }
  return out.join('')
}