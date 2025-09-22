/**
 * main.js - Script principal para el proyecto "Evolución"
 * Carga dinámicamente componentes HTML en contenedores
 */

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadAllComponents();
});

/**
 * Función asíncrona para cargar componentes HTML externos
 * @param {string} componentId - ID del contenedor donde se insertará el contenido
 * @param {string} filePath - Ruta al archivo HTML parcial
 */
async function loadComponent(componentId, filePath) {
    try {
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
        executeScripts(container);
        
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
 */
function executeScripts(container) {
    // Buscar todos los scripts dentro del contenido cargado
    const scripts = container.querySelectorAll('script');
    
    // Iterar sobre cada script encontrado
    scripts.forEach(oldScript => {
        // Crear un nuevo script
        const newScript = document.createElement('script');
        
        // Copiar todos los atributos del script original
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copiar el contenido del script original
        newScript.textContent = oldScript.textContent;
        
        // Reemplazar el script original con el nuevo (que se ejecutará)
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/**
 * Función que carga todos los componentes de la aplicación
 * coordinando las llamadas a loadComponent para cada sección
 */
function loadAllComponents() {
    // Carga el encabezado
    loadComponent('header-container', 'partials/header.html');
    
    // Carga la sección hero
    loadComponent('hero-container', 'partials/hero.html');
    
    // Carga la sección acerca de nosotros
    loadComponent('acerca-container', 'partials/acerca.html');
    
    // Carga el pie de página
    loadComponent('footer-container', 'partials/footer.html');
}