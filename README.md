# Biotronik

Asistente de IA específicamente diseñado para cardiólogos, con una interfaz minimalista inspirada en Apple.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Database (Neon):**
   - Create account at [neon.tech](https://neon.tech)
   - Create new project named "biotronik"
   - Copy your DATABASE_URL

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
   OPENAI_API_KEY="sk-your-openai-api-key-here"
   ```

4. **Setup database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Create super admin user:**
   ```bash
   npx ts-node src/scripts/seed.ts
   ```

7. **Open in browser:**
   Navigate to [`http://localhost:3000](http://localhost:3000)

### 👨‍💻 **Credenciales de Administrador**

**Super Admin (Bruno):**
- **Email:** `bruno@biotronik.com`
- **Password:** `bruno123`
- **Panel Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login!

📖 **For detailed setup guides:**
- **Database:** [NEON_SETUP.md](./NEON_SETUP.md)
- **Admin Panel:** [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Vercel Deployment:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Características

- **Diseño Minimalista:** Interfaz limpia inspirada en Apple
- **Enfoque en Cardiología:** Respuestas de IA especializadas en medicina cardiovascular
- **Sistema de Usuarios:** Autenticación completa con NextAuth.js y gestión de roles (SUPERADMIN, ADMIN, USER)
- **Panel de Administración:** Interfaz completa para gestionar usuarios, especialidades médicas y permisos
- **Múltiples Conversaciones:** Sidebar con lista de chats, crear/eliminar/cambiar entre conversaciones
- **Historial Persistente:** Todas las conversaciones se guardan automáticamente en Neon Database por usuario
- **Análisis de Imágenes Médicas:** Capacidad de analizar ECGs, radiografías, ecocardiogramas y otras imágenes cardíacas
- **Consultas Rápidas:** Botones disparadores con animaciones hermosas para facilitar el primer mensaje
- **Formato Markdown:** Respuestas del asistente renderizadas con formato Markdown para mejor legibilidad
- **Botón de Copiar:** Función para copiar respuestas del asistente al portapapeles
- **Interfaz Profesional:** Diseñada para uso clínico por cardiólogos
- **Chat en Tiempo Real:** Respuestas instantáneas con GPT-4O multimodal
- **Basado en Evidencia:** Respuestas alineadas con guías cardiovasculares actuales
- **Nueva Conversación:** Función para limpiar el chat y empezar de nuevo

## Uso

### 👥 **Para Administradores**
- **Inicia sesión** en `/admin` con credenciales de SUPERADMIN o ADMIN
- **Crea usuarios** para médicos del hospital con información especializada
- **Gestiona roles** y permisos (USER, ADMIN, SUPERADMIN)
- **Supervisa actividad** y estadísticas del sistema
- **Activa/Desactiva** usuarios según necesidades institucionales

### 👩‍⚕️ **Para Médicos**
- **Inicia sesión** en `/auth/signin` con credenciales asignadas
- **Chat personalizado** con información del perfil médico en el contexto
- **Múltiples conversaciones** organizadas por sidebar colapsible
- **Consultas Rápidas:** Utiliza los botones disparadores con animaciones para consultas comunes (hipertensión, medicamentos, ECGs, etc.)
- **Análisis de Imágenes:** Haz clic en "📷 Imagen" para subir hasta 3 imágenes médicas
- Soporta ECGs, radiografías de tórax, ecocardiogramas, angiografías y otras imágenes cardíacas
- **Respuestas Formateadas:** Las respuestas del asistente se muestran con formato Markdown (encabezados, listas, código, etc.)
- **Copiar Respuestas:** Haz hover sobre los mensajes del asistente para ver el botón de copiar
- **Historial persistente** de todas las conversaciones por usuario
- El asistente de IA proporciona respuestas basadas en evidencia apropiadas para profesionales médicos

## 🚀 Deployment en Producción

### **Vercel (Recomendado)**
```bash
# 1. Conectar repo a Vercel
# 2. Configurar variables de entorno
# 3. Deploy automático

# Variables principales:
# DATABASE_URL=tu-neon-connection-string
# OPENAI_API_KEY=tu-openai-key
# NEXTAUTH_SECRET=secret-seguro-produccion
# NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### **Post-deployment:**
```bash
# Crear usuario admin en producción
npx ts-node src/scripts/seed-production.ts
```

📖 **Guía completa:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Notas Importantes

- Esta herramienta está diseñada para uso profesional de cardiólogos licenciados
- No está destinada para situaciones de emergencia o diagnóstico de pacientes
- Siempre consulta las guías actuales y usa el juicio clínico