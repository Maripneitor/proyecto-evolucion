/**
 * header.js - Funcionalidad completa del header para el proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 * VERSIÓN CORREGIDA - Scroll y navegación funcionando correctamente
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
    const maxRetries = 10;
    
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
        
        // Inicializar funcionalidades
        initScrollEffect(header);
        initMobileMenu();
        initAnchorNavigation();
        headerInitialized = true;
        
        console.log('[header.js] ✅ Header inicializado completamente y listo');

    } catch (error) {
        console.error('[header.js] ❌ Error durante el intento de inicialización:', error);
    }
}

/**
 * Inicializa el efecto de scroll en el header - CORREGIDO
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

    // Handler para resize
    resizeHandler = () => {
        updateScrollState();
    };

    // Configurar event listeners - CORREGIDO: siempre aplicar scroll effect
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    // Aplicar estado inicial inmediatamente
    updateScrollState();
    
    // Verificaciones adicionales para asegurar funcionamiento
    setTimeout(updateScrollState, 100);
    setTimeout(updateScrollState, 500);
    
    // Forzar actualización cuando termina la carga
    window.addEventListener('load', updateScrollState);

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

    // Toggle del menú móvil
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[header.js] 📱 Click en botón menú móvil');
        
        nav.classList.toggle('active');
        toggleBtn.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        toggleBtn.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Cerrar menú al hacer clic en enlaces
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                console.log('[header.js] 📱 Cerrando menú móvil al hacer clic en enlace');
                nav.classList.remove('active');
                toggleBtn.classList.remove('active');
                document.body.classList.remove('no-scroll');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = toggleBtn.contains(e.target);
        
        if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            console.log('[header.js] 📱 Cerrando menú móvil al hacer clic fuera');
            nav.classList.remove('active');
            toggleBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Cerrar menú al redimensionar
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            console.log('[header.js] 📱 Cerrando menú móvil al redimensionar a escritorio');
            nav.classList.remove('active');
            toggleBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });

    console.log('[header.js] ✅ Menú móvil configurado');
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
        const href = link.getAttribute('href');
        
        // Solo manejar enlaces que son anclas internas (#)
        if (href && href.startsWith('#')) {
            // Remover cualquier listener anterior y añadir nuevo
            link.removeEventListener('click', handleAnchorClick);
            link.addEventListener('click', handleAnchorClick);
        }
    });

    console.log('[header.js] ✅ Navegación por anclas configurada correctamente');
}

/**
 * Maneja el clic en enlaces de ancla - LÓGICA COMPLETAMENTE CORREGIDA
 */
function handleAnchorClick(e) {
    e.preventDefault();
    
    const href = this.getAttribute('href');
    console.log(`[header.js] 🔗 Clic en enlace de ancla: ${href}`);
    
    // Verificar si estamos en la página de inicio
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
    
    // Lógica robusta para detectar página de inicio
    const homeIndicators = [
        'index.html',
        '',
        'index',
        'index.htm',
        'index.php'
    ];
    
    let isHome = homeIndicators.includes(currentPage) || 
                 pathname.endsWith('/');
    
    // Verificar explícitamente si estamos en páginas secundarias conocidas
    const secondaryPages = ['proyectos.html', 'proyectos', 'contacto.html', 'acerca.html', 'servicios.html'];
    if (secondaryPages.includes(currentPage)) {
        isHome = false;
    }
    
    // Caso especial: si no hay extensión y no es vacío, probablemente no es home
    if (currentPage && !currentPage.includes('.') && !homeIndicators.includes(currentPage)) {
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
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
    });
    
    // Actualizar URL sin recargar
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
 * Redirige a la página de inicio con ancla - LÓGICA SIMPLIFICADA Y CORREGIDA
 */
function redirectToHomeWithAnchor(anchor) {
    // Validar el anchor
    if (!anchor || anchor === '#') {
        anchor = '';
    }
    
    // Construir URL base del home
    const baseUrl = window.location.origin;
    let homeUrl = baseUrl + '/index.html' + anchor;
    
    // Para desarrollo local, manejar diferentes estructuras de carpetas
    if (window.location.pathname.includes('/proyectos/') || window.location.pathname.includes('/proyectos.html')) {
        homeUrl = baseUrl + '/index.html' + anchor;
    }
    
    console.log(`[header.js] 🔄 Redirigiendo de ${window.location.href} a: ${homeUrl}`);
    
    // Redirigir inmediatamente
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
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    
    // Limpiar event listeners de enlaces
    const navLinks = document.querySelectorAll('.header__nav-link[href]');
    navLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
    });
    
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