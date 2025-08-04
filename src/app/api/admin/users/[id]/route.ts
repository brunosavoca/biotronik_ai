import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole, UserStatus } from "@prisma/client"

// GET - Obtener usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        specialty: true,
        licenseNumber: true,
        hospital: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: { conversations: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Solo SUPERADMIN puede editar usuarios
    if (!session || session.user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "Solo SUPERADMIN puede editar usuarios" }, { status: 403 });
    }

    const { id } = await params;
    const { name, email, role, status, specialty, licenseNumber, hospital, password } = await request.json();

    // Obtener usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Solo SUPERADMIN puede modificar roles SUPERADMIN o ADMIN
    if (role === UserRole.SUPERADMIN || role === UserRole.ADMIN || currentUser.role === UserRole.SUPERADMIN) {
      if (session.user.role !== UserRole.SUPERADMIN) {
        return NextResponse.json({ error: "Solo SUPERADMIN puede modificar administradores" }, { status: 403 })
      }
    }

    // Prevenir que se modifique a sí mismo si es el último SUPERADMIN
    if (currentUser.role === UserRole.SUPERADMIN && session.user.id === id) {
      const superAdminCount = await prisma.user.count({
        where: { role: UserRole.SUPERADMIN, status: UserStatus.ACTIVE }
      })
      
      if (superAdminCount === 1 && (role !== UserRole.SUPERADMIN || status !== UserStatus.ACTIVE)) {
        return NextResponse.json({ error: "No puedes desactivar o cambiar el rol del último SUPERADMIN" }, { status: 400 })
      }
    }

    // Preparar datos de actualización
    const updateData: any = {
      name,
      email,
      role,
      status,
      specialty,
      licenseNumber,
      hospital
    }

    // Solo actualizar contraseña si se proporciona una nueva
    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        specialty: true,
        licenseNumber: true,
        hospital: true,
        createdAt: true,
        lastLoginAt: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "Solo SUPERADMIN puede eliminar usuarios" }, { status: 403 });
    }

    const { id } = await params;

    // Obtener usuario a eliminar
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Prevenir eliminar el último SUPERADMIN
    if (userToDelete.role === UserRole.SUPERADMIN) {
      const superAdminCount = await prisma.user.count({
        where: { role: UserRole.SUPERADMIN, status: UserStatus.ACTIVE }
      })
      
      if (superAdminCount === 1) {
        return NextResponse.json({ error: "No puedes eliminar el último SUPERADMIN" }, { status: 400 })
      }
    }

    // Prevenir auto-eliminación
    if (session.user.id === id) {
      return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}