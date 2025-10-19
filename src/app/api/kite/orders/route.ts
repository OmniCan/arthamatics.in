/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
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
    const orders = await userKite.getOrders()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error getting orders:', error)
    return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ['tradingsymbol', 'exchange', 'transaction_type', 'order_type', 'quantity', 'product']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const userKite = await kiteService.getKiteInstance(session.user.id)
    const order = await userKite.placeOrder('regular', orderData as any)

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error placing order:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}