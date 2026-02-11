/**
 * Utility Functions for HRMS Lite
 */

const Utils = {
    /**
     * Show alert message
     */
    showAlert(message, type = 'success') {
        const container = document.getElementById('alertContainer');
        if (!container) return;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span>${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;

        container.innerHTML = '';
        container.appendChild(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }, 5000);

        // Scroll to alert
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Format date to readable format
     */
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    /**
     * Format datetime to readable format
     */
    formatDateTime(dateString) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    /**
     * Get today's date in YYYY-MM-DD format
     */
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Show loading state
     */
    showLoading(container, message = 'Loading...') {
        container.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p class="loading-text">${message}</p>
            </div>
        `;
    },

    /**
     * Show empty state
     */
    showEmpty(container, title, message, icon = '📭') {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${icon}</div>
                <h3 class="empty-title">${title}</h3>
                <p class="empty-text">${message}</p>
            </div>
        `;
    },

    /**
     * Show error message
     */
    showError(error) {
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (error.message) {
            errorMessage = error.message;
        }

        // Handle validation errors
        if (error.details && typeof error.details === 'object') {
            const errors = [];
            for (const [field, messages] of Object.entries(error.details)) {
                if (Array.isArray(messages)) {
                    errors.push(`${field}: ${messages.join(', ')}`);
                } else if (typeof messages === 'object' && messages.message) {
                    errors.push(messages.message);
                } else {
                    errors.push(`${field}: ${messages}`);
                }
            }
            if (errors.length > 0) {
                errorMessage = errors.join('\n');
            }
        }

        Utils.showAlert(errorMessage, 'error');
    },

    /**
     * Confirm dialog
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Disable button with loading state
     */
    disableButton(button, loadingText = 'Processing...') {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `
            <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            <span>${loadingText}</span>
        `;
    },

    /**
     * Enable button and restore original state
     */
    enableButton(button) {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
    },

    /**
     * Sanitize HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Get form data as object
     */
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        return data;
    },

    /**
     * Reset form
     */
    resetForm(form) {
        form.reset();
    },

    /**
     * Scroll to top smoothly
     */
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);
