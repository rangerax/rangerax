// Polyfills for IE11+ support
(function() {
    // Element.matches polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    // Element.closest polyfill
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    // Array.from polyfill
    if (!Array.from) {
        Array.from = function(arrayLike) {
            var array = [];
            for (var i = 0; i < arrayLike.length; i++) {
                array.push(arrayLike[i]);
            }
            return array;
        };
    }

    // window.matchMedia polyfill for IE
    if (!window.matchMedia) {
        window.matchMedia = function() {
            return {
                matches: false,
                addListener: function() {},
                removeListener: function() {}
            };
        };
    }
})();


// Event listener cleanup registry
const EventListenerRegistry = {
    listeners: [],
    
    add: function(element, event, handler, options) {
        if (!element || typeof element.addEventListener !== 'function') {
            // Invalid element for event listener
            return false;
        }
        
        try {
            element.addEventListener(event, handler, options);
            this.listeners.push({ element: element, event: event, handler: handler, options: options });
            return true;
        } catch (error) {
            // Error adding event listener
            return false;
        }
    },
    
    remove: function(element, event, handler, options) {
        try {
            element.removeEventListener(event, handler, options);
            this.listeners = this.listeners.filter(function(listener) {
                return !(listener.element === element && listener.event === event && listener.handler === handler);
            });
        } catch (error) {
            // Error removing event listener
        }
    },
    
    removeAll: function() {
        this.listeners.forEach(function(listener) {
            try {
                listener.element.removeEventListener(listener.event, listener.handler, listener.options);
            } catch (error) {
                // Error removing event listener during cleanup
            }
        });
        this.listeners = [];
    }
};

// Focus management utility for accessibility
const FocusManager = {
    previousFocus: null,
    
    saveFocus: function() {
        this.previousFocus = document.activeElement;
    },
    
    restoreFocus: function() {
        if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
            try {
                this.previousFocus.focus();
            } catch (error) {
                // Focus restoration failed
            }
        }
    },
    
    trapFocus: function(container) {
        if (!container) return;
        
        var focusableElements = container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
        );
        
        if (focusableElements.length === 0) return;
        
        var firstElement = focusableElements[0];
        var lastElement = focusableElements[focusableElements.length - 1];
        
        function handleTabKey(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        EventListenerRegistry.add(container, 'keydown', handleTabKey);
        
        // Focus first element
        try {
            firstElement.focus();
        } catch (error) {
            // Focus management failed
        }
    }
};

// Image preloader utility
const ImagePreloader = {
    cache: new Map(),
    
    preload: function(src) {
        return new Promise(function(resolve, reject) {
            if (!src) {
                reject(new Error('No image source provided'));
                return;
            }
            
            // Check cache first
            if (ImagePreloader.cache.has(src)) {
                resolve(ImagePreloader.cache.get(src));
                return;
            }
            
            var img = new Image();
            
            img.onload = function() {
                ImagePreloader.cache.set(src, img);
                resolve(img);
            };
            
            img.onerror = function() {
                reject(new Error('Failed to load image: ' + src));
            };
            
            img.src = src;
        });
    },
    
    preloadBatch: function(sources) {
        if (!Array.isArray(sources)) {
            // Image sources must be an array
            return Promise.resolve([]);
        }
        
        var promises = sources.map(function(src) {
            return ImagePreloader.preload(src).catch(function(error) {
                return null;
            });
        });
        
        return Promise.all(promises);
    }
};

// Safe DOM utility functions
const DOMUtils = {
    safeGetElement: function(selector) {
        try {
            var element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            return element;
        } catch (error) {
            // Error getting element
            return null;
        }
    },
    
    safeGetElements: function(selector) {
        try {
            var elements = document.querySelectorAll(selector);
            return Array.from(elements);
        } catch (error) {
            // Error getting elements
            return [];
        }
    },
    
    safeSetAttribute: function(element, attribute, value) {
        if (!element || typeof element.setAttribute !== 'function') {
            return false;
        }
        
        try {
            element.setAttribute(attribute, value);
            return true;
        } catch (error) {
            // Error setting attribute
            return false;
        }
    },
    
    safeAddClass: function(element, className) {
        if (!element || !element.classList) {
            return false;
        }
        
        try {
            element.classList.add(className);
            return true;
        } catch (error) {
            // Error adding class
            return false;
        }
    },
    
    safeRemoveClass: function(element, className) {
        if (!element || !element.classList) {
            return false;
        }
        
        try {
            element.classList.remove(className);
            return true;
        } catch (error) {
            // Error removing class
            return false;
        }
    },
    
    safeToggleClass: function(element, className) {
        if (!element || !element.classList) {
            return false;
        }
        
        try {
            return element.classList.toggle(className);
        } catch (error) {
            // Error toggling class
            return false;
        }
    }
};

