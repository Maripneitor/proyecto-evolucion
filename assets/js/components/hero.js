/**
 * hero.js - Slider hero para el proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 * VERSIÓN ROBUSTA - Con verificaciones completas y manejo de errores
 */

// Estado global del slider
let sliderState = {
    currentSlide: 0,
    totalSlides: 0,
    isAnimating: false,
    autoplayInterval: null,
    autoplayDelay: 6000 // 6 segundos entre transiciones
};

/**
 * Inicializa el slider hero con verificaciones robustas
 */
export function initHeroSlider() {
    console.log('[hero.js] 🔧 Inicializando slider hero...');

    // Verificación completa de elementos críticos
    if (!validateSliderStructure()) {
        console.warn('[hero.js] ⚠️ Estructura del slider incompleta. Slider desactivado sin bloquear otros scripts.');
        return false; // Retorna sin error para no bloquear ejecución
    }

    try {
        // Inicializar estado del slider
        initializeSliderState();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Iniciar autoplay
        startAutoplay();
        
        // Actualizar indicadores visuales
        updateSliderUI();
        
        console.log('[hero.js] ✅ Slider hero inicializado correctamente');
        return true;

    } catch (error) {
        console.error('[hero.js] ❌ Error durante la inicialización del slider:', error);
        // Limpiar recursos en caso de error sin bloquear
        cleanupSlider();
        return false;
    }
}

/**
 * Valida que toda la estructura del slider esté presente y sea correcta
 * @returns {boolean} - True si la estructura es válida
 */
function validateSliderStructure() {
    console.log('[hero.js] 🔍 Validando estructura del slider...');
    
    const validations = [
        // Elementos principales
        { selector: '.hero-slider', description: 'Contenedor principal del slider' },
        { selector: '.slide', description: 'Diapositivas del slider', minCount: 1 },
        { selector: '.slider-controls', description: 'Controles de navegación' },
        { selector: '.slider-arrow.prev', description: 'Flecha anterior' },
        { selector: '.slider-arrow.next', description: 'Flecha siguiente' },
        { selector: '.slider-dots', description: 'Contenedor de puntos' },
        { selector: '.slider-dot', description: 'Puntos de navegación', minCount: 1 }
    ];

    let isValid = true;

    validations.forEach(validation => {
        const elements = document.querySelectorAll(validation.selector);
        
        if (elements.length === 0) {
            console.warn(`[hero.js] ⚠️ Elemento no encontrado: ${validation.description} (${validation.selector})`);
            isValid = false;
            return;
        }

        if (validation.minCount && elements.length < validation.minCount) {
            console.warn(`[hero.js] ⚠️ Insuficientes elementos: ${validation.description} - encontrados: ${elements.length}, requeridos: ${validation.minCount}`);
            isValid = false;
            return;
        }

        console.log(`[hero.js] ✅ ${validation.description}: ${elements.length} encontrados`);
    });

    // Verificación adicional: coincidencia entre slides y dots
    if (isValid) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        if (slides.length !== dots.length) {
            console.warn(`[hero.js] ⚠️ Número de slides (${slides.length}) no coincide con dots (${dots.length})`);
            // No marcamos como inválido, solo advertimos
        }
    }

    if (!isValid) {
        console.warn('[hero.js] ⚠️ Validación fallida. El slider no se inicializará.');
    } else {
        console.log('[hero.js] ✅ Validación de estructura completada correctamente');
    }

    return isValid;
}

/**
 * Inicializa el estado del slider
 */
function initializeSliderState() {
    const slides = document.querySelectorAll('.slide');
    
    sliderState.totalSlides = slides.length;
    sliderState.currentSlide = 0;
    sliderState.isAnimating = false;

    // Asegurar que solo el slide activo esté visible
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.classList.remove('active');
        }
    });

    console.log(`[hero.js] 📊 Slider configurado con ${slides.length} diapositivas`);
}

/**
 * Configura todos los event listeners del slider
 */
