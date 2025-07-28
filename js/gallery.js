// Gallery images are now loaded from gallery-config.js
// No need to edit this file to add/remove images!

// Custom Lightbox Variables
let currentImageIndex = 0;
let isLightboxOpen = false;

// Initialize Gallery
function initializeGallery() {
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
        console.error('Error initializing gallery:', error);
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

// Touch/swipe handling variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let lightboxTouchStartHandler;
let lightboxTouchEndHandler;

// Handle swipe gestures
function handleSwipeGesture() {
    const swipeThreshold = 50; // Minimum distance for a valid swipe
    const maxVerticalDistance = 100; // Maximum vertical movement to still count as horizontal swipe
    
    const horizontalDistance = touchEndX - touchStartX;
    const verticalDistance = Math.abs(touchEndY - touchStartY);
    
    // Only process if it's primarily a horizontal swipe
    if (Math.abs(horizontalDistance) > swipeThreshold && verticalDistance < maxVerticalDistance) {
        if (horizontalDistance > 0) {
            // Swipe right - go to previous image
            showPreviousImage();
        } else {
            // Swipe left - go to next image
            showNextImage();
        }
    }
}

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

    // Touch handlers for swipe gestures
    lightboxTouchStartHandler = function(e) {
        if (!isLightboxOpen) return;
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    };

    lightboxTouchEndHandler = function(e) {
        if (!isLightboxOpen) return;
        
        const touch = e.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        handleSwipeGesture();
    };

    // Add event listeners
    EventListenerRegistry.add(document, 'keydown', lightboxKeyHandler);
    
    const closeBtn = DOMUtils.safeGetElement('.lightbox-close');
    const prevBtn = DOMUtils.safeGetElement('.lightbox-prev');
    const nextBtn = DOMUtils.safeGetElement('.lightbox-next');
    const overlay = DOMUtils.safeGetElement('.lightbox-overlay');
    const lightboxContent = DOMUtils.safeGetElement('.lightbox-content');

    if (closeBtn) EventListenerRegistry.add(closeBtn, 'click', lightboxCloseHandler);
    if (prevBtn) EventListenerRegistry.add(prevBtn, 'click', lightboxPrevHandler);
    if (nextBtn) EventListenerRegistry.add(nextBtn, 'click', lightboxNextHandler);
    if (overlay) EventListenerRegistry.add(overlay, 'click', lightboxOverlayHandler);
    
    // Add touch event listeners for swipe gestures
    if (lightboxContent) {
        EventListenerRegistry.add(lightboxContent, 'touchstart', lightboxTouchStartHandler, { passive: true });
        EventListenerRegistry.add(lightboxContent, 'touchend', lightboxTouchEndHandler, { passive: true });
    }
}

function removeLightboxEventListeners() {
    // Remove event listeners
    const closeBtn = DOMUtils.safeGetElement('.lightbox-close');
    const prevBtn = DOMUtils.safeGetElement('.lightbox-prev');
    const nextBtn = DOMUtils.safeGetElement('.lightbox-next');
    const overlay = DOMUtils.safeGetElement('.lightbox-overlay');
    const lightboxContent = DOMUtils.safeGetElement('.lightbox-content');

    if (lightboxKeyHandler) EventListenerRegistry.remove(document, 'keydown', lightboxKeyHandler);
    if (closeBtn && lightboxCloseHandler) EventListenerRegistry.remove(closeBtn, 'click', lightboxCloseHandler);
    if (prevBtn && lightboxPrevHandler) EventListenerRegistry.remove(prevBtn, 'click', lightboxPrevHandler);
    if (nextBtn && lightboxNextHandler) EventListenerRegistry.remove(nextBtn, 'click', lightboxNextHandler);
    if (overlay && lightboxOverlayHandler) EventListenerRegistry.remove(overlay, 'click', lightboxOverlayHandler);
    
    // Remove touch event listeners
    if (lightboxContent && lightboxTouchStartHandler) {
        EventListenerRegistry.remove(lightboxContent, 'touchstart', lightboxTouchStartHandler);
    }
    if (lightboxContent && lightboxTouchEndHandler) {
        EventListenerRegistry.remove(lightboxContent, 'touchend', lightboxTouchEndHandler);
    }
}

// Export gallery functions for external use
window.Gallery = {
    initialize: initializeGallery,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
    showPreviousImage: showPreviousImage,
    showNextImage: showNextImage
};