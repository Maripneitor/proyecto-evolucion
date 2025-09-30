/**
 * header.js - Funcionalidad completa del header para el proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 * VERSIÓN COMPLETAMENTE CORREGIDA - Scroll y navegación funcionando
 */

// Estado global para controlar la inicialización
let headerInitialized = false;
let scrollHandler = null;
let resizeHandler = null;

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
    const maxRetries = 10; // Aumentado para carga asíncrona
    
    try {
        // Verificar que el header existe y está visible en el DOM
        const header = document.querySelector('.header');
        
        if (!header || !document.body.contains(header)) {
            console.warn(`[header.js] ⚠️ Header no encontrado en el DOM (intento ${retryCount + 1}/${maxRetries})`);
            
            if (retryCount < maxRetries) {
                setTimeout(() => attemptHeaderInitialization(retryCount + 1), 150 * (retryCount + 1));
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
        }, 100);

    } catch (error) {
        console.error('[header.js] ❌ Error durante el intento de inicialización:', error);
    }
}

/**
 * Inicializa el efecto de scroll en el header con manejo robusto - CORREGIDO
 */
function initScrollEffect(header) {
    console.log('[header.js] 📜 Configurando efecto de scroll...');
    
    // Limpiar listeners anteriores si existen
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
    }

    // Función optimizada para el efecto de scroll - CORREGIDA
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
                console.log(`[header.js] 📜 Header cambió a estado scrolled (scroll: ${scrollY}px)`);
            } else {
                header.classList.remove('scrolled');
                console.log(`[header.js] 📜 Header cambió a estado normal (scroll: ${scrollY}px)`);
            }
        }
    };

    // Throttling para mejor rendimiento - MEJORADO
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

    // Handler para resize - MEJORADO
    resizeHandler = () => {
        updateScrollState();
    };

    // Configurar event listeners
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    // Aplicar estado inicial inmediatamente y después de delays estratégicos
    updateScrollState();
    setTimeout(updateScrollState, 100);
    setTimeout(updateScrollState, 500); // Delay adicional para carga completa
    
    // Forzar actualización cuando termina la carga
    window.addEventListener('load', updateScrollState);

    console.log('[header.js] ✅ Efecto de scroll configurado correctamente');
}

/**
 * Inicializa el menú móvil - CORREGIDO
 */
function initMobileMenu() {
    console.log('[header.js] 📱 Configurando menú móvil...');
    
    const toggleBtn = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    
    if (!toggleBtn || !nav) {
        console.warn('[header.js] ⚠️ Elementos del menú móvil no encontrados');
        return;
    }

    // Clonar y reemplazar para limpiar event listeners
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

    // Toggle del menú móvil - CORREGIDO
    newToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[header.js] 📱 Click en botón menú móvil');
        toggleMobileMenu(nav, newToggleBtn);
    });

    // Cerrar menú al hacer clic en enlaces - MEJORADO
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
        // Remover listeners antiguos y añadir nuevos
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
            // Solo cerrar si el menú está activo (en vista móvil)
            if (nav.classList.contains('active')) {
                console.log('[header.js] 📱 Cerrando menú móvil al hacer clic en enlace');
                closeMobileMenu(nav, newToggleBtn);
            }
            // NO prevenir el comportamiento por defecto - permite la navegación normal
        });
    });

    // Cerrar menú al hacer clic fuera - MEJORADO
    document.addEventListener('click', (e) => {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = newToggleBtn.contains(e.target);
        
        if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            console.log('[header.js] 📱 Cerrando menú móvil al hacer clic fuera');
            closeMobileMenu(nav, newToggleBtn);
        }
    });

    // Cerrar menú al redimensionar - MEJORADO
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            console.log('[header.js] 📱 Cerrando menú móvil al redimensionar a escritorio');
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
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.classList.remove('no-scroll');
        toggleBtn.setAttribute('aria-expanded', 'false');
        console.log('[header.js] 📱 Menú móvil cerrado');
    }
}

/**
 * Inicializa la navegación por anclas - COMPLETAMENTE CORREGIDO
 */
function initAnchorNavigation() {
    console.log('[header.js] 🔗 Configurando navegación por anclas...');
    
    // Seleccionar TODOS los enlaces del header que tengan href
    const navLinks = document.querySelectorAll('.header__nav-link[href]');
    
    if (navLinks.length === 0) {
        console.warn('[header.js] ⚠️ No se encontraron enlaces de navegación');
        return;
    }
    
    console.log(`[header.js] 🔗 Encontrados ${navLinks.length} enlaces de navegación`);

    navLinks.forEach(link => {
        // Clonar y reemplazar para limpiar listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        const href = newLink.getAttribute('href');
        
        // Solo manejar enlaces que son anclas internas (#)
        if (href.startsWith('#')) {
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`[header.js] 🔗 Clic en enlace de ancla: ${href}`);
                handleAnchorNavigation(href);
            });
        }
        // Los enlaces normales (proyectos.html, etc.) se comportan normalmente
    });

    console.log('[header.js] ✅ Navegación por anclas configurada correctamente');
}

/**
 * Maneja la navegación por anclas - LÓGICA CRÍTICA COMPLETAMENTE CORREGIDA
 */
