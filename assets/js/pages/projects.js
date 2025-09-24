/**
 * projects.js - Script específico para la página de proyectos
 * Proyecto Evolución - Arqueología y Restauración
 */

import { projectsData } from '../data/proyectosData.js';

console.log('[projects.js] Script de página de proyectos cargado correctamente');

// Estado global de la vista
let currentView = 'grid'; // 'grid' o 'list'

/**
 * Función para cargar componentes específicos de la página de proyectos
 */
async function loadPageComponent(componentId, filePath) {
    try {
        console.log(`[projects.js] Cargando componente de página: ${componentId}`);
        
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
        
        const html = await response.text();
        const container = document.getElementById(componentId);
        
        if (container) {
            container.innerHTML = html;
            console.log(`[projects.js] Componente '${componentId}' cargado exitosamente.`);
        } else {
            console.warn(`[projects.js] Contenedor '${componentId}' no encontrado en la página de proyectos.`);
        }
    } catch (error) {
        console.error(`[projects.js] Error al cargar componente ${componentId}:`, error);
    }
}

/**
 * Inicializa los controles de vista (grid/lista)
 */
function initViewControls() {
    console.log('[projects.js] Inicializando controles de vista...');
    
    const gridBtn = document.querySelector('.view-controls__btn--grid');
    const listBtn = document.querySelector('.view-controls__btn--list');
    const projectsContainer = document.getElementById('projects-container');
    
    if (!gridBtn || !listBtn || !projectsContainer) {
        console.warn('[projects.js] Elementos de controles de vista no encontrados');
        return;
    }
    
    // Event listeners para los botones de vista
    gridBtn.addEventListener('click', () => switchView('grid', gridBtn, listBtn, projectsContainer));
    listBtn.addEventListener('click', () => switchView('list', gridBtn, listBtn, projectsContainer));
    
    // Cargar preferencia del usuario desde localStorage
    const savedView = localStorage.getItem('projectsView');
    if (savedView && (savedView === 'grid' || savedView === 'list')) {
        switchView(savedView, gridBtn, listBtn, projectsContainer, false);
    }
    
    console.log('[projects.js] Controles de vista inicializados correctamente');
}

/**
 * Cambia entre vista de grid y lista
 */
function switchView(view, gridBtn, listBtn, projectsContainer, savePreference = true) {
    if (view === currentView) return;
    
    console.log(`[projects.js] Cambiando a vista: ${view}`);
    
    // Actualizar estado
    currentView = view;
    
    // Actualizar clases del contenedor
    if (view === 'list') {
        projectsContainer.classList.add('view-list');
        projectsContainer.classList.remove('view-grid');
    } else {
        projectsContainer.classList.add('view-grid');
        projectsContainer.classList.remove('view-list');
    }
    
    // Actualizar botones activos
    gridBtn.classList.toggle('active', view === 'grid');
    listBtn.classList.toggle('active', view === 'list');
    
    // Actualizar atributos ARIA para accesibilidad
    gridBtn.setAttribute('aria-pressed', view === 'grid');
    listBtn.setAttribute('aria-pressed', view === 'list');
    
    // Guardar preferencia del usuario
    if (savePreference) {
        localStorage.setItem('projectsView', view);
    }
    
    console.log(`[projects.js] Vista cambiada a: ${view}`);
}

/**
 * Inicializa la página de proyectos
 */
function initProjectsPage() {
    console.log('[projects.js] Iniciando la página de proyectos...');

    const gridContainer = document.getElementById('projects-grid-container');

    if (!gridContainer) {
        console.error('[projects.js] Error: No se encontró el contenedor #projects-grid-container. Deteniendo ejecución.');
        return;
    }

    console.log(`[projects.js] Contenedor encontrado. Cargando ${projectsData.length} proyectos...`);

    if (projectsData.length === 0) {
        console.warn('[projects.js] No hay proyectos en los datos. Mostrando mensaje de vacío.');
        gridContainer.innerHTML = '<p class="no-projects">No hay proyectos para mostrar en este momento.</p>';
        return;
    }

    // Limpiamos el contenedor antes de añadir nuevos elementos
    console.log('[projects.js] Limpiando contenedor...');
    gridContainer.innerHTML = '';

    console.log('[projects.js] Creando tarjetas de proyecto...');
    projectsData.forEach((project, index) => {
        console.log(`[projects.js] Procesando proyecto ${index + 1}:`, project.title);
        
        const projectCard = createProjectCard(project);
        gridContainer.appendChild(projectCard);
        console.log(`[projects.js] Tarjeta ${index + 1} añadida al DOM`);
    });

    console.log('[projects.js] Todas las tarjetas de proyecto han sido creadas y añadidas al DOM.');
    console.log('[projects.js] Número de tarjetas en el contenedor:', gridContainer.children.length);
}

/**
 * Crea el HTML para una tarjeta de proyecto
 */
function createProjectCard(project) {
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
            <p class="project-card__description">${project.description}</p>
            <div class="project-card__meta">
                <span class="project-card__year">${project.year}</span>
                <span class="project-card__location">${project.location}</span>
            </div>
            <span class="project-card__view-link">Ver detalles →</span>
        </div>
    `;
    
    return projectCard;
}

// Inicialización de la página de proyectos
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[projects.js] Inicializando página de proyectos...');
    
    try {
        // Cargar componentes específicos de la página de proyectos si los hay
        // await loadPageComponent('algún-contenedor', 'partials/algún-componente.html');
        
        // Inicializar la lógica específica de la página de proyectos
        initProjectsPage();
        
        // Inicializar controles de vista (después de cargar los proyectos)
        initViewControls();
        
        console.log('[projects.js] Página de proyectos inicializada correctamente.');
        
    } catch (error) {
        console.error('[projects.js] Error durante la inicialización de la página de proyectos:', error);
    }
});

// Exportar para posible uso futuro
export function initProjectsPageFunction() {
    console.log('[projects.js] Función initProjectsPageFunction() llamada');
    initProjectsPage();
}