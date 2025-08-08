import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/mailer"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { subject, html, overrideRecipients } = await request.json()
    if (!html) return NextResponse.json({ error: "Contenido del reporte requerido" }, { status: 400 })

    let recipients: string[] = []
    if (Array.isArray(overrideRecipients) && overrideRecipients.length > 0) {
      recipients = overrideRecipients
    } else {
      const list = await prisma.emailRecipient.findMany({ where: { enabled: true } })
      recipients = list.map(r => r.email)
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No hay destinatarios configurados" }, { status: 400 })
    }

    const info = await sendEmail({
      to: recipients,
      subject: subject || "Reporte Médico Generado",
      html
    })

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error: unknown) {
    console.error("Error enviando reporte por email:", error)
    const message = error instanceof Error ? error.message : 'Error al enviar email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}