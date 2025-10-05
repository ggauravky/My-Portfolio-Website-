// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

class Blog {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.postsPerPage = 6;
        this.currentPage = 1;
        this.isLoading = false;
        this.maxRetries = 3;
        this.retryCount = 0;
        this.categories = new Set();
        // © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    async init() {
        try {
            this.showLoadingOverlay(true);

            // Initialize theme FIRST (exactly like portfolio)
            this.initTheme();

            // Initialize navigation (exactly like portfolio)
            this.initNavigation();

            // Load blog posts
            await this.loadPosts();

            // Initialize other components
            this.initSearch();
            this.initFilters();
            this.initModal();
            this.initNewsletter();
            this.initBackToTop();
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            console.log('Blog initialized successfully');
        } catch (error) {
            console.error('Error initializing blog:', error);
            this.showError('Failed to initialize blog. Please refresh the page.');
        } finally {
            this.showLoadingOverlay(false);
        }
    }// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

    // Theme Management - EXACT COPY from portfolio script.js
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle'); // EXACT same ID
        const savedTheme = localStorage.getItem('theme') || 'light';

        // Set initial theme
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        // Theme toggle event listener - EXACT same logic as portfolio
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
    // EXACT same function as portfolio
    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Navigation - EXACT COPY from portfolio script.js
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle'); // EXACT same class
        const navMenu = document.querySelector('.nav-menu'); // EXACT same class
        const navLinks = document.querySelectorAll('.nav-link'); // EXACT same class

        // Mobile navigation toggle - EXACT same logic
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
        // Close mobile menu on link click - EXACT same logic
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside - EXACT same logic
        document.addEventListener('click', (e) => {
            if (navToggle && navMenu && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Loading overlay management
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    // Load blog posts with complete error handling
    async loadPosts() {
        try {
            this.isLoading = true;
            const response = await fetch('./blog.json');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            const data = await response.json();

            // Validate data structure
            if (!data || !Array.isArray(data.posts)) {
                throw new Error('Invalid blog data structure');
            }

            // Process and validate posts
            this.posts = data.posts
                .filter(post => this.validatePost(post))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (this.posts.length === 0) {
                throw new Error('No valid blog posts found');
            }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            this.filteredPosts = [...this.posts];
            this.extractCategories();

            // Hide error and render content
            this.hideError();
            this.renderPosts();
            this.renderFilters();
            this.updateStats();
            this.updateLoadMoreButton();

            this.retryCount = 0;
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.handleLoadError(error);
        } finally {
            this.isLoading = false;
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Validate post structure
    validatePost(post) {
        const requiredFields = ['id', 'title', 'excerpt', 'content', 'category', 'date', 'readTime'];

        for (const field of requiredFields) {
            if (!post[field]) {
                console.warn(`Post missing required field: ${field}`, post);
                return false;
            }
        }

        // Validate date format
        if (isNaN(new Date(post.date).getTime())) {
            console.warn(`Post has invalid date: ${post.date}`, post);
            return false;
        }

        return true;
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Extract unique categories
    extractCategories() {
        this.categories.clear();
        this.posts.forEach(post => {
            this.categories.add(post.category);
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Handle loading errors
    handleLoadError(error) {
        let errorMessage = 'Unable to load blog posts. ';

        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            errorMessage += 'Please check your internet connection.';
        } else if (error.message.includes('HTTP')) {
            errorMessage += 'The blog data file could not be found.';
        } else if (error.message.includes('JSON')) {
            errorMessage += 'The blog data is corrupted.';
        } else {
            errorMessage += 'An unexpected error occurred.';
        }

        this.showError(errorMessage);
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Retry functionality
    async retry() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`Retrying... Attempt ${this.retryCount}/${this.maxRetries}`);

            this.hideError();
            this.showLoadingOverlay(true);

            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.loadPosts();

            this.showLoadingOverlay(false);
        } else {
            this.showError('Maximum retry attempts exceeded. Please refresh the page.');
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Error display
    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorText = document.getElementById('error-text');
        const blogGrid = document.getElementById('blog-grid');

        if (errorContainer && errorText) {
            errorText.textContent = message;
            errorContainer.style.display = 'block';
        }

        if (blogGrid) {
            blogGrid.innerHTML = '';
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    hideError() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }

    // Render blog posts
    renderPosts() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(0, endIndex);

        if (postsToShow.length === 0) {
            blogGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        blogGrid.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');

        // Add click listeners
        blogGrid.querySelectorAll('.blog-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.openModal(postsToShow[index]);
            });
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Create post card HTML with PERFECT sizing
    createPostCard(post) {
        const formattedDate = this.formatDate(post.date);
        const categoryClass = post.category.toLowerCase().replace(/\s+/g, '-');
        // © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

        return `
            <article class="blog-card" data-category="${categoryClass}">
                <div class="blog-card-image">
                    ${post.image ? 
                        `<img src="${post.image}" alt="${this.escapeHtml(post.title)}">` :
                        `<i class="fas fa-blog"></i>`
                    }
                </div>

                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${this.escapeHtml(post.category)}</span>
                        <span class="blog-card-date">${formattedDate}</span>
                    </div>

                    <h3 class="blog-card-title">${this.escapeHtml(post.title)}</h3>
                    <p class="blog-card-excerpt">${this.escapeHtml(post.excerpt)}</p>

                    <div class="blog-card-footer">
                        <a href="#" class="read-more" onclick="event.preventDefault();">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime} min read
                        </span>
                    </div>
                </div>
            </article>
        `;
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Render filter tags
    renderFilters() {
        const filterTags = document.getElementById('filter-tags');
        if (!filterTags) return;

        // Keep 'All' button, add category filters
        const allButton = filterTags.querySelector('[data-filter="all"]');
        filterTags.innerHTML = '';

        if (allButton) {
            filterTags.appendChild(allButton);
        } else {
            filterTags.innerHTML = `
                <button class="filter-tag active" data-filter="all">
                    <i class="fas fa-th"></i>
                    All
                </button>
            `;
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Add category filters
        Array.from(this.categories).sort().forEach(category => {
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
            const categoryIcon = this.getCategoryIcon(category);

            const filterButton = document.createElement('button');
            filterButton.className = 'filter-tag';
            filterButton.setAttribute('data-filter', categorySlug);
            filterButton.innerHTML = `
                <i class="${categoryIcon}"></i>
                ${this.escapeHtml(category)}
            `;

            filterTags.appendChild(filterButton);
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Get category icon
    getCategoryIcon(category) {
        const iconMap = {
            'data science': 'fas fa-chart-line',
            'web development': 'fas fa-code',
            'machine learning': 'fas fa-brain',
            'ai/ml': 'fas fa-robot',
            'python': 'fab fa-python',
            'javascript': 'fab fa-js',
            'tutorial': 'fas fa-book',
            'project': 'fas fa-project-diagram',
            'career': 'fas fa-briefcase',
            'technology': 'fas fa-microchip'
        };

        return iconMap[category.toLowerCase()] || 'fas fa-tag';
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Initialize search
    initSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.currentPage = 1;
                this.filterAndSearch();
            }, 300);
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Initialize filters
    initFilters() {
        const filterTags = document.getElementById('filter-tags');
        if (!filterTags) return;

        filterTags.addEventListener('click', (e) => {
            const filterTag = e.target.closest('.filter-tag');
            if (!filterTag) return;

            // Update active filter
            filterTags.querySelectorAll('.filter-tag').forEach(tag => {
                tag.classList.remove('active');
            });
            filterTag.classList.add('active');

            // Apply filter
            this.currentFilter = filterTag.dataset.filter;
            this.currentPage = 1;
            this.filterAndSearch();
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Filter and search posts
    filterAndSearch() {
        this.filteredPosts = this.posts.filter(post => {
            const matchesFilter = this.currentFilter === 'all' || 
                post.category.toLowerCase().replace(/\s+/g, '-') === this.currentFilter;

            const matchesSearch = !this.searchTerm || 
                post.title.toLowerCase().includes(this.searchTerm) ||
                post.excerpt.toLowerCase().includes(this.searchTerm) ||
                post.category.toLowerCase().includes(this.searchTerm);

            return matchesFilter && matchesSearch;
        });

        this.renderPosts();
        this.updateLoadMoreButton();
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Update load more button
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.postsPerPage;
        const hasMore = totalShown < this.filteredPosts.length;

        loadMoreBtn.style.display = hasMore ? 'flex' : 'none';

        // Remove existing event listeners and add new one
        const newBtn = loadMoreBtn.cloneNode(true);
        loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);

        newBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderPosts();
            this.updateLoadMoreButton();
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Update statistics
    updateStats() {
        const totalPosts = document.getElementById('total-posts');
        const totalCategories = document.getElementById('total-categories');
        const avgReadTime = document.getElementById('avg-read-time');
        const latestPost = document.getElementById('latest-post');

        if (totalPosts) totalPosts.textContent = this.posts.length;
        if (totalCategories) totalCategories.textContent = this.categories.size;

        if (avgReadTime && this.posts.length > 0) {
            const avgTime = Math.round(
                this.posts.reduce((sum, post) => sum + parseInt(post.readTime), 0) / this.posts.length
            );
            avgReadTime.textContent = avgTime;
        }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        if (latestPost && this.posts.length > 0) {
            const latest = new Date(this.posts[0].date);
            const now = new Date();
            const daysAgo = Math.floor((now - latest) / (1000 * 60 * 60 * 24));

            if (daysAgo === 0) {
                latestPost.textContent = 'Today';
            } else if (daysAgo === 1) {
                latestPost.textContent = 'Yesterday';
            } else if (daysAgo < 7) {
                latestPost.textContent = `${daysAgo}d ago`;
            } else {
                latestPost.textContent = 'Recent';
            }
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Modal functionality
    initModal() {
        const modal = document.getElementById('blog-modal');
        const closeBtn = modal?.querySelector('.modal-close');

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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Open modal
    openModal(post) {
        const modal = document.getElementById('blog-modal');
        if (!modal) return;

        // Update modal content
        const modalCategory = modal.querySelector('.modal-category');
        const modalDate = modal.querySelector('.modal-date');
        const modalReadTime = modal.querySelector('.modal-read-time span');
        const modalTitle = modal.querySelector('.modal-title');
        const modalContent = modal.querySelector('.modal-content-body');
        const modalTags = modal.querySelector('.modal-tags');

        if (modalCategory) modalCategory.textContent = post.category;
        if (modalDate) modalDate.textContent = this.formatDate(post.date);
        if (modalReadTime) modalReadTime.textContent = `${post.readTime} min read`;
        if (modalTitle) modalTitle.textContent = post.title;
        if (modalContent) modalContent.innerHTML = this.formatContent(post.content);
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        // Add tags if available
        if (modalTags && post.tags) {
            const tagsHTML = post.tags.map(tag => 
                `<span class="tag">${this.escapeHtml(tag)}</span>`
            ).join('');
            modalTags.innerHTML = `<h4>Tags</h4><div class="tags-list">${tagsHTML}</div>`;
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Close modal
    closeModal() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Newsletter functionality
    initNewsletter() {
        const form = document.getElementById('newsletter-form');
        const emailInput = document.getElementById('newsletter-email');
        const submitBtn = form?.querySelector('.btn-subscribe');

        if (!form || !emailInput || !submitBtn) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();

            if (!this.isValidEmail(email)) {
                this.showNewsletterMessage('Please enter a valid email address.', 'error');
                return;
            }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Subscribing...</span>';

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                this.showNewsletterMessage('Successfully subscribed! Welcome to our newsletter.', 'success');
                emailInput.value = '';
            } catch (error) {
                this.showNewsletterMessage('Subscription failed. Please try again later.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Newsletter messages
    showNewsletterMessage(message, type) {
        const noteElement = document.querySelector('.newsletter-note');
        if (!noteElement) return;

        noteElement.textContent = message;
        noteElement.className = `newsletter-note ${type}`;

        setTimeout(() => {
            noteElement.className = 'newsletter-note';
            noteElement.innerHTML = '<i class="fas fa-shield-alt"></i><span>Your privacy is important to us. Unsubscribe anytime.</span>';
        }, 5000);
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    // Back to top button
    initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatContent(content) {
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]*)`/g, '<code>$1</code>')
            .replace(/^(?!<[h|u|o|l|p|d])(.*)$/gm, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/## (.*?)(<\/p>|$)/g, '<h2>$1</h2>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Global share functionality
function shareArticle(platform) {
    const title = document.querySelector('.modal-title')?.textContent || 'Check out this article';
    const url = window.location.href;

    switch(platform) {
        case 'twitter':
            window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                '_blank',
                'width=600,height=400'
            );
            break;
        case 'linkedin':
            window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                '_blank',
                'width=600,height=400'
            );
            break;
            // © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
        case 'copy':
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    const btn = document.querySelector('.share-copy');
                    const originalIcon = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        btn.innerHTML = originalIcon;
                    }, 2000);
                });
            }
            break;
    }
}
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.
// Initialize blog when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.blog = new Blog();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Blog;
}
// © 2025 Gaurav Kumar Yadav — All rights reserved.

// GitHub: https://github.com/the-gaurav-codes
// Instagram: https://www.instagram.com/the_gau_rav/
// Email: kumar.gaurav.yadav2007@gmail.com

// Unauthorized copying or use of this code is prohibited.