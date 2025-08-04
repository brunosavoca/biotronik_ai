import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole, UserStatus } from "@prisma/client"

// GET - Listar todos los usuarios (Solo SUPERADMIN y ADMIN)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
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
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo usuario (Solo SUPERADMIN y ADMIN)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { email, name, password, role, specialty, licenseNumber, hospital } = await request.json()

    // Validaciones
    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, nombre y contraseña son requeridos" }, { status: 400 })
    }

    // Solo SUPERADMIN puede crear otros SUPERADMIN o ADMIN
    if (role === UserRole.SUPERADMIN || role === UserRole.ADMIN) {
      if (session.user.role !== UserRole.SUPERADMIN) {
        return NextResponse.json({ error: "Solo SUPERADMIN puede crear otros administradores" }, { status: 403 })
      }
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está en uso" }, { status: 400 })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || UserRole.USER,
        specialty,
        licenseNumber,
        hospital
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        specialty: true,
        licenseNumber: true,
        hospital: true,
        createdAt: true
      }
    })

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}