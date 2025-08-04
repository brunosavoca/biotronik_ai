import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Obtener conversación específica con todos sus mensajes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: { 
        id,
        userId: session.user.id // Solo conversaciones del usuario
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error al obtener conversación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar título de conversación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { title } = await request.json();
    
    // Verificar que la conversación pertenece al usuario
    const existingConversation = await prisma.conversation.findFirst({
      where: { 
        id,
        userId: session.user.id
      }
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }
    
    const conversation = await prisma.conversation.update({
      where: { id },
      data: { title }
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error al actualizar conversación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar conversación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar que la conversación pertenece al usuario
    const existingConversation = await prisma.conversation.findFirst({
      where: { 
        id,
        userId: session.user.id
      }
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    await prisma.conversation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar conversación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}