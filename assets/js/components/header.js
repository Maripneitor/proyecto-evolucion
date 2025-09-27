/**
 * header.js - Funcionalidad completa del header para el proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 */

/**
 * Inicializa toda la funcionalidad del header
 */
export function initHeader() {
    console.log('[header.js] Inicializando funcionalidad del header...');
    
    // Verificar que el header existe en el DOM
    const header = document.querySelector('.header');
    if (!header) {
        console.warn('[header.js] No se encontró el elemento .header en el DOM');
        return;
    }

    // Inicializar todas las funcionalidades
    initScrollEffect(header);
    initMobileMenu();
    initAnchorNavigation();
    
    console.log('[header.js] Header inicializado correctamente en todas las páginas');
}

/**
 * Inicializa el efecto de scroll en el header
 * @param {HTMLElement} header - Elemento del header
 */
function initScrollEffect(header) {
    console.log('[header.js] Configurando efecto de scroll...');
    
    const updateHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Configurar el evento de scroll
    window.addEventListener('scroll', updateHeaderScroll);
    
    // Aplicar estado inicial
    updateHeaderScroll();
}

/**
 * Inicializa el menú móvil
 */
function initMobileMenu() {
    console.log('[header.js] Configurando menú móvil...');
    
    const toggleBtn = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    
    if (!toggleBtn || !nav) {
        console.warn('[header.js] Elementos del menú móvil no encontrados');
        return;
    }

    // Toggle del menú móvil
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu(nav, toggleBtn);
    });

    // Cerrar menú al hacer clic en enlaces
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu(nav, toggleBtn);
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeMobileMenu(nav, toggleBtn);
        }
    });

    // Cerrar menú al redimensionar la ventana (si se cambia a desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu(nav, toggleBtn);
        }
    });
}

/**
 * Abre/cierra el menú móvil
 */
function toggleMobileMenu(nav, toggleBtn) {
    const isOpening = !nav.classList.contains('active');
    
    nav.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    console.log(`[header.js] Menú móvil ${isOpening ? 'abierto' : 'cerrado'}`);
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu(nav, toggleBtn) {
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.classList.remove('no-scroll');
        console.log('[header.js] Menú móvil cerrado');
    }
}

/**
 * Inicializa la navegación por anclas con soporte para múltiples páginas
 */
function initAnchorNavigation() {
    console.log('[header.js] Configurando navegación por anclas...');
    
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const isAnchorLink = targetHref.startsWith('#');

            if (isAnchorLink) {
                // Si es un enlace de ancla (ej: #contacto)
                e.preventDefault();
                console.log(`[header.js] Clic en ancla: ${targetHref}`);
                
                // Comprueba si ya estamos en la página de inicio
                const currentPage = window.location.pathname.split('/').pop();
                const isHomePage = currentPage === 'index.html' || currentPage === '' || window.location.pathname.endsWith('/');
                
                if (isHomePage) {
                    // Si SÍ estamos en el inicio, solo haz scroll suave
                    console.log(`[header.js] Scroll suave a: ${targetHref}`);
                    const targetElement = document.querySelector(targetHref);
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const elementPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: elementPosition,
                            behavior: 'smooth'
                        });
                        
                        // Actualizar URL
                        history.pushState(null, null, targetHref);
                    } else {
                        console.warn(`[header.js] Elemento no encontrado: ${targetHref}`);
                    }
                } else {
                    // Si NO estamos en el inicio, redirige a la página de inicio con el ancla
                    console.log(`[header.js] Redirigiendo a index.html${targetHref}`);
                    window.location.href = `index.html${targetHref}`;
                }
            }
            // Si no es un ancla (ej: proyectos.html), el navegador lo manejará normalmente.
        });
    });
}

// Inicialización automática si se carga directamente
if (import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
    });
}