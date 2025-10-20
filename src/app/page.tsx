import Link from 'next/link'
import MarketWatchlist from '@/components/MarketWatchlist'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Arthamatics Finance
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted partner for stock and mutual fund distribution.
            Secure onboarding, KYC compliance, and personalized recommendations.
          </p>
          <div className="space-x-4">
            <Link
              href="/auth/signup"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium border border-indigo-600 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Market Data Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <MarketWatchlist />
        </div>
      </div>
    </div>
  )
}
