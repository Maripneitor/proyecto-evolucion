/**
 * home.js - Script específico para la página de inicio
 * Proyecto Evolución - Arqueología y Restauración
 */

import { initAcercaSection } from '../components/acerca.js';
import { initHeroSlider } from '../components/hero.js';

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

/**
 * Maneja el scroll a anclas cuando la página carga con un hash en la URL
 */
function handleAnchorOnLoad() {
    if (window.location.hash) {
        console.log(`[home.js] URL contiene hash: ${window.location.hash}`);
        
        // Pequeño retraso para asegurar que todo el contenido (especialmente los parciales) esté cargado
        setTimeout(() => {
            const element = document.querySelector(window.location.hash);
            if (element) {
                console.log(`[home.js] Haciendo scroll a: ${window.location.hash}`);
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const elementPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`[home.js] Elemento no encontrado: ${window.location.hash}`);
            }
        }, 500); // 500ms de retraso
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
        
        // Inicializa el slider hero después de cargar el contenido
        console.log('[home.js] Inicializando slider hero...');
        initHeroSlider();
        
        // Inicializa los scripts específicos de la página de inicio
        console.log('[home.js] Inicializando sección "Acerca de"...');
        initAcercaSection();
        
        // Manejar scroll a anclas si la URL contiene un hash
        handleAnchorOnLoad();
        
        console.log('[home.js] Página de inicio inicializada correctamente.');
        
    } catch (error) {
        console.error('[home.js] Error durante la inicialización de la página de inicio:', error);
    }
});

// Exportar para posible uso futuro
export function initHomePage() {
    console.log('[home.js] Función initHomePage() llamada');
}