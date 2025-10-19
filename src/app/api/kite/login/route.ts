import { NextResponse } from 'next/server'
import { kiteService } from '@/lib/kite'

export async function GET() {
  try {
    const loginURL = kiteService.getLoginURL()
    return NextResponse.json({ loginURL })
  } catch (error) {
    console.error('Error getting Kite login URL:', error)
    return NextResponse.json({ error: 'Failed to get login URL' }, { status: 500 })
  }
}