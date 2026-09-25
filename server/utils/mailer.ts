import type { H3Event } from 'h3'

interface Mail {
  subject: string
  text: string
  replyTo?: string
}

export async function sendMail(event: H3Event, mail: Mail) {
  const { resendApiKey, contactTo, contactFrom } = useRuntimeConfig(event)

  if (!resendApiKey) {
    console.info('[mailer] NUXT_RESEND_API_KEY vazio, e-mail apenas logado:', mail)
    return
  }

  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: {
      from: contactFrom,
      to: contactTo,
      subject: mail.subject,
      text: mail.text,
      reply_to: mail.replyTo,
    },
  })
}
