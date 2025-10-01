/**
 * project-detail.js - Script específico para la página de detalle de proyecto
 * Proyecto Evolución - Arqueología y Restauración
 * VERSIÓN CORREGIDA - Componentes interactivos completamente funcionales
 */

import { projectsData } from '../data/proyectosData.js';

// Variable global para almacenar el proyecto actual
let currentProject = null;

/**
 * Inicializa la página de detalle de proyecto
 */
async function initProjectDetailPage() {
    console.log('[project-detail.js] Inicializando página de detalle de proyecto...');
    
    try {
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
        
        // Guardar proyecto actual
        currentProject = project;
        
        // Actualizar contenido de la página con los datos del proyecto
        await updatePageContent(project);
        
        // Inicializar componentes interactivos DESPUÉS de cargar los datos
        await initComparisonSlider();
        await initProjectGallery();
        
        console.log('[project-detail.js] Página de detalle inicializada correctamente');
        
    } catch (error) {
        console.error('[project-detail.js] Error crítico en inicialización:', error);
        showError();
    }
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
async function updatePageContent(project) {
    console.log('[project-detail.js] Actualizando contenido de la página...');
    
    return new Promise((resolve) => {
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            try {
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
                updateElementContent('project-year', project.year || '-');
                updateElementContent('project-location', project.location || '-');
                updateElementContent('project-duration', project.duration || '-');
                updateElementContent('project-client', project.client || '-');
                
                // Actualizar descripción completa
                updateElementContent('project-full-description', project.fullDescription, true);
                
                console.log('[project-detail.js] Contenido de la página actualizado correctamente');
                resolve();
                
            } catch (error) {
                console.error('[project-detail.js] Error actualizando contenido:', error);
                resolve(); // Resolver igualmente para continuar
            }
        }, 100);
    });
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
        element.innerHTML = `<p>${content}</p>`;
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
        image.style.display = 'none';
        return;
    }
    
    image.src = src;
    image.alt = alt;
    image.style.display = 'block';
    console.log(`[project-detail.js] Imagen '${imageId}' actualizada: ${src}`);
}

/**
 * Inicializa el slider de comparación antes/después - COMPLETAMENTE CORREGIDO
 */
function initComparisonSlider() {
    return new Promise((resolve) => {
        console.log('[project-detail.js] Inicializando slider de comparación...');
        
        setTimeout(() => {
            try {
                const slider = document.getElementById('comparison-slider');
                const beforeContainer = document.querySelector('.comparison-before');
                
                if (!slider) {
                    console.error('[project-detail.js] ERROR: Slider no encontrado en el DOM');
                    resolve();
                    return;
                }
                
                if (!beforeContainer) {
                    console.error('[project-detail.js] ERROR: Contenedor "antes" no encontrado');
                    resolve();
                    return;
                }
                
                // Verificar que las imágenes estén cargadas
                const beforeImg = document.getElementById('comparison-before-img');
                const afterImg = document.getElementById('comparison-after-img');
                
                if (!beforeImg || !afterImg) {
                    console.error('[project-detail.js] ERROR: Imágenes del slider no encontradas');
                    resolve();
                    return;
                }
                
                // Verificar que las imágenes tengan src válido
                if (!beforeImg.src || beforeImg.src === window.location.href) {
                    console.error('[project-detail.js] ERROR: Imagen "antes" no tiene src válido');
                    resolve();
                    return;
                }
                
                if (!afterImg.src || afterImg.src === window.location.href) {
                    console.error('[project-detail.js] ERROR: Imagen "después" no tiene src válido');
                    resolve();
                    return;
                }
                
                // Limpiar event listeners previos creando un nuevo elemento
                const newSlider = slider.cloneNode(true);
                slider.parentNode.replaceChild(newSlider, slider);
                
                // Configurar evento input CORREGIDO - usando el nuevo slider
                newSlider.addEventListener('input', function(e) {
                    const value = e.target.value;
                    beforeContainer.style.width = `${value}%`;
                    console.log(`[project-detail.js] Slider actualizado: ${value}%`);
                });
                
                // Configurar evento change como respaldo
                newSlider.addEventListener('change', function(e) {
                    const value = e.target.value;
                    beforeContainer.style.width = `${value}%`;
                    console.log(`[project-detail.js] Slider change: ${value}%`);
                });
                
                // Añadir soporte para touch en dispositivos móviles
                newSlider.addEventListener('touchstart', function() {
                    document.body.style.overflow = 'hidden';
                });
                
                newSlider.addEventListener('touchend', function() {
                    document.body.style.overflow = '';
                });
                
                // Forzar posición inicial y asegurar que el contenedor tenga el ancho correcto
                beforeContainer.style.width = '50%';
                newSlider.value = 50;
                
                // Verificar que el evento funciona inmediatamente
                console.log('[project-detail.js] Verificando funcionalidad del slider...');
                setTimeout(() => {
                    newSlider.value = 60;
                    newSlider.dispatchEvent(new Event('input'));
                    console.log('[project-detail.js] Prueba de slider completada');
                }, 100);
                
                console.log('[project-detail.js] Slider de comparación inicializado correctamente');
                resolve();
                
            } catch (error) {
                console.error('[project-detail.js] Error inicializando slider:', error);
                resolve();
            }
        }, 200); // Mayor delay para asegurar que las imágenes estén cargadas
    });
}

