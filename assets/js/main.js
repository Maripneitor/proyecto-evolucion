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
        
        // Inserta el contenido en el contenedor especificado
        document.getElementById(componentId).innerHTML = html;
        
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