# 👨‍💻 Panel de Administración de Usuarios - Biotronik

## 🎯 **Resumen**
Sistema completo de autenticación y administración de usuarios con roles y permisos para la plataforma Biotronik.

---

## 🏗️ **Arquitectura del Sistema**

### 🔐 **Autenticación**
- **NextAuth.js** para gestión de sesiones
- **Bcrypt** para hash de contraseñas
- **JWT** para tokens de sesión
- **Middleware** de protección de rutas

### 📊 **Base de Datos**
- **Usuarios** con roles y información médica
- **Sesiones** y cuentas de NextAuth
- **Conversaciones** vinculadas a usuarios
- **Mensajes** con control de acceso

### 🎭 **Roles y Permisos**
```
SUPERADMIN
├── Crear/Editar/Eliminar cualquier usuario
├── Cambiar roles (incluso ADMIN/SUPERADMIN)
├── Acceso completo al panel de administración
└── No puede eliminarse a sí mismo si es el último SUPERADMIN

ADMIN
├── Crear/Editar usuarios (solo USER)
├── Activar/Desactivar usuarios
├── Ver estadísticas del sistema
└── NO puede gestionar otros ADMIN/SUPERADMIN

USER
├── Acceso solo al chat
├── Gestionar sus propias conversaciones
└── Sin acceso al panel de administración
```

---

## 🚀 **Configuración Inicial**

### 1. **Credenciales de Super Admin (Bruno)**
```
📧 Email: bruno@biotronik.com
🔑 Password: bruno123
👤 Rol: SUPERADMIN
🏥 Hospital: Biotronik HQ
```

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login!

### 2. **Variables de Entorno**
```env
DATABASE_URL="tu-neon-connection-string"
OPENAI_API_KEY="tu-openai-api-key"
NEXTAUTH_SECRET="biotronik-secret-key-2024"
```

### 3. **Aplicar Migraciones**
```bash
npx prisma db push
npx ts-node src/scripts/seed.ts
```

---

## 🎮 **Funcionalidades del Panel**

### 📈 **Dashboard**
- **Estadísticas en tiempo real**
  - Total de usuarios
  - Usuarios activos
  - Administradores
  - Total de conversaciones

### 👥 **Gestión de Usuarios**
- **Crear usuarios** con información médica completa
- **Buscar y filtrar** por nombre, email, especialidad, hospital
- **Cambiar estados:** ACTIVE | INACTIVE | SUSPENDED
- **Editar información** médica y de contacto
- **Eliminar usuarios** (solo SUPERADMIN)

### 🏥 **Información Médica**
- **Especialidad médica**
- **Número de licencia**
- **Hospital/Institución**
- **Historial de actividad**

---

## 🛡️ **Seguridad Implementada**

### 🔒 **Protección de Rutas**
- **Middleware** que verifica autenticación
- **APIs protegidas** con verificación de sesión
- **Control de acceso** por roles
- **Validación de pertenencia** de datos

### 🛑 **Validaciones de Seguridad**
- **Anti auto-eliminación** del último SUPERADMIN
- **Verificación de permisos** antes de cada acción
- **Aislamiento de datos** por usuario
- **Validación de inputs** en formularios

### 🔐 **Gestión de Contraseñas**
- **Hash bcrypt** con salt de 12 rounds
- **Validación de complejidad** en el frontend
- **Cambio de contraseña** en el panel

---

## 🎯 **URLs y Accesos**

### 🌐 **Rutas Principales**
```
/auth/signin          → Login de usuarios
/admin                → Panel de administración
/chat                 → Interfaz de chat (usuarios autenticados)
/                     → Página de inicio (pública)
```

### 🔗 **APIs Administrativas**
```
GET    /api/admin/users         → Listar usuarios
POST   /api/admin/users         → Crear usuario
GET    /api/admin/users/[id]    → Obtener usuario
PUT    /api/admin/users/[id]    → Actualizar usuario
DELETE /api/admin/users/[id]    → Eliminar usuario
```

### 💬 **APIs de Chat (Protegidas)**
```
GET    /api/conversations       → Conversaciones del usuario
POST   /api/conversations       → Crear conversación
GET    /api/conversations/[id]  → Obtener conversación
PUT    /api/conversations/[id]  → Actualizar conversación
DELETE /api/conversations/[id]  → Eliminar conversación
POST   /api/chat                → Enviar mensaje de chat
```

---

## 👨‍⚕️ **Casos de Uso Médicos**

### 🏥 **Para Administradores de Hospital**
- **Dar de alta** a nuevos médicos del hospital
- **Gestionar especialidades** y departamentos
- **Controlar acceso** por licencias médicas
- **Monitorear actividad** del personal

### 👩‍⚕️ **Para Médicos Usuarios**
- **Acceso personalizado** al chat con información del perfil
- **Historial médico** de consultas por especialidad
- **Recomendaciones contextuales** basadas en hospital/especialidad

### 🔬 **Para Super Administradores**
- **Control total** del sistema
- **Gestión de roles** de administradores
- **Supervisión de seguridad** y accesos
- **Mantenimiento** de la plataforma

---

## 🎨 **Interfaz de Usuario**

### 📱 **Panel Responsive**
- **Diseño moderno** inspirado en dashboards médicos
- **Tabla interactiva** con búsqueda y filtros
- **Modal intuitivo** para crear usuarios
- **Indicadores visuales** de estado y rol

### 🎨 **Elementos UI**
- **Badges coloridos** para roles y estados
- **Botones contextuales** para acciones
- **Estados de carga** y confirmaciones
- **Diseño consistente** con el resto de la app

### ⚡ **Experiencia Optimizada**
- **Carga rápida** de datos
- **Búsqueda en tiempo real**
- **Confirmaciones** para acciones críticas
- **Feedback visual** en todas las acciones

---

## 🔧 **Comandos Útiles**

### 🗄️ **Base de Datos**
```bash
# Ver datos en Prisma Studio
npx prisma studio

# Reset completo
npx prisma db push --force-reset

# Crear nuevo admin manualmente
npx ts-node src/scripts/seed.ts
```

### 🚀 **Desarrollo**
```bash
# Iniciar en modo desarrollo
npm run dev

# Ver logs de autenticación
tail -f .next/server.log
```

---

## ✅ **Funcionalidades Completadas**

- ✅ **Sistema de autenticación** completo con NextAuth.js
- ✅ **Roles y permisos** (SUPERADMIN, ADMIN, USER)
- ✅ **Panel de administración** con CRUD de usuarios
- ✅ **Middleware de protección** de rutas
- ✅ **APIs seguras** con control de acceso
- ✅ **Usuario Bruno** como super admin inicial
- ✅ **Información médica** en perfiles de usuario
- ✅ **Integración completa** con el sistema de chat existente
- ✅ **Interfaz responsive** y moderna
- ✅ **Validaciones de seguridad** robustas

---

## 🎉 **¡Sistema Listo!**

**Bruno, ya tienes el control total del sistema:**
1. **Inicia sesión** con tus credenciales
2. **Accede al panel** en `/admin`
3. **Crea usuarios** para tu equipo médico
4. **Gestiona roles** y permisos
5. **Supervisa actividad** del sistema

**El sistema está preparado para un entorno de producción médica profesional** 🏥💪