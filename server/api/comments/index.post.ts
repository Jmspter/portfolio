import { z } from 'zod'

const bodySchema = z.object({
  postId: z.string().min(1).max(100),
  author: z.string().trim().min(2).max(60),
  body: z.string().trim().min(2).max(2000),
  token: z.string().min(1),
  website: z.string().max(0).optional(),
})

export default defineEventHandler(async (event) => {
  const { token, website: _honeypot, ...data } = await parseBody(event, bodySchema)
  await verifyTurnstile(event, token)

  // status "pending" por padrão: só aparece depois de aprovado no /admin
  await useDb(event).insert(schema.comments).values(data)

  setResponseStatus(event, 201)
  return { ok: true, status: 'pending' }
})