/**
 * Inicializa la galería de imágenes del proyecto - COMPLETAMENTE CORREGIDO
 */
function initProjectGallery() {
    return new Promise((resolve) => {
        console.log('[project-detail.js] Inicializando galería del proyecto...');
        
        setTimeout(() => {
            try {
                const galleryContainer = document.getElementById('project-gallery');
                
                if (!galleryContainer) {
                    console.error('[project-detail.js] ERROR: Contenedor de galería no encontrado');
                    resolve();
                    return;
                }
                
                if (!currentProject) {
                    console.error('[project-detail.js] ERROR: Proyecto actual no definido');
                    resolve();
                    return;
                }
                
                const gallery = currentProject.gallery;
                
                // Limpiar contenido de "Cargando..." inmediatamente
                galleryContainer.innerHTML = '';
                
                // Verificar que gallery existe y es un array válido
                if (!gallery || !Array.isArray(gallery)) {
                    console.warn('[project-detail.js] Galería no definida o no es un array');
                    galleryContainer.innerHTML = `
                        <div class="no-gallery">
                            <p>No hay información de galería disponible para este proyecto.</p>
                        </div>
                    `;
                    resolve();
                    return;
                }
                
                if (gallery.length === 0) {
                    console.log('[project-detail.js] Galería vacía - mostrando mensaje informativo');
                    galleryContainer.innerHTML = `
                        <div class="no-gallery">
                            <p>No hay imágenes adicionales disponibles para este proyecto.</p>
                        </div>
                    `;
                    resolve();
                    return;
                }
                
                console.log(`[project-detail.js] Creando galería con ${gallery.length} imágenes`);
                
                // Filtrar URLs válidas
                const validImages = gallery.filter(imgUrl => 
                    imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== ''
                );
                
                if (validImages.length === 0) {
                    console.warn('[project-detail.js] No hay URLs de imagen válidas en la galería');
                    galleryContainer.innerHTML = `
                        <div class="no-gallery">
                            <p>Las imágenes de la galería no están disponibles.</p>
                        </div>
                    `;
                    resolve();
                    return;
                }
                
                // Crear elementos de galería dinámicamente
                validImages.forEach((imgUrl, index) => {
                    try {
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item';
                        
                        const img = document.createElement('img');
                        img.src = imgUrl;
                        img.alt = `Imagen ${index + 1} del proyecto ${currentProject.title}`;
                        img.loading = 'lazy';
                        
                        // Manejar errores de carga de imagen
                        img.onerror = function() {
                            console.error(`[project-detail.js] Error cargando imagen: ${imgUrl}`);
                            this.style.display = 'none';
                            // Opcional: mostrar un placeholder
                            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDI1MFYxNTBIMTUwVjEwMFoiIGZpbGw9IiNEOEQ5REIiLz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OEEwQUMiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+Cjwvc3ZnPgo=';
                            this.style.display = 'block';
                        };
                        
                        img.onload = function() {
                            console.log(`[project-detail.js] Imagen ${index + 1} cargada correctamente`);
                        };
                        
                        galleryItem.appendChild(img);
                        galleryContainer.appendChild(galleryItem);
                        
                        console.log(`[project-detail.js] Imagen ${index + 1} añadida a la galería`);
                        
                    } catch (imgError) {
                        console.error(`[project-detail.js] Error creando elemento de imagen ${index + 1}:`, imgError);
                    }
                });
                
                console.log('[project-detail.js] Galería inicializada correctamente');
                resolve();
                
            } catch (error) {
                console.error('[project-detail.js] Error creando galería:', error);
                const galleryContainer = document.getElementById('project-gallery');
                if (galleryContainer) {
                    galleryContainer.innerHTML = `
                        <div class="no-gallery">
                            <p>Error al cargar la galería de imágenes.</p>
                        </div>
                    `;
                }
                resolve();
            }
        }, 100);
    });
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
                        <p>El proyecto puede no existir o haber sido removido.</p>
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
export { initProjectDetailPage };