// Gallery data for LightGallery
const galleryImages = [
    {
        src: 'images/gallery/2700rackwith3x600inserts.jpg',
        title: 'Original RANGERAX 2700 - 3x600 Target Configuration',
        description: '2700 rack with 3x600 wide removable target inserts.'
    },
    {
        src: 'images/gallery/2700rackwith2x600inserts.jpg',
        title: 'Original RANGERAX 2700 - 2x600 Target Configuration',
        description: '2700 rack with 2x600 wide removable target inserts for spacing between shooters.'
    },
    {
        src: 'images/gallery/2700rackwith2x750inserts.jpg',
        title: 'Original RANGERAX 2700 - 2x750 Target Configuration',
        description: '2700 rack with 2x750 wide removable target inserts. The larger 750 wide target frames reduce the likelihood of off target shoots striking the timber frame especially if firing larger calibres.'
    },
    {
        src: 'images/gallery/2700RackLinkExample.jpg',
        title: 'Original RANGERAX 2700 Linking Option',
        description: 'Multiple 2700 racks can be linked together with increase spacing between targets and shooters.'
    },
    {
        src: 'images/gallery/2700sideonview.jpg',
        title: 'Original RANGERAX 2700 Side On',
        description: '2700 rack side on view.'
    },
    {
        src: 'images/gallery/600750sidebyside.jpg',
        title: 'Mobile RANGERAX Standalone 600 and 750 Racks',
        description: 'Standalone 600 and 750 wide racks, ideal for various competition and practices where targets need to be offset or place at various distances.'
    },
    {
        src: 'images/gallery/600basecloseup.jpg',
        title: 'Mobile RANGERAX 600 Standalone Rack Base Closeup',
        description: 'Closeup of the 600 rack base without target frame insert.'
    },
    {
        src: 'images/gallery/750basecloseup.jpg',
        title: 'Mobile RANGERAX 750 Standalone Rack Base Closeup',
        description: 'Closeup of the 750 rack base without target frame insert. The larger 750 wide target frames reduce the likelihood of off target shoots striking the timber frame especially if firing larger calibres.'
    },
    {
        src: 'images/gallery/customexample1.jpg',
        title: 'Custom Built Target Racks',
        description: 'Custom built target racks for a local range requiring an additional lower target area for prone shooting.'
    },
    {
        src: 'images/gallery/originalrangeraxinuse.jpg',
        title: 'Original Rangerax with 600 wide target inserts in use',
        description: 'Original Rangerax with 600 wide target inserts in use at a local range.'
    }
];

// Custom Lightbox Variables
let currentImageIndex = 0;
let isLightboxOpen = false;

