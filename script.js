// script.js - Полные скрипты для сайта DeXeD

document.addEventListener('DOMContentLoaded', function() {
    console.log('DeXeD website initialized successfully');
    
    // Инициализация всех функций
    initScrollToTop();
    initSmoothScrolling();
    initAnimations();
    initStatsCounter();
    initReviewsSlider();
    initMobileTouchEvents();
    
    // Инициализация при загрузке
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        initScrollToTopButton();
    });
});

// Функция для отслеживания лидов
function trackFacebookLead() {
    console.log('Lead tracked - Telegram button clicked');
    
    // Facebook Pixel событие для отслеживания конверсий
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
    
    // Google Analytics событие
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-YOUR_TRACKING_ID/your_conversion_label'
        });
    }
    
    // Показываем уведомление
    showNotification('Redirecting to Telegram...', 'info');
}

// Функция для кнопки "Scroll to Top"
function initScrollToTop() {
    const scrollButton = document.querySelector('.scroll-to-top');
    
    if (!scrollButton) return;
    
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
    
    scrollButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', toggleScrollButton);
}

// Инициализация кнопки "Наверх" при загрузке
function initScrollToTopButton() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Плавная прокрутка для якорных ссылок
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации при скролле
function initAnimations() {
    const animatedElements = document.querySelectorAll('.process-card, .feature-card, .asset-card, .review-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 100);
}

// Анимация счетчиков статистики
function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const finalValue = statNumber.textContent;
                
                if (finalValue.includes('+') || finalValue.includes('24/7') || finalValue === 'DEX') {
                    statNumber.style.opacity = '1';
                    statNumber.style.transform = 'translateY(0)';
                } else {
                    animateCounter(statNumber, 0, parseInt(finalValue), 2000);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statItems.forEach(item => observer.observe(item));
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Слайдер отзывов - ИСПРАВЛЕННАЯ ВЕРСИЯ
function initReviewsSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!sliderTrack || !prevBtn || !nextBtn) {
        console.warn('Slider elements not found');
        return;
    }
    
    // Массив отзывов с корректными путями к изображениям
    const reviews = [
        {
            image: 'review1.jpg',
            alt: 'Отзыв 1'
        },
        {
            image: 'review2.jpg', 
            alt: 'Отзыв 2'
        },
        {
            image: 'review3.jpg',
            alt: 'Отзыв 3'
        },
        {
            image: 'review4.jpg',
            alt: 'Отзыв 4'
        },
        {
            image: 'review5.jpg',
            alt: 'Отзыв 5'
        }
    ];
    
    let currentSlide = 0;
    let autoSlideInterval;
    const SLIDE_DURATION = 5000;
    
    function renderSlides() {
        sliderTrack.innerHTML = '';
        
        reviews.forEach((review, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slider-slide';
            slideElement.innerHTML = `
                <div class="slide-image-container">
                    <img src="${review.image}" alt="${review.alt}" class="review-image" 
                         onerror="handleImageError(this)">
                    <div class="slide-overlay">
                        <div class="slide-content">
                            <div class="review-stars">
                            </div>
                            <div class="slide-counter">${index + 1} / ${reviews.length}</div>
                        </div>
                    </div>
                </div>
            `;
            sliderTrack.appendChild(slideElement);
        });
        
        updateSliderPosition();
    }
    
    function handleImageError(img) {
        console.warn('Image failed to load:', img.src);
        img.style.display = 'none';
        
        // Создаем fallback контент
        const container = img.parentElement;
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.innerHTML = `
            <div class="fallback-content">
                <i class="fas fa-image"></i>
                <p>Отзыв ${Array.from(container.parentElement.parentElement.children).indexOf(container.parentElement) + 1}</p>
            </div>
        `;
        fallback.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
            color: #D4AF37;
            border-radius: 15px;
        `;
        
        const fallbackContent = fallback.querySelector('.fallback-content');
        fallbackContent.style.cssText = `
            text-align: center;
            font-size: 1.2rem;
        `;
        
        container.appendChild(fallback);
    }
    
    function updateSliderPosition() {
        const slideWidth = 100;
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % reviews.length;
        updateSliderPosition();
        restartAutoSlide();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + reviews.length) % reviews.length;
        updateSliderPosition();
        restartAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, SLIDE_DURATION);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Добавляем обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    sliderTrack.addEventListener('mouseenter', stopAutoSlide);
    sliderTrack.addEventListener('mouseleave', startAutoSlide);
    
    // Обработка клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Инициализация
    renderSlides();
    startAutoSlide();
    
    // Обработка видимости страницы
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
}

// Touch events для мобильных устройств
function initMobileTouchEvents() {
    const sliderTrack = document.getElementById('sliderTrack');
    
    if (!sliderTrack) return;
    
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    sliderTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    sliderTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        endX = e.changedTouches[0].clientX;
        handleSwipe(startX, endX);
        isDragging = false;
    });
    
    function handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                document.getElementById('nextBtn')?.click();
            } else {
                document.getElementById('prevBtn')?.click();
            }
        }
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    // Создаем контейнер для уведомлений если его нет
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 300px;
        background: ${getNotificationColor(type)};
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(45deg, #10B981, #059669)',
        error: 'linear-gradient(45deg, #EF4444, #DC2626)',
        info: 'linear-gradient(45deg, #3B82F6, #2563EB)',
        warning: 'linear-gradient(45deg, #F59E0B, #D97706)'
    };
    return colors[type] || colors.info;
}

// CTA button hover effects enhancement
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-button, .features-btn, .final-cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Добавляем эффект нажатия
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
});

// Обработка ошибок изображений
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Добавляем обработчик ошибок если его еще нет
        if (!img.hasAttribute('data-error-handled')) {
            img.setAttribute('data-error-handled', 'true');
            img.addEventListener('error', function() {
                console.warn('Image failed to load:', this.src);
                this.style.opacity = '0.3';
                
                // Для изображений отзывов добавляем специальную обработку
                if (this.classList.contains('review-image')) {
                    handleReviewImageError(this);
                }
            });
            
            // Обработка успешной загрузки
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });
}

// Специальная обработка для изображений отзывов
function handleReviewImageError(img) {
    const container = img.parentElement;
    const slide = container.parentElement;
    const slideIndex = Array.from(slide.parentElement.children).indexOf(slide);
    
    // Создаем fallback контент
    const fallback = document.createElement('div');
    fallback.className = 'review-fallback';
    fallback.innerHTML = `
        <div class="fallback-content">
            <i class="fas fa-user-circle"></i>
            <h4>Отзыв ${slideIndex + 1}</h4>
            <p>⭐⭐⭐⭐⭐</p>
            <small>Изображение временно недоступно</small>
        </div>
    `;
    
    fallback.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        color: #D4AF37;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
    `;
    
    container.appendChild(fallback);
}

// Утилиты
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Оптимизация производительности при скролле
const optimizedScrollHandler = throttle(function() {
    // Код для выполнения при скролле
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Произошла ошибка на странице', 'error');
});

// Resize observer для адаптивности
function initResizeObserver() {
    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                // Обновляем слайдер при изменении размера
                if (entry.target === document.body) {
                    const sliderTrack = document.getElementById('sliderTrack');
                    if (sliderTrack) {
                        // Пересчитываем позицию слайдера
                        const slides = sliderTrack.querySelectorAll('.slider-slide');
                        if (slides.length > 0) {
                            const currentSlide = Math.round(parseInt(sliderTrack.style.transform.split('translateX(')[1]) / 100);
                            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
                        }
                    }
                }
            }
        });
        
        resizeObserver.observe(document.body);
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', loadTime + 'ms');
                
                if (loadTime > 3000) {
                    console.warn('Page load time is slow:', loadTime + 'ms');
                }
            }, 0);
        });
    }
}

