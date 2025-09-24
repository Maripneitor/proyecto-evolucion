/**
 * main.js - Script principal para el proyecto "Evolución"
 * Versión refactorizada: Solo carga componentes comunes (header, footer)
 * Proyecto Evolución - Arqueología y Restauración
 */

import { initHeader } from './components/header.js';

/**
 * Función auxiliar para cargar componentes HTML
 * @param {string} componentId - ID del contenedor
 * @param {string} filePath - Ruta al archivo HTML parcial
 */
async function loadComponent(componentId, filePath) {
    try {
        console.log(`[main.js] Cargando componente: ${componentId} desde ${filePath}`);
        
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Error al cargar ${filePath}: ${response.status}`);
        
        const html = await response.text();
        const container = document.getElementById(componentId);
        
        if (container) {
            container.innerHTML = html;
            console.log(`[main.js] Componente '${componentId}' cargado exitosamente.`);
            
            // Inicializar el header inmediatamente después de cargarlo
            if (componentId === 'header-container') {
                console.log('[main.js] Inicializando funcionalidad del header...');
                initHeader();
            }
        } else {
            console.warn(`[main.js] Contenedor con ID '${componentId}' no encontrado en esta página.`);
        }
    } catch (error) {
        console.error(`[main.js] No se pudo cargar el componente: ${error}`);
    }
}

// Carga los componentes comunes a todas las páginas
document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] Cargando componentes comunes...');
    
    Promise.all([
        loadComponent('header-container', 'partials/header.html'),
        loadComponent('footer-container', 'partials/footer.html')
    ]).then(() => {
        console.log('[main.js] Todos los componentes comunes han sido cargados.');
    }).catch(error => {
        console.error('[main.js] Error al cargar componentes comunes:', error);
    });
});

// Exportar la función para que esté disponible globalmente
window.loadComponent = loadComponent;