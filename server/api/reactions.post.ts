import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const bodySchema = z.object({
  postId: z.string().min(1).max(100),
  type: z.enum(['like', 'love']),
})

// Alterna a reação: se o visitante já reagiu, remove; senão, adiciona.
export default defineEventHandler(async (event) => {
  const { postId, type } = await parseBody(event, bodySchema)
  const db = useDb(event)
  const hash = await visitorHash(event)

  const where = and(
    eq(schema.reactions.postId, postId),
    eq(schema.reactions.type, type),
    eq(schema.reactions.visitorHash, hash),
  )

  const existing = await db.select({ id: schema.reactions.id }).from(schema.reactions).where(where).limit(1)

  if (existing.length) {
    await db.delete(schema.reactions).where(where)
    return { active: false }
  }

  await db.insert(schema.reactions).values({ postId, type, visitorHash: hash }).onConflictDoNothing()
  return { active: true }
})
