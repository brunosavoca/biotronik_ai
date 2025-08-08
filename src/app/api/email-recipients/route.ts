import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const recipients = await prisma.emailRecipient.findMany({
    where: { enabled: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true }
  })

  return NextResponse.json({ recipients })
}