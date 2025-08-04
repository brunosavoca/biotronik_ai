import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Verificar si Bruno ya existe
  const existingBruno = await prisma.user.findUnique({
    where: { email: 'bruno@biotronik.com' }
  })

  if (existingBruno) {
    console.log('✅ Bruno ya existe en la base de datos')
    return
  }

  // Crear contraseña hasheada
  const hashedPassword = await bcrypt.hash('bruno123', 12)

  // Crear usuario Bruno como SUPERADMIN
  const bruno = await prisma.user.create({
    data: {
      email: 'bruno@biotronik.com',
      name: 'Bruno Savoca',
      password: hashedPassword,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      specialty: 'Administración de Sistemas',
      hospital: 'Biotronik HQ',
      licenseNumber: 'SUPER-001'
    }
  })

  console.log('🎉 Usuario Bruno creado exitosamente:')
  console.log(`📧 Email: ${bruno.email}`)
  console.log(`👤 Nombre: ${bruno.name}`)
  console.log(`🔑 Rol: ${bruno.role}`)
  console.log(`🏥 Hospital: ${bruno.hospital}`)
  console.log('')
  console.log('🔐 Credenciales de acceso:')
  console.log('   Email: bruno@biotronik.com')
  console.log('   Password: bruno123')
  console.log('')
  console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })