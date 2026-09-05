# Venkata Bhavanarayana Avvari — DevOps Portfolio

A recruiter-focused DevOps Engineer portfolio, built with vanilla HTML/CSS/JS. No build step required — deploys directly to GitHub Pages.

## Project Structure

```
/
├── index.html                    # Main page (semantic HTML shell)
├── Assets/
│   └── Venkata Lebenslauf.pdf   # Resume PDF
├── css/
│   ├── base.css                 # CSS variables, reset, typography, utilities
│   ├── components.css           # Shared UI components (panels, buttons, badges…)
│   ├── sections.css             # Section-specific layout (nav, hero, projects…)
│   └── responsive.css           # Breakpoints 320px → 1920px+
└── js/
    ├── translations.js           # EN / DE bilingual strings
    ├── theme.js                 # Dark / light mode toggle
    ├── navigation.js             # Header scroll state, mobile menu, scroll-spy
    ├── i18n.js                  # Language switcher
    ├── animations.js            # Scroll-reveal, project filter/expand, contact form, scroll progress
    ├── hero-interaction.js       # Cursor-reactive dash field (hero only)
    └── main.js                  # Site init (footer year)
```

## Features

- **Dark / light theme** — persists via `localStorage`, respects `prefers-color-scheme`
- **EN / DE bilingual** — switcher syncs across desktop nav and mobile menu; `?lang=de` URL param supported
- **Scroll-spy** — active nav link highlights as you scroll through sections
- **Scroll progress bar** — accent-colored indicator at top of page
- **Project filter** — filter by Kubernetes / AWS / CI&CD / Integration
- **Project expand/collapse** — Problem → Solution → Architecture → Engineering decisions
- **Cursor-reactive hero** — subtle dot-grid interaction (fine pointer only; touch supported)
- **Reduced motion** — all animations respect `prefers-reduced-motion`
- **Fully responsive** — 320px through 1920px+

## Getting Started

No dependencies. Open `index.html` directly in a browser, or serve locally:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

## GitHub Pages Deployment

Push to a `gh-pages` branch, or enable GitHub Pages on the `main` branch. The site works at the root of the repository — no path prefix needed.

## SEO & Social

- Canonical URL, Open Graph, Twitter Card, and JSON-LD structured data included in `<head>`
- Replace placeholder LinkedIn / GitHub links (`https://linkedin.com/in/your-profile`, `https://github.com/your-username`) with real URLs before deploying
- Update `canonical` and JSON-LD `url` if your domain differs

## Accessibility

- Skip-to-content link
- All icons `aria-hidden`, all interactive elements labelled
- `aria-expanded` / `aria-pressed` / `aria-current` used throughout
- Visible `:focus-visible` states on all interactive elements
- `role="list"` / `role="listitem"` on tag/badges to aid screen readers