// Service Worker registration
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Ленивая загрузка изображений
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Предзагрузка критических ресурсов
function preloadCriticalResources() {
    const criticalResources = [
        '/css/main.css',
        '/fonts/your-font.woff2'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'font';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// Управление состоянием загрузки
function initPageTransitions() {
    window.addEventListener('beforeunload', function() {
        document.body.classList.add('page-transition');
    });
    
    // Убираем класс когда страница полностью загружена
    window.addEventListener('load', function() {
        document.body.classList.remove('page-transition');
    });
}

// Оптимизация анимаций
function optimizeAnimations() {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        // Добавляем will-change только для анимируемых элементов
        if (el.classList.contains('process-card') || 
            el.classList.contains('feature-card') ||
            el.classList.contains('slider-slide')) {
            el.style.willChange = 'transform, opacity';
        } else {
            el.style.willChange = 'auto';
        }
    });
}

// Инициализация всех модулей
function initAllModules() {
    initImageErrorHandling();
    initResizeObserver();
    initPerformanceMonitoring();
    initServiceWorker();
    initLazyLoading();
    preloadCriticalResources();
    initPageTransitions();
    optimizeAnimations();
}

// Запуск инициализации при полной загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllModules);
} else {
    initAllModules();
}

// Глобальные функции для обработки ошибок
window.handleImageError = function(img) {
    console.warn('Image error handled:', img.src);
    img.style.opacity = '0.3';
    
    // Добавляем альтернативный текст если его нет
    if (!img.alt) {
        img.alt = 'Изображение не загружено';
    }
};

// Facebook Pixel код
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1167436535223971');
fbq('track', 'PageView');

console.log('DeXeD scripts loaded successfully');

// Добавляем CSS для fallback контента
const fallbackStyles = `
    .image-fallback,
    .review-fallback {
        animation: fadeIn 0.5s ease-in;
    }
    
    .fallback-content {
        text-align: center;
        padding: 20px;
    }
    
    .fallback-content i {
        font-size: 3rem;
        margin-bottom: 10px;
        opacity: 0.7;
    }
    
    .fallback-content h4 {
        margin: 10px 0 5px 0;
        color: #D4AF37;
    }
    
    .fallback-content p {
        margin: 5px 0;
        color: #FFD700;
    }
    
    .fallback-content small {
        color: #888;
        font-size: 0.8rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = fallbackStyles;
document.head.appendChild(styleSheet);