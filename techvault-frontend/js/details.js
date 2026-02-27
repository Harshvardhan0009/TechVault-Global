/* =========================================
   details.js
   — Reads URL query params: ?id=, ?category=, ?country=, ?future=
   — Renders appropriate detail content
   — Handles user-saved entries from localStorage
   ========================================= */

(function () {
    'use strict';

    /* ── Navbar shrink ── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    const root = document.getElementById('details-root');
    if (!root) return;

    const params     = new URLSearchParams(window.location.search);
    const entryId    = params.get('id');
    const categoryKey = params.get('category');
    const countryKey  = params.get('country');
    const futureKey   = params.get('future');

    /* ── Static knowledge base ── */

    const CATEGORIES = {
        communication: {
            title: 'Communication',
            tagline: 'From smoke signals to 5G — connecting humanity across every distance.',
            body: [
                'Communication technology is the thread binding civilisation together. The journey began with the written word and evolved through the printing press, telegraph, telephone, radio, television, internet, and beyond.',
                'Each leap reduced the friction of distance. The telephone annihilated the tyranny of geography. The internet collapsed the barriers of time and borders entirely, enabling instant exchange of knowledge, culture, and commerce across every corner of the globe.',
                'Today 5G networks and satellite constellations are pushing towards ubiquitous, ultra-low-latency connectivity, while natural language AI is beginning to dissolve even the barrier of language itself.',
            ],
            stats: [{ n: '5.4B', l: 'Internet Users' }, { n: '8B+', l: 'Mobile Subscriptions' }, { n: '5G', l: 'Generation of Wireless' }],
        },
        computing: {
            title: 'Computing',
            tagline: 'From mechanical calculators to quantum chips — the engine of the modern world.',
            body: [
                'Computing traces its formal origins to Charles Babbage\'s Analytical Engine concept and Ada Lovelace\'s pioneering algorithms. The electronic age exploded after the 1947 transistor, with Moore\'s Law doubling transistor density roughly every two years for over five decades.',
                'The personal computer democratised access to computation. The internet networked those computers together. Cloud computing centralised vast resources, and smartphones placed supercomputers in billions of pockets.',
                'Today AI accelerators, neuromorphic chips, and quantum processors represent the next inflection — processing paradigms that may transcend the classical von Neumann architecture entirely.',
            ],
            stats: [{ n: '10²²', l: 'Transistors Made to Date' }, { n: '3nm', l: 'Smallest Process Node' }, { n: '1000+', l: 'Qubits (IBM 2024)' }],
        },
        medical: {
            title: 'Medical Technology',
            tagline: 'From surgery without anaesthesia to CRISPR — rewriting the limits of life.',
            body: [
                'Medical technology has fundamentally redefined what it means to be human, extending average global life expectancy from around 30 years in 1800 to over 73 today. Vaccines, antibiotics, anaesthesia, and germ theory eliminated scourges that killed millions annually.',
                'The 20th century brought radiology, MRI, heart transplants, and laparoscopic surgery. The 21st arrived with genomic sequencing, mRNA vaccines, robotic surgery, and CRISPR gene editing — the ability to rewrite the source code of life itself.',
                'AI-driven diagnostics can now detect cancers, retinal disease, and cardiac abnormalities from imaging with accuracy matching or exceeding specialist clinicians, promising a future of truly personalised, preventive medicine.',
            ],
            stats: [{ n: '73yrs', l: 'Global Life Expectancy' }, { n: '24hrs', l: 'Genome Sequencing Time' }, { n: '$100', l: 'Cost to Sequence Genome (2024)' }],
        },
        transport: {
            title: 'Transportation',
            tagline: 'From sail to hyperloop — shrinking the world through motion.',
            body: [
                'Transportation technology has always been synonymous with civilisational advance. The wheel, the sail, the steam engine, the railway, the combustion engine, and commercial aviation each collapsed the distances separating people, goods, and ideas.',
                'The 20th century was defined by the automobile and the jet plane, which reshaped cities and made global travel routine. The 21st is being defined by electrification, autonomous driving, and urban air mobility.',
                'GPS has revolutionised logistics; container shipping underpins globalisation; and the push for zero-emission transport — from electric cars to hydrogen freight — is the defining infrastructure challenge of the coming decades.',
            ],
            stats: [{ n: '4.5B', l: 'Air Passengers / Year' }, { n: '10M+', l: 'EVs Sold in 2023' }, { n: '97%', l: 'Global Trade Moves by Sea' }],
        },
        energy: {
            title: 'Energy Technology',
            tagline: 'From fire to fusion — powering every era of human ambition.',
            body: [
                'Energy technology is the master enabler — without it, no other technology functions. The Industrial Revolution ran on coal; the 20th century on oil and gas; the digital revolution on electricity from an increasingly diverse mix of sources.',
                'The photovoltaic cell, wind turbine, and lithium-ion battery form the triad of the clean-energy revolution now underway. Solar costs have fallen over 99% since 1977; wind is now the cheapest new electricity source in history.',
                'Nuclear fusion — long the holy grail — achieved ignition at the National Ignition Facility in 2022, raising the prospect of virtually limitless, clean baseload power within the coming decades.',
            ],
            stats: [{ n: '99%', l: 'Solar Cost Drop Since 1977' }, { n: '30%', l: 'Global Electricity from Renewables' }, { n: '2022', l: 'Year of Fusion Ignition' }],
        },
    };

    const COUNTRIES = {
        usa: {
            title: 'United States of America',
            tagline: 'Silicon Valley to Cape Canaveral — leading the global tech frontier for a century.',
            body: [
                'The United States has dominated global technological innovation since the early 20th century. From the Wright brothers\' first flight and Bell Labs\' transistor to the internet, the personal computer, the smartphone, and large-scale AI, American institutions have repeatedly defined the state of the art.',
                'Silicon Valley emerged from the confluence of Stanford University, defence funding, and venture capital into the world\'s most powerful tech ecosystem. Companies like IBM, Intel, Apple, Google, Amazon, and Microsoft have set the global technological agenda for decades.',
                'The US spends more on R&D than any other nation in absolute terms, and its research universities — MIT, Caltech, Stanford, Carnegie Mellon — attract talent from every country on Earth, creating a self-reinforcing innovation flywheel.',
            ],
            stats: [{ n: '#1', l: 'Global R&D Spending' }, { n: '7/10', l: 'Top Tech Companies' }, { n: '$700B+', l: 'Annual R&D Investment' }],
        },
        india: {
            title: 'India',
            tagline: 'From Mangalyaan to digital payments — the world\'s fastest-growing tech power.',
            body: [
                'India\'s technological rise has been one of the defining stories of the 21st century. From a largely agrarian economy at independence, India built world-class space, nuclear, and software capabilities within decades, culminating in the Indian Space Research Organisation\'s Mars Orbiter Mission — completed at a fraction of NASA\'s equivalent cost.',
                'India\'s IT services sector — centred on Bengaluru, Hyderabad, and Pune — has made the country the back-office of the global economy. Homegrown companies like Infosys, TCS, and Wipro, alongside a booming startup ecosystem, have created millions of high-skilled jobs.',
                'The UPI digital payments platform processes billions of transactions monthly, making India a global leader in financial technology inclusion. With 1.4 billion people and the world\'s largest young population, India\'s technological trajectory has only begun.',
            ],
            stats: [{ n: '1,400', l: 'Tech Unicorns & Startups' }, { n: '12B+', l: 'UPI Transactions / Month' }, { n: '#3', l: 'Global Startup Ecosystem' }],
        },
        china: {
            title: 'China',
            tagline: 'From manufacturing hub to AI superpower — the world\'s most ambitious tech sprint.',
            body: [
                'China\'s technological transformation over four decades ranks among the most dramatic in history. Beginning as the world\'s low-cost manufacturer, China has systematically climbed the value chain to become a global leader in AI, 5G, electric vehicles, renewable energy, and space technology.',
                'Domestic champions Huawei, Alibaba, Tencent, Baidu, BYD, and DJI compete — and often lead — on the global stage. China files more patents annually than any other country, and its universities now produce the largest share of the world\'s STEM graduates.',
                'State-backed megaprojects like the Belt and Road Initiative, the Beidou satellite navigation system, and the China Space Station reflect a long-term national strategy to achieve technological self-sufficiency and global leadership across every critical domain.',
            ],
            stats: [{ n: '#1', l: 'Annual Patent Filings' }, { n: '40%', l: 'Global EV Market Share' }, { n: '#2', l: 'AI Research Output' }],
        },
        germany: {
            title: 'Germany',
            tagline: 'The engineer\'s republic — precision, process, and industrial mastery.',
            body: [
                'Germany\'s technological identity is inseparable from its engineering culture. The country that gave the world the automobile (Benz, Daimler), aspirin, X-rays, the diesel engine, and the jet turbine remains a global industrial powerhouse anchored by its Mittelstand — thousands of mid-sized firms that are world leaders in their niches.',
                'German engineering excellence is embodied in sectors from automotive (BMW, Mercedes, Volkswagen) and machine tools to optics (Zeiss) and chemicals (BASF, Bayer). The country\'s apprenticeship system is the global gold standard for technical workforce development.',
                'Germany is now leading Europe\'s green transition with Energiewende — an ambitious national programme to decarbonise its entire energy system — while investing heavily in hydrogen technology, advanced manufacturing, and quantum computing research.',
            ],
            stats: [{ n: '#3', l: 'Global Export Economy' }, { n: '40%', l: 'Electricity from Renewables' }, { n: '2.9%', l: 'GDP Spent on R&D' }],
        },
        japan: {
            title: 'Japan',
            tagline: 'Kaizen, robotics, and bullet trains — the art of technological refinement.',
            body: [
                'Japan\'s technological philosophy — rooted in the concept of kaizen, or continuous improvement — has produced some of the world\'s most reliable, refined, and innovative products and systems. The Shinkansen bullet train network, launched in 1964, remains a benchmark for high-speed rail safety and punctuality worldwide.',
                'Japanese companies pioneered consumer electronics, cameras, game consoles, and hybrid vehicles. Sony, Toyota, Honda, Panasonic, Nintendo, and Canon defined entire consumer categories. Japan leads the world in industrial robotics density — its factories are among the most automated on Earth.',
                'Japan is now investing aggressively in next-generation semiconductors, AI, quantum computing, and space exploration, partnering with the US and other allies as it seeks to reclaim technological leadership in the 21st century.',
            ],
            stats: [{ n: '#1', l: 'Industrial Robot Density' }, { n: '320km/h', l: 'Shinkansen Top Speed' }, { n: '3.3%', l: 'GDP Spent on R&D' }],
        },
    };

    const FUTURE = {
        ai: {
            title: 'Artificial Intelligence',
            tagline: 'The last invention humanity may ever need to make.',
            body: [
                'Artificial intelligence has transitioned in a single decade from a research curiosity to a general-purpose technology reshaping every sector of the economy. Large language models, diffusion models, and reinforcement learning agents now write code, design molecules, compose music, and reason across complex multi-step problems.',
                'The current wave — driven by transformer architectures, massive compute, and internet-scale data — is producing systems with emergent capabilities that surprise even their creators. GPT-4, Gemini, Claude and their successors represent a qualitative shift in machine capability.',
                'Researchers debate whether artificial general intelligence — systems matching human cognitive flexibility across all domains — could arrive within years or decades. Either timeline implies a transformation of work, science, and society at a speed no prior technology has approached.',
            ],
            stats: [{ n: '$200B', l: 'AI Investment in 2024' }, { n: '300M', l: 'Jobs Potentially Affected' }, { n: '2030s', l: 'Projected AGI Timeline (Median)' }],
        },
        quantum: {
            title: 'Quantum Computing',
            tagline: 'Harnessing superposition and entanglement to solve the unsolvable.',
            body: [
                'Quantum computers exploit quantum mechanical phenomena — superposition, entanglement, and interference — to process information in ways fundamentally impossible for classical machines. Where classical bits are 0 or 1, qubits can represent both simultaneously, enabling certain computations to scale exponentially faster.',
                'Google\'s 2019 claim of quantum supremacy — performing a specific calculation in 200 seconds that would take a classical supercomputer 10,000 years — marked a symbolic milestone. IBM, IonQ, Quantinuum, and dozens of startups are now racing to build fault-tolerant systems capable of real-world applications.',
                'The stakes are enormous: quantum computers could break current encryption standards, revolutionise drug discovery by simulating molecular interactions at atomic scale, and optimise supply chains and financial models of intractable complexity. The race is as much geopolitical as it is scientific.',
            ],
            stats: [{ n: '1000+', l: 'Qubits (IBM Condor 2023)' }, { n: '$2.5B', l: 'Quantum Investment in 2023' }, { n: '2030s', l: 'Fault-Tolerant Target' }],
        },
        biotech: {
            title: 'Biotechnology',
            tagline: 'Rewriting the code of life — from CRISPR to programmable organisms.',
            body: [
                'Biotechnology sits at the intersection of biology, chemistry, computer science, and engineering. The sequencing of the human genome — completed in 2003 at a cost of $3 billion — now costs less than $100 and takes 24 hours, unlocking personalised medicine at scale.',
                'CRISPR-Cas9 gene editing, mRNA therapeutics (proved at scale by COVID-19 vaccines), synthetic biology, and organoids are converging into a platform for rewriting biology itself. Diseases once considered incurable — including certain cancers, sickle cell anaemia, and rare genetic conditions — are yielding to these tools.',
                'Synthetic biology is going further still, designing novel proteins, programmable microbes, and biosensors that could clean up pollution, manufacture sustainable materials, produce food without agriculture, and one day extend healthy human lifespan beyond current biological limits.',
            ],
            stats: [{ n: '$100', l: 'Genome Sequencing Cost (2024)' }, { n: '50+', l: 'CRISPR Clinical Trials Active' }, { n: '$800B', l: 'Biotech Market Size 2024' }],
        },
    };

    /* ── Render a stored user entry ── */
    function renderEntry(item) {
        document.title = `${item.title} — TechVault Global`;

        const bgClass = item.category ? item.category : '';
        const statusLabel = { emerging: 'Emerging', mainstream: 'Mainstream', legacy: 'Legacy', obsolete: 'Obsolete' }[item.status] || '';
        const impactLabel = { low: 'Low Impact', medium: 'Medium Impact', high: 'High Impact', revolutionary: 'Revolutionary' }[item.impact] || '';

        root.innerHTML = `
            <div class="details-hero" style="background: radial-gradient(ellipse at 50% 80%, #1a0000 0%, #000 65%);">
                <span class="details-category-badge">${escHtml(item.category || 'Innovation')}</span>
                <h1>${escHtml(item.title)}</h1>
                <div class="details-meta">
                    ${item.year ? `<span>📅 ${item.year}</span>` : ''}
                    ${item.country ? `<span>📍 ${escHtml(item.country)}</span>` : ''}
                    ${item.inventor ? `<span>👤 ${escHtml(item.inventor)}</span>` : ''}
                    ${statusLabel ? `<span>⚡ ${statusLabel}</span>` : ''}
                </div>
            </div>

            <div class="details-body">
                <a href="index.html#archive" class="details-back">← Back to Archive</a>

                <p>${escHtml(item.description)}</p>

                ${(item.impact || item.status || item.year) ? `
                <div class="details-stats">
                    ${item.year ? `<div class="stat-box"><span class="stat-number">${item.year}</span><span class="stat-label">Year of Innovation</span></div>` : ''}
                    ${item.impact ? `<div class="stat-box"><span class="stat-number">${escHtml(impactLabel)}</span><span class="stat-label">Global Impact</span></div>` : ''}
                    ${item.status ? `<div class="stat-box"><span class="stat-number">${escHtml(statusLabel)}</span><span class="stat-label">Current Status</span></div>` : ''}
                </div>
                ` : ''}

                <div style="text-align:center; margin-top: 24px;">
                    <a href="index.html#archive" class="btn-outline">← Back to Archive</a>
                    &nbsp;&nbsp;
                    <a href="add.html" class="btn-primary">+ Add Another</a>
                </div>
            </div>
        `;
    }

    /* ── Render from knowledge base ── */
    function renderKnowledge(data, backAnchor) {
        document.title = `${data.title} — TechVault Global`;

        root.innerHTML = `
            <div class="details-hero">
                <h1>${data.title}</h1>
                <p class="hero-sub" style="margin-top:16px; font-style:italic; color:var(--gray);">${data.tagline}</p>
            </div>

            <div class="details-body">
                <a href="index.html#${backAnchor}" class="details-back">← Back</a>

                ${data.body.map((p) => `<p>${p}</p>`).join('')}

                <div class="details-stats">
                    ${data.stats.map((s) => `
                        <div class="stat-box">
                            <span class="stat-number">${s.n}</span>
                            <span class="stat-label">${s.l}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="text-align:center; margin-top:24px;">
                    <a href="index.html" class="btn-outline">← Home</a>
                    &nbsp;&nbsp;
                    <a href="add.html" class="btn-primary">+ Add Innovation</a>
                </div>
            </div>
        `;
    }

    function renderNotFound() {
        document.title = 'Not Found — TechVault Global';
        root.innerHTML = `
            <div class="details-not-found">
                <h2>Entry Not Found</h2>
                <p style="color:var(--gray); margin-bottom:32px;">This innovation doesn't exist in the vault yet.</p>
                <a href="index.html" class="btn-outline" style="margin-right:12px;">← Home</a>
                <a href="add.html" class="btn-primary">Add It →</a>
            </div>
        `;
    }

    function escHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ── Route ── */
    if (entryId) {
        /* User-saved entry */
        try {
            const stored = localStorage.getItem('techvault_innovations');
            const data   = stored ? JSON.parse(stored) : [];
            const item   = data.find((d) => d.id === entryId);
            if (item) {
                renderEntry(item);
            } else {
                renderNotFound();
            }
        } catch {
            renderNotFound();
        }
    } else if (categoryKey && CATEGORIES[categoryKey]) {
        renderKnowledge(CATEGORIES[categoryKey], 'categories');
    } else if (countryKey && COUNTRIES[countryKey]) {
        renderKnowledge(COUNTRIES[countryKey], 'leaders');
    } else if (futureKey && FUTURE[futureKey]) {
        renderKnowledge(FUTURE[futureKey], 'future');
    } else {
        renderNotFound();
    }
})();