/**
 * Navbar Active State Manager
 * Automatically highlights the current page in navigation
 */

(function() {
    'use strict';

    /**
     * Set active nav link based on current page
     */
    function setActiveNavLink() {
        // Get current page filename (default to index.html if empty)
        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '') {
            currentPage = 'index.html';
        }

        // Get all nav links
        const navLinks = document.querySelectorAll('.nav-links a');

        // Remove active class from all links first
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class ONLY to the matching link
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');

            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Run when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setActiveNavLink);
    } else {
        setActiveNavLink();
    }
})();
