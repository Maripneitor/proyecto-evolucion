/**
 * main.js - Script principal para el proyecto "Evolución"
 * Carga dinámicamente componentes HTML en contenedores
 * Versión refactorizada para evitar condiciones de carrera
 */

// Importar funciones de inicialización de componentes
import { initAcercaSection } from './components/acerca.js';
// (Aquí irían otras importaciones de inicializadores en el futuro)
// import { initHeader } from './components/header.js';
// import { initHero } from './components/hero.js';

/**
 * Función asíncrona para cargar componentes HTML externos
 * @param {string} componentId - ID del contenedor donde se insertará el contenido
 * @param {string} filePath - Ruta al archivo HTML parcial
 */
async function loadComponent(componentId, filePath) {
    try {
        console.log(`[main.js] Cargando componente: ${componentId} desde ${filePath}`);
        
        // Realiza la petición fetch al archivo parcial
        const response = await fetch(filePath);
        
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error al cargar ${filePath}: ${response.status}`);
        }
        
        // Obtiene el contenido HTML
        const html = await response.text();
        const container = document.getElementById(componentId);
        
        if (!container) {
            throw new Error(`Contenedor con ID '${componentId}' no encontrado en el DOM`);
        }
        
        // Inserta el contenido en el contenedor especificado
        container.innerHTML = html;
        console.log(`[main.js] Componente '${componentId}' cargado exitosamente.`);
        
    } catch (error) {
        // Manejo de errores con mensaje descriptivo
        console.error(`[main.js] Error al cargar el componente ${componentId}:`, error);
        const container = document.getElementById(componentId);
        if (container) {
            container.innerHTML = `
                <div class="error">
                    <p>Error al cargar el componente: ${filePath}</p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Función que carga todos los componentes de la aplicación
 * coordinando las llamadas a loadComponent para cada sección
 */
async function loadAllComponents() {
    console.log('[main.js] Iniciando carga de todos los componentes...');
    
    try {
        // Cargar todos los componentes en paralelo
        await Promise.all([
            loadComponent('header-container', 'partials/header.html'),
            loadComponent('hero-container', 'partials/hero.html'),
            loadComponent('acerca-container', 'partials/acerca.html'),
            loadComponent('contacto-container', 'partials/contacto.html'),
            loadComponent('footer-container', 'partials/footer.html')
        ]);
        
        console.log('[main.js] ✅ Todo el HTML ha sido cargado exitosamente.');
        return true;
        
    } catch (error) {
        console.error('[main.js] ❌ Error durante la carga de componentes:', error);
        return false;
    }
}

/**
 * Función que inicializa todos los componentes JavaScript
 * Se llama después de que todo el HTML esté cargado
 */
function initializeComponents() {
    console.log('[main.js] Inicializando componentes JavaScript...');
    
    // Inicializar cada sección en el orden correcto
    initAcercaSection();
    // initHeader();
    // initHero();
    // initContacto();
    
    console.log('[main.js] ✅ Todos los componentes han sido inicializados.');
}

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[main.js] DOM completamente cargado. Iniciando proceso de carga...');
    
    // Primero: Cargar todo el HTML
    const htmlLoaded = await loadAllComponents();
    
    if (htmlLoaded) {
        // Segundo: Inicializar los componentes JavaScript
        // Usamos un pequeño delay para asegurar que el DOM está listo
        setTimeout(() => {
            initializeComponents();
        }, 100);
    } else {
        console.error('[main.js] No se pudo inicializar los componentes debido a errores en la carga del HTML.');
    }
});

// Exportar funciones para posible uso externo
export { loadComponent, loadAllComponents, initializeComponents };