// Initialize Custom Gallery
function initializeCustomGallery() {
    try {
        const galleryContainer = DOMUtils.safeGetElement('#gallery');
        if (!galleryContainer) {
            return false;
        }

        // Clear existing content
        galleryContainer.innerHTML = '';

        // Generate gallery items
        galleryImages.forEach(function(image, index) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-index', index);
            item.setAttribute('aria-label', image.title);

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.title;
            img.className = 'gallery-thumbnail';
            img.loading = 'lazy';

            item.appendChild(img);
            galleryContainer.appendChild(item);

            // Add click event listener
            item.addEventListener('click', function() {
                openLightbox(index);
            });

            // Add keyboard support
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        return true;
    } catch (error) {
        console.error('Error initializing custom gallery:', error);
        return false;
    }
}

// Open Lightbox Function
function openLightbox(index) {
    try {
        if (index < 0 || index >= galleryImages.length) {
            return false;
        }

        currentImageIndex = index;
        isLightboxOpen = true;

        const lightbox = DOMUtils.safeGetElement('#custom-lightbox');
        const lightboxImage = DOMUtils.safeGetElement('#lightbox-image');
        const lightboxTitle = DOMUtils.safeGetElement('#lightbox-title');
        const lightboxDescription = DOMUtils.safeGetElement('#lightbox-description');
        const lightboxCurrent = DOMUtils.safeGetElement('#lightbox-current');
        const lightboxTotal = DOMUtils.safeGetElement('#lightbox-total');

        if (!lightbox || !lightboxImage) {
            return false;
        }

        // Update lightbox content
        const currentImage = galleryImages[index];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.title;

        if (lightboxTitle) lightboxTitle.textContent = currentImage.title;
        if (lightboxDescription) lightboxDescription.textContent = currentImage.description;
        if (lightboxCurrent) lightboxCurrent.textContent = index + 1;
        if (lightboxTotal) lightboxTotal.textContent = galleryImages.length;

        // Show lightbox
        lightbox.style.display = 'flex';
        DOMUtils.safeRemoveClass(lightbox, 'hiding');
        DOMUtils.safeAddClass(lightbox, 'showing');
        DOMUtils.safeSetAttribute(lightbox, 'aria-hidden', 'false');

        // Prevent body scroll
        DOMUtils.safeAddClass(document.body, 'lightbox-open');

        // Focus management
        FocusManager.saveFocus();
        FocusManager.trapFocus(lightbox);

        // Add event listeners
        addLightboxEventListeners();

        // Preload adjacent images
        preloadAdjacentImages(index);

        return true;
    } catch (error) {
        console.error('Error opening lightbox:', error);
        return false;
    }
}

// Close Lightbox Function
function closeLightbox() {
    try {
        const lightbox = DOMUtils.safeGetElement('#custom-lightbox');
        if (!lightbox || !isLightboxOpen) {
            return false;
        }

        isLightboxOpen = false;

        // Hide lightbox with animation
        DOMUtils.safeRemoveClass(lightbox, 'showing');
        DOMUtils.safeAddClass(lightbox, 'hiding');
        DOMUtils.safeSetAttribute(lightbox, 'aria-hidden', 'true');

        // Restore body scroll
        DOMUtils.safeRemoveClass(document.body, 'lightbox-open');

        // Restore focus
        FocusManager.restoreFocus();

        // Remove event listeners
        removeLightboxEventListeners();

        // Hide after animation
        setTimeout(function() {
            lightbox.style.display = 'none';
            DOMUtils.safeRemoveClass(lightbox, 'hiding');
        }, 300);

        return true;
    } catch (error) {
        console.error('Error closing lightbox:', error);
        return false;
    }
}

// Navigate to Previous Image
function showPreviousImage() {
    if (!isLightboxOpen) return;
    
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    updateLightboxImage(newIndex);
}

// Navigate to Next Image
function showNextImage() {
    if (!isLightboxOpen) return;
    
    const newIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    updateLightboxImage(newIndex);
}

// Update Lightbox Image
function updateLightboxImage(index) {
    try {
        if (index < 0 || index >= galleryImages.length) {
            return false;
        }

        currentImageIndex = index;
        const currentImage = galleryImages[index];

        const lightboxImage = DOMUtils.safeGetElement('#lightbox-image');
        const lightboxTitle = DOMUtils.safeGetElement('#lightbox-title');
        const lightboxDescription = DOMUtils.safeGetElement('#lightbox-description');
        const lightboxCurrent = DOMUtils.safeGetElement('#lightbox-current');

        if (lightboxImage) {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.title;
        }

        if (lightboxTitle) lightboxTitle.textContent = currentImage.title;
        if (lightboxDescription) lightboxDescription.textContent = currentImage.description;
        if (lightboxCurrent) lightboxCurrent.textContent = index + 1;

        // Preload adjacent images
        preloadAdjacentImages(index);

        return true;
    } catch (error) {
        console.error('Error updating lightbox image:', error);
        return false;
    }
}

// Preload Adjacent Images
function preloadAdjacentImages(index) {
    try {
        const prevIndex = index > 0 ? index - 1 : galleryImages.length - 1;
        const nextIndex = index < galleryImages.length - 1 ? index + 1 : 0;

        const imagesToPreload = [
            galleryImages[prevIndex].src,
            galleryImages[nextIndex].src
        ];

        ImagePreloader.preloadBatch(imagesToPreload);
    } catch (error) {
        console.error('Error preloading adjacent images:', error);
    }
}

// Lightbox Event Handlers
let lightboxKeyHandler;
let lightboxCloseHandler;
let lightboxPrevHandler;
let lightboxNextHandler;
let lightboxOverlayHandler;

function addLightboxEventListeners() {
    // Keyboard navigation
    lightboxKeyHandler = function(e) {
        if (!isLightboxOpen) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPreviousImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
        }
    };

    // Close button
    lightboxCloseHandler = function() {
        closeLightbox();
    };

    // Previous button
    lightboxPrevHandler = function() {
        showPreviousImage();
    };

    // Next button
    lightboxNextHandler = function() {
        showNextImage();
    };

    // Overlay click
    lightboxOverlayHandler = function(e) {
        if (e.target.classList.contains('lightbox-overlay')) {
            closeLightbox();
        }
    };

    // Add event listeners
    EventListenerRegistry.add(document, 'keydown', lightboxKeyHandler);
    
    const closeBtn = DOMUtils.safeGetElement('.lightbox-close');
    const prevBtn = DOMUtils.safeGetElement('.lightbox-prev');
    const nextBtn = DOMUtils.safeGetElement('.lightbox-next');
    const overlay = DOMUtils.safeGetElement('.lightbox-overlay');

    if (closeBtn) EventListenerRegistry.add(closeBtn, 'click', lightboxCloseHandler);
    if (prevBtn) EventListenerRegistry.add(prevBtn, 'click', lightboxPrevHandler);
    if (nextBtn) EventListenerRegistry.add(nextBtn, 'click', lightboxNextHandler);
    if (overlay) EventListenerRegistry.add(overlay, 'click', lightboxOverlayHandler);
}

