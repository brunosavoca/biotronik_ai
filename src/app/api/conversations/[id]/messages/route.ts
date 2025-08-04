import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Agregar mensaje a conversación
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { role, content, images = [] } = await request.json();
    
    // Verificar que la conversación pertenece al usuario
    const conversation = await prisma.conversation.findFirst({
      where: { 
        id,
        userId: session.user.id
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }
    
    const message = await prisma.message.create({
      data: {
        role,
        content,
        images,
        conversationId: id
      }
    });

    // Actualizar timestamp de la conversación
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error al crear mensaje:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}