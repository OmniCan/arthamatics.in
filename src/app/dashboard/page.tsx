'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Arthamatics Finance</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p>Role: {session.user?.role}</p>
          {session.user?.role === 'admin' ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
              <p>Manage customers, view reports, etc.</p>
              <div className="mt-4 space-x-4">
                <Link href="/admin" className="text-indigo-600 hover:text-indigo-800">Go to Admin Panel</Link>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Portal</h3>
              <p>View recommendations, manage investments, etc.</p>
              <div className="mt-4 space-x-4">
                <Link href="/trading" className="text-indigo-600 hover:text-indigo-800">Start Trading</Link>
                <Link href="/onboarding" className="text-indigo-600 hover:text-indigo-800">Complete Profile</Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}