function removeLightboxEventListeners() {
    // Remove event listeners
    const closeBtn = DOMUtils.safeGetElement('.lightbox-close');
    const prevBtn = DOMUtils.safeGetElement('.lightbox-prev');
    const nextBtn = DOMUtils.safeGetElement('.lightbox-next');
    const overlay = DOMUtils.safeGetElement('.lightbox-overlay');

    if (lightboxKeyHandler) EventListenerRegistry.remove(document, 'keydown', lightboxKeyHandler);
    if (closeBtn && lightboxCloseHandler) EventListenerRegistry.remove(closeBtn, 'click', lightboxCloseHandler);
    if (prevBtn && lightboxPrevHandler) EventListenerRegistry.remove(prevBtn, 'click', lightboxPrevHandler);
    if (nextBtn && lightboxNextHandler) EventListenerRegistry.remove(nextBtn, 'click', lightboxNextHandler);
    if (overlay && lightboxOverlayHandler) EventListenerRegistry.remove(overlay, 'click', lightboxOverlayHandler);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize header scroll effect with error handling
    const header = DOMUtils.safeGetElement('#header');
    
    // Theme toggle functionality with SVG icons and error handling
    const themeSwitcher = DOMUtils.safeGetElement('#theme-switcher');
    const sunIcon = DOMUtils.safeGetElement('#sun-icon');
    const moonIcon = DOMUtils.safeGetElement('#moon-icon');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to handle SVG logo theme adaptation with error handling
    function updateLogoForTheme() {
        try {
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const heroLogo = DOMUtils.safeGetElement('.theme-adaptive-logo');
            const headerLogo = DOMUtils.safeGetElement('.logo-svg');
            
            if (heroLogo) {
                if (currentTheme === 'dark') {
                    DOMUtils.safeAddClass(heroLogo, 'dark-theme');
                    DOMUtils.safeRemoveClass(heroLogo, 'light-theme');
                } else {
                    DOMUtils.safeAddClass(heroLogo, 'light-theme');
                    DOMUtils.safeRemoveClass(heroLogo, 'dark-theme');
                }
            }
            
            if (headerLogo) {
                if (currentTheme === 'dark') {
                    DOMUtils.safeAddClass(headerLogo, 'dark-theme');
                    DOMUtils.safeRemoveClass(headerLogo, 'light-theme');
                } else {
                    DOMUtils.safeAddClass(headerLogo, 'light-theme');
                    DOMUtils.safeRemoveClass(headerLogo, 'dark-theme');
                }
            }
        } catch (error) {
            // Error updating logo theme
        }
    }
    
    // Function to update theme toggle icons with error handling
    function updateThemeIcons(theme) {
        try {
            if (!sunIcon || !moonIcon) {
                return;
            }
            
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                // Update ARIA label for accessibility
                if (themeSwitcher) {
                    DOMUtils.safeSetAttribute(themeSwitcher, 'aria-label', 'Switch to light mode');
                }
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
                // Update ARIA label for accessibility
                if (themeSwitcher) {
                    DOMUtils.safeSetAttribute(themeSwitcher, 'aria-label', 'Switch to dark mode');
                }
            }
        } catch (error) {
            // Error updating theme icons
        }
    }
    
    // Check for saved theme preference or default to dark mode with error handling
    let currentTheme;
    try {
        currentTheme = localStorage.getItem('theme') || 'dark';
    } catch (error) {
        currentTheme = 'dark';
    }
    
    // Set initial theme with error handling
    try {
        DOMUtils.safeSetAttribute(document.body, 'data-theme', currentTheme);
        updateThemeIcons(currentTheme);
        updateLogoForTheme();
    } catch (error) {
        // Error setting initial theme
    }
    
    // Toggle theme on button click with proper error handling and accessibility
    if (themeSwitcher) {
        function handleThemeToggle() {
            try {
                let newTheme;
                
                if (document.body.getAttribute('data-theme') === 'dark') {
                    newTheme = 'light';
                } else {
                    newTheme = 'dark';
                }
                
                DOMUtils.safeSetAttribute(document.body, 'data-theme', newTheme);
                
                // Save to localStorage with error handling
                try {
                    localStorage.setItem('theme', newTheme);
                } catch (storageError) {
                    // Storage not available
                }
                
                // Update the icons and logo when theme changes
                updateThemeIcons(newTheme);
                updateLogoForTheme();
                
                // Announce theme change to screen readers
                const announcement = 'Theme switched to ' + newTheme + ' mode';
                announceToScreenReader(announcement);
                
            } catch (error) {
                // Error toggling theme
            }
        }
        
        EventListenerRegistry.add(themeSwitcher, 'click', handleThemeToggle);
        
        // Add keyboard support for theme toggle
        EventListenerRegistry.add(themeSwitcher, 'keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleThemeToggle();
            }
        });
    }
    
    // Screen reader announcement utility
    function announceToScreenReader(message) {
        try {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            // Remove after announcement
            setTimeout(function() {
                if (announcement.parentNode) {
                    announcement.parentNode.removeChild(announcement);
                }
            }, 1000);
        } catch (error) {
            // Screen reader announcement failed
        }
    }
    
    // Mobile menu toggle with enhanced error handling and accessibility
    const menuToggle = DOMUtils.safeGetElement('#menuToggle');
    const mobileNav = DOMUtils.safeGetElement('#mobileNav');
    
    // Enhanced error handling for missing elements
    if (!menuToggle || !mobileNav) {
        // Mobile navigation not available
    } else {
        // Function to close mobile menu with accessibility support
        function closeMobileMenu() {
            try {
                DOMUtils.safeRemoveClass(mobileNav, 'active');
                DOMUtils.safeRemoveClass(menuToggle, 'active');
                DOMUtils.safeSetAttribute(menuToggle, 'aria-expanded', 'false');
                
                // Restore focus management
                FocusManager.restoreFocus();
                
                // Announce to screen readers
                announceToScreenReader('Menu closed');
                
            } catch (error) {
                // Error closing mobile menu
            }
        }
        
        // Function to open mobile menu with accessibility support
        function openMobileMenu() {
            try {
                DOMUtils.safeAddClass(mobileNav, 'active');
                DOMUtils.safeAddClass(menuToggle, 'active');
                DOMUtils.safeSetAttribute(menuToggle, 'aria-expanded', 'true');
                
                // Save current focus and trap focus in menu
                FocusManager.saveFocus();
                FocusManager.trapFocus(mobileNav);
                
                // Announce to screen readers
                announceToScreenReader('Menu opened');
                
            } catch (error) {
                // Error opening mobile menu
            }
        }
        
        // Handle menu toggle with improved accessibility
        function handleMenuToggle() {
            try {
                const isActive = mobileNav.classList.contains('active');
                
                if (isActive) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            } catch (error) {
                // Error toggling mobile menu
            }
        }
        
        // Add event listeners with registry for cleanup
        EventListenerRegistry.add(menuToggle, 'click', handleMenuToggle);
        
        // Add keyboard support for menu toggle
        EventListenerRegistry.add(menuToggle, 'keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMenuToggle();
            } else if (e.key === 'Escape') {
                if (mobileNav.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
        
        // Close mobile menu when clicking a link with enhanced error handling
        const mobileLinks = DOMUtils.safeGetElements('.mobile-nav-links a');
        mobileLinks.forEach(function(link) {
            if (link) {
                EventListenerRegistry.add(link, 'click', function() {
                    closeMobileMenu();
                });
                
                // Add keyboard support for menu links
                EventListenerRegistry.add(link, 'keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeMobileMenu();
                    }
                });
            }
        });
        
        // Close mobile menu on window resize to desktop size with debouncing
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                try {
                    if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                        closeMobileMenu();
                    }
                } catch (error) {
                    // Error handling resize
                }
            }, 150);
        }
        
        EventListenerRegistry.add(window, 'resize', handleResize);
        
        // Close menu when clicking outside
        EventListenerRegistry.add(document, 'click', function(e) {
            try {
                if (mobileNav.classList.contains('active') && 
                    !mobileNav.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            } catch (error) {
                // Error handling outside click
            }
        });
    }
    
    // Header scroll effect with performance optimization and error handling
    let scrollTimeout;
    let isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                try {
                    // Handle header scroll effect
                    if (header) {
                        if (window.scrollY > 50) {
                            DOMUtils.safeAddClass(header, 'scrolled');
                        } else {
                            DOMUtils.safeRemoveClass(header, 'scrolled');
                        }
                    }
                    
                    // Animate elements when they enter viewport with performance optimization
                    const fadeElements = DOMUtils.safeGetElements('.fade-in');
                    fadeElements.forEach(function(element) {
                        if (!element) return;
                        
                        try {
                            const rect = element.getBoundingClientRect();
                            const elementTop = rect.top;
                            const elementBottom = rect.bottom;
                            const isVisible = elementTop < window.innerHeight - 100 && elementBottom > 0;
                            
                            if (isVisible && !element.classList.contains('active')) {
                                DOMUtils.safeAddClass(element, 'active');
                                
                                // Announce to screen readers when content becomes visible
                                const elementText = element.textContent || element.getAttribute('aria-label') || 'Content';
                                announceToScreenReader(elementText + ' is now visible');
                            }
                        } catch (error) {
                            // Animation error ignored
                        }
                    });
                    
                    isScrolling = false;
                } catch (error) {
                    // Error in scroll handler
                    isScrolling = false;
                }
            });
            
            isScrolling = true;
        }
    }
    
    // Throttled scroll handler for better performance
    function throttledScrollHandler() {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(function() {
            handleScroll();
            scrollTimeout = null;
        }, 16); // ~60fps
    }
    
    EventListenerRegistry.add(window, 'scroll', throttledScrollHandler, { passive: true });
    
    // Trigger initial scroll to activate visible elements with error handling
    try {
        handleScroll();
    } catch (error) {
        // Error in initial scroll handler
    }
    
    // Smooth scrolling for anchor links with enhanced error handling and accessibility
    const anchorLinks = DOMUtils.safeGetElements('a[href^="#"]');
    anchorLinks.forEach(function(anchor) {
        if (!anchor) return;
        
        function handleAnchorClick(e) {
            try {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                // Close mobile menu if open
                if (mobileNav && mobileNav.classList.contains('active')) {
                    closeMobileMenu();
                }
                
                const targetElement = DOMUtils.safeGetElement(targetId);
                if (targetElement) {
                    // Calculate scroll position accounting for header
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Use modern smooth scrolling with fallback
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        // Polyfill for older browsers
                        smoothScrollTo(targetPosition, 500);
                    }
                    
                    // Set focus to target element for accessibility
                    setTimeout(function() {
                        try {
                            // Make target focusable temporarily
                            const originalTabIndex = targetElement.getAttribute('tabindex');
                            targetElement.setAttribute('tabindex', '-1');
                            targetElement.focus();
                            
                            // Restore original tabindex after focus
                            setTimeout(function() {
                                if (originalTabIndex !== null) {
                                    targetElement.setAttribute('tabindex', originalTabIndex);
                                } else {
                                    targetElement.removeAttribute('tabindex');
                                }
                            }, 100);
                            
                            // Announce navigation to screen readers
                            const sectionName = targetElement.getAttribute('aria-label') || 
                                              targetElement.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 
                                              'Section';
                            announceToScreenReader('Navigated to ' + sectionName);
                            
                        } catch (focusError) {
                            // Focus management failed
                        }
                    }, 600); // Wait for scroll to complete
                }
            } catch (error) {
                // Error handling anchor click
            }
        }
        
        EventListenerRegistry.add(anchor, 'click', handleAnchorClick);
    });
    
    // Smooth scroll polyfill for older browsers
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const difference = targetY - startY;
        const startTime = performance.now();
        
        function step() {
            try {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-in-out)
                const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                
                window.scrollTo(0, startY + difference * ease);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            } catch (error) {
                // Error in smooth scroll polyfill
            }
        }
        
        requestAnimationFrame(step);
    }

    // Initialize Custom Gallery
    initializeCustomGallery();

    // Initialize random hero background with gallery image
    function initializeHeroBackground() {
        try {
            const heroSection = DOMUtils.safeGetElement('.hero');
            if (!heroSection || !galleryImages || galleryImages.length === 0) {
                return;
            }
            
            // Select random image from gallery
            const randomIndex = Math.floor(Math.random() * galleryImages.length);
            const randomImage = galleryImages[randomIndex];
            
            if (randomImage && randomImage.src) {
                // Preload the image for better performance
                ImagePreloader.preload(randomImage.src)
                    .then(function(img) {
                        // Set the background image on the hero::before pseudo-element
                        heroSection.style.setProperty('--hero-bg-image', 'url(' + randomImage.src + ')');
                        
                        // Add CSS rule to apply the background image
                        if (!document.getElementById('hero-bg-style')) {
                            const style = document.createElement('style');
                            style.id = 'hero-bg-style';
                            style.textContent = '.hero::before { background-image: var(--hero-bg-image); }';
                            document.head.appendChild(style);
                        }
                        
                        // Add accessibility description
                        DOMUtils.safeSetAttribute(heroSection, 'aria-describedby', 'hero-bg-description');
                        
                        // Create hidden description for screen readers
                        let bgDescription = DOMUtils.safeGetElement('#hero-bg-description');
                        if (!bgDescription) {
                            bgDescription = document.createElement('div');
                            bgDescription.id = 'hero-bg-description';
                            bgDescription.className = 'sr-only';
                            bgDescription.style.position = 'absolute';
                            bgDescription.style.left = '-10000px';
                            bgDescription.style.width = '1px';
                            bgDescription.style.height = '1px';
                            bgDescription.style.overflow = 'hidden';
                            document.body.appendChild(bgDescription);
                        }
                        bgDescription.textContent = 'Background image: ' + randomImage.title;
                        
                    })
                    .catch(function(error) {
                        // Failed to load hero background image
                    });
            }
        } catch (error) {
            // Error initializing hero background
        }
    }
    
    // Initialize random hero background
    initializeHeroBackground();
    
    // Cleanup functionality for memory leak prevention
    function cleanup() {
        try {
            // Clear all registered event listeners
            EventListenerRegistry.removeAll();
            
            // Clear image preloader cache
            if (ImagePreloader.cache) {
                ImagePreloader.cache.clear();
            }
            
            // Clear any pending timeouts
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }
            
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
                resizeTimeout = null;
            }
            
            // Reset state variables
            isGalleryInitialized = false;
            currentImageIndex = 0;
            isScrolling = false;
        } catch (error) {
            // Error during cleanup
        }
    }
    
    // Register cleanup on page unload
    EventListenerRegistry.add(window, 'beforeunload', cleanup);
    EventListenerRegistry.add(window, 'pagehide', cleanup);
    
    // Expose cleanup function globally for manual cleanup if needed
    window.RangeraxCleanup = cleanup;
    
    // Performance monitoring (optional - for debugging)
    if (typeof performance !== 'undefined' && performance.mark) {
        try {
            performance.mark('rangerax-js-end');
            performance.measure('rangerax-js-load', 'rangerax-js-start', 'rangerax-js-end');
            
            // Performance measurement completed
        } catch (error) {
            // Performance API not fully supported, ignore
        }
    }
    
    
    // RANGERAX JavaScript initialized successfully
});

// Mark performance start point
if (typeof performance !== 'undefined' && performance.mark) {
    try {
        performance.mark('rangerax-js-start');
    } catch (error) {
        // Performance API not supported, ignore
    }
}