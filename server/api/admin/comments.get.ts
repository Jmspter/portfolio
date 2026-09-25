import { z } from 'zod'
import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { status } = parseQuery(event, z.object({
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  }))

  return useDb(event)
    .select()
    .from(schema.comments)
    .where(eq(schema.comments.status, status))
    .orderBy(desc(schema.comments.createdAt))
})
