/**
 * header.js - Funcionalidad completa del header para el proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 * VERSIÓN CORREGIDA - Soluciona problemas de scroll y navegación entre páginas
 */

// Estado global para controlar la inicialización
let headerInitialized = false;
let scrollHandler = null;

/**
 * Inicializa toda la funcionalidad del header con manejo robusto de carga asíncrona
 */
export function initHeader() {
    console.log('[header.js] 🔧 Iniciando inicialización del header...');
    
    if (headerInitialized) {
        console.log('[header.js] ⚠️ Header ya estaba inicializado, omitiendo...');
        return;
    }

    // Intentar inicializar inmediatamente y con reintentos
    attemptHeaderInitialization();
}

/**
 * Intenta inicializar el header con múltiples reintentos si es necesario
 */
function attemptHeaderInitialization(retryCount = 0) {
    const maxRetries = 5;
    
    try {
        // Verificar que el header existe y está visible en el DOM
        const header = document.querySelector('.header');
        
        if (!header || !document.body.contains(header)) {
            console.warn(`[header.js] ⚠️ Header no encontrado en el DOM (intento ${retryCount + 1}/${maxRetries})`);
            
            if (retryCount < maxRetries) {
                setTimeout(() => attemptHeaderInitialization(retryCount + 1), 100 * (retryCount + 1));
                return;
            } else {
                console.error('[header.js] ❌ No se pudo encontrar el header después de múltiples intentos');
                return;
            }
        }

        console.log('[header.js] ✅ Header encontrado en el DOM, procediendo con inicialización...');
        
        // Inicializar funcionalidades con delay para asegurar renderizado completo
        setTimeout(() => {
            initScrollEffect(header);
            initMobileMenu();
            initAnchorNavigation();
            headerInitialized = true;
            console.log('[header.js] ✅ Header inicializado completamente y listo');
        }, 50);

    } catch (error) {
        console.error('[header.js] ❌ Error durante el intento de inicialización:', error);
    }
}

/**
 * Inicializa el efecto de scroll en el header con manejo robusto
 */
function initScrollEffect(header) {
    console.log('[header.js] 📜 Configurando efecto de scroll...');
    
    // Limpiar listener anterior si existe
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
    }

    // Función optimizada para el efecto de scroll
    const updateScrollState = () => {
        if (!header || !document.body.contains(header)) {
            console.warn('[header.js] ⚠️ Header no disponible durante updateScrollState');
            return;
        }
        
        const scrollY = window.scrollY || window.pageYOffset;
        const shouldBeScrolled = scrollY > 50;
        const currentlyScrolled = header.classList.contains('scrolled');
        
        // Aplicar cambios solo si son necesarios (optimización de rendimiento)
        if (shouldBeScrolled !== currentlyScrolled) {
            if (shouldBeScrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            console.log(`[header.js] 📜 Header ${shouldBeScrolled ? 'con' : 'sin'} scrolled (scroll: ${scrollY}px)`);
        }
    };

    // Throttling para mejor rendimiento
    let ticking = false;
    scrollHandler = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollState();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Configurar event listeners
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Aplicar estado inicial inmediatamente y después de un breve delay
    updateScrollState();
    setTimeout(updateScrollState, 150); // Delay para capturar cualquier renderizado tardío
    
    // También aplicar en resize por si cambia la posición del header
    window.addEventListener('resize', updateScrollState, { passive: true });

    console.log('[header.js] ✅ Efecto de scroll configurado correctamente');
}

/**
 * Inicializa el menú móvil
 */
function initMobileMenu() {
    console.log('[header.js] 📱 Configurando menú móvil...');
    
    const toggleBtn = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    
    if (!toggleBtn || !nav) {
        console.warn('[header.js] ⚠️ Elementos del menú móvil no encontrados');
        return;
    }

    // Reiniciar event listeners
    toggleBtn.replaceWith(toggleBtn.cloneNode(true));
    const newToggleBtn = document.querySelector('.header__toggle');
    
    // Toggle del menú móvil
    newToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu(nav, newToggleBtn);
    });

    // Cerrar menú al hacer clic en enlaces
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeMobileMenu(nav, newToggleBtn);
            }
        });
    });

    // Cerrar menú al hacer clic fuera o redimensionar
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !newToggleBtn.contains(e.target)) {
            closeMobileMenu(nav, newToggleBtn);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMobileMenu(nav, newToggleBtn);
        }
    });

    console.log('[header.js] ✅ Menú móvil configurado');
}

