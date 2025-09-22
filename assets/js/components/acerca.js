/**
 * acerca.js - Funcionalidad para la sección "Acerca de nosotros"
 * Proyecto Evolución - Arqueología y Restauración
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la línea de tiempo
    const timelineItems = document.querySelectorAll('.timeline__item');
    const filters = document.querySelectorAll('.timeline__filter');
    
    // Configuración del IntersectionObserver para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // Observer para animar items al hacer scroll
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar cada item de la línea de tiempo
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Funcionalidad de filtrado
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remover clase active de todos los filtros
            filters.forEach(f => f.classList.remove('active'));
            
            // Añadir clase active al filtro clickeado
            this.classList.add('active');
            
            // Obtener categoría a filtrar
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar items
            timelineItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    
                    // Reobservar el item para reanimarlo si es necesario
                    setTimeout(() => {
                        observer.observe(item);
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Asegurar que los items se muestren correctamente al cargar
    setTimeout(() => {
        timelineItems.forEach(item => {
            if (item.offsetParent !== null) { // Si el elemento es visible
                observer.observe(item);
            }
        });
    }, 500);
});