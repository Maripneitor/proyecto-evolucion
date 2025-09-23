/**
 * acerca.js - Funcionalidad para la sección "Acerca de nosotros"
 * Proyecto Evolución - Arqueología y Restauración
 */

export function initAcercaSection() {
    console.log('[acerca.js] Se ha llamado a initAcercaSection.');
    
    // Elementos de la línea de tiempo
    const timelineItems = document.querySelectorAll('.timeline__item');
    const filters = document.querySelectorAll('.timeline__filter');
    
    console.log(`[acerca.js] Se encontraron ${timelineItems.length} items para observar.`);
    console.log(`[acerca.js] Se encontraron ${filters.length} filtros.`);
    
    // Si no hay elementos, mostrar advertencia
    if (timelineItems.length === 0) {
        console.warn('[acerca.js] ¡ADVERTENCIA! No se encontraron elementos .timeline__item en el DOM.');
        return;
    }
    
    // Configuración del IntersectionObserver para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // Observer para animar items al hacer scroll
    const observer = new IntersectionObserver(function(entries) {
        console.log(`[acerca.js] IntersectionObserver callback ejecutado. ${entries.length} entradas procesadas.`);
        
        entries.forEach(entry => {
            console.log(`[acerca.js] Elemento: ${entry.target.classList} | Intersectando: ${entry.isIntersecting}`);
            
            if (entry.isIntersecting) {
                console.log('[acerca.js] ¡Item a la vista! Añadiendo clase .visible a:', entry.target);
                entry.target.classList.add('visible');
                
                // Dejar de observar después de que se hace visible para mejorar rendimiento
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar cada item de la línea de tiempo
    timelineItems.forEach((item, index) => {
        console.log(`[acerca.js] Observando item ${index + 1}:`, item);
        observer.observe(item);
    });
    
    // Funcionalidad de filtrado
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            console.log('[acerca.js] Filtro clickeado:', this.textContent, '| Data-filter:', this.getAttribute('data-filter'));
            
            // Remover clase active de todos los filtros
            filters.forEach(f => f.classList.remove('active'));
            
            // Añadir clase active al filtro clickeado
            this.classList.add('active');
            
            // Obtener categoría a filtrar
            const filterValue = this.getAttribute('data-filter');
            console.log('[acerca.js] Filtrando por:', filterValue);
            
            // Filtrar items
            timelineItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    console.log('[acerca.js] Mostrando item:', item);
                    
                    // Reobservar el item para reanimarlo si es necesario
                    setTimeout(() => {
                        observer.observe(item);
                    }, 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible'); // Resetear animación
                    console.log('[acerca.js] Ocultando item:', item);
                }
            });
        });
    });
    
    // Forzar check inicial de visibilidad para elementos ya visibles
    setTimeout(() => {
        console.log('[acerca.js] Realizando check forzado de visibilidad...');
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible) {
                console.log('[acerca.js] Item visible en check forzado, añadiendo clase .visible a:', item);
                item.classList.add('visible');
                observer.unobserve(item);
            }
        });
    }, 500);
}