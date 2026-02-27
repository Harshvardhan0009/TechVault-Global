/* =========================================
   scroll.js
   — Navbar shrink on scroll
   — Intersection Observer reveal animations
   ========================================= */

(function () {
    'use strict';

    /* ── Navbar shrink ── */
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ── Scroll-reveal ── */
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger child cards if the revealed element contains a card-container
                    const cards = entry.target.querySelectorAll('.card, .archive-card, .timeline-item');
                    if (cards.length > 0) {
                        cards.forEach((card, idx) => {
                            card.style.transitionDelay = `${idx * 80}ms`;
                        });
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px',
        }
    );

    revealEls.forEach((el) => observer.observe(el));

    /* ── Active nav link highlight on scroll ── */
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.navbar nav a:not(.nav-add-btn)');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        navLinks.forEach((link) => {
                            link.style.color = '';
                        });
                        const active = document.querySelector(
                            `.navbar nav a[href="#${entry.target.id}"]`
                        );
                        if (active) active.style.color = '#ffffff';
                    }
                });
            },
            { threshold: 0.4 }
        );
        sections.forEach((s) => sectionObserver.observe(s));
    }
})();