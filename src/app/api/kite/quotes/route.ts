import { NextRequest, NextResponse } from 'next/server'
import { kiteService } from '@/lib/kite'

export async function POST(request: NextRequest) {
  try {
    const { instruments } = await request.json()

    if (!instruments || !Array.isArray(instruments)) {
      return NextResponse.json({ error: 'Instruments array is required' }, { status: 400 })
    }

    const quotes = await kiteService.getQuote(instruments)

    return NextResponse.json({ quotes })
  } catch (error) {
    console.error('Error getting quotes:', error)
    return NextResponse.json({ error: 'Failed to get quotes' }, { status: 500 })
  }
}