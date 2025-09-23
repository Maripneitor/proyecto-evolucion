/**
 * home.js - Script específico para la página de inicio
 * Proyecto Evolución - Arqueología y Restauración
 */

import { initAcercaSection } from '../components/acerca.js';

/**
 * Función para cargar componentes específicos de la página de inicio
 * Reutilizamos la lógica de loadComponent
 */
async function loadPageComponent(componentId, filePath) {
    try {
        console.log(`[home.js] Cargando componente de página: ${componentId}`);
        
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
        
        const html = await response.text();
        const container = document.getElementById(componentId);
        
        if (container) {
            container.innerHTML = html;
            console.log(`[home.js] Componente '${componentId}' cargado exitosamente.`);
        } else {
            console.warn(`[home.js] Contenedor '${componentId}' no encontrado en la página de inicio.`);
        }
    } catch (error) {
        console.error(`[home.js] Error al cargar componente ${componentId}:`, error);
    }
}

// Inicialización de la página de inicio
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[home.js] Inicializando página de inicio...');
    
    try {
        // Cargar componentes específicos de la página de inicio
        await Promise.all([
            loadPageComponent('hero-container', 'partials/hero.html'),
            loadPageComponent('acerca-container', 'partials/acerca.html'),
            loadPageComponent('contacto-container', 'partials/contacto.html')
        ]);
        
        console.log('[home.js] Todos los componentes de la página de inicio han sido cargados.');
        
        // Inicializa los scripts específicos de la página de inicio
        console.log('[home.js] Inicializando sección "Acerca de"...');
        initAcercaSection();
        
        console.log('[home.js] Página de inicio inicializada correctamente.');
        
    } catch (error) {
        console.error('[home.js] Error durante la inicialización de la página de inicio:', error);
    }
});

// Exportar para posible uso futuro
export function initHomePage() {
    console.log('[home.js] Función initHomePage() llamada');
    // Re-ejecutar la lógica de inicialización si es necesario
}