function setupEventListeners() {
    // Flechas de navegación
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', goToPrevSlide);
        console.log('[hero.js] ✅ Listener de flecha anterior configurado');
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', goToNextSlide);
        console.log('[hero.js] ✅ Listener de flecha siguiente configurado');
    }

    // Puntos de navegación
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    console.log(`[hero.js] ✅ ${dots.length} listeners de puntos configurados`);

    // Pausar autoplay al interactuar
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', pauseAutoplay);
        sliderContainer.addEventListener('mouseleave', resumeAutoplay);
        console.log('[hero.js] ✅ Listeners de interacción configurados');
    }

    // Pausar autoplay cuando la página no está visible
    document.addEventListener('visibilitychange', handleVisibilityChange);

    console.log('[hero.js] ✅ Todos los event listeners configurados correctamente');
}

/**
 * Maneja el cambio de visibilidad de la página
 */
function handleVisibilityChange() {
    if (document.hidden) {
        pauseAutoplay();
    } else {
        resumeAutoplay();
    }
}

/**
 * Navega a la diapositiva anterior
 */
function goToPrevSlide() {
    if (sliderState.isAnimating) {
        console.log('[hero.js] ⏳ Animación en curso, ignorando navegación...');
        return;
    }
    
    const newSlide = sliderState.currentSlide === 0 ? 
        sliderState.totalSlides - 1 : 
        sliderState.currentSlide - 1;
    
    goToSlide(newSlide);
}

/**
 * Navega a la siguiente diapositiva
 */
function goToNextSlide() {
    if (sliderState.isAnimating) {
        console.log('[hero.js] ⏳ Animación en curso, ignorando navegación...');
        return;
    }
    
    const newSlide = sliderState.currentSlide === sliderState.totalSlides - 1 ? 
        0 : 
        sliderState.currentSlide + 1;
    
    goToSlide(newSlide);
}

/**
 * Navega a una diapositiva específica
 * @param {number} slideIndex - Índice de la diapositiva destino
 */
function goToSlide(slideIndex) {
    // Validaciones de seguridad
    if (sliderState.isAnimating) {
        console.log('[hero.js] ⏳ Animación en curso, ignorando solicitud...');
        return;
    }
    
    if (slideIndex === sliderState.currentSlide) {
        console.log(`[hero.js] 🔄 Ya en la diapositiva ${slideIndex}, ignorando...`);
        return;
    }

    if (slideIndex < 0 || slideIndex >= sliderState.totalSlides) {
        console.warn(`[hero.js] ⚠️ Índice de slide inválido: ${slideIndex}. Límites: 0-${sliderState.totalSlides - 1}`);
        return;
    }

    console.log(`[hero.js] 🔄 Navegando de slide ${sliderState.currentSlide} a ${slideIndex}`);
    
    sliderState.isAnimating = true;
    
    // Reiniciar autoplay
    restartAutoplay();
    
    // Realizar transición
    performSlideTransition(sliderState.currentSlide, slideIndex);
    
    // Actualizar estado
    sliderState.currentSlide = slideIndex;
    
    // Actualizar UI después de un breve delay
    setTimeout(updateSliderUI, 50);
}

/**
 * Realiza la transición entre slides
 */
function performSlideTransition(oldIndex, newIndex) {
    const slides = document.querySelectorAll('.slide');
    const oldSlide = slides[oldIndex];
    const newSlide = slides[newIndex];

    if (!oldSlide || !newSlide) {
        console.error('[hero.js] ❌ Slides no encontrados para transición');
        sliderState.isAnimating = false;
        return;
    }

    // Transición suave
    oldSlide.classList.remove('active');
    newSlide.classList.add('active');

    // Finalizar animación después de la transición CSS
    setTimeout(() => {
        sliderState.isAnimating = false;
        console.log(`[hero.js] ✅ Transición a slide ${newIndex} completada`);
    }, 800); // Coincide con la duración de la transición CSS
}

/**
 * Actualiza la interfaz de usuario del slider
 */
