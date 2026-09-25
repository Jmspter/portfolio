import { defineConfig } from 'drizzle-kit'

// Só gera as migrations SQL; quem aplica é o `wrangler d1 migrations apply`.
export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema.ts',
  out: './drizzle',
})
