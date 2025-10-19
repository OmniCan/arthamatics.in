'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function KiteCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const requestToken = searchParams.get('request_token')

      if (!requestToken) {
        setStatus('error')
        setMessage('No request token found')
        return
      }

      try {
        const response = await fetch('/api/kite/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestToken })
        })

        if (response.ok) {
          setStatus('success')
          setMessage('Kite account connected successfully!')
          setTimeout(() => {
            router.push('/trading')
          }, 2000)
        } else {
          const error = await response.json()
          setStatus('error')
          setMessage(error.error || 'Failed to connect Kite account')
        }
      } catch {
        setStatus('error')
        setMessage('Network error occurred')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Kite</h2>
              <p className="text-gray-600">Please wait while we set up your trading account...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting to trading dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.push('/trading')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Back to Trading
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function KiteCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>}>
      <KiteCallbackContent />
    </Suspense>
  )
}