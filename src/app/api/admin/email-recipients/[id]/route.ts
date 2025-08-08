import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const { id } = await params
  const { email, name, enabled } = await request.json()
  try {
    const updated = await prisma.emailRecipient.update({
      where: { id },
      data: { email, name, enabled }
    })
    return NextResponse.json({ recipient: updated })
  } catch (error) {
    console.error("Error actualizando destinatario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const { id } = await params
  try {
    await prisma.emailRecipient.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error eliminando destinatario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}