document.addEventListener('DOMContentLoaded', function() {
    // Initialize header scroll effect
    const header = document.getElementById('header');
    
    // Theme toggle functionality with SVG icons
    const themeSwitcher = document.getElementById('theme-switcher');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to handle SVG logo theme adaptation
    function updateLogoForTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const heroLogo = document.querySelector('.theme-adaptive-logo');
        const headerLogo = document.querySelector('.logo-svg');
        
        if (heroLogo) {
            if (currentTheme === 'dark') {
                heroLogo.classList.add('dark-theme');
                heroLogo.classList.remove('light-theme');
            } else {
                heroLogo.classList.add('light-theme');
                heroLogo.classList.remove('dark-theme');
            }
        }
        
        if (headerLogo) {
            if (currentTheme === 'dark') {
                headerLogo.classList.add('dark-theme');
                headerLogo.classList.remove('light-theme');
            } else {
                headerLogo.classList.add('light-theme');
                headerLogo.classList.remove('dark-theme');
            }
        }
    }
    
    // Function to update theme toggle icons
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);
    
    // Initialize logo theme
    updateLogoForTheme();
    
    // Toggle theme on button click
    themeSwitcher.addEventListener('click', function() {
        let newTheme;
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            newTheme = 'light';
        } else {
            newTheme = 'dark';
        }
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update the icons and logo when theme changes
        updateThemeIcons(newTheme);
        updateLogoForTheme();
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    menuToggle.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
        });
    });
    
    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animate elements when they enter viewport
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = elementTop < window.innerHeight - 100 && elementBottom > 0;
            
            if (isVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger initial scroll to activate visible elements
    handleScroll();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Close mobile menu if open
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Product Gallery Functionality
    const galleryImages = [
        {
            src: 'images/gallery/2700rackwith3x600inserts.jpg',
            title: 'Original RangeRax 2700 - 3x600 Target Configuration',
            description: '2700 rack with 3x600 wide removable target inserts.'
        },
        {
            src: 'images/gallery/2700rackwith2x600inserts.jpg',
            title: 'Original RangeRax 2700 - 2x600 Target Configuration',
            description: '2700 rack with 2x600 wide removable target inserts for spacing between shooters.'
        },
        {
            src: 'images/gallery/2700rackwith2x750inserts.jpg',
            title: 'Original RangeRax 2700 - 2x750 Target Configuration',
            description: '2700 rack with 2x7500 wide removable target inserts. The larger 750 wide target frames reduce the likelihood of off target shoots striking the timber frame especially if firing larger calibres.'
        },
        {
            src: 'images/gallery/2700RackLinkExample.jpg',
            title: 'Original RangeRax 2700 Linking Option',
            description: 'Multiple 2700 racks can be linked together with increase spacing between targets and shooters.'
        },
        {
            src: 'images/gallery/2700sideonview.jpg',
            title: 'Original RangeRax 2700 Side On',
            description: '2700 rack side on view.'
        },
        {
            src: 'images/gallery/600750sidebyside.jpg',
            title: 'Mobile RangeRax Standalone 600 and 750 Racks',
            description: 'Standalone 600 and 750 wide racks, ideal for various competition and practices where targets need to be offset or place at various distances.'
        },
        {
            src: 'images/gallery/600basecloseup.jpg',
            title: 'Mobile RangeRax 600 Standalone Rack Base Closeup',
            description: 'Closeup of the 600 rack base without target frame insert.'
        },
        {
            src: 'images/gallery/750basecloseup.jpg',
            title: 'Mobile RangeRax 750 Standalone Rack Base Closeup',
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

    let currentImageIndex = 0;
    const mainImage = document.getElementById('mainImage');
    const imageCounter = document.getElementById('imageCounter');
    const productTitle = document.getElementById('productTitle');
    const productDescription = document.getElementById('productDescription');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const thumbnails = document.querySelectorAll('.thumbnail');

    function updateGallery(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        
        currentImageIndex = index;
        
        // Update main image
        mainImage.src = galleryImages[index].src;
        mainImage.alt = galleryImages[index].title;
        
        // Update counter
        imageCounter.textContent = `${index + 1} / ${galleryImages.length}`;
        
        // Update product info
        productTitle.textContent = galleryImages[index].title;
        productDescription.textContent = galleryImages[index].description;
        
        // Update thumbnail active state
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Previous button
    prevBtn.addEventListener('click', () => {
        updateGallery(currentImageIndex - 1);
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        updateGallery(currentImageIndex + 1);
    });

    // Thumbnail clicks
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateGallery(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            updateGallery(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
            updateGallery(currentImageIndex + 1);
        }
    });

    // Auto-advance gallery (optional - uncomment to enable)
    // setInterval(() => {
    //     updateGallery(currentImageIndex + 1);
    // }, 5000);

    // Initialize gallery
    updateGallery(0);
});