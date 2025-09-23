/**
 * proyectos.js - Funcionalidad para la página de proyectos
 * Proyecto Evolución - Arqueología y Restauración
 */

import { projectsData } from '../data/proyectosData.js';

/**
 * Crea el HTML para una tarjeta de proyecto
 * @param {Object} project - Datos del proyecto
 * @returns {string} HTML de la tarjeta
 */
function createProjectCard(project) {
    return `
        <a href="proyecto-detalle.html?id=${project.id}" class="project-card" data-category="${project.category.toLowerCase()}">
            <div class="project-card__image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-card__category">${project.category}</div>
            </div>
            <div class="project-card__content">
                <h3 class="project-card__title">${project.title}</h3>
                <p class="project-card__description">${project.description}</p>
                <div class="project-card__meta">
                    <span class="project-card__year">${project.year}</span>
                    <span class="project-card__location">${project.location}</span>
                </div>
            </div>
        </a>
    `;
}

/**
 * Renderiza todas las tarjetas de proyectos en el grid
 */
function renderProjects() {
    const gridContainer = document.getElementById('projects-grid-container');
    
    if (!gridContainer) {
        console.error('No se encontró el contenedor de proyectos con ID "projects-grid-container"');
        return;
    }
    
    console.log(`[proyectos.js] Renderizando ${projectsData.length} proyectos`);
    
    // Limpiar contenedor antes de renderizar
    gridContainer.innerHTML = '';
    
    // Crear y insertar tarjetas
    projectsData.forEach(project => {
        const projectCardHTML = createProjectCard(project);
        gridContainer.insertAdjacentHTML('beforeend', projectCardHTML);
    });
    
    console.log('[proyectos.js] Proyectos renderizados exitosamente');
}

/**
 * Inicializa la página de proyectos
 */
export function initProyectosPage() {
    console.log('[proyectos.js] Inicializando página de proyectos');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderProjects);
    } else {
        renderProjects();
    }
}

// Inicializar automáticamente si este script se carga directamente
if (import.meta.url === document.currentScript.src) {
    initProyectosPage();
}