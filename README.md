# TechVault Global

A dark, editorial-style website exploring the evolution of technology across the world.

---

## Project Structure

```
techvault/
├── index.html          Main page (Hero, Categories, Timeline, Leaders, Future, Archive)
├── add.html            Add a new innovation form
├── details.html        Dynamic detail view (categories, countries, future tech, saved entries)
├── css/
│   └── style.css       All styles (dark theme, cards, timeline, forms, responsive)
├── js/
│   ├── scroll.js       Navbar shrink + Intersection Observer scroll-reveal
│   ├── archive.js      localStorage data store, seed data, archive grid, filter buttons
│   ├── add.js          Form validation, save to localStorage, toast notification
│   └── details.js      Reads URL params, renders detail pages from knowledge base or localStorage
└── assets/
    └── images/         All card background images
```

---

## Features

### index.html
- **Hero** — animated grid background, fade-up entrance animations, CTA buttons
- **Categories** — 5 image cards (Communication, Computing, Medical, Transportation, Energy)
- **Timeline** — alternating left/right milestone layout (1876 → 2022)
- **Global Leaders** — 5 country cards (USA, India, China, Germany, Japan)
- **Future** — 3 larger cards (AI, Quantum Computing, Biotechnology)
- **Archive** — filterable grid of all innovations stored in localStorage

### add.html
- Validated form: title, year, category, country, inventor, description, impact, status
- Saves to `localStorage` under key `techvault_innovations`
- Shows animated toast on success, then redirects to the archive

### details.html
- Driven entirely by URL query parameters:
  - `?category=computing` → renders a knowledge-base article about Computing
  - `?country=japan` → renders a knowledge-base article about Japan
  - `?future=ai` → renders a knowledge-base article about Artificial Intelligence
  - `?id=tv-abc123` → renders a user-saved innovation from localStorage

---

## Data Model (localStorage)

```json
{
  "id":          "tv-abc123",
  "title":       "World Wide Web",
  "year":        1990,
  "category":    "communication",
  "country":     "Switzerland",
  "inventor":    "Tim Berners-Lee / CERN",
  "description": "…",
  "impact":      "revolutionary",
  "status":      "mainstream",
  "addedAt":     "2026-02-26T12:00:00.000Z"
}
```

---

## Technologies Used

- Vanilla HTML, CSS, JavaScript — no frameworks or dependencies
- Google Fonts: Bebas Neue, Crimson Pro, Space Mono
- Intersection Observer API for scroll-reveal animations
- localStorage for persistent data across sessions

---

## Running the Project

Open `index.html` in a browser. No build step or server required.

> **Note:** localStorage requires the page to be served from the same origin.  
> For full functionality, serve with a local server:  
> `npx serve .` or `python -m http.server 8080`

---

© 2026 TechVault Global