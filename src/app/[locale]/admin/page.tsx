"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { 
  Building,
  User,
  UserCheck, 
  Trash,
  Eye,
  EyeSlash,
  Users,
  Shield,
  Message
} from "@mynaui/icons-react"

interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  specialty?: string
  licenseNumber?: string
  hospital?: string
  createdAt: string
  lastLoginAt?: string
  _count: { conversations: number }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    if (status === "loading") return

    if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN")) {
      router.push("/auth/signin")
      return
    }

    loadUsers()
  }, [session, status, router])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoading(false)
    }
  }



  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        loadUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Error al actualizar usuario")
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${userName}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        loadUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Error al eliminar usuario")
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error)
    }
  }



  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "ADMIN": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "INACTIVE": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "SUSPENDED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
            <Building className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestión de usuarios - {session?.user?.name} ({session?.user?.role})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button variant="outline" size="sm">
                💬 Chat
              </Button>
            </Link>
            <Button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              variant="outline"
              size="sm"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="medical-card card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Activos</h3>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === "ACTIVE").length}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Administradores</h3>
                <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === "ADMIN" || u.role === "SUPERADMIN").length}</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Message className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversaciones</h3>
                <p className="text-2xl font-bold text-purple-600">{users.reduce((acc, u) => acc + u._count.conversations, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Link href="/form">
            <Button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white">
              📋 Formulario Médico
            </Button>
          </Link>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Información Médica
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rol/Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.specialty && <div><strong>Especialidad:</strong> {user.specialty}</div>}
                        {user.hospital && <div><strong>Hospital:</strong> {user.hospital}</div>}
                        {user.licenseNumber && <div><strong>Licencia:</strong> {user.licenseNumber}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{user._count.conversations} chats</div>
                      <div>
                        {user.lastLoginAt
                          ? `Último: ${new Date(user.lastLoginAt).toLocaleDateString()}`
                          : "Nunca"
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {user.status === "ACTIVE" ? (
                        <Button
                          onClick={() => handleStatusChange(user.id, "INACTIVE")}
                          variant="outline"
                          size="sm"
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <EyeSlash className="w-4 h-4 mr-1" />
                          Desactivar
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStatusChange(user.id, "ACTIVE")}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Activar
                        </Button>
                      )}
                      {session?.user?.role === "SUPERADMIN" && (
                        <Button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}