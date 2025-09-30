/**
 * hero.js - Slider hero para el proyecto Evolución
 * VERSIÓN ULTRA-ROBUSTA - A prueba de errores
 */

class HeroSlider {
    constructor() {
        this.state = {
            currentSlide: 0,
            totalSlides: 0,
            isAnimating: false,
            autoplayInterval: null,
            autoplayDelay: 6000,
            isInitialized: false
        };
        
        this.elements = {};
    }

    /**
     * Inicializa el slider con verificaciones exhaustivas
     */
    init() {
        console.log('🎯 Inicializando Hero Slider...');

        // Verificar estructura crítica ANTES de cualquier operación
        if (!this.validateStructure()) {
            console.warn('⚠️ Slider desactivado - Estructura HTML incompleta');
            this.safeFallback();
            return false;
        }

        try {
            this.cacheElements();
            this.initializeState();
            this.createDots();
            this.setupEventListeners();
            this.startAutoplay();
            this.updateUI();
            
            this.state.isInitialized = true;
            console.log('✅ Hero Slider inicializado correctamente');
            return true;

        } catch (error) {
            console.error('❌ Error crítico en inicialización:', error);
            this.safeFallback();
            return false;
        }
    }

    /**
     * Valida que todos los elementos críticos existan
     */
    validateStructure() {
        try {
            const criticalElements = [
                '.hero-slider',
                '.slide',
                '.slider-controls',
                '.slider-arrow.prev',
                '.slider-arrow.next',
                '.slider-dots'
            ];

            for (const selector of criticalElements) {
                const element = document.querySelector(selector);
                if (!element) {
                    console.error(`❌ Elemento crítico no encontrado: ${selector}`);
                    return false;
                }
            }

            const slides = document.querySelectorAll('.slide');
            if (slides.length === 0) {
                console.error('❌ No se encontraron slides');
                return false;
            }

            return true;
        } catch (error) {
            console.error('❌ Error en validación de estructura:', error);
            return false;
        }
    }

    /**
     * Cachea elementos DOM para mejor performance
     */
    cacheElements() {
        try {
            this.elements = {
                slider: document.querySelector('.hero-slider'),
                slides: document.querySelectorAll('.slide'),
                prevArrow: document.querySelector('.slider-arrow.prev'),
                nextArrow: document.querySelector('.slider-arrow.next'),
                dotsContainer: document.querySelector('.slider-dots'),
                controls: document.querySelector('.slider-controls')
            };
        } catch (error) {
            console.error('❌ Error cacheando elementos:', error);
            throw error;
        }
    }