/**
 * Abre/cierra el menú móvil
 */
function toggleMobileMenu(nav, toggleBtn) {
    const isOpening = !nav.classList.contains('active');
    
    nav.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    toggleBtn.setAttribute('aria-expanded', nav.classList.contains('active'));
    console.log(`[header.js] 📱 Menú móvil ${isOpening ? 'abierto' : 'cerrado'}`);
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu(nav, toggleBtn) {
    nav.classList.remove('active');
    toggleBtn.classList.remove('active');
    document.body.classList.remove('no-scroll');
    toggleBtn.setAttribute('aria-expanded', 'false');
}

/**
 * Inicializa la navegación por anclas - CORREGIDO
 */
function initAnchorNavigation() {
    console.log('[header.js] 🔗 Configurando navegación por anclas...');
    
    const navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
    
    if (navLinks.length === 0) {
        console.warn('[header.js] ⚠️ No se encontraron enlaces de ancla');
        return;
    }
    
    // Remover listeners antiguos y añadir nuevos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleAnchorNavigation(this.getAttribute('href'));
        });
    });

    console.log(`[header.js] ✅ ${navLinks.length} enlaces de ancla configurados`);
}

/**
 * Maneja la navegación por anclas - LÓGICA CRÍTICA CORREGIDA
 */
function handleAnchorNavigation(href) {
    const isHomePage = isCurrentPageHome();
    console.log(`[header.js] 🔗 Navegando a ${href} desde ${isHomePage ? 'inicio' : 'página secundaria'}`);
    
    if (isHomePage) {
        smoothScrollToSection(href);
    } else {
        redirectToHomeWithAnchor(href);
    }
}

/**
 * Detecta si la página actual es la página de inicio - CORREGIDO
 */
function isCurrentPageHome() {
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop() || '';
    
    // Lógica robusta para detectar página de inicio
    const homeIndicators = [
        'index.html',
        '',
        'index',
        'index.htm'
    ];
    
    const isHome = homeIndicators.includes(currentPage) || 
                   pathname.endsWith('/') || 
                   (!currentPage.includes('.') && !pathname.includes('proyectos'));
    
    console.log(`[header.js] 🔍 Detección página: "${currentPage}" -> ${isHome ? 'INICIO' : 'SECUNDARIA'}`);
    
    return isHome;
}

/**
 * Scroll suave a sección - MEJORADO
 */
function smoothScrollToSection(sectionId) {
    const targetElement = document.querySelector(sectionId);
    
    if (!targetElement) {
        console.warn(`[header.js] ⚠️ Sección ${sectionId} no encontrada`);
        return;
    }
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const offsetPosition = targetElement.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
    
    // Actualizar URL sin recargar
    if (history.pushState) {
        history.pushState(null, null, sectionId);
    }
    
    console.log(`[header.js] ✅ Scroll a ${sectionId} completado`);
}

/**
 * Redirige a la página de inicio con ancla - CORREGIDO
 */
function redirectToHomeWithAnchor(anchor) {
    const currentPath = window.location.pathname;
    let homePath = '';
    
    // Construir ruta correcta al index.html
    if (currentPath.includes('proyectos')) {
        // Desde proyectos.html -> ../index.html o ./index.html según estructura
        const pathParts = currentPath.split('/');
        pathParts.pop(); // Remover archivo actual
        homePath = pathParts.join('/') + '/index.html' + anchor;
    } else {
        // Desde otras páginas, asumir mismo directorio
        homePath = currentPath.replace(/[^/]*$/, 'index.html') + anchor;
    }
    
    // Asegurar URL absoluta
    const homeUrl = new URL(homePath, window.location.origin).href;
    
    console.log(`[header.js] 🔄 Redirigiendo a: ${homeUrl}`);
    window.location.href = homeUrl;
}

/**
 * Función de limpieza para recargar componentes
 */
export function cleanupHeader() {
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }
    headerInitialized = false;
    console.log('[header.js] 🧹 Header limpiado para reinicialización');
}

// Inicialización automática cuando se carga el script directamente
if (typeof import.meta !== 'undefined' && import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[header.js] 🔧 Inicialización automática iniciada');
        setTimeout(initHeader, 100);
    });
}