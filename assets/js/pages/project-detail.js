/**
 * project-detail.js - Script específico para la página de detalle de proyecto
 * Proyecto Evolución - Arqueología y Restauración
 */

import { projectsData } from '../data/proyectosData.js';

/**
 * Inicializa la página de detalle de proyecto
 */
export function initProjectDetailPage() {
    console.log('[project-detail.js] Inicializando página de detalle de proyecto...');
    
    // Obtener ID del proyecto desde la URL
    const projectId = getProjectIdFromURL();
    if (!projectId) {
        showError();
        return;
    }
    
    // Buscar el proyecto en los datos
    const project = findProjectById(projectId);
    if (!project) {
        showError();
        return;
    }
    
    // Actualizar contenido de la página con los datos del proyecto
    updatePageContent(project);
    
    // Inicializar slider de comparación
    initComparisonSlider();
    
    console.log('[project-detail.js] Página de detalle inicializada correctamente');
}

/**
 * Obtiene el ID del proyecto desde los parámetros de la URL
 * @returns {number|null} ID del proyecto o null si no se encuentra
 */
function getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    console.log(`[project-detail.js] Parámetros de URL: ${window.location.search}`);
    console.log(`[project-detail.js] ID obtenido de la URL: ${id}`);
    
    if (!id) {
        console.error('[project-detail.js] Error: No se encontró el parámetro "id" en la URL');
        return null;
    }
    
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
        console.error('[project-detail.js] Error: El ID del proyecto no es un número válido:', id);
        return null;
    }
    
    console.log(`[project-detail.js] ID numérico válido: ${projectId}`);
    return projectId;
}

/**
 * Busca un proyecto por ID en los datos
 * @param {number} projectId - ID del proyecto a buscar
 * @returns {Object|null} Proyecto encontrado o null
 */
function findProjectById(projectId) {
    console.log(`[project-detail.js] Buscando proyecto con ID: ${projectId}`);
    console.log(`[project-detail.js] Total de proyectos disponibles: ${projectsData.length}`);
    
    const project = projectsData.find(proj => proj.id === projectId);
    
    if (!project) {
        console.error(`[project-detail.js] Error: No se encontró ningún proyecto con ID: ${projectId}`);
        console.log('[project-detail.js] IDs disponibles:', projectsData.map(p => p.id));
        return null;
    }
    
    console.log(`[project-detail.js] Proyecto encontrado: "${project.title}"`);
    return project;
}

/**
 * Actualiza el contenido de la página con los datos del proyecto
 * @param {Object} project - Datos del proyecto
 */
function updatePageContent(project) {
    console.log('[project-detail.js] Actualizando contenido de la página...');
    
    // Actualizar meta tags para SEO
    document.title = `${project.title} - Evolución Arqueología`;
    console.log(`[project-detail.js] Título de página actualizado: ${document.title}`);
    
    // Actualizar hero section
    updateElementContent('project-category', project.category);
    updateElementContent('project-title', project.title);
    updateElementContent('project-description', project.description);
    
    // Actualizar imágenes del slider de comparación
    updateImageSource('comparison-before-img', project.beforeImage, `Antes: ${project.title}`);
    updateImageSource('comparison-after-img', project.afterImage, `Después: ${project.title}`);
    
    // Actualizar detalles del proyecto
    updateElementContent('project-year', project.year);
    updateElementContent('project-location', project.location);
    updateElementContent('project-duration', project.duration);
    updateElementContent('project-client', project.client);
    
    // Actualizar descripción completa
    updateElementContent('project-full-description', project.fullDescription, true);
    
    // Actualizar galería
    updateProjectGallery(project.gallery);
    
    console.log('[project-detail.js] Contenido de la página actualizado correctamente');
}

/**
 * Actualiza el contenido de un elemento del DOM
 * @param {string} elementId - ID del elemento
 * @param {string} content - Contenido a insertar
 * @param {boolean} isHTML - Si el contenido es HTML
 */
