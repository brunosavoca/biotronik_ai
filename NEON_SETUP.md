# 🗄️ Configuración de Neon Database para Biotronik

## ✅ **Prerequisitos**
- Cuenta en [Neon Database](https://neon.tech)
- Node.js instalado
- Proyecto Biotronik configurado

---

## 🚀 **Pasos de configuración**

### 1. **Crear proyecto en Neon**
1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto llamado **"biotronik"**
3. Selecciona la región más cercana
4. Copia la **DATABASE_URL** que aparece

### 2. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:

```env
# Neon Database URL
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. **Ejecutar migraciones**
```bash
# Crear y aplicar la migración inicial
npx prisma migrate dev --name init

# Generar el cliente de Prisma
npx prisma generate
```

### 4. **Verificar la conexión**
```bash
# Ver el estado de la base de datos
npx prisma studio
```

---

## 📊 **Schema de base de datos**

### **Conversations Table**
```sql
- id: String (Primary Key)
- title: String 
- createdAt: DateTime
- updatedAt: DateTime
```

### **Messages Table**
```sql
- id: String (Primary Key)
- role: String ("user" | "assistant")
- content: String
- images: String[] (Array de URLs)
- timestamp: DateTime
- conversationId: String (Foreign Key)
```

---

## 🔧 **APIs disponibles**

### **Conversaciones**
- `GET /api/conversations` - Listar todas las conversaciones
- `POST /api/conversations` - Crear nueva conversación
- `GET /api/conversations/[id]` - Obtener conversación específica
- `PUT /api/conversations/[id]` - Actualizar título
- `DELETE /api/conversations/[id]` - Eliminar conversación

### **Mensajes**
- `POST /api/conversations/[id]/messages` - Agregar mensaje

### **Chat**
- `POST /api/chat` - Enviar mensaje y obtener respuesta de IA

---

## 🎯 **Funcionalidades implementadas**

### ✅ **Múltiples conversaciones**
- **Sidebar colapsible** con lista de chats
- **Crear nueva conversación** con botón "+"
- **Cambiar entre conversaciones** con clic
- **Eliminar conversaciones** con botón de basura

### ✅ **Persistencia automática**
- **Mensajes del usuario** se guardan automáticamente
- **Respuestas del asistente** se persisten en DB
- **Títulos automáticos** basados en el primer mensaje
- **Timestamps** para ordenamiento

### ✅ **Experiencia de usuario**
- **Estado de carga** con indicadores visuales
- **Sidebar responsive** que se colapsa
- **Animaciones suaves** para transiciones
- **Botones de acción rápida** que crean conversaciones automáticamente

---

## 🛠️ **Comandos útiles**

```bash
# Reset completo de la base de datos
npx prisma migrate reset

# Ver datos en Prisma Studio
npx prisma studio

# Aplicar cambios del schema
npx prisma db push

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion
```

---

## 📝 **Notas importantes**

1. **URLs de imágenes**: Se almacenan como base64 data URLs
2. **Títulos automáticos**: Se generan a partir de los primeros 50 caracteres del mensaje inicial
3. **Cascade delete**: Al eliminar una conversación, todos sus mensajes se eliminan automáticamente
4. **Ordenamiento**: Las conversaciones se ordenan por `updatedAt` descendente

---

## 🎨 **UI Features**

### **Sidebar**
- Lista de conversaciones ordenada por fecha
- Botón de crear nueva conversación
- Botón de colapsar/expandir
- Indicador visual de conversación activa
- Botón de eliminar en hover

### **Chat principal**
- Header con información del asistente
- Área de mensajes con avatares y burbujas
- Botones disparadores para nuevas conversaciones
- Input con soporte para imágenes
- Botón de "Nueva conversación" cuando hay mensajes

¡La funcionalidad de múltiples chats con historial está lista! 🎉