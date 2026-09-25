import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  token: z.string().min(1),
  website: z.string().max(0).optional(), // honeypot: bots preenchem, humanos não
})

export default defineEventHandler(async (event) => {
  const body = await parseBody(event, bodySchema)
  await verifyTurnstile(event, body.token)

  await sendMail(event, {
    subject: `Contato do portfólio: ${body.name}`,
    text: `De: ${body.name} <${body.email}>\n\n${body.message}`,
    replyTo: body.email,
  })

  return { ok: true }
})
