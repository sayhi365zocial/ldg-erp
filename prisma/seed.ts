import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'sayhi@365zocial.com' },
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'sayhi@365zocial.com',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('📧 Email: sayhi@365zocial.com')
  console.log('🔑 Password: admin123')
  console.log('')
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
