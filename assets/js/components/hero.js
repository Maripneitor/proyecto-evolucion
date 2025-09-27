/**
 * hero.js - Funcionalidad para el slider hero del proyecto Evolución
 * Proyecto Evolución - Arqueología y Restauración
 */

/**
 * Inicializa el slider hero con navegación automática y controles
 */
export function initHeroSlider() {
    console.log('[hero.js] Inicializando slider hero...');
    
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-arrow--prev');
    const nextButton = document.querySelector('.slider-arrow--next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!slider || slides.length === 0) {
        console.warn('[hero.js] Elementos del slider no encontrados');
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 7000; // 7 segundos
    
    // Crear puntos de navegación
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir a diapositiva ${index + 1}`);
            dot.innerHTML = `<span class="sr-only">Diapositiva ${index + 1}</span>`;
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            
            dotsContainer.appendChild(dot);
        });
    }
    
    // Ir a una slide específica
    function goToSlide(n) {
        // Validar índice
        if (n < 0) n = slides.length - 1;
        if (n >= slides.length) n = 0;
        
        // Remover clase active de la slide actual
        slides[currentSlide].classList.remove('active');
        document.querySelectorAll('.slider-dot')[currentSlide]?.classList.remove('active');
        
        // Actualizar índice
        currentSlide = n;
        
        // Añadir clase active a la nueva slide
        slides[currentSlide].classList.add('active');
        document.querySelectorAll('.slider-dot')[currentSlide]?.classList.add('active');
        
        console.log(`[hero.js] Cambiando a slide: ${currentSlide + 1}`);
    }
    
    // Slide siguiente
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Slide anterior
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Iniciar intervalo automático
    function startInterval() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // Reiniciar intervalo (al interacción del usuario)
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Event listeners para controles
    function initControls() {
        // Flechas de navegación
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }
        
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetInterval();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetInterval();
            }
        });
        
        // Pausar en hover (opcional)
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startInterval();
        });
    }
    
    // Inicializar todo
    function init() {
        createDots();
        initControls();
        startInterval();
        
        // Asegurar que la primera slide esté activa
        goToSlide(0);
        
        console.log(`[hero.js] Slider inicializado con ${slides.length} diapositivas`);
    }
    
    // Iniciar el slider
    init();
    
    // Limpiar intervalo al salir de la página
    window.addEventListener('beforeunload', () => {
        clearInterval(slideInterval);
    });
}

// Inicialización automática si se carga directamente
if (import.meta.url === document.currentScript?.src) {
    document.addEventListener('DOMContentLoaded', () => {
        initHeroSlider();
    });
}