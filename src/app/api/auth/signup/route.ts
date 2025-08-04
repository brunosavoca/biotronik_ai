import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole, UserStatus } from "@prisma/client"

// Emails permitidos para el registro
const ALLOWED_EMAILS = [
  "alfredo@biotronik.ai",
  "bruno@biotronik.ai"
]

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, specialty, licenseNumber, hospital } = await request.json()

    // Validaciones básicas
    if (!email || !name || !password) {
      return NextResponse.json({ 
        error: "Email, nombre y contraseña son requeridos" 
      }, { status: 400 })
    }

    // Validar email permitido
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json({ 
        error: "Lo sentimos, el registro está restringido solo para personal autorizado de Biotronik. Si crees que esto es un error, contacta al administrador del sistema." 
      }, { status: 403 })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json({ 
        error: "La contraseña debe tener al menos 6 caracteres" 
      }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: "Ya existe una cuenta con este email" 
      }, { status: 400 })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determinar el rol basado en el email
    let role: UserRole = UserRole.USER
    if (email.toLowerCase() === "bruno@biotronik.ai") {
      role = UserRole.SUPERADMIN
    } else if (email.toLowerCase() === "alfredo@biotronik.ai") {
      role = UserRole.ADMIN
    }

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role,
        status: UserStatus.ACTIVE,
        specialty: specialty || null,
        licenseNumber: licenseNumber || null,
        hospital: hospital || "Biotronik"
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

    return NextResponse.json({ 
      message: "Usuario creado exitosamente",
      user: newUser 
    })

  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}