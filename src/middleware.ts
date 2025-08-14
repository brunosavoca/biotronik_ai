import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest } from "next/server"
import { locales, defaultLocale } from './i18n'

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // This will add locale prefix only when it's not the default locale
})

export default function middleware(req: NextRequest) {
  // For now, just apply i18n middleware
  // Authentication can be handled at the page level with session checks
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