function updateSliderUI() {
    updateDotsNavigation();
    updateSlideAccessibility();
    updateNavigationControls();
    
    console.log(`[hero.js] 🎨 UI actualizada para slide ${sliderState.currentSlide}`);
}

/**
 * Actualiza los puntos de navegación
 */
function updateDotsNavigation() {
    const dots = document.querySelectorAll('.slider-dot');
    
    dots.forEach((dot, index) => {
        const isActive = index === sliderState.currentSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive.toString());
        
        // Actualizar accesibilidad
        dot.setAttribute('tabindex', isActive ? '0' : '-1');
    });
}

/**
 * Actualiza la accesibilidad de los slides
 */
function updateSlideAccessibility() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach((slide, index) => {
        const isActive = index === sliderState.currentSlide;
        slide.setAttribute('aria-hidden', (!isActive).toString());
        
        if (isActive) {
            slide.removeAttribute('tabindex');
        } else {
            slide.setAttribute('tabindex', '-1');
        }
    });
}

/**
 * Actualiza el estado de los controles de navegación
 */
function updateNavigationControls() {
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');
    
    if (prevArrow) {
        const isDisabled = sliderState.currentSlide === 0;
        prevArrow.setAttribute('aria-disabled', isDisabled.toString());
        prevArrow.style.opacity = isDisabled ? '0.5' : '1';
    }
    
    if (nextArrow) {
        const isDisabled = sliderState.currentSlide === sliderState.totalSlides - 1;
        nextArrow.setAttribute('aria-disabled', isDisabled.toString());
        nextArrow.style.opacity = isDisabled ? '0.5' : '1';
    }
}

/**
 * Inicia el autoplay del slider
 */
function startAutoplay() {
    // Limpiar intervalo existente
    if (sliderState.autoplayInterval) {
        clearInterval(sliderState.autoplayInterval);
    }
    
    sliderState.autoplayInterval = setInterval(() => {
        if (!sliderState.isAnimating && !document.hidden) {
            goToNextSlide();
        }
    }, sliderState.autoplayDelay);
    
    console.log('[hero.js] 🔄 Autoplay iniciado');
}

/**
 * Pausa el autoplay
 */
function pauseAutoplay() {
    if (sliderState.autoplayInterval) {
        clearInterval(sliderState.autoplayInterval);
        sliderState.autoplayInterval = null;
        console.log('[hero.js] ⏸️ Autoplay pausado');
    }
}

/**
 * Reanuda el autoplay
 */
function resumeAutoplay() {
    if (!sliderState.autoplayInterval && !document.hidden) {
        startAutoplay();
        console.log('[hero.js] ▶️ Autoplay reanudado');
    }
}

/**
 * Reinicia el autoplay
 */
function restartAutoplay() {
    pauseAutoplay();
    startAutoplay();
}

/**
 * Limpia recursos del slider
 */
function cleanupSlider() {
    pauseAutoplay();
    sliderState = {
        currentSlide: 0,
        totalSlides: 0,
        isAnimating: false,
        autoplayInterval: null,
        autoplayDelay: 6000
    };
    console.log('[hero.js] 🧹 Slider limpiado');
}

/**
 * Función para destruir el slider
 */
export function destroyHeroSlider() {
    cleanupSlider();
    
    // Remover event listeners
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (prevArrow) {
        prevArrow.replaceWith(prevArrow.cloneNode(true));
    }
    if (nextArrow) {
        nextArrow.replaceWith(nextArrow.cloneNode(true));
    }
    
    dots.forEach(dot => {
        dot.replaceWith(dot.cloneNode(true));
    });
    
    console.log('[hero.js] 🔴 Slider destruido completamente');
}

// Inicialización automática si se carga direaactamente
if (typeof import.meta !== 'undefined' && import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[hero.js] 🔧 Inicialización automática iniciada');
        setTimeout(initHeroSlider, 200); // Delay mayor para asegurar carga de componentes
    });
}