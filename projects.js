// Advanced Projects Page JavaScript
// Author: Gaurav

// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

class ProjectsPage {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.activeFilters = {
            categories: new Set(['All']),
            technologies: new Set(),
            search: '',
            sort: 'default'
        };
        this.currentView = 'grid';
        this.debounceTimer = null;
        this.currentModal = null;
        this.carouselIndex = 0;

        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.showLoading();

            // Initialize theme (matches main portfolio)
            this.initTheme();

            // Initialize navigation
            this.initNavigation();

            // Load project data
            await this.loadProjects();
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            // Initialize all components
            this.initSearch();
            this.initFilters();
            this.initViewToggle();
            this.initModal();
            this.initBackToTop();
            this.initAnimations();

            // Render initial content
            this.renderFilters();
            this.renderProjects();
            this.updateStatistics();
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            // Hide loading screen
            this.hideLoading();

            console.log('Projects page initialized successfully');
        } catch (error) {
            console.error('Error initializing projects page:', error);
            this.showError('Failed to load projects. Please refresh the page.');
            this.hideLoading();
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Loading Management
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Theme Management (matches main portfolio)
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';

        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';

                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Navigation (matches main portfolio)
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
            });
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Data Loading - Fixed to use correct path
    async loadProjects() {
        try {
            const response = await fetch('./projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.projects = data.projects || [];
            this.filteredProjects = [...this.projects];

            if (this.projects.length === 0) {
                throw new Error('No projects found in data file');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            // Fallback to sample data if JSON fails to load
            this.projects = this.getSampleProjects();
            this.filteredProjects = [...this.projects];
        }
    }// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

    // Search Functionality
    initSearch() {
        const searchInput = document.getElementById('projects-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.activeFilters.search = e.target.value.toLowerCase().trim();
                this.applyFilters();
            }, 300);
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Filter System
    initFilters() {
        // Sort dropdown
        const sortSelect = document.getElementById('projects-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.activeFilters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Clear filters buttons
        const clearFiltersBtn = document.getElementById('clear-filters');
        const clearFiltersNoResults = document.getElementById('clear-filters-no-results');

        [clearFiltersBtn, clearFiltersNoResults].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.clearAllFilters();
                });
            }
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    renderFilters() {
        this.renderCategoryFilters();
        this.renderTechnologyFilters();
    }

    renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        if (!container) return;
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Get unique categories
        const categories = new Set(['All']);
        this.projects.forEach(project => {
            if (project.category) categories.add(project.category);
        });

        const filtersHTML = Array.from(categories).map(category => `
            <button class="category-filter ${this.activeFilters.categories.has(category) ? 'active' : ''}"
                    data-category="${category}">
                ${category}
            </button>
        `).join('');

        container.innerHTML = filtersHTML;

        // Add event listeners
        container.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.toggleCategoryFilter(category);
            });
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    renderTechnologyFilters() {
        const container = document.getElementById('tech-filters');
        if (!container) return;

        // Get unique technologies
        const technologies = new Set();
        this.projects.forEach(project => {
            if (project.tech && Array.isArray(project.tech)) {
                project.tech.forEach(tech => technologies.add(tech));
            }
        });
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        const filtersHTML = Array.from(technologies).sort().map(tech => `
            <button class="tech-filter ${this.activeFilters.technologies.has(tech) ? 'active' : ''}"
                    data-tech="${tech}">
                ${tech}
            </button>
        `).join('');

        container.innerHTML = filtersHTML;

        // Add event listeners
        container.querySelectorAll('.tech-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tech = e.target.dataset.tech;
                this.toggleTechnologyFilter(tech);
            });
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    toggleCategoryFilter(category) {
        if (category === 'All') {
            this.activeFilters.categories.clear();
            this.activeFilters.categories.add('All');
        } else {
            this.activeFilters.categories.delete('All');
            if (this.activeFilters.categories.has(category)) {
                this.activeFilters.categories.delete(category);
            } else {
                this.activeFilters.categories.add(category);
            }

            if (this.activeFilters.categories.size === 0) {
                this.activeFilters.categories.add('All');
            }
        }

        this.applyFilters();
        this.renderCategoryFilters();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    toggleTechnologyFilter(tech) {
        if (this.activeFilters.technologies.has(tech)) {
            this.activeFilters.technologies.delete(tech);
        } else {
            this.activeFilters.technologies.add(tech);
        }

        this.applyFilters();
        this.renderTechnologyFilters();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    clearAllFilters() {
        this.activeFilters.categories.clear();
        this.activeFilters.categories.add('All');
        this.activeFilters.technologies.clear();
        this.activeFilters.search = '';
        this.activeFilters.sort = 'default';

        // Reset UI elements
        const searchInput = document.getElementById('projects-search');
        if (searchInput) searchInput.value = '';

        const sortSelect = document.getElementById('projects-sort');
        if (sortSelect) sortSelect.value = 'default';

        this.renderFilters();
        this.applyFilters();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    applyFilters() {
        let filtered = [...this.projects];

        // Apply category filter
        if (!this.activeFilters.categories.has('All')) {
            filtered = filtered.filter(project =>
                this.activeFilters.categories.has(project.category)
            );
        }

        // Apply technology filter
        if (this.activeFilters.technologies.size > 0) {
            filtered = filtered.filter(project =>
                project.tech && project.tech.some(tech =>
                    this.activeFilters.technologies.has(tech)
                )
            );
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Apply search filter
        if (this.activeFilters.search) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(this.activeFilters.search) ||
                project.description.toLowerCase().includes(this.activeFilters.search) ||
                (project.tech && project.tech.some(tech =>
                    tech.toLowerCase().includes(this.activeFilters.search)
                ))
            );
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Apply sorting
        this.sortProjects(filtered);

        this.filteredProjects = filtered;
        this.renderProjects();
        this.updateResultsInfo();
        this.updateClearFiltersVisibility();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    sortProjects(projects) {
        switch (this.activeFilters.sort) {
            case 'title':
                projects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'category':
                projects.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
                break;
            case 'difficulty':
                const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
                projects.sort((a, b) =>
                    (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2)
                );
                break;
            case 'status':
                const statusOrder = { 'completed': 1, 'in-progress': 2, 'planned': 3 };
                projects.sort((a, b) =>
                    (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1)
                );
                break;
            default:
                // Keep original order
                break;
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // View Toggle
    initViewToggle() {
        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');
        const projectsGrid = document.getElementById('projects-grid-advanced');

        if (gridViewBtn && listViewBtn && projectsGrid) {
            gridViewBtn.addEventListener('click', () => {
                this.currentView = 'grid';
                projectsGrid.className = 'projects-grid-advanced grid-view';
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            });
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            listViewBtn.addEventListener('click', () => {
                this.currentView = 'list';
                projectsGrid.className = 'projects-grid-advanced list-view';
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
            });
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Project Rendering
    renderProjects() {
        const container = document.getElementById('projects-grid-advanced');
        const noResults = document.getElementById('no-results');

        if (!container) return;

        if (this.filteredProjects.length === 0) {
            container.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        container.style.display = this.currentView === 'grid' ? 'grid' : 'flex';
        if (noResults) noResults.style.display = 'none';

        const projectsHTML = this.filteredProjects.map((project, index) => `
            <div class="project-card-advanced fade-in-stagger" 
                 onclick="projectsPage.openProjectModal('${project.id}')"
                 style="animation-delay: ${index * 100}ms">

                <div class="project-image-advanced">
                    ${project.images && project.images.length > 0
                ? `<img src="${project.images[0]}" 
                              alt="${project.title}" 
                              loading="lazy" 
                              onerror="this.style.display='none'">`
                : `<i class="fas fa-laptop-code"></i>`
            }
                </div>

                <div class="project-content-advanced">
                    <div class="project-header-advanced">
                        <h3 class="project-title-advanced">${project.title}</h3>
                        <div class="project-meta-advanced">
                            <span class="project-category-advanced">${project.category || 'General'}</span>
                            <span class="project-difficulty-advanced ${project.difficulty || 'medium'}">
                                ${this.capitalizeFirst(project.difficulty || 'Medium')}
                            </span>
                            <span class="project-status-advanced ${project.status || 'completed'}">
                                ${this.capitalizeFirst(this.formatStatus(project.status || 'completed'))}
                            </span>
                        </div>
                    </div>

                    <p class="project-description-advanced">${project.description}</p>

                    <div class="project-tech-advanced">
                        ${(project.tech || []).slice(0, 5).map(tech =>
                `<span class="tech-tag-advanced">${tech}</span>`
            ).join('')}
                        ${(project.tech || []).length > 5 ?
                `<span class="tech-tag-advanced">+${(project.tech || []).length - 5} more</span>`
                : ''
            }
                    </div>

                    <div class="project-footer-advanced">
                        <div class="project-links-advanced">
                            ${project.github ? `
                                <a href="${project.github}" 
                                   target="_blank" 
                                   rel="noopener" 
                                   class="project-link-advanced project-link-github-advanced"
                                   onclick="event.stopPropagation()">
                                    <i class="fab fa-github"></i> Code
                                </a>
                            ` : ''}
                            ${project.live ? `
                                <a href="${project.live}" 
                                   target="_blank" 
                                   rel="noopener" 
                                   class="project-link-advanced project-link-live-advanced"
                                   onclick="event.stopPropagation()">
                                    <i class="fas fa-external-link-alt"></i> Live
                                </a>
                            ` : ''}
                        </div>

                        ${project.duration ? `
                            <span class="project-duration-advanced">${project.duration}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = projectsHTML;
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Trigger animations
        this.triggerStaggeredAnimations();
    }

    // Helper methods
    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatStatus(status) {
        return status.replace('-', ' ');
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Modal Functionality
    initModal() {
        const modal = document.getElementById('project-modal-advanced');
        const closeBtn = modal?.querySelector('.modal-close-advanced');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        const modal = document.getElementById('project-modal-advanced');
        const modalBody = document.getElementById('modal-body-advanced');

        if (!project || !modal || !modalBody) return;

        this.currentModal = project;
        this.carouselIndex = 0;

        // Build modal content
        const modalHTML = this.buildModalContent(project);
        modalBody.innerHTML = modalHTML;

        // Initialize carousel if images exist
        if (project.images && project.images.length > 1) {
            this.initCarousel();
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        modal.querySelector('.modal-close-advanced')?.focus();
    }

    buildModalContent(project) {
        const hasImages = project.images && project.images.length > 0;
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        let imagesHTML = '';
        if (hasImages) {
            if (project.images.length === 1) {
                imagesHTML = `
                    <div class="modal-images-advanced">
                        <div class="image-carousel-advanced">
                            <img src="${project.images[0]}" 
                                 alt="${project.title}" 
                                 class="carousel-item-advanced active"
                                 loading="lazy">
                        </div>
                    </div>
                `;
            } else {
                const imagesHtml = project.images.map((img, index) => `
                    <img src="${img}" 
                         alt="${project.title} image ${index + 1}" 
                         class="carousel-item-advanced ${index === 0 ? 'active' : ''}"
                         loading="lazy">
                `).join('');

                const indicators = project.images.map((_, index) => `
                    <button class="carousel-indicator-advanced ${index === 0 ? 'active' : ''}"
                            onclick="projectsPage.goToSlide(${index})"></button>
                `).join('');

                imagesHTML = `
                    <div class="modal-images-advanced">
                        <div class="image-carousel-advanced">
                            <div class="carousel-container-advanced">
                                ${imagesHtml}
                                <button class="carousel-controls-advanced carousel-prev-advanced" 
                                        onclick="projectsPage.prevSlide()">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="carousel-controls-advanced carousel-next-advanced" 
                                        onclick="projectsPage.nextSlide()">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <div class="carousel-indicators-advanced">
                                ${indicators}
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            imagesHTML = `
                <div class="modal-images-advanced">
                    <div class="image-carousel-advanced">
                        <div class="carousel-placeholder-advanced">
                            <i class="fas fa-image"></i>
                            <p>Project Images</p>
                        </div>
                    </div>
                </div>
            `;
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        return `
            <div class="modal-header-advanced">
                <h2 class="modal-title-advanced">${project.title}</h2>
                <div class="modal-meta-advanced">
                    <span class="project-category-advanced">${project.category || 'General'}</span>
                    <span class="project-difficulty-advanced ${project.difficulty || 'medium'}">
                        ${this.capitalizeFirst(project.difficulty || 'Medium')}
                    </span>
                    <span class="project-status-advanced ${project.status || 'completed'}">
                        ${this.capitalizeFirst(this.formatStatus(project.status || 'completed'))}
                    </span>
                    ${project.duration ? `<span class="project-duration-advanced">${project.duration}</span>` : ''}
                </div>
            </div>

            ${imagesHTML}

            <div class="modal-description-advanced">
                <p>${project.description}</p>
                ${project.longDescription ? `<p>${project.longDescription}</p>` : ''}
            </div>

            ${project.tech && project.tech.length > 0 ? `
                <div class="modal-tech-advanced">
                    ${project.tech.map(tech => `<span class="tech-tag-modal">${tech}</span>`).join('')}
                </div>
            ` : ''}

            ${project.features && project.features.length > 0 ? `
                <div class="modal-project-info">
                    <h3>Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${(project.github || project.live) ? `
                <div class="modal-links-advanced">
                    ${project.github ? `
                        <a href="${project.github}" 
                           target="_blank" 
                           rel="noopener" 
                           class="project-link-advanced project-link-github-advanced">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    ` : ''}
                    ${project.live ? `
                        <a href="${project.live}" 
                           target="_blank" 
                           rel="noopener" 
                           class="project-link-advanced project-link-live-advanced">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            ` : ''}

            ${project.challenges || project.solutions ? `
                <div class="modal-project-info">
                    <div class="project-info-grid">
                        ${project.challenges ? `
                            <div class="info-item">
                                <div class="info-label">Challenges</div>
                                <div class="info-value">${project.challenges}</div>
                            </div>
                        ` : ''}
                        ${project.solutions ? `
                            <div class="info-item">
                                <div class="info-label">Solutions</div>
                                <div class="info-value">${project.solutions}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
        `;
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Carousel Methods
    initCarousel() {
        if (!this.currentModal || !this.currentModal.images || this.currentModal.images.length <= 1) return;

        // Keyboard navigation for carousel
        document.addEventListener('keydown', this.handleCarouselKeyboard.bind(this));
    }

    handleCarouselKeyboard(e) {
        if (!document.getElementById('project-modal-advanced')?.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextSlide();
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    nextSlide() {
        if (!this.currentModal?.images) return;

        this.carouselIndex = (this.carouselIndex + 1) % this.currentModal.images.length;
        this.updateCarousel();
    }

    prevSlide() {
        if (!this.currentModal?.images) return;

        this.carouselIndex = this.carouselIndex === 0
            ? this.currentModal.images.length - 1
            : this.carouselIndex - 1;
        this.updateCarousel();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    goToSlide(index) {
        if (!this.currentModal?.images || index < 0 || index >= this.currentModal.images.length) return;

        this.carouselIndex = index;
        this.updateCarousel();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    updateCarousel() {
        const items = document.querySelectorAll('.carousel-item-advanced');
        const indicators = document.querySelectorAll('.carousel-indicator-advanced');

        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.carouselIndex);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.carouselIndex);
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    closeModal() {
        const modal = document.getElementById('project-modal-advanced');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clean up
        this.currentModal = null;
        this.carouselIndex = 0;

        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleCarouselKeyboard);
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Utility Methods
    updateResultsInfo() {
        const resultCount = document.getElementById('results-count');
        if (resultCount) {
            const total = this.filteredProjects.length;
            resultCount.textContent = `${total} project${total !== 1 ? 's' : ''} found`;
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    updateClearFiltersVisibility() {
        const hasActiveFilters =
            !this.activeFilters.categories.has('All') ||
            this.activeFilters.categories.size > 1 ||
            this.activeFilters.technologies.size > 0 ||
            this.activeFilters.search ||
            this.activeFilters.sort !== 'default';

        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    updateStatistics() {
        const totalProjects = this.projects.length;
        const completedProjects = this.projects.filter(p => p.status === 'completed').length;

        // Get unique technologies
        const technologies = new Set();
        this.projects.forEach(project => {
            if (project.tech && Array.isArray(project.tech)) {
                project.tech.forEach(tech => technologies.add(tech));
            }
        });
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Get unique categories  
        const categories = new Set();
        this.projects.forEach(project => {
            if (project.category) categories.add(project.category);
        });

        // Animate counter numbers
        this.animateCounter('total-projects-stat', totalProjects);
        this.animateCounter('completed-projects-stat', completedProjects);
        this.animateCounter('technologies-stat', technologies.size);
        this.animateCounter('categories-stat', categories.size);
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Update breakdown sections
        this.updateCategoryBreakdown();
        this.updateStatusBreakdown();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    animateCounter(elementId, finalValue) {
        const element = document.querySelector(`#${elementId} .stat-number`);
        if (!element) return;

        let currentValue = 0;
        const increment = Math.ceil(finalValue / 30);
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            element.textContent = currentValue;
        }, 50);
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    updateCategoryBreakdown() {
        const container = document.getElementById('category-breakdown');
        if (!container) return;

        const categoryCounts = {};
        this.projects.forEach(project => {
            const category = project.category || 'Other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const breakdownHTML = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => `
            <div class="breakdown-item">
                <span class="breakdown-label">${category}</span>
                <span class="breakdown-count">${count}</span>
            </div>
        `).join('');

        container.innerHTML = breakdownHTML;
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    updateStatusBreakdown() {
        const container = document.getElementById('status-breakdown');
        if (!container) return;

        const statusCounts = {};
        this.projects.forEach(project => {
            const status = project.status || 'completed';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusLabels = {
            'completed': 'Completed',
            'in-progress': 'In Progress',
            'planned': 'Planned'
        };
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        const breakdownHTML = Object.entries(statusCounts)
            .map(([status, count]) => `
            <div class="breakdown-item">
                <span class="breakdown-label">
                    <i class="fas fa-circle status-${status}"></i>
                    ${statusLabels[status] || status}
                </span>
                <span class="breakdown-count">${count}</span>
            </div>
        `).join('');

        container.innerHTML = breakdownHTML;
    }

// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

    calculateStats() {
        const techSet = new Set();
        this.projects.forEach(project => {
            if (project.tech && Array.isArray(project.tech)) {
                project.tech.forEach(tech => techSet.add(tech));
            }
        });

        const categorySet = new Set();
        this.projects.forEach(project => {
            if (project.category) categorySet.add(project.category);
        });

        return {
            total: this.projects.length,
            technologies: techSet.size,
            categories: categorySet.size
        };
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Animations
    initAnimations() {
        // Intersection Observer for staggered animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    triggerStaggeredAnimations() {
        // Reset and apply staggered animations
        const cards = document.querySelectorAll('.fade-in-stagger');
        cards.forEach((card, index) => {
            card.classList.remove('visible');
            card.style.transitionDelay = `${index * 100}ms`;
            this.observer?.observe(card);
        });
    }

    // Back to Top functionality
    initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Error handling
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Enhanced sample data fallback
    getSampleProjects() {
        return [
            {
                id: '1',
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with modern UI/UX and secure payment integration.',
                category: 'Web Development',
                tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
                difficulty: 'hard',
                status: 'completed',
                duration: '3 months',
                github: 'https://github.com/user/ecommerce',
                live: 'https://ecommerce.example.com',
                images: [],
                features: [
                    'User authentication and authorization',
                    'Product catalog with search and filters',
                    'Shopping cart and wishlist functionality',
                    'Secure payment processing with Stripe',
                    'Admin dashboard for product management'
                ]
            },
            {
                id: '2',
                title: 'Task Management App',
                description: 'A collaborative task management application with real-time updates and team features.',
                category: 'Mobile App',
                tech: ['Vue.js', 'Firebase', 'Vuetify'],
                difficulty: 'medium',
                status: 'completed',
                duration: '2 months',
                github: 'https://github.com/user/task-manager',
                live: 'https://tasks.example.com',
                images: [],
                features: [
                    'Real-time task updates',
                    'Team collaboration tools',
                    'Progress tracking and analytics',
                    'Mobile-responsive design'
                ]
            },
            {
                id: '3',
                title: 'AI Chat Bot',
                description: 'An intelligent chatbot using natural language processing for customer support.',
                category: 'Artificial Intelligence',
                tech: ['Python', 'TensorFlow', 'Natural Language Processing'],
                difficulty: 'hard',
                status: 'in-progress',
                duration: '4 months',
                github: 'https://github.com/user/ai-chatbot',
                live: 'https://chatbot.example.com',
                images: [],
                features: [
                    'Natural language understanding',
                    'Multi-platform integration',
                    'Learning from conversations',
                    'Customizable responses'
                ]
            },
            {
                id: '4',
                title: 'Weather Dashboard',
                description: 'A responsive weather application with real-time forecasts and interactive maps.',
                category: 'Web Development',
                tech: ['JavaScript', 'CSS3', 'Weather API', 'Chart.js'],
                difficulty: 'easy',
                status: 'completed',
                duration: '1 month',
                github: 'https://github.com/user/weather-app',
                live: 'https://weather.example.com',
                images: [],
                features: [
                    '5-day weather forecast',
                    'Interactive weather maps',
                    'Location-based weather data',
                    'Mobile-friendly interface'
                ]
            },
            {
                id: '5',
                title: 'Portfolio Website',
                description: 'A personal portfolio website showcasing projects, skills, and experience.',
                category: 'Web Development',
                tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
                difficulty: 'medium',
                status: 'completed',
                duration: '2 weeks',
                github: 'https://github.com/user/portfolio',
                live: 'https://portfolio.example.com',
                images: [],
                features: [
                    'Responsive design',
                    'Dark/light theme toggle',
                    'Project showcase with filtering',
                    'Contact form integration'
                ]
            },
            {
                id: '6',
                title: 'Data Visualization Tool',
                description: 'An interactive data visualization platform for analyzing and presenting complex datasets.',
                category: 'Data Science',
                tech: ['Python', 'D3.js', 'Pandas', 'Flask'],
                difficulty: 'hard',
                status: 'in-progress',
                duration: '3 months',
                github: 'https://github.com/user/data-viz',
                images: [],
                features: [
                    'Multiple chart types',
                    'Real-time data updates',
                    'Export functionality',
                    'Interactive filtering'
                ]
            }
        ];
    }
}
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
// Initialize the projects page when DOM is loaded
let projectsPage;

document.addEventListener('DOMContentLoaded', () => {
    projectsPage = new ProjectsPage();
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsPage;
}

// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.