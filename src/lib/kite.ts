/* eslint-disable @typescript-eslint/no-explicit-any */
import { KiteConnect } from 'kiteconnect'
import { prisma } from './prisma'

interface OrderParams {
  tradingsymbol: string
  exchange: string
  transaction_type: string
  order_type: string
  quantity: number
  price?: number
  trigger_price?: number
  product: string
}

export class KiteService {
  private kite: InstanceType<typeof KiteConnect>

  constructor() {
    this.kite = new KiteConnect({
      api_key: process.env.KITE_API_KEY!
    }) as InstanceType<typeof KiteConnect>
  }

  // Get Kite instance with user's access token
  async getKiteInstance(userId: string): Promise<InstanceType<typeof KiteConnect>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kiteToken: true, kiteTokenExpiry: true }
    })

    if (!user?.kiteToken) {
      throw new Error('Kite access token not found')
    }

    if (user.kiteTokenExpiry && new Date() > user.kiteTokenExpiry) {
      throw new Error('Kite access token expired')
    }

    const userKite = new KiteConnect({
      api_key: process.env.KITE_API_KEY!
    }) as InstanceType<typeof KiteConnect>

    userKite.setAccessToken(user.kiteToken)
    return userKite
  }

  // Generate login URL for OAuth
  getLoginURL(): string {
    return this.kite.getLoginURL()
  }

  // Generate session after user authorization
  async generateSession(requestToken: string): Promise<any> {
    try {
      const response = await this.kite.generateSession(requestToken, process.env.KITE_API_SECRET!)
      return response
    } catch (error) {
      console.error('Error generating Kite session:', error)
      throw error
    }
  }

  // Set access token for authenticated requests
  setAccessToken(accessToken: string): void {
    this.kite.setAccessToken(accessToken)
  }

  // Get user profile
  async getProfile(): Promise<any> {
    try {
      return await this.kite.getProfile()
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    }
  }

  // Get holdings
  async getHoldings(): Promise<any> {
    try {
      return await this.kite.getHoldings()
    } catch (error) {
      console.error('Error getting holdings:', error)
      throw error
    }
  }

  // Get positions
  async getPositions(): Promise<any> {
    try {
      return await this.kite.getPositions()
    } catch (error) {
      console.error('Error getting positions:', error)
      throw error
    }
  }

  // Get orders
  async getOrders(): Promise<any> {
    try {
      return await this.kite.getOrders()
    } catch (error) {
      console.error('Error getting orders:', error)
      throw error
    }
  }

  // Place order
  async placeOrder(orderParams: OrderParams): Promise<any> {
    try {
      return await this.kite.placeOrder('regular', orderParams as any)
    } catch (error) {
      console.error('Error placing order:', error)
      throw error
    }
  }

  // Get instruments
  async getInstruments(exchange?: string): Promise<any> {
    try {
      return await this.kite.getInstruments(exchange as any)
    } catch (error) {
      console.error('Error getting instruments:', error)
      throw error
    }
  }

  // Get quote
  async getQuote(instruments: string[]): Promise<any> {
    try {
      return await this.kite.getQuote(instruments)
    } catch (error) {
      console.error('Error getting quote:', error)
      throw error
    }
  }

  // Get market data (LTP)
  async getLTP(instruments: string[]): Promise<any> {
    try {
      return await this.kite.getLTP(instruments)
    } catch (error) {
      console.error('Error getting LTP:', error)
      throw error
    }
  }
}

// Singleton instance
export const kiteService = new KiteService()