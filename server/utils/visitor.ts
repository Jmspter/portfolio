import type { H3Event } from 'h3'

/** Identifica o visitante sem guardar dados pessoais. */
export async function visitorHash(event: H3Event) {
  const { visitorSalt } = useRuntimeConfig(event)
  const ip = getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event) ?? 'unknown'
  const ua = getRequestHeader(event, 'user-agent') ?? ''
  const data = new TextEncoder().encode(`${ip}|${ua}|${visitorSalt}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
}
