// Portfolio Website JavaScript
// Author: Gaurav
// Description: Interactive functionality for the portfolio website

class Portfolio {
    constructor() {
        this.skills = [];
        this.projects = [];
        this.featuredProject = null;
        this.activeFilters = new Set(['All']);
        this.searchTerm = '';

        this.init();
    }

    async init() {
        try {
            // Initialize theme
            this.initTheme();

            // Initialize navigation
            this.initNavigation();

            // Load data
            await this.loadData();

            // Initialize components
            this.initSearch();
            this.initContactForm();
            this.initModal();
            this.initAnimations();

            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.showError('Failed to load portfolio data. Please refresh the page.');
        }
    }

    // Theme Management
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';

        // Set initial theme
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        // Theme toggle event listener
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Navigation
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile navigation toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Skip smooth scrolling for external pages
                if (link.classList.contains('external-page')) {
                    return; // Let the link work normally
                }

                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

    }

    // Data Loading
    async loadData() {
        try {
            // Load skills
            const skillsResponse = await fetch('./data/skills.json');
            if (!skillsResponse.ok) throw new Error('Failed to load skills data');
            const skillsData = await skillsResponse.json();
            this.skills = skillsData.skills;
            this.renderSkills();

            // Load projects
            const projectsResponse = await fetch('./data/projects.json');
            if (!projectsResponse.ok) throw new Error('Failed to load projects data');
            const projectsData = await projectsResponse.json();
            this.projects = projectsData.projects;
            this.featuredProject = projectsData.projects.find(p => p.id === projectsData.featured);

            this.renderFeaturedProject();
            this.renderProjects();
            this.renderFilters();

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Unable to load portfolio data. Some sections may not display correctly.');
        }
    }

    // Skills Rendering
    renderSkills() {
        const skillsContainer = document.getElementById('skills-container');
        if (!skillsContainer || !this.skills.length) return;

        const skillsHTML = this.skills.map(category => `
            <div class="skill-category fade-in">
                <h3>
                    ${this.getCategoryIcon(category.category)}
                    ${category.category}
                </h3>
                <div class="skill-list">
                    ${category.items.map(skill => `
                        <span class="skill-item">${skill}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        skillsContainer.innerHTML = skillsHTML;
    }

    getCategoryIcon(category) {
        const icons = {
            'Web Development': '<i class="fas fa-code"></i>',
            'Data Science': '<i class="fas fa-chart-bar"></i>',
            'AI/ML': '<i class="fas fa-robot"></i>',
            'Python Development': '<i class="fab fa-python"></i>',
            'Database': '<i class="fas fa-database"></i>',
            'Tools': '<i class="fas fa-tools"></i>'
        };
        return icons[category] || '<i class="fas fa-laptop-code"></i>';
    }

    // Featured Project Rendering
    renderFeaturedProject() {
        const featuredContainer = document.getElementById('featured-project-container');
        const featuredBtn = document.getElementById('featured-project-btn');

        if (!featuredContainer || !this.featuredProject) return;

        const project = this.featuredProject;

        featuredContainer.innerHTML = `
            <div class="featured-card fade-in">
                <h3 class="featured-title">${project.title}</h3>
                <p class="featured-description">${project.short}</p>
                <div class="featured-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="featured-buttons">
                    <button class="btn btn-white" onclick="portfolio.openProjectModal('${project.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" rel="noopener" class="btn btn-outline-white">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    ` : ''}
                    ${project.live ? `
                        <a href="${project.live}" target="_blank" rel="noopener" class="btn btn-outline-white">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        // Inside openProjectModal, before assembling modalHTML
        const imagesHTML = (project.images && project.images.length > 0)
            ? `
    <div class="modal-images">
      <div class="image-carousel">
        ${project.images.map((src, i) => `
          <img class="carousel-item"
               src="${src}"
               alt="${project.title} image ${i + 1}"
               loading="lazy">
        `).join('')}
      </div>
    </div>
  `
            : `
    <div class="modal-images">
      <div class="image-carousel">
        <div class="carousel-placeholder">
          <i class="fas fa-image"></i>
          <p>Project Images</p>
        </div>
      </div>
    </div>
  `;

        // Then include ${imagesHTML} in modalHTML after the tech tags
        const modalHTML = `
  <div class="modal-header">
    <h2 class="modal-title">${project.title}</h2>
    <p class="modal-description">${project.description}</p>
    <div class="modal-tech">
      ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
    </div>
  </div>
  ${imagesHTML}
  <div class="modal-links">
    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn btn-secondary"><i class="fab fa-github"></i> View Code</a>` : ''}
    ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
  </div>
`;


        // Featured project button in hero
        if (featuredBtn) {
            featuredBtn.addEventListener('click', () => {
                this.openProjectModal(project.id);
            });
        }
    }

    // Projects Rendering
    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid || !this.projects.length) return;

        const filteredProjects = this.getFilteredProjects();

        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
            <div class="no-results">
                <p>No projects found matching your criteria.</p>
            </div>
        `;
            return;
        }

        // Limit to 7 projects for the main page
        const displayProjects = filteredProjects.slice(0, 7);

        // Regular project cards
        const projectsHTML = displayProjects.map(project => `
        <div class="project-card fade-in" onclick="portfolio.openProjectModal('${project.id}')">
            <div class="project-image">
                ${project.images && project.images.length > 0
                ? `<img src="${project.images[0]}" alt="${project.title} thumbnail" loading="lazy" decoding="async" onerror="this.onerror=null; this.replaceWith(document.createElement('i').className='fas fa-laptop-code')">`
                : `<i class="fas fa-laptop-code"></i>`
            }
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.short}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-link project-link-github" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="project-link project-link-live" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');

        // Create the "More Projects" card with the image
        const moreProjectsCard = `
        <div class="project-card more-projects-card fade-in" onclick="window.location.href='projects.html'">
            <div class="project-image">
                <img src="./assets/morep.png" alt="Click for More Projects" loading="lazy" decoding="async">
            </div>
            <div class="project-content">
                <h3 class="project-title">More Projects</h3>
                <p class="project-description">Explore all my projects sorted by technology and category</p>
                <div class="project-tech">
                    <span class="tech-tag">View All</span>
                    <span class="tech-tag">Categorized</span>
                </div>
                <div class="project-links">
                    <span class="more-projects-link">
                        <i class="fas fa-arrow-right"></i> Next Page
                    </span>
                </div>
            </div>
        </div>
    `;

        // Combine and render both regular projects and the more projects card
        projectsGrid.innerHTML = projectsHTML + moreProjectsCard;
    }


    // Project Filtering
    renderFilters() {
        const filtersContainer = document.getElementById('project-filters');
        if (!filtersContainer || !this.projects.length) return;

        // Get all unique tags
        const allTags = new Set(['All']);
        this.projects.forEach(project => {
            project.tags.forEach(tag => allTags.add(tag));
        });

        const filtersHTML = Array.from(allTags).map(tag => `
            <button class="filter-tag ${this.activeFilters.has(tag) ? 'active' : ''}" 
                    onclick="portfolio.toggleFilter('${tag}')">
                ${tag}
            </button>
        `).join('');

        filtersContainer.innerHTML = filtersHTML;
    }

    toggleFilter(tag) {
        if (tag === 'All') {
            this.activeFilters.clear();
            this.activeFilters.add('All');
        } else {
            this.activeFilters.delete('All');
            if (this.activeFilters.has(tag)) {
                this.activeFilters.delete(tag);
            } else {
                this.activeFilters.add(tag);
            }

            if (this.activeFilters.size === 0) {
                this.activeFilters.add('All');
            }
        }

        this.renderFilters();
        this.renderProjects();
    }

    getFilteredProjects() {
        let filtered = this.projects;

        // Filter by tags
        if (!this.activeFilters.has('All')) {
            filtered = filtered.filter(project =>
                project.tags.some(tag => this.activeFilters.has(tag))
            );
        }

        // Filter by search term
        if (this.searchTerm) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                project.short.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                project.tech.some(tech => tech.toLowerCase().includes(this.searchTerm.toLowerCase()))
            );
        }

        return filtered;
    }

    // Search Functionality
    initSearch() {
        const searchInput = document.getElementById('project-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderProjects();
        });
    }

    // Modal Functionality
    initModal() {
        const modal = document.getElementById('project-modal');
        const closeBtn = modal?.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal on backdrop click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');

        if (!project || !modal || !modalBody) return;

        // Before building modalHTML:
        const hasImages = Array.isArray(project.images) && project.images.length > 0;

        let imagesHTML = '';
        if (hasImages) {
            const imgs = project.images.map((src, i) =>
                '<img class="carousel-item' + (i === 0 ? ' active' : '') + '"' +
                ' src="' + src + '"' +
                ' alt="' + project.title + ' image ' + (i + 1) + '"' +
                ' loading="lazy" decoding="async"' +
                " onerror=\"this.style.display='none'\">"
            ).join('');

            const controls = project.images.length > 1
                ? '<button class="carousel-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>' +
                '<button class="carousel-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>'
                : '';

            imagesHTML =
                '<div class="modal-images">' +
                '<div class="image-carousel" data-index="0">' +
                imgs + controls +
                '</div>' +
                '</div>';
        } else {
            imagesHTML =
                '<div class="modal-images">' +
                '<div class="image-carousel">' +
                '<div class="carousel-placeholder">' +
                '<i class="fas fa-image"></i>' +
                '<p>Project Images</p>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Then your modalHTML uses the prebuilt imagesHTML:
        const modalHTML = `
  <div class="modal-header">
    <h2 class="modal-title">${project.title}</h2>
    <p class="modal-description">${project.description}</p>
    <div class="modal-tech">
      ${(project.tech || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
    </div>
  </div>

  ${imagesHTML}

  <div class="modal-links">
    ${project.github ? `
      <a href="${project.github}" target="_blank" rel="noopener" class="btn btn-secondary">
        <i class="fab fa-github"></i> View Code
      </a>
    ` : ''}
    ${project.live ? `
      <a href="${project.live}" target="_blank" rel="noopener" class="btn btn-primary">
        <i class="fas fa-external-link-alt"></i> Live Demo
      </a>
    ` : ''}
  </div>
`;


        modalBody.innerHTML = modalHTML;
        modal.classList.add('active');

        // Focus management for accessibility
        modal.querySelector('.modal-close')?.focus();
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    this.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showFormStatus('Failed to send message. Please try again or contact me directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    showFormStatus(message, type) {
        const status = document.getElementById('form-status');
        if (!status) return;

        status.textContent = message;
        status.className = `form-status ${type}`;
        status.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }

    // Animations
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Re-observe new elements when content is updated
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const fadeElements = node.querySelectorAll ?
                            node.querySelectorAll('.fade-in') : [];
                        fadeElements.forEach(el => observer.observe(el));

                        if (node.classList?.contains('fade-in')) {
                            observer.observe(node);
                        }
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Error Handling
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid #dc2626;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 3000;
            max-width: 300px;
            box-shadow: 0 4px 12px var(--shadow-color);
        `;
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(errorDiv);

        // Auto remove after 8 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 8000);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Handle service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to add PWA functionality
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
