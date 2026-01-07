# Sistema de Gestión de Proyectos y Tareas - Frontend

Interfaz web para el sistema de gestión de proyectos y tareas, desarrollada con **HTML, CSS y JavaScript Vanilla**. Consume la API REST del backend con autenticación JWT.

---

## 🚀 Tecnologías

- **HTML5**
- **CSS3** (Variables CSS, Flexbox, Grid)
- **JavaScript ES6+** (Fetch API, LocalStorage)
- **Sin frameworks** (Vanilla JS puro)

---

## 🎨 Características

- ✅ Diseño responsivo y moderno
- ✅ Autenticación con JWT
- ✅ Gestión completa de proyectos
- ✅ Gestión completa de tareas
- ✅ Manejo de errores con alertas visuales
- ✅ Estados de loading
- ✅ Validación de formularios
- ✅ Protección de rutas (requiere login)

---

## 📁 Estructura del Proyecto
```
project-management-frontend/
├── index.html                # Página de login
├── register.html             # Página de registro
├── dashboard.html            # Dashboard de proyectos
├── project-detail.html       # Detalle de proyecto con tareas
├── css/
│   └── styles.css           # Estilos globales
├── js/
│   ├── config.js            # Configuración de API y utilidades
│   ├── auth.js              # Lógica de autenticación
│   ├── dashboard.js         # Lógica del dashboard
│   └── project-detail.js    # Lógica de detalle de proyecto
└── README.md
```

---

## 🔗 Consumo de API

El frontend consume los siguientes endpoints del backend:

### Autenticación (Público)
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión (obtiene JWT)

### Proyectos (Requiere JWT)
- `GET /api/projects` - Listar proyectos del usuario
- `POST /api/projects` - Crear nuevo proyecto
- `PATCH /api/projects/{id}/activate` - Activar proyecto
- `DELETE /api/projects/{id}` - Eliminar proyecto

### Tareas (Requiere JWT)
- `GET /api/projects/{projectId}/tasks` - Listar tareas del proyecto
- `POST /api/projects/{projectId}/tasks` - Crear nueva tarea
- `PATCH /api/tasks/{id}/complete` - Completar tarea
- `DELETE /api/tasks/{id}` - Eliminar tarea

---

## ⚙️ Configuración

### URL del Backend

La URL del backend está configurada en `js/config.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

Si tu backend está en otro puerto o dominio, actualiza esta variable.

---

## 🚀 Instalación y Ejecución

### Prerequisitos
- Backend corriendo en `http://localhost:8080`
- Navegador web moderno

---

### Opción 1: Live Server (VS Code) - Recomendado

**1. Instalar extensión Live Server**
- Abre VS Code
- Ve a Extensions (Ctrl + Shift + X)
- Busca "Live Server"
- Instala la extensión de Ritwick Dey

**2. Abrir con Live Server**
- Click derecho en `index.html`
- Selecciona "Open with Live Server"
- Se abrirá automáticamente en `http://127.0.0.1:5500`

**3. Detener el servidor**
- Click en "Port: 5500" en la barra inferior de VS Code
- O cierra la pestaña del navegador

---

### Opción 2: Python HTTP Server

**1. Navegar a la carpeta del proyecto**
```bash
cd project-management-frontend
```

**2. Iniciar servidor**
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**3. Abrir en el navegador**
```
http://localhost:8000
```

**4. Detener el servidor**
```bash
Ctrl + C
```

---

### Opción 3: Node.js http-server

**1. Instalar http-server (una sola vez)**
```bash
npm install -g http-server
```

**2. Iniciar servidor**
```bash
cd project-management-frontend
http-server -p 8000
```

**3. Abrir en el navegador**
```
http://localhost:8000
```

---

## 📱 Funcionalidades Implementadas

### 1. Autenticación

**Registro (`register.html`)**
- Formulario con username, email y password
- Validaciones client-side
- Redirección automática al dashboard tras registro exitoso

**Login (`index.html`)**
- Formulario con username y password
- Almacenamiento de JWT en LocalStorage
- Redirección al dashboard tras login exitoso

---

### 2. Dashboard de Proyectos (`dashboard.html`)

**Listar Proyectos**
- Grid responsivo con todos los proyectos del usuario
- Estados visuales: DRAFT, ACTIVE
- Click en proyecto para ver detalle

**Crear Proyecto**
- Modal con formulario
- Validación de nombre obligatorio
- Actualización automática de la lista

**Activar Proyecto**
- Botón "Activar" solo en proyectos DRAFT
- Validación: debe tener al menos 1 tarea
- Mensaje de error si no cumple requisitos

**Eliminar Proyecto**
- Confirmación antes de eliminar
- Soft delete (no se elimina de la BD)

---

### 3. Detalle de Proyecto (`project-detail.html`)

**Información del Proyecto**
- Nombre del proyecto
- Estado (DRAFT/ACTIVE)
- Botón "Volver" al dashboard

**Listar Tareas**
- Lista de todas las tareas del proyecto
- Indicador visual de tareas completadas (✓)
- Tareas completadas con estilo diferente

**Crear Tarea**
- Modal con formulario
- Validación de título obligatorio
- Actualización automática de la lista

**Completar Tarea**
- Botón "Completar" solo en tareas pendientes
- No se puede completar dos veces
- Actualización visual inmediata

**Eliminar Tarea**
- Confirmación antes de eliminar
- Soft delete

---

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación

1. Usuario se registra/inicia sesión
2. Backend devuelve JWT token
3. Frontend guarda token en `localStorage`
4. Todas las peticiones incluyen header: `Authorization: Bearer {token}`
5. Backend valida el token en cada petición

