import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      specialty?: string
      hospital?: string
    }
  }

  interface User {
    role: UserRole
    specialty?: string
    hospital?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    specialty?: string
    hospital?: string
  }
}