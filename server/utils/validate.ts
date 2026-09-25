import type { H3Event } from 'h3'
import type { ZodTypeAny, z } from 'zod'

export async function parseBody<T extends ZodTypeAny>(event: H3Event, schema: T): Promise<z.infer<T>> {
  const result = schema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados inválidos',
      data: result.error.flatten().fieldErrors,
    })
  }
  return result.data
}

export function parseQuery<T extends ZodTypeAny>(event: H3Event, schema: T): z.infer<T> {
  const result = schema.safeParse(getQuery(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Parâmetros inválidos' })
  }
  return result.data
}
