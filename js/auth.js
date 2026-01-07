// ============================================
// AUTENTICACIÓN - LOGIN Y REGISTRO
// ============================================
// Aquí se CONSUMEN los endpoints de autenticación
// ============================================

// ============================================
// REGISTRO DE USUARIO
// ============================================
// CONSUME: POST /api/auth/register
// ============================================
async function register(username, email, password) {
    try {
        // Hacer petición al backend
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar usuario');
        }

        // El backend devuelve: { token: "eyJhbGc...", type: "Bearer" }
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);

        // Redirigir al dashboard
        window.location.href = '/dashboard.html';
        
    } catch (error) {
        throw new Error(handleError(error));
    }
}

// ============================================
// LOGIN DE USUARIO
// ============================================
// CONSUME: POST /api/auth/login
// ============================================
async function login(username, password) {
    try {
        // Hacer petición al backend
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Credenciales inválidas');
        }

        // El backend devuelve: { token: "eyJhbGc...", type: "Bearer" }
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);

        // Redirigir al dashboard
        window.location.href = '/dashboard.html';
        
    } catch (error) {
        throw new Error(handleError(error));
    }
}

// ============================================
// PROTEGER PÁGINAS
// ============================================
// Redirige al login si no hay token
// ============================================
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/index.html';
    }
}

// ============================================
// MOSTRAR INFO DEL USUARIO EN EL HEADER
// ============================================
function loadUserInfo() {
    const username = localStorage.getItem('username');
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement && username) {
        userInfoElement.textContent = `Hola, ${username}`;
    }
}