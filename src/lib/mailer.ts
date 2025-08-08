import nodemailer from "nodemailer"

export interface SendEmailOptions {
  to: string[]
  subject: string
  html: string
  attachments?: { filename: string; content: string; contentType?: string }[]
}

export function createTransport() {
  const host = process.env.EMAIL_SERVER_HOST
  const port = Number(process.env.EMAIL_SERVER_PORT || 587)
  const user = process.env.EMAIL_SERVER_USER
  const pass = process.env.EMAIL_SERVER_PASSWORD

  if (!host || !user || !pass) {
    throw new Error("Configuración SMTP faltante. Defina EMAIL_SERVER_HOST, EMAIL_SERVER_USER y EMAIL_SERVER_PASSWORD")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  })
}

export async function sendEmail(options: SendEmailOptions) {
  const from = process.env.EMAIL_FROM || "no-reply@biotronik.local"
  const transporter = createTransport()
  const info = await transporter.sendMail({
    from,
    to: options.to.join(","),
    subject: options.subject,
    html: options.html,
    attachments: options.attachments
  })
  return info
}