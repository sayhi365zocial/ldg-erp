import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = 'LDG2025!' // Default password - CHANGE AFTER FIRST LOGIN
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email: 'sayhi@365zocial.com' },
    update: {},
    create: {
      email: 'sayhi@365zocial.com',
      name: 'Wirawat Lianudom',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('📧 Email:', user.email)
  console.log('🔑 Password:', password)
  console.log('⚠️  Please change your password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
