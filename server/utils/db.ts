import type { H3Event } from 'h3'
import { drizzle } from 'drizzle-orm/d1'
import * as tables from '../database/schema'

// Auto-importado pelo Nitro: use `schema.comments`, `schema.reactions`
export const schema = tables

export function useDb(event: H3Event) {
  const env = event.context.cloudflare?.env as { DB?: any } | undefined
  if (!env?.DB) {
    throw createError({ statusCode: 500, statusMessage: 'Binding D1 "DB" não encontrado' })
  }
  return drizzle(env.DB, { schema: tables })
}
