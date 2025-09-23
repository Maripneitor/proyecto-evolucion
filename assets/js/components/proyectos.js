/**
 * proyectos.js - Funcionalidad para la página de proyectos
 * Proyecto Evolución - Arqueología y Restauración
 */

import { projectsData } from '../data/proyectosData.js';

console.log('[proyectos.js] Script cargado correctamente');
console.log('[proyectos.js] projectsData importado:', projectsData);

function initProjectsPage() {
    console.log('[proyectos.js] Iniciando la página de proyectos...');
    console.log('[proyectos.js] Estado del DOM:', document.readyState);

    const gridContainer = document.getElementById('projects-grid-container');

    if (!gridContainer) {
        console.error('[proyectos.js] Error: No se encontró el contenedor #projects-grid-container. Deteniendo ejecución.');
        console.error('[proyectos.js] Búsqueda en el documento completo:');
        console.error('[proyectos.js] - Elementos con clase "projects-grid":', document.querySelectorAll('.projects-grid').length);
        console.error('[proyectos.js] - Elementos con ID que contienen "project":', document.querySelector('[id*="project"]'));
        return;
    }

    console.log(`[proyectos.js] Contenedor encontrado. Cargando ${projectsData.length} proyectos...`);
    console.log('[proyectos.js] Datos de proyectos:', projectsData);

    if (projectsData.length === 0) {
        console.warn('[proyectos.js] No hay proyectos en los datos. Mostrando mensaje de vacío.');
        gridContainer.innerHTML = '<p class="no-projects">No hay proyectos para mostrar en este momento.</p>';
        return;
    }

    // Limpiamos el contenedor antes de añadir nuevos elementos
    console.log('[proyectos.js] Limpiando contenedor...');
    gridContainer.innerHTML = '';

    console.log('[proyectos.js] Creando tarjetas de proyecto...');
    projectsData.forEach((project, index) => {
        console.log(`[proyectos.js] Procesando proyecto ${index + 1}:`, project.title);
        
        const projectCard = document.createElement('a');
        projectCard.className = 'project-card';
        projectCard.href = `proyecto-detalle.html?id=${project.id}`;
        projectCard.setAttribute('data-project-id', project.id);

        projectCard.innerHTML = `
            <div class="project-card__image-container">
                <img src="${project.image}" alt="Imagen de ${project.title}" class="project-card__image" loading="lazy">
                <span class="project-card__category">${project.category}</span>
            </div>
            <div class="project-card__content">
                <h3 class="project-card__title">${project.title}</h3>
                <p class="project-card__description">${project.description.substring(0, 100)}...</p>
                <div class="project-card__meta">
                    <span class="project-card__year">${project.year}</span>
                    <span class="project-card__location">${project.location}</span>
                </div>
            </div>
        `;
        
        gridContainer.appendChild(projectCard);
        console.log(`[proyectos.js] Tarjeta ${index + 1} añadida al DOM`);
    });

    console.log('[proyectos.js] Todas las tarjetas de proyecto han sido creadas y añadidas al DOM.');
    console.log('[proyectos.js] Número de tarjetas en el contenedor:', gridContainer.children.length);
}

// Asegurarnos de que el script se ejecuta después de que el DOM esté listo
console.log('[proyectos.js] Verificando estado del DOM para ejecución...');

if (document.readyState === 'loading') {
    console.log('[proyectos.js] DOM aún cargando. Esperando evento DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initProjectsPage);
} else {
    console.log('[proyectos.js] DOM ya está listo. Ejecutando inmediatamente...');
    initProjectsPage();
}

// Exportar para posible uso futuro
export function initProyectosPage() {
    console.log('[proyectos.js] Función initProyectosPage() llamada');
    initProjectsPage();
}