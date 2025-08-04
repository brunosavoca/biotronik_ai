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
  UserPlus, 
  Edit,
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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Form state para crear usuario
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    specialty: "",
    licenseNumber: "",
    hospital: ""
  })

  // Form state para editar usuario
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    specialty: "",
    licenseNumber: "",
    hospital: ""
  })

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        setShowCreateModal(false)
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "USER",
          specialty: "",
          licenseNumber: "",
          hospital: ""
        })
        loadUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Error al crear usuario")
      }
    } catch (error) {
      console.error("Error creando usuario:", error)
      alert("Error al crear usuario")
    } finally {
      setCreateLoading(false)
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

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditUser({
      name: user.name,
      email: user.email,
      password: "", // Password field will be optional for updates
      role: user.role,
      specialty: user.specialty || "",
      licenseNumber: user.licenseNumber || "",
      hospital: user.hospital || ""
    })
    setShowEditModal(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setEditLoading(true)

    try {
      // Create updateData without password first, then conditionally add it
      const { password, ...updateData } = editUser;
      const finalData = password ? { ...updateData, password } : updateData;

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      })

      if (response.ok) {
        setShowEditModal(false)
        setEditingUser(null)
        setEditUser({
          name: "",
          email: "",
          password: "",
          role: "USER",
          specialty: "",
          licenseNumber: "",
          hospital: ""
        })
        loadUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Error al actualizar usuario")
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error)
      alert("Error al actualizar usuario")
    } finally {
      setEditLoading(false)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
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
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Button
            onClick={() => setShowCreateModal(true)}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
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
                      {session?.user?.role === "SUPERADMIN" && (
                        <Button
                          onClick={() => handleEditUser(user)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                        Editar
                        </Button>
                      )}
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Crear Nuevo Usuario
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <Input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                  {session?.user?.role === "SUPERADMIN" && (
                    <option value="SUPERADMIN">Super Administrador</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Especialidad
                </label>
                <Input
                  type="text"
                  value={newUser.specialty}
                  onChange={(e) => setNewUser({...newUser, specialty: e.target.value})}
                  className="mt-1"
                  placeholder="Cardiología, Medicina Interna, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hospital/Institución
                </label>
                <Input
                  type="text"
                  value={newUser.hospital}
                  onChange={(e) => setNewUser({...newUser, hospital: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createLoading}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {createLoading ? "Creando..." : "Crear Usuario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Editar Usuario: {editingUser.name}
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  required
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña (dejar vacío para no cambiar)
                </label>
                <Input
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                  className="mt-1"
                  placeholder="Nueva contraseña (opcional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="SUPERADMIN">Super Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Especialidad
                </label>
                <Input
                  type="text"
                  value={editUser.specialty}
                  onChange={(e) => setEditUser({...editUser, specialty: e.target.value})}
                  className="mt-1"
                  placeholder="Cardiología, Medicina Interna, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Número de Licencia
                </label>
                <Input
                  type="text"
                  value={editUser.licenseNumber}
                  onChange={(e) => setEditUser({...editUser, licenseNumber: e.target.value})}
                  className="mt-1"
                  placeholder="Número de licencia médica"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hospital/Institución
                </label>
                <Input
                  type="text"
                  value={editUser.hospital}
                  onChange={(e) => setEditUser({...editUser, hospital: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setEditUser({
                      name: "",
                      email: "",
                      password: "",
                      role: "USER",
                      specialty: "",
                      licenseNumber: "",
                      hospital: ""
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {editLoading ? "Actualizando..." : "Actualizar Usuario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}