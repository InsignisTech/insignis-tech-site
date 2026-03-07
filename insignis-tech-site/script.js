// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const exploreBtn = document.getElementById('exploreBtn');
const contactForm = document.getElementById('contactForm');

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });
}

// Close mobile menu when clicking a link
if (navMenu) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 100; // Offset for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Explore button animation and scroll
exploreBtn.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Validate required fields
            if (!data.name || !data.email || !data.message) {
                showNotification('Proszę wypełnić wszystkie wymagane pola.', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            console.log('Form submitted:', data);

            // Show success message
            showNotification('Wiadomość została wysłana! Skontaktujemy się wkrótce.', 'success');

            // Reset form
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Typing effect for hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 30);
    }
});

// Parallax effect for fog animation and particles
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;

    // Subtle parallax for fog elements
    const fogElements = document.querySelectorAll('.fog');
    fogElements.forEach((fog, index) => {
        const speed = (index + 1) * 0.5;
        const yPos = -(currentScrollY * speed * 0.1);
        fog.style.transform = `translateY(${yPos}px)`;
    });

    // Parallax for floating particles
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.3;
        const yPos = -(currentScrollY * speed * 0.05);
        particle.style.transform = `translateY(${yPos}px)`;
    });

    lastScrollY = currentScrollY;
});

// Mouse tracking for interactive elements
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Subtle hologram interaction
    const hologram = document.querySelector('.hologram');
    if (hologram) {
        const rotateX = (mouseY - 0.5) * 10;
        const rotateY = (mouseX - 0.5) * 10;
        hologram.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll handler
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based animations can be added here
}, 16)); // ~60fps

// Responsive navigation: Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 255, 0.9);
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
        backdrop-filter: blur(10px);
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.error {
        background: rgba(255, 0, 0, 0.9);
        box-shadow: 0 4px 20px rgba(255, 0, 0, 0.3);
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-top: 1px solid rgba(0, 255, 255, 0.2);
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }

    .section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    @media (min-width: 769px) {
        .nav-menu {
            display: flex !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('INSIGNIS TECH - Futuristic interface initialized');

    // Loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 3500); // Show loading for 3.5 seconds
    }

    // Add loading animation to body
    document.body.classList.add('loaded');

    // Hologram interaction (minimal JS)
    const hologram = document.getElementById('hologram');
    if (hologram) {
        hologram.addEventListener('mouseenter', () => {
            hologram.style.animationPlayState = 'paused';
        });

        hologram.addEventListener('mouseleave', () => {
            hologram.style.animationPlayState = 'running';
        });

        hologram.addEventListener('click', () => {
            hologram.classList.add('hologram-clicked');
            setTimeout(() => {
                hologram.classList.remove('hologram-clicked');
            }, 500);
        });
    }
});
