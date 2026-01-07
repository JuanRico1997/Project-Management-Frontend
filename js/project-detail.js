// ============================================
// DETALLE DE PROYECTO - GESTIÓN DE TAREAS
// ============================================
// Aquí se CONSUMEN los endpoints de tareas
// ============================================

let currentProjectId = null;
let currentProject = null;
let tasks = [];

// Cargar todo cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();  // Verificar autenticación
    loadUserInfo(); // Mostrar nombre de usuario
    
    // Obtener el ID del proyecto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    currentProjectId = urlParams.get('id');
    
    if (!currentProjectId) {
        showAlert('ID de proyecto no válido', 'error');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 2000);
        return;
    }
    
    loadProjectDetails();
    loadTasks();
});

// ============================================
// CARGAR DETALLES DEL PROYECTO
// ============================================
// CONSUME: GET /api/projects (filtramos por ID)
// ============================================
async function loadProjectDetails() {
    try {
        // Obtener todos los proyectos
        const response = await fetchWithAuth(API_ENDPOINTS.PROJECTS.LIST);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar proyecto');
        }

        // Buscar el proyecto actual
        currentProject = data.find(p => p.id === currentProjectId);
        
        if (!currentProject) {
            throw new Error('Proyecto no encontrado');
        }

        // Mostrar información del proyecto
        document.getElementById('projectName').textContent = currentProject.name;
        document.getElementById('projectStatus').textContent = currentProject.status;
        document.getElementById('projectStatus').className = 
            `project-status status-${currentProject.status.toLowerCase()}`;
        
    } catch (error) {
        showAlert(handleError(error), 'error');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 2000);
    }
}

// ============================================
// CARGAR LISTA DE TAREAS
// ============================================
// CONSUME: GET /api/projects/{projectId}/tasks
// ============================================
async function loadTasks() {
    try {
        showLoading(true);
        
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.TASKS.LIST(currentProjectId));
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar tareas');
        }

        // Guardar tareas en variable global
        tasks = data;
        
        // Renderizar en la UI
        renderTasks(tasks);
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// RENDERIZAR TAREAS EN LA LISTA
// ============================================
function renderTasks(tasksList) {
    const container = document.getElementById('tasksList');
    
    if (tasksList.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--gray-600); padding: 2rem;">
                <p>No hay tareas en este proyecto</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Crea la primera tarea para comenzar</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasksList.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div>
                <div class="task-title">
                    ${task.completed ? '✓ ' : ''}${escapeHtml(task.title)}
                </div>
            </div>
            <div class="task-actions">
                ${!task.completed ? `
                    <button class="btn btn-success btn-small" onclick="completeTask('${task.id}')">
                        Completar
                    </button>
                ` : ''}
                <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// CREAR NUEVA TAREA
// ============================================
// CONSUME: POST /api/projects/{projectId}/tasks
// ============================================
async function createTask() {
    const title = document.getElementById('taskTitle').value.trim();

    if (!title) {
        showAlert('El título de la tarea es obligatorio', 'error');
        return;
    }

    try {
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.TASKS.CREATE(currentProjectId), {
            method: 'POST',
            body: JSON.stringify({ title })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear tarea');
        }

        showAlert('Tarea creada exitosamente', 'success');
        closeModal('createTaskModal');
        document.getElementById('taskTitle').value = '';
        
        // Recargar lista de tareas
        loadTasks();
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    }
}

// ============================================
// COMPLETAR TAREA
// ============================================
// CONSUME: PATCH /api/tasks/{id}/complete
// ============================================
async function completeTask(taskId) {
    if (!confirm('¿Marcar esta tarea como completada?')) {
        return;
    }

    try {
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.TASKS.COMPLETE(taskId), {
            method: 'PATCH'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al completar tarea');
        }

        showAlert('Tarea completada exitosamente', 'success');
        
        // Recargar lista de tareas
        loadTasks();
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    }
}

// ============================================
// ELIMINAR TAREA (SOFT DELETE)
// ============================================
// CONSUME: DELETE /api/tasks/{id}
// ============================================
async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
        return;
    }

    try {
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.TASKS.DELETE(taskId), {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar tarea');
        }

        showAlert('Tarea eliminada exitosamente', 'success');
        
        // Recargar lista de tareas
        loadTasks();
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    }
}

// ============================================
// UTILIDADES DE UI
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.toggle('hidden', !show);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function goBack() {
    window.location.href = '/dashboard.html';
}
