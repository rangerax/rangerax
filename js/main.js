document.addEventListener('DOMContentLoaded', function() {
    // Initialize header scroll effect
    const header = document.getElementById('header');
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to handle SVG logo theme adaptation
    function updateLogoForTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const logoSVG = document.querySelector('.theme-adaptive-logo');
        
        if (logoSVG) {
            if (currentTheme === 'dark') {
                // For dark mode - could use a specific class if needed
                logoSVG.classList.add('dark-theme');
                logoSVG.classList.remove('light-theme');
            } else {
                // For light mode
                logoSVG.classList.add('light-theme');
                logoSVG.classList.remove('dark-theme');
            }
        }
    }
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '🌙';
    }
    
    // Initialize logo theme
    updateLogoForTheme();
    
    // Toggle theme on button click (SINGLE event listener)
    themeToggle.addEventListener('click', function() {
        let newTheme;
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            newTheme = 'light';
            this.textContent = '🌙';
        } else {
            newTheme = 'dark';
            this.textContent = '☀️';
        }
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update the logo when theme changes
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
});