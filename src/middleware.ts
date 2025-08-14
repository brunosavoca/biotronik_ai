import { withAuth } from "next-auth/middleware"
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from "next/server"
import { locales, defaultLocale } from './i18n'

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // This will add locale prefix only when it's not the default locale
})

// Paths that should be protected by authentication
const protectedPaths = ['/admin', '/chat', '/form']
const authPaths = ['/auth/signin', '/auth/signup']

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  // Apply i18n middleware for all routes
  if (pathnameIsMissingLocale) {
    return intlMiddleware(req)
  }
  
  // Get the locale from the pathname
  const locale = pathname.split('/')[1]
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  
  // Check if this is a protected path
  const isProtectedPath = protectedPaths.some(path => 
    pathWithoutLocale.startsWith(path)
  )
  
  const isAuthPath = authPaths.some(path => 
    pathWithoutLocale.startsWith(path)
  )
  
  // For protected paths, apply authentication
  if (isProtectedPath) {
    return (withAuth as any)(
      function middleware(req: any) {
        const { token } = req.nextauth
        
        // Special handling for admin routes
        if (pathWithoutLocale.startsWith("/admin")) {
          if (!token || (token.role !== "SUPERADMIN" && token.role !== "ADMIN")) {
            return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url))
          }
        }
        
        // Apply i18n to authenticated routes
        return intlMiddleware(req as NextRequest)
      },
      {
        callbacks: {
          authorized: ({ token }: any) => !!token,
        },
        pages: {
          signIn: `/${locale}/auth/signin`,
        }
      }
    )(req as any)
  }
  
  // For all other routes, just apply i18n
  return intlMiddleware(req)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - ... if they start with `/api`, `/_next` or `/_vercel`
    // - ... the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, including dots
    '/([\\w-]+)?/users/(.+)'
  ]
}