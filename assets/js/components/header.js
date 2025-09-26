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
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    console.log(`[header.js] Encontrados ${anchorLinks.length} enlaces de ancla`);
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleAnchorClick(e, this.getAttribute('href'));
        });
    });
}

/**
 * Maneja el clic en enlaces de ancla
 */
function handleAnchorClick(event, href) {
    // Ignorar enlaces vacíos
    if (href === '#' || href === '#!') {
        event.preventDefault();
        return;
    }

    const targetId = href.substring(1);
    
    // Verificar si estamos en la página de inicio
    const isHomePage = isCurrentPageHome();
    
    if (!isHomePage && targetId !== 'inicio') {
        // CORRECCIÓN: Redirigir a la página de inicio con el ancla
        event.preventDefault();
        redirectToHomeWithAnchor(href);
        return;
    }
    
    // Comportamiento para página de inicio
    handleHomePageAnchor(event, href, targetId);
}

/**
 * Verifica si la página actual es la página de inicio
 */
function isCurrentPageHome() {
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop();
    
    return currentPage === 'index.html' || 
           currentPage === '' ||
           pathname.endsWith('/') ||
           !currentPage.includes('.html'); // Para servidores locales
}

/**
 * Redirige a la página de inicio con el ancla correspondiente
 */
function redirectToHomeWithAnchor(anchor) {
    // CORRECCIÓN: Construir URL correctamente para cualquier escenario
    const baseUrl = window.location.origin + window.location.pathname;
    let homeUrl;
    
    if (baseUrl.includes('proyectos.html') || baseUrl.includes('proyecto-detalle.html')) {
        // Si estamos en una página secundaria, navegar a index.html
        homeUrl = baseUrl.replace(/[^/]*$/, 'index.html') + anchor;
    } else {
        // Para otros casos, usar la URL base
        homeUrl = baseUrl.replace(/[^/]*$/, 'index.html') + anchor;
    }
    
    console.log(`[header.js] Redirigiendo a: ${homeUrl}`);
    window.location.href = homeUrl;
}

/**
 * Maneja los clics en anclas dentro de la página de inicio
 */
function handleHomePageAnchor(event, href, targetId) {
    if (targetId === 'inicio') {
        // Scroll al inicio de la página
        event.preventDefault();
        scrollToTop();
        return;
    }
    
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        event.preventDefault();
        scrollToElement(targetElement, href);
    } else {
        console.warn(`[header.js] Elemento objetivo no encontrado: ${targetId}`);
    }
}

/**
 * Realiza scroll suave al top de la página
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    console.log('[header.js] Scroll al inicio de la página');
}

/**
 * Realiza scroll suave a un elemento específico
 */
function scrollToElement(element, href) {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const elementPosition = element.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
    
    // Actualizar URL
    history.pushState(null, null, href);
    
    console.log(`[header.js] Scroll suave a: ${element.id}`);
}

// Inicialización automática si se carga directamente
if (import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
    });
}