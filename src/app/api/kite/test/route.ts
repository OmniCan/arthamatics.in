import { NextResponse } from 'next/server'
import { kiteService } from '@/lib/kite'

export async function GET() {
  try {
    // Test if API key is configured
    const apiKey = process.env.KITE_API_KEY
    const apiSecret = process.env.KITE_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({
        status: 'error',
        message: 'Kite API credentials not configured'
      }, { status: 500 })
    }

    // Test login URL generation
    const loginURL = kiteService.getLoginURL()

    return NextResponse.json({
      status: 'success',
      message: 'Kite API credentials configured successfully',
      apiKeyConfigured: !!apiKey,
      apiSecretConfigured: !!apiSecret,
      loginURLEndsWith: loginURL.split('?')[0] // Don't expose full URL for security
    })
  } catch (error) {
    console.error('Kite test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test Kite API configuration'
    }, { status: 500 })
  }
}