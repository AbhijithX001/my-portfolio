const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');
const allImages = document.querySelectorAll('img');

if (menuIcon) {
    menuIcon.setAttribute('role', 'button');
    menuIcon.setAttribute('aria-label', 'Toggle navigation menu');
    menuIcon.setAttribute('tabindex', '0');
    menuIcon.setAttribute('aria-expanded', 'false');

    const toggleMenu = () => {
        menuIcon.classList.toggle('bx-x');
        const expanded = menuIcon.classList.contains('bx-x');
        menuIcon.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        if (navbar) navbar.classList.toggle('active');
    };

    menuIcon.addEventListener('click', toggleMenu);
    menuIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navbar && navbar.classList.contains('active')) {
                menuIcon.classList.remove('bx-x');
                menuIcon.setAttribute('aria-expanded', 'false');
                navbar.classList.remove('active');
            }
        }
    });
    document.addEventListener('click', (e) => {
        if (!navbar) return;
        if (!navbar.contains(e.target) && !menuIcon.contains(e.target) && navbar.classList.contains('active')) {
            menuIcon.classList.remove('bx-x');
            menuIcon.setAttribute('aria-expanded', 'false');
            navbar.classList.remove('active');
        }
    });
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbar && navbar.classList.contains('active')) {
                menuIcon.classList.remove('bx-x');
                menuIcon.setAttribute('aria-expanded', 'false');
                navbar.classList.remove('active');
            }
        });
    });
}

allImages.forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
});