### Protección de Rutas

Las páginas `dashboard.html` y `project-detail.html`:
- Verifican si existe token al cargar
- Redirigen a `index.html` si no hay token
- Redirigen a `index.html` si el token es inválido (401/403)

### Logout

- Elimina el token de `localStorage`
- Redirige a `index.html`

---

## 🎨 Diseño y UX

### Paleta de Colores
```css
--primary-color: #4f46e5     /* Azul principal */
--success-color: #10b981     /* Verde (completado) */
--danger-color: #ef4444      /* Rojo (eliminar) */
--warning-color: #f59e0b     /* Amarillo (draft) */
```

### Características de UX

- **Loading indicators:** Spinner mientras carga datos
- **Alertas:** Mensajes de éxito/error con auto-dismiss
- **Confirmaciones:** Dialogs antes de acciones destructivas
- **Estados visuales:** Colores diferentes para DRAFT/ACTIVE
- **Responsive:** Funciona en móvil, tablet y desktop

---

## 🧪 Flujo de Prueba Completo

### 1. Registro e Inicio de Sesión

**a) Registrar nuevo usuario**
1. Abre `http://127.0.0.1:5500/register.html`
2. Completa el formulario:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `123456`
3. Click en "Registrarse"
4. Deberías ser redirigido al dashboard

**b) Cerrar sesión y volver a entrar**
1. Click en "Cerrar Sesión"
2. En la página de login, ingresa:
   - Username: `testuser`
   - Password: `123456`
3. Click en "Iniciar Sesión"

---

### 2. Gestión de Proyectos

**a) Crear proyecto**
1. En el dashboard, click en "+ Nuevo Proyecto"
2. Ingresa nombre: "Mi Primer Proyecto"
3. Click en "Crear Proyecto"
4. El proyecto aparece con estado DRAFT

**b) Intentar activar proyecto sin tareas**
1. Click en "Activar" en el proyecto
2. Verás error: "El proyecto debe tener al menos una tarea"

---

### 3. Gestión de Tareas

**a) Crear tareas**
1. Click en el proyecto "Mi Primer Proyecto"
2. Click en "+ Nueva Tarea"
3. Ingresa título: "Tarea 1"
4. Click en "Crear Tarea"
5. Repite para crear 2-3 tareas más

**b) Completar tarea**
1. Click en "Completar" en una tarea
2. La tarea cambia a estado completado (con ✓)
3. El botón "Completar" desaparece

**c) Eliminar tarea**
1. Click en "Eliminar" en una tarea
2. Confirma la eliminación
3. La tarea desaparece de la lista

---

### 4. Activar Proyecto

1. Vuelve al dashboard (botón "← Volver")
2. Ahora el proyecto tiene tareas
3. Click en "Activar"
4. El estado cambia a ACTIVE
5. El botón "Activar" desaparece

---

### 5. Eliminar Proyecto

1. Click en "Eliminar" en un proyecto
2. Confirma la eliminación
3. El proyecto desaparece de la lista

---

## 🛠️ Decisiones Técnicas

### 1. Vanilla JavaScript
- Sin dependencias ni frameworks
- Código más simple y directo
- Facilita el entendimiento del flujo

### 2. LocalStorage para JWT
- Persistencia del token entre sesiones
- Fácil acceso desde cualquier script
- Auto-logout si el token es inválido

### 3. Fetch API
- API nativa del navegador
- Promesas para manejo asíncrono
- Headers Authorization en todas las peticiones protegidas

### 4. Función `fetchWithAuth()`
- Centraliza la lógica de autenticación
- Agrega automáticamente el header Authorization
- Maneja errores 401/403 con redirect a login

### 5. Modales en CSS
- Sin librerías externas
- Overlay con backdrop
- Animaciones suaves

### 6. Separación de archivos JS
- `config.js`: Configuración y utilidades
- `auth.js`: Lógica de autenticación
- `dashboard.js`: Lógica de proyectos
- `project-detail.js`: Lógica de tareas

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch"

**Causa:** El backend no está corriendo o hay problema de CORS

**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Verifica que CORS esté configurado en el backend
3. Verifica la URL en `js/config.js`

---

### Error: "401 Unauthorized"

**Causa:** Token JWT inválido o expirado

**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. Verifica que el token no haya expirado (24 horas por defecto)

---

### La página está en blanco

**Causa:** Error de JavaScript en la consola

**Solución:**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Verifica que todos los archivos JS estén cargando correctamente

---

## 📂 Archivos Clave

### `js/config.js`
- Configuración de URL del backend
- Endpoints de la API
- Funciones utilitarias (getAuthToken, fetchWithAuth, logout, showAlert)

### `js/auth.js`
- Funciones de registro y login
- Validación de autenticación (requireAuth)
- Carga de información del usuario

### `js/dashboard.js`
- CRUD de proyectos
- Renderizado del grid de proyectos
- Manejo de modales

### `js/project-detail.js`
- CRUD de tareas
- Renderizado de lista de tareas
- Navegación entre páginas

---

## 🔄 Flujo de Datos
```
1. Usuario interactúa con UI (click, submit)
   ↓
2. JavaScript captura evento
   ↓
3. Validación client-side
   ↓
4. Petición fetch() a API
   ↓
5. Backend procesa y responde
   ↓
6. JavaScript procesa respuesta
   ↓
7. Actualización del DOM
   ↓
8. Feedback visual al usuario
```

---

## 📧 Contacto

Desarrollado como parte del Assessment Técnico de RIWI.

---

## 📄 Licencia

Este proyecto es de uso educativo.