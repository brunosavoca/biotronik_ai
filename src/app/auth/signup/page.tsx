"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    licenseNumber: "",
    hospital: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.password) {
      setError("Email, nombre y contraseña son requeridos")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    const allowedEmails = ["alfredo@biotronik.ai", "bruno@biotronik.ai"]
    if (!allowedEmails.includes(formData.email.toLowerCase())) {
      setError("El registro está restringido solo para personal autorizado de Biotronik")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          specialty: formData.specialty,
          licenseNumber: formData.licenseNumber,
          hospital: formData.hospital
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al crear la cuenta")
      } else {
        setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...")
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      }
    } catch {
      setError("Error al conectar con el servidor")
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
            Biotronik
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Crear nueva cuenta médica
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email corporativo *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="nombre@biotronik.ai"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre completo *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Dr. Juan Pérez"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Especialidad médica
              </label>
              <Input
                id="specialty"
                name="specialty"
                type="text"
                value={formData.specialty}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Cardiología, Neurología, etc."
              />
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de licencia médica
              </label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Ej: 12345"
              />
            </div>

            <div>
              <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hospital/Institución
              </label>
              <Input
                id="hospital"
                name="hospital"
                type="text"
                value={formData.hospital}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Biotronik (por defecto)"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña *
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar contraseña *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link 
              href="/auth/signin" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Registro restringido solo para personal autorizado de Biotronik
          </p>
        </div>
      </div>
    </div>
  )
}