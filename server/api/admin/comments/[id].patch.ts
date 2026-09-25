import { z } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400 })

  const { status } = await parseBody(event, z.object({
    status: z.enum(['pending', 'approved', 'rejected']),
  }))

  await useDb(event).update(schema.comments).set({ status }).where(eq(schema.comments.id, id))
  return { ok: true }
})
