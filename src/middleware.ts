import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Add custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}