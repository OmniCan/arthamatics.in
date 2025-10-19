import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { kiteService } from '@/lib/kite'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userKite = await kiteService.getKiteInstance(session.user.id)
    const holdings = await userKite.getHoldings()

    return NextResponse.json({ holdings })
  } catch (error) {
    console.error('Error getting holdings:', error)
    return NextResponse.json({ error: 'Failed to get holdings' }, { status: 500 })
  }
}