function handleAnchorNavigation(href) {
    // Verificar si estamos en la página de inicio - DETECCIÓN MEJORADA
    const isHomePage = isCurrentPageHome();
    
    console.log(`[header.js] 🔗 Navegación: ${href} | Página actual: ${isHomePage ? 'Inicio' : 'Secundaria'}`);
    
    if (isHomePage) {
        // Si estamos en el inicio, hacer scroll suave a la sección
        smoothScrollToSection(href);
    } else {
        // Si no estamos en el inicio, redirigir a la página de inicio con el ancla
        redirectToHomeWithAnchor(href);
    }
}

/**
 * Detecta si la página actual es la página de inicio - DETECCIÓN CORREGIDA
 */
function isCurrentPageHome() {
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop() || '';
    const hostname = window.location.hostname;
    
    // Lógica robusta para detectar página de inicio - MEJORADA
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    
    // Para servidor local y producción
    const homeIndicators = [
        'index.html',
        '',
        'index',
        'index.htm',
        'index.php'
    ];
    
    let isHome = homeIndicators.includes(currentPage) || 
                 pathname.endsWith('/');
    
    // Casos especiales para desarrollo local
    if (isLocalhost && !currentPage) {
        isHome = true;
    }
    
    // Verificar explícitamente si NO estamos en páginas secundarias conocidas
    const secondaryPages = ['proyectos.html', 'proyectos', 'contacto.html', 'acerca.html'];
    if (secondaryPages.includes(currentPage)) {
        isHome = false;
    }
    
    console.log(`[header.js] 🔍 Detección página: "${currentPage}" en "${pathname}" -> ${isHome ? 'INICIO' : 'SECUNDARIA'}`);
    
    return isHome;
}

/**
 * Scroll suave a sección - MEJORADO CON MANEJO DE ERRORES
 */
function smoothScrollToSection(sectionId) {
    // Validar el sectionId
    if (!sectionId || sectionId === '#') {
        console.warn('[header.js] ⚠️ ID de sección inválido');
        return;
    }
    
    const targetElement = document.querySelector(sectionId);
    
    if (!targetElement) {
        console.warn(`[header.js] ⚠️ Sección ${sectionId} no encontrada en esta página`);
        
        // Intentar scroll al top si la sección no existe
        if (sectionId === '#inicio') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('[header.js] ✅ Scroll al inicio completado');
        }
        return;
    }
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const offsetPosition = targetElement.offsetTop - headerHeight - 20;
    
    console.log(`[header.js] 🎯 Haciendo scroll suave a: ${sectionId}, posición: ${offsetPosition}px`);
    
    window.scrollTo({
        top: Math.max(0, offsetPosition), // Asegurar que no sea negativo
        behavior: 'smooth'
    });
    
    // Actualizar URL sin recargar - MEJORADO
    try {
        if (history.pushState) {
            history.pushState(null, null, sectionId);
        }
    } catch (e) {
        console.warn('[header.js] ⚠️ No se pudo actualizar la URL del historial');
    }
    
    console.log(`[header.js] ✅ Scroll a ${sectionId} completado`);
}

/**
 * Redirige a la página de inicio con ancla - COMPLETAMENTE CORREGIDO
 */
function redirectToHomeWithAnchor(anchor) {
    // Validar el anchor
    if (!anchor || anchor === '#') {
        anchor = '';
    }
    
    const currentPath = window.location.pathname;
    let homePath = '';
    
    // Construir ruta correcta al index.html - LÓGICA MEJORADA
    if (currentPath.includes('proyectos.html')) {
        // Caso específico: desde proyectos.html
        homePath = currentPath.replace('proyectos.html', 'index.html') + anchor;
    } else if (currentPath.endsWith('/proyectos/')) {
        // Caso específico: desde directorio proyectos/
        homePath = currentPath.replace('/proyectos/', '/') + 'index.html' + anchor;
    } else {
        // Caso general: reemplazar el archivo actual por index.html
        homePath = currentPath.replace(/[^/]*$/, 'index.html') + anchor;
    }
    
    // Limpiar posibles dobles barras
    homePath = homePath.replace(/([^:]\/)\/+/g, '$1');
    
    // Construir URL absoluta de manera robusta
    let homeUrl;
    try {
        homeUrl = new URL(homePath, window.location.origin).href;
    } catch (e) {
        // Fallback si URL constructor falla
        homeUrl = window.location.origin + (homePath.startsWith('/') ? '' : '/') + homePath;
    }
    
    console.log(`[header.js] 🔄 Redirigiendo de ${window.location.href} a: ${homeUrl}`);
    
    // Redirigir después de un pequeño delay para mejor UX
    setTimeout(() => {
        window.location.href = homeUrl;
    }, 100);
}

/**
 * Función de limpieza para recargar componentes
 */
export function cleanupHeader() {
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    headerInitialized = false;
    console.log('[header.js] 🧹 Header limpiado para reinicialización');
}

// Inicialización automática cuando se carga el script directamente
if (typeof import.meta !== 'undefined' && import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[header.js] 🔧 Inicialización automática iniciada');
        setTimeout(initHeader, 200);
    });
}