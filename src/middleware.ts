import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    // Proteger rutas de administración
    if (pathname.startsWith("/admin")) {
      if (!token || (token.role !== "SUPERADMIN" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/chat/:path*"]
}