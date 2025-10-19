import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { phone, address } = await request.json()

    if (!phone || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    await prisma.customer.update({
      where: { userId: session.user.id },
      data: {
        phone,
        address,
        kycStatus: 'pending' // Could be approved later by admin
      }
    })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}