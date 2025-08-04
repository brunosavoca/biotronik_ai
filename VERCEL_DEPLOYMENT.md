# 🚀 Deployment en Vercel - Biotronik

## 📋 **Prerequisitos**
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [GitHub](https://github.com) (para vincular repo)
- ✅ Neon Database configurada y funcionando
- ✅ OpenAI API Key

---

## 🛠️ **Preparación del Proyecto**

### 1. **Arreglar rutas Next.js 15** ✅
Ya hemos arreglado todas las rutas dinámicas para Next.js 15.

### 2. **Crear archivo de configuración de Vercel**

```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. **Verificar .gitignore**
Asegúrate de que estas líneas estén en `.gitignore`:
```
.env
.env.local
.env.production
node_modules/
.next/
```

---

## 🌐 **Configuración en Vercel**

### **Paso 1: Conectar Repositorio**
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Clic en **"New Project"**
3. **Import Git Repository** → Conecta tu GitHub
4. Selecciona el repositorio `biotronik`

### **Paso 2: Configurar Variables de Entorno**
En la sección **Environment Variables** agrega:

```bash
# Base de Datos
DATABASE_URL=postgresql://neondb_owner:npg_Tcn5XgsdKe1z@ep-noisy-block-aek9yvd9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# OpenAI
OPENAI_API_KEY=sk-tu-clave-real-de-openai

# NextAuth.js
NEXTAUTH_SECRET=biotronik-production-secret-2024
NEXTAUTH_URL=https://tu-dominio-vercel.vercel.app

# Prisma
PRISMA_GENERATE_DATAPROXY=true
```

⚠️ **IMPORTANTE:** 
- Cambia `sk-tu-clave-real-de-openai` por tu clave real
- `NEXTAUTH_URL` se actualizará automáticamente con tu dominio de Vercel

### **Paso 3: Configurar Build Settings**
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## 🔧 **Configuraciones Adicionales**

### **package.json scripts**
Asegúrate de tener estos scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### **Configurar dominio personalizado (Opcional)**
1. En el dashboard de Vercel → **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Actualiza `NEXTAUTH_URL` con tu dominio real

---

## 🗄️ **Base de Datos en Producción**

### **Aplicar migraciones después del deploy**
```bash
# Ejecutar localmente para aplicar en producción
npx prisma db push --preview-feature
```

### **Seed usuario Bruno en producción**
```bash
# Modificar seed script para production
# src/scripts/seed-production.ts
```

---

## 🔐 **Seguridad en Producción**

### **Variables de entorno seguras:**
- ✅ `NEXTAUTH_SECRET` debe ser diferente y más seguro
- ✅ `DATABASE_URL` con conexión SSL requerida
- ✅ `OPENAI_API_KEY` mantenida privada
- ✅ No commits de archivos `.env`

### **CORS y Headers de Seguridad:**
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

---

## 🚀 **Deployment Process**

### **Deployment automático:**
1. **Push a main/master** → Deploy automático
2. **Pull Requests** → Preview deployments
3. **Rollbacks** disponibles en el dashboard

### **Comandos útiles:**
```bash
# Deploy desde CLI (opcional)
npx vercel

# Preview deployment
npx vercel --prod
```

---

## ✅ **Checklist Post-Deployment**

### **Testing básico:**
- [ ] ✅ Home page carga correctamente
- [ ] ✅ Login funciona (`/auth/signin`)
- [ ] ✅ Panel admin accesible (`/admin`)
- [ ] ✅ Chat funciona con IA (`/chat`)
- [ ] ✅ Base de datos conectada
- [ ] ✅ Variables de entorno configuradas

### **Testing de funcionalidades:**
- [ ] ✅ Crear usuario desde admin
- [ ] ✅ Login con usuario creado
- [ ] ✅ Chat multimodal (texto + imágenes)
- [ ] ✅ Múltiples conversaciones
- [ ] ✅ Persistencia de datos

### **Testing de seguridad:**
- [ ] ✅ Rutas admin protegidas
- [ ] ✅ APIs requieren autenticación
- [ ] ✅ Usuarios solo ven sus datos
- [ ] ✅ Roles funcionan correctamente

---

## 🔧 **Troubleshooting**

### **Errores comunes:**

**1. Build fails - Prisma**
```bash
# Solución: Verificar PRISMA_GENERATE_DATAPROXY=true
```

**2. NextAuth errors**
```bash
# Solución: Verificar NEXTAUTH_URL y NEXTAUTH_SECRET
```

**3. Database connection**
```bash
# Solución: Verificar DATABASE_URL y SSL settings
```

**4. API timeouts**
```bash
# Solución: Aumentar maxDuration en vercel.json
```

### **Logs y debugging:**
- **Vercel Dashboard** → Functions → View Logs
- **Runtime Logs** para errores de API
- **Build Logs** para errores de compilación

---

## 🌟 **Optimizaciones de Producción**

### **Performance:**
- **Edge Runtime** para APIs rápidas
- **Image Optimization** de Next.js
- **Caching** de respuestas estáticas

### **Monitoring:**
- **Vercel Analytics** habilitado
- **Error tracking** con Sentry (opcional)
- **Uptime monitoring** (opcional)

---

## 🎯 **URLs Finales**

Una vez deployado tendrás:

```
🏠 Home: https://biotronik-tu-proyecto.vercel.app/
🔐 Login: https://biotronik-tu-proyecto.vercel.app/auth/signin  
👨‍💻 Admin: https://biotronik-tu-proyecto.vercel.app/admin
💬 Chat: https://biotronik-tu-proyecto.vercel.app/chat
```

### **Credenciales de Bruno:**
```
📧 Email: bruno@biotronik.com
🔑 Password: bruno123
```

⚠️ **IMPORTANTE:** Cambia la contraseña inmediatamente en producción!

---

## 📱 **Próximos pasos opcionales**

### **1. Dominio personalizado**
- Configurar DNS
- SSL automático con Vercel

### **2. Notificaciones**
- Email alerts para nuevos usuarios
- Slack integration para admin

### **3. Analytics médicos**
- Dashboard de uso por especialidad
- Métricas de consultas más frecuentes

### **4. Backup strategy**
- Backup automático de Neon DB
- Export de conversaciones importantes

---

## 🎉 **¡Deployment Completo!**

Tu plataforma médica **Biotronik** estará disponible 24/7 en internet, lista para:

- ✅ **Administrar médicos** de tu organización
- ✅ **Consultas especializadas** en cardiología  
- ✅ **Análisis de imágenes** médicas
- ✅ **Historial persistente** por usuario
- ✅ **Seguridad** nivel hospitalario

**¡Bruno tendrá control total desde cualquier lugar del mundo!** 🌍🏥