    /**
     * Inicializa el estado del slider
     */
    initializeState() {
        this.state.totalSlides = this.elements.slides.length;
        this.state.currentSlide = 0;
        this.state.isAnimating = false;

        // Activar solo el primer slide
        this.elements.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === 0);
        });
    }

    /**
     * Crea los dots de navegación dinámicamente
     */
    createDots() {
        try {
            this.elements.dotsContainer.innerHTML = '';
            
            for (let i = 0; i < this.state.totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('data-slide', i);
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                dot.setAttribute('aria-label', `Diapositiva ${i + 1}`);
                
                const dotInner = document.createElement('span');
                dotInner.className = 'slider-dot__inner';
                dot.appendChild(dotInner);
                
                dot.addEventListener('click', () => this.goToSlide(i));
                this.elements.dotsContainer.appendChild(dot);
            }
            
            this.elements.dots = document.querySelectorAll('.slider-dot');
        } catch (error) {
            console.error('❌ Error creando dots:', error);
        }
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        try {
            // Flechas de navegación
            this.elements.prevArrow.addEventListener('click', () => this.goToPrevSlide());
            this.elements.nextArrow.addEventListener('click', () => this.goToNextSlide());

            // Interacción para pausar autoplay
            this.elements.slider.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.elements.slider.addEventListener('mouseleave', () => this.resumeAutoplay());

            // Pausar cuando la página no es visible
            document.addEventListener('visibilitychange', () => {
                document.hidden ? this.pauseAutoplay() : this.resumeAutoplay();
            });

            // Teclado navigation
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        } catch (error) {
            console.error('❌ Error configurando event listeners:', error);
        }
    }

    /**
     * Maneja navegación por teclado
     */
    handleKeyboard(event) {
        if (!this.state.isInitialized) return;
        
        try {
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    this.goToPrevSlide();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.goToNextSlide();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.state.totalSlides - 1);
                    break;
            }
        } catch (error) {
            console.error('❌ Error en navegación por teclado:', error);
        }
    }

    /**
     * Navega a la diapositiva anterior
     */
    goToPrevSlide() {
        if (this.state.isAnimating) return;
        
        try {
            const newIndex = this.state.currentSlide === 0 ? 
                this.state.totalSlides - 1 : 
                this.state.currentSlide - 1;
            
            this.goToSlide(newIndex);
        } catch (error) {
            console.error('❌ Error navegando a slide anterior:', error);
        }
    }

    /**
     * Navega a la siguiente diapositiva
     */
    goToNextSlide() {
        if (this.state.isAnimating) return;
        
        try {
            const newIndex = this.state.currentSlide === this.state.totalSlides - 1 ? 
                0 : 
                this.state.currentSlide + 1;
            
            this.goToSlide(newIndex);
        } catch (error) {
            console.error('❌ Error navegando a siguiente slide:', error);
        }
    }

    /**
     * Navega a una diapositiva específica
     */
    goToSlide(newIndex) {
        // Validaciones de seguridad
        if (this.state.isAnimating || 
            newIndex < 0 || 
            newIndex >= this.state.totalSlides ||
            newIndex === this.state.currentSlide) {
            return;
        }

        try {
            this.state.isAnimating = true;
            this.restartAutoplay();

            // Realizar transición
            this.performTransition(this.state.currentSlide, newIndex);
            this.state.currentSlide = newIndex;

            // Actualizar UI después de la transición
            setTimeout(() => {
                this.updateUI();
                this.state.isAnimating = false;
            }, 600);
        } catch (error) {
            console.error('❌ Error navegando a slide específico:', error);
            this.state.isAnimating = false;
        }
    }

    /**
     * Realiza la transición entre slides
     */
    performTransition(oldIndex, newIndex) {
        this.elements.slides[oldIndex].classList.remove('active');
        this.elements.slides[newIndex].classList.add('active');
    }

    /**
     * Actualiza toda la interfaz de usuario
     */
    updateUI() {
        try {
            this.updateDots();
            this.updateAccessibility();
            this.updateNavigationControls();
        } catch (error) {
            console.error('❌ Error actualizando UI:', error);
        }
    }

    /**
     * Actualiza los puntos de navegación
     */
    updateDots() {
        if (!this.elements.dots) return;
        
        this.elements.dots.forEach((dot, index) => {
            const isActive = index === this.state.currentSlide;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive.toString());
        });
    }

    /**
     * Actualiza la accesibilidad
     */
    updateAccessibility() {
        this.elements.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', (index !== this.state.currentSlide).toString());
        });
    }

    /**
     * Actualiza el estado de los controles de navegación
     */
    updateNavigationControls() {
        const isFirst = this.state.currentSlide === 0;
        const isLast = this.state.currentSlide === this.state.totalSlides - 1;

        this.elements.prevArrow.setAttribute('aria-disabled', isFirst.toString());
        this.elements.nextArrow.setAttribute('aria-disabled', isLast.toString());
    }

    /**
     * Sistema de autoplay
     */
    startAutoplay() {
        try {
            this.pauseAutoplay();
            this.state.autoplayInterval = setInterval(() => {
                if (!this.state.isAnimating && !document.hidden) {
                    this.goToNextSlide();
                }
            }, this.state.autoplayDelay);
        } catch (error) {
            console.error('❌ Error iniciando autoplay:', error);
        }
    }

    pauseAutoplay() {
        if (this.state.autoplayInterval) {
            clearInterval(this.state.autoplayInterval);
            this.state.autoplayInterval = null;
        }
    }

    resumeAutoplay() {
        if (!this.state.autoplayInterval && !document.hidden) {
            this.startAutoplay();
        }
    }

    restartAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }

    /**
     * Fallback seguro cuando el slider falla
     */
    safeFallback() {
        try {
            this.pauseAutoplay();
            // Mostrar solo el primer slide
            const slides = document.querySelectorAll('.slide');
            if (slides.length > 0) {
                slides.forEach((slide, index) => {
                    slide.style.display = index === 0 ? 'block' : 'none';
                });
            }
            // Ocultar controles
            if (this.elements.controls) {
                this.elements.controls.style.display = 'none';
            }
        } catch (error) {
            console.error('❌ Error en safe fallback:', error);
        }
    }

    /**
     * Destruye el slider y limpia recursos
     */
    destroy() {
        try {
            this.pauseAutoplay();
            this.state.isInitialized = false;
            console.log('🔴 Hero Slider destruido');
        } catch (error) {
            console.error('❌ Error destruyendo slider:', error);
        }
    }
}

// Instancia global del slider
const heroSlider = new HeroSlider();

// Exportar para uso modular
export function initHeroSlider() {
    return heroSlider.init();
}

export function destroyHeroSlider() {
    return heroSlider.destroy();
}

// Auto-inicialización segura
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            initHeroSlider();
        } catch (error) {
            console.error('❌ Error en auto-inicialización:', error);
        }
    }, 100);
});