import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log('Kite webhook received:', body)

    // Parse the webhook data
    const webhookData = JSON.parse(body)

    // Process order updates here
    // You can store order status changes in your database
    // Example: Update order status, send notifications, etc.

    console.log('Order update:', webhookData)

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}