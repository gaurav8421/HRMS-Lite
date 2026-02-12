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
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Get all nav links
        const navLinks = document.querySelectorAll('.nav-links a');

        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to matching link
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');

            // Check if link matches current page
            if (linkPage === currentPage) {
                link.classList.add('active');
            }

            // Handle index.html as default/root
            if ((currentPage === '' || currentPage === 'index.html') && linkPage === 'index.html') {
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
