const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

const servicesContainer = document.querySelector('#services-container');
const projectsContainer = document.querySelector('#projects-box');
const socialLinksHome = document.querySelector('#social-links-home');
const socialLinksFooter = document.querySelector('#social-links-footer');
const resumeLink = document.querySelector('#resume-link');
const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

const iconList = ['bx-code', 'bx-server', 'bx-code-alt', 'bx-laptop', 'bx-layer'];

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
        if (e.key === 'Escape' && navbar && navbar.classList.contains('active')) {
            menuIcon.classList.remove('bx-x');
            menuIcon.setAttribute('aria-expanded', 'false');
            navbar.classList.remove('active');
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

function applyLazyLoading() {
    document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
}

function getIconClass(platform) {
    const value = (platform || '').toLowerCase();
    if (value === 'github') return 'bxl-github';
    if (value === 'linkedin') return 'bxl-linkedin';
    if (value === 'instagram') return 'bxl-instagram-alt';
    if (value === 'twitter') return 'bxl-twitter';
    if (value === 'facebook') return 'bxl-facebook';
    if (value === 'youtube') return 'bxl-youtube';
    if (value === 'email') return 'bx-envelope';
    return 'bx-link';
}

async function loadServices() {
    if (!servicesContainer) return;

    try {
        const response = await fetch('/api/services/');
        const services = await response.json();

        servicesContainer.innerHTML = '';

        if (!Array.isArray(services) || services.length === 0) {
            servicesContainer.innerHTML = '<p>No services added yet.</p>';
            return;
        }

        services.forEach((service, index) => {
            const box = document.createElement('div');
            box.className = 'service-box';

            const info = document.createElement('div');
            info.className = 'service-info';

            const icon = document.createElement('i');
            icon.className = `bx ${iconList[index % iconList.length]}`;

            const title = document.createElement('h4');
            title.textContent = service.name || 'Service';

            const desc = document.createElement('p');
            desc.textContent = service.description || '';

            info.append(icon, title, desc);
            box.appendChild(info);
            servicesContainer.appendChild(box);
        });
    } catch (error) {
        servicesContainer.innerHTML = '<p>Unable to load services.</p>';
    }
}

async function loadProjects() {
    if (!projectsContainer) return;

    try {
        const response = await fetch('/api/projects/');
        const projects = await response.json();

        projectsContainer.innerHTML = '';

        if (!Array.isArray(projects) || projects.length === 0) {
            projectsContainer.innerHTML = '<p>No projects added yet.</p>';
            return;
        }

        projects.forEach((project) => {
            const card = document.createElement('div');
            card.className = 'project-card';

            if (project.image) {
                const image = document.createElement('img');
                image.src = project.image;
                image.alt = 'Project image';
                image.loading = 'lazy';
                card.appendChild(image);
            }

            const title = document.createElement('h3');
            title.textContent = project.name || 'Project';

            const desc = document.createElement('p');
            desc.textContent = project.description || '';

            const link = document.createElement('a');
            link.className = 'btn';
            link.href = project.link || '#';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Review Project';

            card.append(title, desc, link);
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        projectsContainer.innerHTML = '<p>Unable to load projects.</p>';
    }
}

async function loadSocialLinks() {
    if (!socialLinksHome && !socialLinksFooter) return;

    try {
        const response = await fetch('/api/social-media/');
        const links = await response.json();

        const renderLinks = (container) => {
            if (!container) return;
            container.innerHTML = '';

            if (!Array.isArray(links) || links.length === 0) {
                return;
            }

            links.forEach((item) => {
                const a = document.createElement('a');
                a.href = item.link || '#';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.setAttribute('aria-label', item.platform_label || item.platform || 'Social link');

                const icon = document.createElement('i');
                icon.className = `bx ${getIconClass(item.platform)}`;

                a.appendChild(icon);
                container.appendChild(a);
            });
        };

        renderLinks(socialLinksHome);
        renderLinks(socialLinksFooter);
    } catch (error) {
        if (socialLinksHome) socialLinksHome.innerHTML = '';
        if (socialLinksFooter) socialLinksFooter.innerHTML = '';
    }
}

async function loadResume() {
    if (!resumeLink) return;

    try {
        const response = await fetch('/api/resume/');
        const data = await response.json();

        if (data && data.resume) {
            resumeLink.href = data.resume;
            return;
        }

        resumeLink.href = '#';
        resumeLink.textContent = 'Resume Not Added';
        resumeLink.removeAttribute('target');
    } catch (error) {
        resumeLink.href = '#';
        resumeLink.textContent = 'Resume Not Available';
        resumeLink.removeAttribute('target');
    }
}

async function submitContactForm(event) {
    event.preventDefault();

    if (!contactForm) return;

    const formspreeUrl = contactForm.dataset.formspreeUrl || contactForm.getAttribute('action');
    const payload = {
        full_name: contactForm.full_name.value.trim(),
        email: contactForm.email.value.trim(),
        phone_number: contactForm.phone_number.value.trim(),
        subject: contactForm.subject.value.trim(),
        message: contactForm.message.value.trim(),
    };

    if (contactStatus) {
        contactStatus.textContent = 'Sending...';
    }

    let backendSaved = false;

    try {
        const backendResponse = await fetch('/api/contact/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const backendData = await backendResponse.json();

        if (!backendResponse.ok) {
            throw new Error(backendData.error || 'Unable to save message');
        }
        backendSaved = true;

        if (formspreeUrl) {
            const mailPayload = new FormData();
            mailPayload.append('name', payload.full_name);
            mailPayload.append('email', payload.email);
            mailPayload.append('phone', payload.phone_number);
            mailPayload.append('subject', payload.subject);
            mailPayload.append('message', payload.message);

            const mailResponse = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: mailPayload,
            });

            if (!mailResponse.ok) {
                throw new Error('Saved in backend, but email could not be sent.');
            }
        }

        contactForm.reset();
        if (contactStatus) contactStatus.textContent = 'Message sent and saved successfully.';
    } catch (error) {
        if (contactStatus) {
            if (backendSaved) {
                contactStatus.textContent = error.message || 'Saved in backend, but email failed.';
            } else {
                contactStatus.textContent = error.message || 'Could not submit your message.';
            }
        }
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', submitContactForm);
}

async function initPortfolio() {
    await Promise.all([
        loadServices(),
        loadProjects(),
        loadSocialLinks(),
        loadResume(),
    ]);
    applyLazyLoading();
}

initPortfolio();
