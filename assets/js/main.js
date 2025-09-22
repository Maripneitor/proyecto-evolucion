/**
 * main.js - Script principal para el proyecto "Evolución"
 * Carga dinámicamente componentes HTML en contenedores
 */

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] DOM completamente cargado. Iniciando carga de componentes...');
    loadAllComponents();
});

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
        
        // Inserta el contenido en el contenedor especificado
        container.innerHTML = html;
        
        // EJECUTAR SCRIPTS INCORPORADOS (NUEVA FUNCIONALIDAD)
        executeScripts(container, componentId);
        
    } catch (error) {
        // Manejo de errores con mensaje descriptivo
        console.error('Error:', error);
        document.getElementById(componentId).innerHTML = `
            <div class="error">
                <p>Error al cargar el componente: ${filePath}</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

/**
 * Función que ejecuta los scripts dentro del contenido cargado
 * @param {HTMLElement} container - Contenedor con el HTML recién cargado
 * @param {string} componentId - ID del componente para logging
 */
function executeScripts(container, componentId) {
    // Buscar todos los scripts dentro del contenido cargado
    const scripts = container.querySelectorAll('script');
    
    // DIAGNÓSTICO: Log del número de scripts encontrados
    console.log(`[main.js] Componente '${componentId}' cargado. Se encontraron ${scripts.length} script(s).`);
    
    // Iterar sobre cada script encontrado
    scripts.forEach((oldScript, index) => {
        console.log(`[main.js] Procesando script ${index + 1} para '${componentId}':`, oldScript.src || 'script inline');
        
        // Crear un nuevo script
        const newScript = document.createElement('script');
        
        // Copiar todos los atributos del script original
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copiar el contenido del script original (para scripts inline)
        if (oldScript.src) {
            // Para scripts externos, mantener la referencia src
            newScript.src = oldScript.src;
            // Añadir evento para detectar cuando se carga
            newScript.onload = () => {
                console.log(`[main.js] Script externo ${index + 1} cargado correctamente para '${componentId}'`);
            };
            newScript.onerror = () => {
                console.error(`[main.js] Error al cargar script externo ${index + 1} para '${componentId}'`);
            };
        } else {
            // Para scripts inline, copiar el contenido
            newScript.textContent = oldScript.textContent;
        }
        
        // DIAGNÓSTICO: Log antes de ejecutar el script
        console.log(`[main.js] Ejecutando script para '${componentId}'.`);
        
        // Añadir el nuevo script al final del body para forzar su ejecución
        document.body.appendChild(newScript);
        
        // Eliminar el script original (opcional)
        oldScript.parentNode.removeChild(oldScript);
        
        console.log(`[main.js] Script ${index + 1} procesado para '${componentId}'`);
    });
}

/**
 * Función que carga todos los componentes de la aplicación
 * coordinando las llamadas a loadComponent para cada sección
 */
function loadAllComponents() {
    console.log('[main.js] Iniciando carga de todos los componentes...');
    
    // Carga el encabezado
    loadComponent('header-container', 'partials/header.html');
    
    // Carga la sección hero
    loadComponent('hero-container', 'partials/hero.html');
    
    // Carga la sección acerca de nosotros
    loadComponent('acerca-container', 'partials/acerca.html');
    
    // Carga la sección de contacto
    loadComponent('contacto-container', 'partials/contacto.html');
    
    // Carga el pie de página
    loadComponent('footer-container', 'partials/footer.html');
    
    console.log('[main.js] Todas las solicitudes de carga de componentes han sido iniciadas.');
}