// Modern Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Scroll to Top on Hero Scroll Indicator Click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Navbar Background on Scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Parallax Effect for Hero Background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .style-card, .skill-item, .stat-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Cursor Trail Effect
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorTrail.style.opacity = '0.6';
    });
    
    document.addEventListener('mouseleave', function() {
        cursorTrail.style.opacity = '0';
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    
    // Contact Form Handling
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Udfyld venligst alle felter', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Tak for din besked! Jeg vender tilbage hurtigst muligt.', 'success');
            contactForm.reset();
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
    }
    
    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Typing Effect for Hero Title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Initialize typing effect for hero title
    const heroTitle = document.querySelector('.hero-title .title-line:first-child');
    if (heroTitle) {
        setTimeout(() => {
            typeWriter(heroTitle, 'MrFaws', 150);
        }, 1000);
    }
    
    // Stats Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + (target.toString().includes('+') ? '+' : target.toString().includes('%') ? '%' : '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }
    
    // Animate stats when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const target = entry.target.textContent;
                const numericValue = parseInt(target.replace(/\D/g, ''));
                animateCounter(entry.target, target, 2000);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Project Card Hover Effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
    
    // Skills Animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((skill, index) => {
        skill.style.animationDelay = `${index * 0.1}s`;
    });
    
    // CV Download with Confirmation
    const cvBtn = document.querySelector('.cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('CV download starter...', 'info');
            setTimeout(() => {
                window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
            }, 1000);
        });
    }
    
    // Add loading animation to page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// Add CSS for notifications and animations
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 350px;
        box-shadow: var(--shadow);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #4CAF50;
    }
    
    .notification-error {
        border-left: 4px solid #F44336;
    }
    
    .notification-info {
        border-left: 4px solid #2196F3;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: #4CAF50;
    }
    
    .notification-error i {
        color: #F44336;
    }
    
    .notification-info i {
        color: #2196F3;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .nav.scrolled {
        background: rgba(10, 10, 10, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: left 0.3s ease;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    .animate {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

document.head.appendChild(style);
