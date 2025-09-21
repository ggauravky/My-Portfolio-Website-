// Enhanced Blog JavaScript with comprehensive error handling
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
        this.init();
    }

    async init() {
        try {
            this.showLoadingOverlay(true);
            
            // Initialize theme (same as portfolio)
            this.initTheme();
            
            // Initialize navigation
            this.initNavigation();
            
            // Load blog posts
            await this.loadPosts();
            
            // Initialize components
            this.initSearch();
            this.initFilters();
            this.initModal();
            this.initNewsletter();
            this.initAnimations();
            
            console.log('Blog initialized successfully');
        } catch (error) {
            console.error('Error initializing blog:', error);
            this.showError('Failed to initialize blog. Please refresh the page.');
        } finally {
            this.showLoadingOverlay(false);
        }
    }

    // Show/hide loading overlay
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    // Theme Management (same as portfolio)
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Navigation (mobile menu)
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    // Load blog posts from JSON file
    async loadPosts() {
        try {
            this.isLoading = true;
            
            const response = await fetch('./blog.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Validate data structure
            if (!data || !Array.isArray(data.posts)) {
                throw new Error('Invalid blog data structure');
            }

            // Validate each post
            this.posts = data.posts.filter(post => this.validatePost(post));
            
            if (this.posts.length === 0) {
                throw new Error('No valid blog posts found');
            }

            this.filteredPosts = [...this.posts];
            
            // Hide error container and show blog grid
            this.hideError();
            
            // Render content
            this.renderPosts();
            this.renderFilters();
            this.updateStats();
            
            this.retryCount = 0; // Reset retry count on success
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.handleLoadError(error);
        } finally {
            this.isLoading = false;
        }
    }

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

    // Handle loading errors with retry logic
    handleLoadError(error) {
        let errorMessage = 'Unable to load blog posts. ';

        if (error.message.includes('fetch')) {
            errorMessage += 'Please check your internet connection.';
        } else if (error.message.includes('HTTP')) {
            errorMessage += 'The blog data file could not be found.';
        } else if (error.message.includes('JSON')) {
            errorMessage += 'The blog data is corrupted.';
        } else if (error.message.includes('Invalid blog data')) {
            errorMessage += 'The blog data format is incorrect.';
        } else if (error.message.includes('No valid blog posts')) {
            errorMessage += 'No valid blog posts were found.';
        } else {
            errorMessage += 'An unexpected error occurred.';
        }

        this.showError(errorMessage);
    }

    // Retry loading posts
    async retry() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`Retrying... Attempt ${this.retryCount}/${this.maxRetries}`);
            
            this.hideError();
            this.showLoadingOverlay(true);
            
            // Add delay for retry
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await this.loadPosts();
            this.showLoadingOverlay(false);
        } else {
            this.showError('Maximum retry attempts exceeded. Please refresh the page or try again later.');
        }
    }

    // Show error message
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

    // Hide error message
    hideError() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }

    // Render blog posts with image error handling
    renderPosts() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(0, endIndex);

        if (postsToShow.length === 0) {
            blogGrid.innerHTML = `
                <div class="no-results fade-in">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }

        const postsHTML = postsToShow.map(post => `
            <article class="blog-card fade-in" onclick="blog.openPost('${post.id}')">
                <div class="blog-card-image ${post.image ? '' : 'loading'}">
                    ${post.image ? 
                        `<img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.parentElement.classList.add('loading'); this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <i class="fas fa-${post.icon || 'newspaper'}" style="display: none;"></i>` :
                        `<i class="fas fa-${post.icon || 'newspaper'}"></i>`
                    }
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${this.formatCategory(post.category)}</span>
                        <span class="blog-card-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(post.date)}
                        </span>
                    </div>
                    <h3 class="blog-card-title">${this.escapeHtml(post.title)}</h3>
                    <p class="blog-card-excerpt">${this.escapeHtml(post.excerpt)}</p>
                    <div class="blog-card-footer">
                        <a href="#" class="read-more" onclick="event.stopPropagation(); blog.openPost('${post.id}')">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                </div>
            </article>
        `).join('');

        blogGrid.innerHTML = postsHTML;

        // Show/hide load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = postsToShow.length < this.filteredPosts.length ? 'block' : 'none';
            loadMoreBtn.onclick = () => this.loadMore();
        }

        this.observeElements();
    }

    // Render filters dynamically
    renderFilters() {
        const filtersContainer = document.getElementById('blog-filters');
        if (!filtersContainer || !this.posts.length) return;

        // Get unique categories
        const categories = [...new Set(this.posts.map(post => post.category))];
        
        const filtersHTML = `
            <button class="filter-tag ${this.currentFilter === 'all' ? 'active' : ''}" data-category="all">All</button>
            ${categories.map(category => `
                <button class="filter-tag ${this.currentFilter === category ? 'active' : ''}" 
                        data-category="${category}">
                    ${this.formatCategory(category)}
                </button>
            `).join('')}
        `;

        filtersContainer.innerHTML = filtersHTML;
    }

    // Load more posts
    loadMore() {
        this.currentPage++;
        this.renderPosts();
    }

    // Initialize search
    initSearch() {
        const searchInput = document.getElementById('blog-search');
        if (!searchInput) return;

        // Debounce search to avoid too many calls
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterPosts();
            }, 300);
        });
    }

    // Initialize filters
    initFilters() {
        const filtersContainer = document.getElementById('blog-filters');
        if (!filtersContainer) return;
        
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                // Update active filter
                document.querySelectorAll('.filter-tag').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.getAttribute('data-category');
                this.filterPosts();
            }
        });
    }

    // Filter posts
    filterPosts() {
        this.currentPage = 1;
        
        this.filteredPosts = this.posts.filter(post => {
            // Filter by category
            const categoryMatch = this.currentFilter === 'all' || post.category === this.currentFilter;
            
            // Filter by search term
            const searchMatch = !this.searchTerm || 
                post.title.toLowerCase().includes(this.searchTerm) ||
                post.excerpt.toLowerCase().includes(this.searchTerm) ||
                post.category.toLowerCase().includes(this.searchTerm);
            
            return categoryMatch && searchMatch;
        });

        this.renderPosts();
    }

    // Initialize modal
    initModal() {
        const modal = document.getElementById('article-modal');
        const closeBtn = document.getElementById('article-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    // Open post modal with image handling
    openPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        const modal = document.getElementById('article-modal');
        const articleBody = document.getElementById('article-body');

        if (!post || !modal || !articleBody) return;

        const imageHTML = post.image ? 
            `<img src="${post.image}" alt="${post.title}" class="article-image" 
                  onerror="this.style.display='none';">` : '';

        const articleHTML = `
            <div class="article-header">
                ${imageHTML}
                <h1 class="article-title">${this.escapeHtml(post.title)}</h1>
                <div class="article-meta">
                    <span class="post-category">${this.formatCategory(post.category)}</span>
                    <span class="post-date">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(post.date)}
                    </span>
                    <span class="read-time">
                        <i class="fas fa-clock"></i>
                        ${post.readTime}
                    </span>
                </div>
            </div>
            <div class="article-content">
                ${this.renderMarkdown(post.content)}
            </div>
        `;

        articleBody.innerHTML = articleHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        modal.querySelector('.modal-close')?.focus();
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('article-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Initialize newsletter
    initNewsletter() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            if (!this.validateEmail(emailInput.value)) {
                this.showNotification('Please enter a valid email address.', 'error');
                return;
            }

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                this.showNotification('Successfully subscribed! Welcome to the newsletter.', 'success');
                emailInput.value = '';
            } catch (error) {
                this.showNotification('Failed to subscribe. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    

    // Initialize animations
    initAnimations() {
        this.observeElements();
    }

    observeElements() {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (!el.classList.contains('visible')) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(el);
            }
        });
    }

    // Update stats
    updateStats() {
        const totalPostsEl = document.getElementById('total-posts');
        const totalCategoriesEl = document.getElementById('total-categories');
        
        if (totalPostsEl) {
            totalPostsEl.textContent = this.posts.length;
        }
        
        if (totalCategoriesEl) {
            const categories = [...new Set(this.posts.map(post => post.category))];
            totalCategoriesEl.textContent = categories.length;
        }
    }

    // Utility functions
    formatCategory(category) {
        const categories = {
            'web-development': 'Web Development',
            'data-science': 'Data Science',
            'ai-ml': 'AI/ML',
            'python': 'Python'
        };
        return categories[category] || category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            return dateString;
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    renderMarkdown(content) {
        // Simple markdown renderer
        return content
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\> (.*$)/gim, '<blockquote><p>$1</p></blockquote>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/``````/gim, '<pre><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/^(?!<[h|u|b|p|l])(.*)$/gim, '<p>$1</p>');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--secondary-color)' : '#dc2626'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            z-index: 3000;
            box-shadow: 0 4px 12px var(--shadow-color);
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blog = new Blog();
});
