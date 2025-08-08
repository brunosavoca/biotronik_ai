import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const recipients = await prisma.emailRecipient.findMany({
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json({ recipients })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { email, name } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
  }

  try {
    const recipient = await prisma.emailRecipient.create({
      data: { email, name }
    })
    return NextResponse.json({ recipient })
  } catch (error: unknown) {
    const err = error as { code?: string }
    if (err.code === "P2002") {
      return NextResponse.json({ error: "El email ya existe" }, { status: 400 })
    }
    console.error("Error creando destinatario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}