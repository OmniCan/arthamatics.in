'use client'

import { useState, useEffect } from 'react'

interface StockQuote {
  instrument_token: number
  timestamp: string
  last_price: number
  net_change: number
  ohlc: {
    open: number
    high: number
    low: number
    close: number
  }
  volume: number
  oi?: number
  oi_day_high?: number
  oi_day_low?: number
}

interface MarketData {
  [key: string]: StockQuote
}

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE' },
  { symbol: 'TCS', name: 'TCS', exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys', exchange: 'NSE' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC', exchange: 'NSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE' },
  { symbol: 'LT', name: 'Larsen & Toubro', exchange: 'NSE' },
  { symbol: 'AXISBANK', name: 'Axis Bank', exchange: 'NSE' }
]

export default function MarketWatchlist() {
  const [marketData, setMarketData] = useState<MarketData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketData = async () => {
    try {
      const instruments = POPULAR_STOCKS.map(stock => `${stock.exchange}:${stock.symbol}`)
      const response = await fetch('/api/kite/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruments })
      })

      if (response.ok) {
        const data = await response.json()
        setMarketData(data.quotes || {})
        setError(null)
      } else {
        setError('Failed to fetch market data')
      }
    } catch {
      setError('Network error fetching market data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Watchlist</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Watchlist</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">Unable to load market data</p>
          <button
            onClick={fetchMarketData}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Market Watchlist</h2>
        <span className="text-sm text-gray-500">Updates every 30s</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LTP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {POPULAR_STOCKS.map((stock) => {
              const instrumentKey = `${stock.exchange}:${stock.symbol}`
              const quote = marketData[instrumentKey]

              return (
                <tr key={stock.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {quote ? formatPrice(quote.last_price) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {quote ? (
                      <div className={`text-sm font-medium ${
                        quote.net_change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatChange(quote.net_change)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">N/A</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {quote ? quote.volume.toLocaleString('en-IN') : 'N/A'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Data provided by Kite Connect • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}