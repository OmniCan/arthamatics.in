import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { kiteService } from '@/lib/kite'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions)

    if (!authSession?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestToken } = await request.json()

    if (!requestToken) {
      return NextResponse.json({ error: 'Request token is required' }, { status: 400 })
    }

    const session = await kiteService.generateSession(requestToken)

    // Store access token in database
    await prisma.user.update({
      where: { id: authSession.user.id },
      data: {
        kiteToken: session.access_token,
        kiteTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    // Set access token for current session
    kiteService.setAccessToken(session.access_token)

    return NextResponse.json({
      success: true,
      session: {
        access_token: session.access_token,
        user_id: session.user_id,
        user_name: session.user_name,
        email: session.email
      }
    })
  } catch (error) {
    console.error('Error generating Kite session:', error)
    return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 })
  }
}