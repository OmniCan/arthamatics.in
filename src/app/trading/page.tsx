'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface Holding {
  tradingsymbol: string
  exchange: string
  quantity: number
  average_price: number
  last_price: number
  pnl: number
}

interface Order {
  order_id: string
  tradingsymbol: string
  transaction_type: string
  order_type: string
  quantity: number
  price: number
  status: string
}

export default function Trading() {
  const { data: session, status } = useSession()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [kiteConnected, setKiteConnected] = useState(false)

  const checkKiteConnection = useCallback(async () => {
    if (status !== 'authenticated') {
      setKiteConnected(false)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/kite/holdings')
      if (response.ok) {
        setKiteConnected(true)
      } else {
        setKiteConnected(false)
      }
    } catch {
      setKiteConnected(false)
    } finally {
      setLoading(false)
    }
  }, [status])

  const loadData = useCallback(async () => {
    if (!kiteConnected) return

    try {
      const [holdingsRes, ordersRes] = await Promise.all([
        fetch('/api/kite/holdings'),
        fetch('/api/kite/orders')
      ])

      if (holdingsRes.ok) {
        const holdingsData = await holdingsRes.json()
        setHoldings(holdingsData.holdings || [])
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      }
    } catch {
      console.error('Error loading trading data')
    }
  }, [kiteConnected])

  useEffect(() => {
    checkKiteConnection()
  }, [checkKiteConnection])

  useEffect(() => {
    if (kiteConnected) {
      loadData()
    }
  }, [kiteConnected, loadData])

  const connectKite = async () => {
    try {
      const response = await fetch('/api/kite/login')
      const data = await response.json()
      if (data.loginURL) {
        window.location.href = data.loginURL
      }
    } catch (error) {
      console.error('Error getting Kite login URL:', error)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access the trading dashboard.</p>
            <a
              href="/auth/signin"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 inline-block text-center"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Trading Dashboard</h1>
            {!kiteConnected && (
              <button
                onClick={connectKite}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Connect to Kite
              </button>
            )}
          </div>

          {!kiteConnected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                Please connect your Kite account to start trading.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Holdings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Holdings</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {holdings.length === 0 ? (
                    <li className="px-4 py-4 text-center text-gray-500">No holdings found</li>
                  ) : (
                    holdings.map((holding, index) => (
                      <li key={index} className="px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{holding.tradingsymbol}</p>
                            <p className="text-sm text-gray-500">Qty: {holding.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">₹{holding.last_price}</p>
                            <p className={`text-sm ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              P&L: ₹{holding.pnl.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Orders */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Orders</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <li className="px-4 py-4 text-center text-gray-500">No orders found</li>
                  ) : (
                    orders.map((order, index) => (
                      <li key={index} className="px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.tradingsymbol}</p>
                            <p className="text-sm text-gray-500">
                              {order.transaction_type} {order.quantity} @ ₹{order.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'COMPLETE' ? 'bg-green-100 text-green-800' :
                              order.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}