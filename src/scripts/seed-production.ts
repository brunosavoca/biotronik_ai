import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed PRODUCTION de la base de datos...')

  // Verificar si Bruno ya existe
  const existingBruno = await prisma.user.findUnique({
    where: { email: 'bruno@biotronik.com' }
  })

  if (existingBruno) {
    console.log('✅ Bruno ya existe en la base de datos de producción')
    console.log('⚠️  Asegúrate de cambiar la contraseña por seguridad!')
    return
  }

  // Crear contraseña hasheada SEGURA para producción
  const productionPassword = process.env.BRUNO_PRODUCTION_PASSWORD || 'BrunoSecure2024!'
  const hashedPassword = await bcrypt.hash(productionPassword, 12)

  // Crear usuario Bruno como SUPERADMIN
  const bruno = await prisma.user.create({
    data: {
      email: 'bruno@biotronik.com',
      name: 'Bruno Savoca',
      password: hashedPassword,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      specialty: 'Administración de Sistemas Médicos',
      hospital: 'Biotronik Production',
      licenseNumber: 'SUPER-PROD-001'
    }
  })

  console.log('🎉 Usuario Bruno creado exitosamente en PRODUCCIÓN:')
  console.log(`📧 Email: ${bruno.email}`)
  console.log(`👤 Nombre: ${bruno.name}`)
  console.log(`🔑 Rol: ${bruno.role}`)
  console.log(`🏥 Hospital: ${bruno.hospital}`)
  console.log('')
  console.log('🔐 Credenciales de acceso PRODUCTION:')
  console.log('   Email: bruno@biotronik.com')
  console.log(`   Password: ${productionPassword}`)
  console.log('')
  console.log('🚨 CRÍTICO: ¡CAMBIA LA CONTRASEÑA INMEDIATAMENTE!')
  console.log('   1. Inicia sesión en /admin')
  console.log('   2. Ve a tu perfil')
  console.log('   3. Cambia la contraseña')
  console.log('   4. Usa una contraseña fuerte y única')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed de producción:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })