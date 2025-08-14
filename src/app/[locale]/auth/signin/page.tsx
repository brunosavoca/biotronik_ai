"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LocaleLink from "@/components/LocaleLink"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'
import { useCurrentLocale } from '@/hooks/useLocale'

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const t = useTranslations()
  const locale = useCurrentLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError(t('auth.signin.invalidCredentials'))
      } else {
        // Verificar el rol del usuario después del login exitoso
        const session = await getSession()
        if (session?.user?.role === "SUPERADMIN" || session?.user?.role === "ADMIN") {
          router.push(`/${locale}/admin`)
        } else {
          router.push(`/${locale}/chat`)
        }
      }
    } catch {
      setError(t('auth.signin.errorSigningIn'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.appName')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('auth.signin.subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.signin.email')}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="doctor@hospital.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.signin.password')}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <p className="text-sm text-blue-600 dark:text-blue-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? t('common.loading') : t('auth.signin.button')}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.signin.noAccount')}{" "}
            <LocaleLink 
              href="/auth/signup" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t('auth.signin.signupLink')}
            </LocaleLink>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('home.footer')}
          </p>
        </div>
      </div>
    </div>
  )
}