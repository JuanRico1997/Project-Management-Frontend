// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
// AQUÍ SE DEFINEN TODAS LAS URLs DE TU BACKEND
// ============================================

const API_BASE_URL = 'http://localhost:8080/api';

// Todos los endpoints de tu API REST
const API_ENDPOINTS = {
    // Endpoints de autenticación
    AUTH: {
        REGISTER: `${API_BASE_URL}/auth/register`,  // POST /api/auth/register
        LOGIN: `${API_BASE_URL}/auth/login`          // POST /api/auth/login
    },
    
    // Endpoints de proyectos
    PROJECTS: {
        LIST: `${API_BASE_URL}/projects`,                      // GET /api/projects
        CREATE: `${API_BASE_URL}/projects`,                    // POST /api/projects
        ACTIVATE: (id) => `${API_BASE_URL}/projects/${id}/activate`,  // PATCH /api/projects/{id}/activate
        DELETE: (id) => `${API_BASE_URL}/projects/${id}`       // DELETE /api/projects/{id}
    },
    
    // Endpoints de tareas
    TASKS: {
        LIST: (projectId) => `${API_BASE_URL}/projects/${projectId}/tasks`,      // GET /api/projects/{projectId}/tasks
        CREATE: (projectId) => `${API_BASE_URL}/projects/${projectId}/tasks`,    // POST /api/projects/{projectId}/tasks
        COMPLETE: (id) => `${API_BASE_URL}/tasks/${id}/complete`,                // PATCH /api/tasks/{id}/complete
        DELETE: (id) => `${API_BASE_URL}/tasks/${id}`                            // DELETE /api/tasks/{id}
    }
};

// ============================================
// UTILIDADES PARA AUTENTICACIÓN
// ============================================

// Obtener el token JWT del localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return !!getAuthToken();
}

// ============================================
// FUNCIÓN PRINCIPAL PARA CONSUMIR LA API
// ============================================
// Esta función se usa en TODOS los archivos JS
// para hacer peticiones a tu backend
// ============================================

async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();
    
    // Agregar headers por defecto
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Si hay token, agregarlo al header Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Hacer la petición fetch
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // Si el backend devuelve 401 o 403, el token es inválido
    // Redirigir al login
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/index.html';
        return;
    }
    
    return response;
}

// ============================================
// UTILIDADES ADICIONALES
// ============================================

// Manejar errores de forma consistente
function handleError(error) {
    console.error('Error:', error);
    return error.message || 'Ocurrió un error inesperado';
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/index.html';
}

// Mostrar alertas al usuario
function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}