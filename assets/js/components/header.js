/**
 * header.js - Funcionalidad para el encabezado del proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 */

/**
 * Inicializa toda la funcionalidad del header
 */
export function initHeader() {
    console.log('[header.js] Inicializando funcionalidad del header...');
    
    const header = document.querySelector('.header');
    const toggleBtn = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    
    if (!header) {
        console.warn('[header.js] No se encontró el elemento .header en el DOM');
        return;
    }

    // 1. Efecto de scroll
    initScrollEffect(header);
    
    // 2. Menú móvil
    if (toggleBtn && nav) {
        initMobileMenu(toggleBtn, nav);
    } else {
        console.warn('[header.js] Elementos del menú móvil no encontrados');
    }
    
    // 3. Navegación por anclas
    initAnchorNavigation();
    
    console.log('[header.js] Header inicializado correctamente');
}

/**
 * Inicializa el efecto de scroll en el header
 * @param {HTMLElement} header - Elemento del header
 */
function initScrollEffect(header) {
    console.log('[header.js] Configurando efecto de scroll...');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Aplicar estado inicial
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
}

/**
 * Inicializa el menú móvil
 * @param {HTMLElement} toggleBtn - Botón de toggle del menú
 * @param {HTMLElement} nav - Elemento de navegación
 */
function initMobileMenu(toggleBtn, nav) {
    console.log('[header.js] Configurando menú móvil...');
    
    // Toggle menú móvil
    toggleBtn.addEventListener('click', function() {
        const isOpening = !nav.classList.contains('active');
        
        nav.classList.toggle('active');
        toggleBtn.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        console.log(`[header.js] Menú móvil ${isOpening ? 'abierto' : 'cerrado'}`);
    });
    
    // Cerrar menú al hacer clic en un enlace (útil en móvil)
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Solo cerrar si el menú está activo (en vista móvil)
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                toggleBtn.classList.remove('active');
                document.body.classList.remove('no-scroll');
                console.log('[header.js] Menú móvil cerrado al hacer clic en enlace');
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = toggleBtn.contains(event.target);
        
        if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            nav.classList.remove('active');
            toggleBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
            console.log('[header.js] Menú móvil cerrado al hacer clic fuera');
        }
    });
}

/**
 * Inicializa la navegación por anclas con soporte para múltiples páginas
 */
function initAnchorNavigation() {
    console.log('[header.js] Configurando navegación por anclas...');
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    console.log(`[header.js] Encontrados ${anchorLinks.length} enlaces de ancla`);
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces vacíos o que no sean anclas simples
            if (href === '#' || href === '#!') {
                event.preventDefault();
                return;
            }
            
            // Verificar si estamos en la página de inicio
            const isHomePage = window.location.pathname.endsWith('index.html') || 
                              window.location.pathname.endsWith('/') || 
                              window.location.pathname === '';
            
            if (!isHomePage && href !== '#inicio') {
                // Redirigir a la página de inicio con el ancla
                event.preventDefault();
                const targetPage = `index.html${href}`;
                console.log(`[header.js] Redirigiendo a: ${targetPage}`);
                window.location.href = targetPage;
                return;
            }
            
            // Comportamiento normal para la página de inicio
            handleAnchorClick(event, href);
        });
    });
}

/**
 * Maneja el clic en un enlace de ancla
 * @param {Event} event - Evento del clic
 * @param {string} href - Valor del atributo href
 */
function handleAnchorClick(event, href) {
    if (href === '#inicio') {
        // Scroll suave al top de la página
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        console.log('[header.js] Scroll al inicio de la página');
        return;
    }
    
    const targetId = href.substring(1); // Remover el #
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        event.preventDefault();
        
        // Scroll suave al elemento objetivo
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Actualizar la URL sin recargar la página
        history.pushState(null, null, href);
        
        console.log(`[header.js] Scroll suave a: ${targetId}`);
    } else {
        console.warn(`[header.js] Elemento objetivo no encontrado: ${targetId}`);
    }
}

/**
 * Función auxiliar para verificar si un elemento está en el viewport
 * @param {HTMLElement} element - Elemento a verificar
 * @returns {boolean} True si el elemento está visible
 */
export function isElementInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Inicialización automática si se carga directamente (para compatibilidad)
if (import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
    });
}