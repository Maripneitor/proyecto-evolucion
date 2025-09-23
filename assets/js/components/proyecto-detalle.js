/**
 * proyecto-detalle.js - Funcionalidad para la página de detalle de proyecto
 * Proyecto Evolución - Arqueología y Restauración
 */

import { projectsData } from '../data/proyectosData.js';

/**
 * Obtiene el ID del proyecto desde los parámetros de la URL
 * @returns {number|null} ID del proyecto o null si no se encuentra
 */
function getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        console.error('No se encontró el parámetro "id" en la URL');
        return null;
    }
    
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
        console.error('El ID del proyecto no es un número válido:', id);
        return null;
    }
    
    return projectId;
}

/**
 * Busca un proyecto por ID en los datos
 * @param {number} projectId - ID del proyecto a buscar
 * @returns {Object|null} Proyecto encontrado o null
 */
function findProjectById(projectId) {
    const project = projectsData.find(proj => proj.id === projectId);
    
    if (!project) {
        console.error(`No se encontró ningún proyecto con ID: ${projectId}`);
        return null;
    }
    
    console.log(`Proyecto encontrado: ${project.title}`);
    return project;
}

/**
 * Actualiza el contenido de la página con los datos del proyecto
 * @param {Object} project - Datos del proyecto
 */
function updatePageContent(project) {
    // Actualizar meta tags para SEO
    document.title = `${project.title} - Evolución Arqueología`;
    
    // Actualizar hero section
    document.getElementById('project-category').textContent = project.category;
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.description;
    
    // Actualizar imágenes del slider de comparación
    const beforeImg = document.getElementById('comparison-before-img');
    const afterImg = document.getElementById('comparison-after-img');
    
    if (beforeImg && project.beforeImage) {
        beforeImg.src = project.beforeImage;
        beforeImg.alt = `Antes: ${project.title}`;
    }
    
    if (afterImg && project.afterImage) {
        afterImg.src = project.afterImage;
        afterImg.alt = `Después: ${project.title}`;
    }
    
    // Actualizar detalles del proyecto
    document.getElementById('project-year').textContent = project.year || '-';
    document.getElementById('project-location').textContent = project.location || '-';
    document.getElementById('project-duration').textContent = project.duration || '-';
    document.getElementById('project-client').textContent = project.client || '-';
    
    // Actualizar descripción completa
    const fullDescription = document.getElementById('project-full-description');
    if (fullDescription && project.fullDescription) {
        fullDescription.innerHTML = `<p>${project.fullDescription}</p>`;
    }
    
    // Actualizar galería
    updateProjectGallery(project.gallery);
}

/**
 * Actualiza la galería de imágenes del proyecto
 * @param {Array} gallery - Array de URLs de imágenes
 */
function updateProjectGallery(gallery) {
    const galleryContainer = document.getElementById('project-gallery');
    
    if (!galleryContainer || !gallery || gallery.length === 0) {
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p class="no-gallery">No hay imágenes adicionales para este proyecto.</p>';
        }
        return;
    }
    
    const galleryHTML = gallery.map((imgUrl, index) => `
        <div class="gallery-item">
            <img src="${imgUrl}" alt="Imagen ${index + 1} del proyecto" loading="lazy">
        </div>
    `).join('');
    
    galleryContainer.innerHTML = galleryHTML;
}

/**
 * Inicializa el slider de comparación antes/después
 */
function initComparisonSlider() {
    const slider = document.getElementById('comparison-slider');
    const beforeContainer = document.querySelector('.comparison-before');
    
    if (!slider || !beforeContainer) {
        console.warn('No se encontraron elementos del slider de comparación');
        return;
    }
    
    slider.addEventListener('input', function(e) {
        const value = e.target.value;
        beforeContainer.style.width = `${value}%`;
    });
    
    // Añadir soporte para touch en dispositivos móviles
    slider.addEventListener('touchstart', function() {
        document.body.style.overflow = 'hidden';
    });
    
    slider.addEventListener('touchend', function() {
        document.body.style.overflow = '';
    });
}

/**
 * Muestra un mensaje de error cuando no se encuentra el proyecto
 */
function showError() {
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

/**
 * Inicializa la página de detalle de proyecto
 */
export function initProyectoDetalle() {
    console.log('[proyecto-detalle.js] Inicializando página de detalle de proyecto');
    
    // Obtener ID del proyecto desde la URL
    const projectId = getProjectIdFromURL();
    if (!projectId) {
        showError();
        return;
    }
    
    // Buscar el proyecto
    const project = findProjectById(projectId);
    if (!project) {
        showError();
        return;
    }
    
    // Actualizar contenido de la página
    updatePageContent(project);
    
    // Inicializar slider de comparación
    initComparisonSlider();
    
    console.log('[proyecto-detalle.js] Página de detalle inicializada correctamente');
}

// Inicializar automáticamente si este script se carga directamente
if (import.meta.url === document.currentScript.src) {
    document.addEventListener('DOMContentLoaded', initProyectoDetalle);
}