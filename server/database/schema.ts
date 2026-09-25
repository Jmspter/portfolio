import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core'

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: text('post_id').notNull(),
  author: text('author').notNull(),
  body: text('body').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] })
    .notNull()
    .default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
}, t => [index('comments_post_status_idx').on(t.postId, t.status)])

export const reactions = sqliteTable('reactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: text('post_id').notNull(),
  type: text('type').notNull(),
  // hash de IP + user-agent + salt; o IP em si nunca é guardado
  visitorHash: text('visitor_hash').notNull(),
}, t => [uniqueIndex('reactions_unique').on(t.postId, t.type, t.visitorHash)])