function updateElementContent(elementId, content, isHTML = false) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.warn(`[project-detail.js] Elemento con ID '${elementId}' no encontrado`);
        return;
    }
    
    if (!content) {
        console.warn(`[project-detail.js] Contenido vacío para elemento '${elementId}'`);
        element.textContent = '-';
        return;
    }
    
    if (isHTML) {
        element.innerHTML = content;
    } else {
        element.textContent = content;
    }
    
    console.log(`[project-detail.js] Elemento '${elementId}' actualizado`);
}

/**
 * Actualiza la fuente de una imagen
 * @param {string} imageId - ID de la imagen
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 */
function updateImageSource(imageId, src, alt) {
    const image = document.getElementById(imageId);
    
    if (!image) {
        console.warn(`[project-detail.js] Imagen con ID '${imageId}' no encontrada`);
        return;
    }
    
    if (!src) {
        console.warn(`[project-detail.js] URL de imagen vacía para '${imageId}'`);
        return;
    }
    
    image.src = src;
    image.alt = alt;
    console.log(`[project-detail.js] Imagen '${imageId}' actualizada: ${src}`);
}

/**
 * Actualiza la galería de imágenes del proyecto
 * @param {Array} gallery - Array de URLs de imágenes
 */
function updateProjectGallery(gallery) {
    const galleryContainer = document.getElementById('project-gallery');
    
    if (!galleryContainer) {
        console.warn('[project-detail.js] Contenedor de galería no encontrado');
        return;
    }
    
    if (!gallery || gallery.length === 0) {
        galleryContainer.innerHTML = '<p class="no-gallery">No hay imágenes adicionales para este proyecto.</p>';
        console.log('[project-detail.js] Galería vacía - mostrando mensaje');
        return;
    }
    
    console.log(`[project-detail.js] Actualizando galería con ${gallery.length} imágenes`);
    
    const galleryHTML = gallery.map((imgUrl, index) => `
        <div class="gallery-item">
            <img src="${imgUrl}" alt="Imagen ${index + 1} del proyecto" loading="lazy">
        </div>
    `).join('');
    
    galleryContainer.innerHTML = galleryHTML;
    console.log('[project-detail.js] Galería actualizada correctamente');
}

/**
 * Inicializa el slider de comparación antes/después
 */
function initComparisonSlider() {
    console.log('[project-detail.js] Inicializando slider de comparación...');
    
    const slider = document.getElementById('comparison-slider');
    const beforeContainer = document.querySelector('.comparison-before');
    
    if (!slider) {
        console.warn('[project-detail.js] Slider no encontrado');
        return;
    }
    
    if (!beforeContainer) {
        console.warn('[project-detail.js] Contenedor "antes" no encontrado');
        return;
    }
    
    slider.addEventListener('input', function(e) {
        const value = e.target.value;
        beforeContainer.style.width = `${value}%`;
        console.log(`[project-detail.js] Slider actualizado: ${value}%`);
    });
    
    // Añadir soporte para touch en dispositivos móviles
    slider.addEventListener('touchstart', function() {
        document.body.style.overflow = 'hidden';
    });
    
    slider.addEventListener('touchend', function() {
        document.body.style.overflow = '';
    });
    
    console.log('[project-detail.js] Slider de comparación inicializado');
}

/**
 * Muestra un mensaje de error cuando no se encuentra el proyecto
 */
function showError() {
    console.error('[project-detail.js] Mostrando página de error');
    
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <section class="error-section">
                <div class="container">
                    <div class="error-content">
                        <h1>Proyecto No Encontrado</h1>
                        <p>Lo sentimos, no pudimos encontrar el proyecto solicitado.</p>
                        <a href="proyectos.html" class="btn btn--primary">Volver a Proyectos</a>
                    </div>
                </div>
            </section>
        `;
    }
}

// Inicialización automática cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('[project-detail.js] DOM cargado - iniciando página de detalle');
    initProjectDetailPage();
});

// Exportar para posible uso futuro
export default initProjectDetailPage;