import { z } from 'zod'
import { and, asc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { postId } = parseQuery(event, z.object({ postId: z.string().min(1).max(100) }))
  const db = useDb(event)

  return db
    .select({
      id: schema.comments.id,
      author: schema.comments.author,
      body: schema.comments.body,
      createdAt: schema.comments.createdAt,
    })
    .from(schema.comments)
    .where(and(eq(schema.comments.postId, postId), eq(schema.comments.status, 'approved')))
    .orderBy(asc(schema.comments.createdAt))
})
