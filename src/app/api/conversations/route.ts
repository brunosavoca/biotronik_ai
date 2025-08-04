import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Listar todas las conversaciones del usuario autenticado
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        },
        _count: {
          select: { messages: true }
        }
      }
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear nueva conversación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { title } = await request.json();
    
    const conversation = await prisma.conversation.create({
      data: {
        title: title || "Nueva consulta médica",
        userId: session.user.id
      }
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error al crear conversación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}