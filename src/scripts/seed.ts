import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@arthamatics.in' },
    update: {},
    create: {
      email: 'admin@arthamatics.in',
      password: hashedPassword,
      role: 'admin',
      customer: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '1234567890',
          address: 'Admin Address',
          kycStatus: 'approved'
        }
      }
    }
  })

  console.log('Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })