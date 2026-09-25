import { createRemoteJWKSet, jwtVerify } from 'jose'

// Protege /admin e /api/admin/*. O Cloudflare Access já barra a requisição
// na borda; aqui validamos o JWT também, para a API não depender só disso.
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) return

  if (import.meta.dev) return // liberado em desenvolvimento

  const { accessTeamDomain, accessAud } = useRuntimeConfig(event)
  if (!accessTeamDomain || !accessAud) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudflare Access não configurado' })
  }

  const token = getRequestHeader(event, 'cf-access-jwt-assertion')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })

  jwks ??= createRemoteJWKSet(new URL(`https://${accessTeamDomain}/cdn-cgi/access/certs`))

  try {
    await jwtVerify(token, jwks, {
      issuer: `https://${accessTeamDomain}`,
      audience: accessAud,
    })
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado' })
  }
})
