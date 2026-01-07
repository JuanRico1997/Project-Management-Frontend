// ============================================
// DASHBOARD - GESTIÓN DE PROYECTOS
// ============================================
// Aquí se CONSUMEN los endpoints de proyectos
// ============================================

let projects = [];

// Cargar proyectos cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();  // Verificar que esté autenticado
    loadUserInfo(); // Mostrar nombre de usuario
    loadProjects(); // Cargar lista de proyectos
});

// ============================================
// CARGAR LISTA DE PROYECTOS
// ============================================
// CONSUME: GET /api/projects
// ============================================
async function loadProjects() {
    try {
        showLoading(true);
        
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.PROJECTS.LIST);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar proyectos');
        }

        // Guardar proyectos en variable global
        projects = data;
        
        // Renderizar en la UI
        renderProjects(projects);
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// RENDERIZAR PROYECTOS EN EL GRID
// ============================================
function renderProjects(projectsList) {
    const grid = document.getElementById('projectsGrid');
    
    if (projectsList.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: white; padding: 3rem;">
                <h3>No tienes proyectos aún</h3>
                <p>Crea tu primer proyecto para comenzar</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = projectsList.map(project => `
        <div class="project-card" onclick="goToProject('${project.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <h3>${escapeHtml(project.name)}</h3>
                <span class="project-status status-${project.status.toLowerCase()}">
                    ${project.status}
                </span>
            </div>
            <div class="project-actions" onclick="event.stopPropagation();">
                ${project.status === 'DRAFT' ? `
                    <button class="btn btn-success btn-small" onclick="activateProject('${project.id}')">
                        Activar
                    </button>
                ` : ''}
                <button class="btn btn-danger btn-small" onclick="deleteProject('${project.id}')">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// CREAR NUEVO PROYECTO
// ============================================
// CONSUME: POST /api/projects
// ============================================
async function createProject() {
    const name = document.getElementById('projectName').value.trim();

    if (!name) {
        showAlert('El nombre del proyecto es obligatorio', 'error');
        return;
    }

    try {
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.PROJECTS.CREATE, {
            method: 'POST',
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear proyecto');
        }

        showAlert('Proyecto creado exitosamente', 'success');
        closeModal('createProjectModal');
        document.getElementById('projectName').value = '';
        
        // Recargar lista de proyectos
        loadProjects();
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    }
}

// ============================================
// ACTIVAR PROYECTO
// ============================================
// CONSUME: PATCH /api/projects/{id}/activate
// ============================================
async function activateProject(projectId) {
    if (!confirm('¿Estás seguro de activar este proyecto? Debe tener al menos una tarea.')) {
        return;
    }

    try {
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.PROJECTS.ACTIVATE(projectId), {
            method: 'PATCH'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al activar proyecto');
        }

        showAlert('Proyecto activado exitosamente', 'success');
        
        // Recargar lista de proyectos
        loadProjects();
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    }
}

// ============================================
// ELIMINAR PROYECTO (SOFT DELETE)
// ============================================
// CONSUME: DELETE /api/projects/{id}
// ============================================
async function deleteProject(projectId) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) {
        return;
    }

    try {
        // Hacer petición con autenticación (JWT en header)
        const response = await fetchWithAuth(API_ENDPOINTS.PROJECTS.DELETE(projectId), {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar proyecto');
        }

        showAlert('Proyecto eliminado exitosamente', 'success');
        
        // Recargar lista de proyectos
        loadProjects();
        
    } catch (error) {
        showAlert(handleError(error), 'error');
    }
}

// ============================================
// NAVEGACIÓN
// ============================================

// Ir al detalle del proyecto
function goToProject(projectId) {
    window.location.href = `/project-detail.html?id=${projectId}`;
}

// ============================================
// UTILIDADES DE UI
// ============================================

// Abrir modal
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.toggle('hidden', !show);
    }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}