// ==================================================================== 
// HERO CAROUSEL - Custom Implementation
// Supports video backgrounds and 8-second intervals
// ==================================================================== 

class HeroCarouselCustom {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.carousel-slide-custom');
        this.indicators = element.querySelectorAll('.carousel-indicators-custom .indicator');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 8000; // 8 seconds for regular slides
        this.slide1Delay = 11000; // 11 seconds for slide 1 (3 seconds longer)
        /** @type {HTMLVideoElement[]} */
        this.videos = [];

        this.init();
    }

    init() {
        if (!this.slides.length) return;

        // Collect all videos but don't play them yet
        this.slides.forEach((slide) => {
            const video = /** @type {HTMLVideoElement | null} */ (slide.querySelector('.slide-video'));
            if (video) {
                this.videos.push(video);
                
                // Pause video initially
                video.pause();
                
                // Handle video end event for first slide
                video.addEventListener('ended', () => {
                    if (slide.classList.contains('active')) {
                        this.nextSlide();
                    }
                });
            }
        });

        // Set up indicator event listeners
        this.indicators.forEach((/** @type {HTMLElement} */ indicator, /** @type {number} */ index) => {
            indicator.addEventListener('click', () => {
                const direction = index > this.currentSlide ? 'right' : 'left';
                this.goToSlide(index, direction);
            });
        });

        // Set up gesture controls
        this.initGestureControls();

        // DON'T start autoplay yet - wait for loader to complete
        // Start will be triggered by loader completion event

        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    /**
     * Initialize touch and trackpad gesture controls
     */
    initGestureControls() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        // Touch events for mobile
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleGesture(touchStartX, touchEndX, touchStartY, touchEndY);
        }, { passive: true });

        // Mouse wheel events for trackpad (horizontal scroll)
        this.carousel.addEventListener('wheel', (e) => {
            // Detect horizontal scroll on trackpad
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                
                // Throttle to prevent multiple triggers
                if (!this.wheelThrottle) {
                    this.wheelThrottle = true;
                    
                    if (e.deltaX > 30) {
                        // Swipe left - go to next slide
                        this.nextSlide();
                    } else if (e.deltaX < -30) {
                        // Swipe right - go to previous slide
                        this.prevSlide();
                    }
                    
                    setTimeout(() => {
                        this.wheelThrottle = false;
                    }, 800);
                }
            }
        }, { passive: false });
    }

    /**
     * Handle swipe gestures
     * @param {number} startX
     * @param {number} endX
     * @param {number} startY
     * @param {number} endY
     */
    handleGesture(startX, endX, startY, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.prevSlide();
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                }
            }
        }
    }
    /**
     * @param {number} index
     * @param {string} direction
     */
    goToSlide(index, direction = 'right') {
        const oldIndex = this.currentSlide;
        
        if (oldIndex === index) return;

        // Pause old slide video if exists
        const oldSlide = this.slides[oldIndex];
        const oldVideo = /** @type {HTMLVideoElement | null} */ (oldSlide ? oldSlide.querySelector('.slide-video') : null);
        if (oldVideo) {
            oldVideo.pause();
        }

        // Play new slide video if exists
        const newSlide = this.slides[index];
        const newVideo = /** @type {HTMLVideoElement | null} */ (newSlide ? newSlide.querySelector('.slide-video') : null);
        if (newVideo) {
            newVideo.currentTime = 0;
            newVideo.play().catch((/** @type {any} */ e) => console.log('Video autoplay prevented:', e));
        }

        // Update indicators
        this.indicators.forEach((/** @type {HTMLElement} */ indicator) => {
            indicator.classList.remove('active');
        });
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }

        // Animate slides based on direction
        if (direction === 'right') {
            // Moving to next slide (slide in from right)
            const oldSlide = this.slides[oldIndex];
            const newSlide = this.slides[index];
            
            if (oldSlide) {
                oldSlide.classList.remove('active');
                oldSlide.classList.add('left');
            }
            
            if (newSlide) {
                newSlide.classList.remove('left', 'right');
                newSlide.classList.add('right');
                
                // Trigger reflow
                setTimeout(() => {
                    newSlide.classList.remove('right');
                    newSlide.classList.add('active');
                }, 10);
            }
        } else {
            // Moving to previous slide (slide in from left)
            const oldSlide = this.slides[oldIndex];
            const newSlide = this.slides[index];
            
            if (oldSlide) {
                oldSlide.classList.remove('active');
                oldSlide.classList.add('right');
            }
            
            if (newSlide) {
                newSlide.classList.remove('left', 'right');
                newSlide.classList.add('left');
                
                // Trigger reflow
                setTimeout(() => {
                    newSlide.classList.remove('left');
                    newSlide.classList.add('active');
                }, 10);
            }
        }

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex, 'right');
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex, 'left');
    }

    startAutoPlay() {
        // Don't restart if already running
        if (this.autoPlayInterval) return;
        
        // Use longer delay for slide 1, regular delay for others
        const delay = this.currentSlide === 0 ? this.slide1Delay : this.autoPlayDelay;
        
        this.autoPlayInterval = setTimeout(() => {
            this.nextSlide();
            // After moving to next slide, restart with appropriate interval
            this.autoPlayInterval = null;
            this.startAutoPlay();
        }, delay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearTimeout(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    /**
     * Start the carousel after loader completes
     * Plays the first slide video and starts autoplay
     */
    startAfterLoader() {
        // Play first slide video if exists
        const firstSlide = this.slides[0];
        if (firstSlide) {
            const firstVideo = /** @type {HTMLVideoElement | null} */ (firstSlide.querySelector('.slide-video'));
            if (firstVideo) {
                firstVideo.currentTime = 0;
                firstVideo.play().catch((/** @type {any} */ e) => console.log('Video autoplay prevented:', e));
            }
        }
        
        // Start the autoplay timer
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const carouselElement = /** @type {HTMLElement | null} */ (document.querySelector('.hero-carousel-wrapper'));
        let carouselInstance = null;
        
        if (carouselElement) {
            carouselInstance = new HeroCarouselCustom(carouselElement);
        }
        
        // Wait for loader to complete before starting carousel
        const loader = document.getElementById('fullscreen-loader');
        if (loader && carouselInstance) {
            // Listen for when loader is hidden
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target instanceof HTMLElement && 
                        mutation.target.classList.contains('loaded')) {
                        // Loader is done, start the carousel after a brief delay
                        setTimeout(() => {
                            if (carouselInstance) {
                                carouselInstance.startAfterLoader();
                            }
                        }, 500);
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(loader, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        } else if (carouselInstance) {
            // No loader present, start immediately
            carouselInstance.startAfterLoader();
        }
        
        // Add page-just-loaded class for one-time animations
        // Only on homepage index page
        if (document.body.classList.contains('page-type-index')) {
            document.body.classList.add('page-just-loaded');
            
            // Remove class after animations complete (8 seconds total)
            setTimeout(() => {
                document.body.classList.remove('page-just-loaded');
            }, 8000);
        }
    });
}
