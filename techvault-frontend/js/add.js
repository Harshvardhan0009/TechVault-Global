/* =========================================
   add.js
   — Form validation
   — Save new innovation to localStorage
   — Toast success notification
   — Redirect to archive after save
   ========================================= */

(function () {
    'use strict';

    const form   = document.getElementById('add-form');
    const toast  = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    if (!form) return;

    /* ── Navbar shrink (reuse scroll behaviour) ── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ── Helpers ── */
    function generateId() {
        return 'tv-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    }

    function setError(groupId, hasError) {
        const group = document.getElementById(groupId);
        if (!group) return;
        group.classList.toggle('has-error', hasError);
    }

    function clearErrors() {
        document.querySelectorAll('.form-group').forEach((g) => g.classList.remove('has-error'));
    }

    /* ── Validation ── */
    function validate(data) {
        let valid = true;

        if (!data.title || data.title.trim().length < 2) {
            setError('group-title', true);
            valid = false;
        }

        const y = parseInt(data.year, 10);
        if (!data.year || isNaN(y) || y < 1800 || y > 2099) {
            setError('group-year', true);
            valid = false;
        }

        if (!data.category) {
            setError('group-category', true);
            valid = false;
        }

        if (!data.description || data.description.trim().length < 20) {
            setError('group-description', true);
            valid = false;
        }

        return valid;
    }

    /* ── Toast ── */
    function showToast(message, duration = 3200) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }

    /* ── Live input → clear error ── */
    form.querySelectorAll('input, select, textarea').forEach((el) => {
        el.addEventListener('input', () => {
            const group = el.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
    });

    /* ── Submit ── */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const data = {
            id:          generateId(),
            title:       form.title.value.trim(),
            year:        parseInt(form.year.value, 10),
            category:    form.category.value,
            country:     form.country.value.trim(),
            inventor:    form.inventor.value.trim(),
            description: form.description.value.trim(),
            impact:      form.impact.value,
            status:      form.status.value,
            addedAt:     new Date().toISOString(),
        };

        if (!validate(data)) {
            /* Scroll to first error */
            const firstError = form.querySelector('.has-error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        /* Load current data, append, save */
        let existing = [];
        try {
            const stored = localStorage.getItem('techvault_innovations');
            existing = stored ? JSON.parse(stored) : [];
        } catch {
            existing = [];
        }

        existing.unshift(data); // newest first
        try {
            localStorage.setItem('techvault_innovations', JSON.stringify(existing));
        } catch (err) {
            showToast('⚠ Could not save — storage may be full.');
            return;
        }

        showToast(`"${data.title}" saved to the vault!`);
        form.reset();

        /* Redirect to archive after short delay */
        setTimeout(() => {
            window.location.href = `index.html#archive`;
        }, 2000);
    });
})();