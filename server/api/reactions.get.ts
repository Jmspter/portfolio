import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { postId } = parseQuery(event, z.object({ postId: z.string().min(1).max(100) }))
  const db = useDb(event)
  const me = await visitorHash(event)

  const rows = await db
    .select({
      type: schema.reactions.type,
      count: sql<number>`count(*)`,
      mine: sql<number>`sum(case when ${schema.reactions.visitorHash} = ${me} then 1 else 0 end)`,
    })
    .from(schema.reactions)
    .where(eq(schema.reactions.postId, postId))
    .groupBy(schema.reactions.type)

  return rows.map(r => ({ type: r.type, count: Number(r.count), mine: Number(r.mine) > 0 }))
})
