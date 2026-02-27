/* =========================================
   archive.js
   — localStorage data store
   — Seed data (default innovations)
   — Render archive grid
   — Category filter buttons
   ========================================= */

(function () {
    'use strict';

    const STORAGE_KEY = 'techvault_innovations';

    /* ── Default seed data ── */
    const SEED_DATA = [
        {
            id: 'seed-1',
            title: 'World Wide Web',
            year: 1990,
            category: 'communication',
            country: 'Switzerland',
            inventor: 'Tim Berners-Lee / CERN',
            description: 'Tim Berners-Lee proposed a hypertext system at CERN that became the World Wide Web — turning the internet into a global public information space.',
            impact: 'revolutionary',
            status: 'mainstream',
        },
        {
            id: 'seed-2',
            title: 'Transistor',
            year: 1947,
            category: 'computing',
            country: 'USA',
            inventor: 'Bell Labs (Shockley, Bardeen, Brattain)',
            description: 'The transistor replaced the vacuum tube as the fundamental building block of electronic circuits, enabling miniaturisation and the entire digital age.',
            impact: 'revolutionary',
            status: 'mainstream',
        },
        {
            id: 'seed-3',
            title: 'CRISPR-Cas9 Gene Editing',
            year: 2012,
            category: 'medical',
            country: 'USA / France',
            inventor: 'Jennifer Doudna & Emmanuelle Charpentier',
            description: 'A precise, low-cost tool for editing DNA sequences, opening the door to cures for genetic diseases and transforming biological research worldwide.',
            impact: 'revolutionary',
            status: 'emerging',
        },
        {
            id: 'seed-4',
            title: 'Electric Vehicle Battery',
            year: 2008,
            category: 'energy',
            country: 'USA',
            inventor: 'Tesla / Elon Musk',
            description: 'High-density lithium-ion battery packs brought electric vehicles into the mainstream, accelerating the global transition away from fossil-fuel transportation.',
            impact: 'high',
            status: 'mainstream',
        },
        {
            id: 'seed-5',
            title: 'GPS Navigation',
            year: 1983,
            category: 'transport',
            country: 'USA',
            inventor: 'U.S. Department of Defense',
            description: 'A satellite-based global positioning system that revolutionised navigation for military, aviation, shipping, and everyday consumer devices.',
            impact: 'high',
            status: 'mainstream',
        },
        {
            id: 'seed-6',
            title: '5G Wireless Network',
            year: 2019,
            category: 'communication',
            country: 'South Korea / China',
            inventor: 'Multiple carriers & standards bodies',
            description: 'Fifth-generation wireless technology delivering ultra-low latency and massive bandwidth, enabling the Internet of Things, autonomous vehicles, and smart cities.',
            impact: 'high',
            status: 'emerging',
        },
        {
            id: 'seed-7',
            title: 'MRI Scanner',
            year: 1977,
            category: 'medical',
            country: 'USA',
            inventor: 'Raymond Damadian',
            description: 'Magnetic resonance imaging gave doctors a non-invasive window into the human body, transforming diagnostics for cancer, neurological conditions, and injuries.',
            impact: 'high',
            status: 'mainstream',
        },
        {
            id: 'seed-8',
            title: 'Solar Photovoltaic Cell',
            year: 1954,
            category: 'energy',
            country: 'USA',
            inventor: 'Bell Labs',
            description: 'The first practical silicon solar cell converted sunlight into electricity at viable efficiency, planting the seed of the renewable energy revolution.',
            impact: 'revolutionary',
            status: 'mainstream',
        },
    ];

    /* ── Data helpers ── */
    function loadData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('TechVault: localStorage not available.', e);
        }
    }

    function getData() {
        let data = loadData();
        if (!data) {
            data = [...SEED_DATA];
            saveData(data);
        }
        return data;
    }

    /* Public API used by add.js */
    window.TechVault = window.TechVault || {};
    window.TechVault.getData = getData;
    window.TechVault.saveData = saveData;
    window.TechVault.STORAGE_KEY = STORAGE_KEY;

    /* ── Render ── */
    const grid = document.getElementById('archive-grid');
    if (!grid) return; // not on index page

    let currentFilter = 'all';

    function impactLabel(val) {
        const map = {
            low: 'Low Impact',
            medium: 'Medium Impact',
            high: 'High Impact',
            revolutionary: 'Revolutionary',
        };
        return map[val] || '';
    }

    function renderGrid(filter) {
        const data = getData();
        const filtered = filter === 'all'
            ? data
            : data.filter((d) => d.category === filter);

        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="archive-empty">No innovations found in this category yet.<br><a href="add.html" style="color:var(--red)">Add one →</a></div>`;
            return;
        }

        // Sort newest first
        const sorted = [...filtered].sort((a, b) => b.year - a.year);

        sorted.forEach((item) => {
            const card = document.createElement('a');
            card.className = 'archive-card reveal';
            card.href = `details.html?id=${item.id}`;

            card.innerHTML = `
                <div class="archive-card-category">${item.category}${item.impact ? ' &nbsp;·&nbsp; ' + impactLabel(item.impact) : ''}</div>
                <div class="archive-card-title">${escapeHtml(item.title)}</div>
                <div class="archive-card-year">${item.year}${item.country ? ' &nbsp;·&nbsp; ' + escapeHtml(item.country) : ''}</div>
                <p class="archive-card-desc">${escapeHtml(item.description).substring(0, 130)}${item.description.length > 130 ? '…' : ''}</p>
            `;

            grid.appendChild(card);
        });

        /* Re-run reveal observer on new cards */
        if (window._revealObserver) {
            grid.querySelectorAll('.reveal').forEach((el) => window._revealObserver.observe(el));
        } else {
            /* Fallback: just show them */
            grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ── Filter buttons ── */
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGrid(currentFilter);
        });
    });

    /* Initial render */
    renderGrid('all');

    /* Expose a refreshGrid for add.js to call after saving */
    window.TechVault.refreshGrid = () => renderGrid(currentFilter);
})();