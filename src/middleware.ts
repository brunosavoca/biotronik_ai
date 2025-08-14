import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/config'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

// Combine auth and i18n middleware
export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Check if the pathname is public (doesn't require auth)
  const isPublicPath = !pathname.match(/^\/(en|es|pt)?\/?admin/) && 
                       !pathname.match(/^\/(en|es|pt)?\/?chat/)
  
  // For public paths, only apply i18n middleware
  if (isPublicPath) {
    return intlMiddleware(req)
  }
  
  // For protected paths, apply auth middleware with i18n
  const authMiddleware = withAuth(
    function onSuccess(req) {
      // Apply i18n after successful auth
      return intlMiddleware(req as NextRequest)
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          const { pathname } = req.nextUrl
          
          // Check admin routes
          if (pathname.match(/^\/(en|es|pt)?\/?admin/)) {
            return token?.role === "SUPERADMIN" || token?.role === "ADMIN"
          }
          
          // Other protected routes just need authentication
          return !!token
        },
      },
      pages: {
        signIn: '/auth/signin',
      }
    }
  )
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (authMiddleware as any)(req)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    '/((?!api|_next|.*\\..*).*)' 
  ]
}