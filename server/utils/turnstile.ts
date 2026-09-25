import type { H3Event } from 'h3'

export async function verifyTurnstile(event: H3Event, token: string) {
  const { turnstileSecret } = useRuntimeConfig(event)
  if (!turnstileSecret) return // sem secret configurado: não valida (dev)

  const ip = getRequestHeader(event, 'cf-connecting-ip')
  const body = new URLSearchParams({ secret: turnstileSecret, response: token })
  if (ip) body.set('remoteip', ip)

  const res = await $fetch<{ success: boolean }>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body },
  )
  if (!res.success) {
    throw createError({ statusCode: 403, statusMessage: 'Falha na verificação anti-spam' })
  }
}
