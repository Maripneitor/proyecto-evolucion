/**
 * acerca.js - Funcionalidad para la sección "Acerca de nosotros"
 * Proyecto Evolución - Arqueología y Restauración
 */

// DIAGNÓSTICO: Confirmar que el archivo se está ejecutando
console.log('[acerca.js] El script ha comenzado a ejecutarse.');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('[acerca.js] DOMContentLoaded disparado. Buscando elementos...');
    
    // DIAGNÓSTICO: Log antes de buscar elementos
    console.log('[acerca.js] Buscando items de la línea de tiempo en el DOM...');
    
    // Elementos de la línea de tiempo
    const timelineItems = document.querySelectorAll('.timeline__item');
    const filters = document.querySelectorAll('.timeline__filter');
    
    // DIAGNÓSTICO: Log del número de elementos encontrados
    console.log(`[acerca.js] Se encontraron ${timelineItems.length} items para observar.`);
    console.log(`[acerca.js] Se encontraron ${filters.length} filtros.`);
    
    // Si no hay elementos, mostrar advertencia
    if (timelineItems.length === 0) {
        console.warn('[acerca.js] ¡ADVERTENCIA! No se encontraron elementos .timeline__item en el DOM.');
        console.warn('[acerca.js] Posibles causas:');
        console.warn('[acerca.js] 1. El HTML no se ha cargado correctamente');
        console.warn('[acerca.js] 2. Los elementos tienen una clase diferente');
        console.warn('[acerca.js] 3. El script se ejecuta antes de que el HTML esté disponible');
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
            console.log(`[acerca.js] Elemento: ${entry.target.classList} | Intersectando: ${entry.isIntersecting} | Ratio: ${entry.intersectionRatio}`);
            
            if (entry.isIntersecting) {
                // DIAGNÓSTICO: Log cuando un elemento es visible
                console.log('[acerca.js] ¡Item a la vista! Añadiendo clase .visible a:', entry.target);
                
                entry.target.classList.add('visible');
                
                // Dejar de observar después de que se hace visible para mejorar rendimiento
                observer.unobserve(entry.target);
                console.log('[acerca.js] Dejando de observar el elemento:', entry.target);
            }
        });
    }, observerOptions);
    
    // Observar cada item de la línea de tiempo
    timelineItems.forEach((item, index) => {
        console.log(`[acerca.js] Observando item ${index + 1}:`, item);
        observer.observe(item);
    });
    
    console.log(`[acerca.js] Todos los items (${timelineItems.length}) están siendo observados.`);
    
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
                        console.log('[acerca.js] Reobservando item:', item);
                    }, 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible'); // Resetear animación
                    console.log('[acerca.js] Ocultando item:', item);
                }
            });
        });
    });
    
    // Asegurar que los items se muestren correctamente al cargar
    setTimeout(() => {
        console.log('[acerca.js] Comprobando visibilidad inicial de items...');
        timelineItems.forEach(item => {
            if (item.offsetParent !== null) { // Si el elemento es visible
                observer.observe(item);
                console.log('[acerca.js] Item visible en carga, observando:', item);
            } else {
                console.log('[acerca.js] Item no visible en carga:', item);
            }
        });
    }, 500);
    
    // Forzar check inicial de visibilidad
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
    }, 1000);
});

// DIAGNÓSTICO: Log adicional para verificar la ejecución del script
console.log('[acerca.js] Script completamente cargado y configurado.');