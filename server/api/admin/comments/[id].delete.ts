import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400 })

  await useDb(event).delete(schema.comments).where(eq(schema.comments.id, id))
  return { ok: true }
})
