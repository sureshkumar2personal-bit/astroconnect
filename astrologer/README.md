# Astrologer App — folder map

One React + Vite app. It is responsive: the same code renders the desktop/tablet layout
(wider than 760px) and the phone layout (760px and narrower).

```
astrologer/
├── index.html            App entry page (loads src/main.jsx)
├── package.json          Scripts: dev / build / preview
├── vite.config.js        Vite + React + Tailwind; alias @/ → src/
├── reference/            Design references — view only, never imported by code
│   ├── desktop/          Full HTML reference (desktop)
│   ├── mobile/           Full HTML reference (phone)
│   └── mockups/          Dashboard screenshots (light/ and dark/)
└── src/
    ├── main.jsx          Starts React and loads styles/index.css
    ├── App.jsx           Picks the page for the current #/ route; builds the Home dashboard
    ├── layout/           Sidebar, headers, phone bottom nav, "All sections" menu
    ├── pages/            One file per page (WorkPage, EarningsPage, LivePage, …)
    │                     SectionPage.jsx = shared page frame; sections.js = page list
    ├── components/
    │   ├── ui/           Reusable building blocks used on many pages:
    │   │                 Icon, Logo, Bell, Card, Toggle, ThemeToggle,
    │   │                 primitives.jsx (badges, dialog, toast),
    │   │                 sectionKit.jsx (section, KPI, table, form field, charts)
    │   └── <page>/       Pieces used by one page only: home/, work/, earnings/, live/, …
    ├── hooks/            useXxx.js — page state and actions (one hook per area)
    ├── data/             mockXxx.js — mock data until a backend exists
    ├── lib/              Router, store, formatting, Text Questions rules
    ├── config/           Theme → image map
    ├── assets/images/    light/ and dark/ theme images
    └── styles/           All CSS (Tailwind CSS v4) — no CSS lives next to components
```

## Where do I put…?

| I am adding… | Put it in |
|---|---|
| A new section page | `src/pages/<Name>Page.jsx`, and register it in `src/pages/sections.js` |
| A component used by one page | `src/components/<page>/` |
| A component used by several pages | `src/components/ui/` |
| Page state / actions | `src/hooks/use<Name>.js` |
| Mock data | `src/data/mock<Name>.js` |
| Helper functions | `src/lib/` |
| An image | `src/assets/images/light/` or `src/assets/images/dark/` |
| Styles | `src/styles/` (see below) |

## Styling (`src/styles/`)

| File / folder | Contents |
|---|---|
| `index.css` | Entry stylesheet (imported by `src/main.jsx`). Its import order is the cascade order. |
| `tailwind.css` | Tailwind setup: theme colours, fonts, breakpoints, `dark` variant. |
| `tokens.css` | Light and dark theme values (colours, shadows, theme background images). |
| `base.css` | Page-wide defaults (body, links, buttons, focus ring). |
| `common/` | Rules for every screen size. |
| `desktop/` | Desktop and tablet rules — wider than 760px. |
| `mobile/` | Phone rules — 760px and narrower. |

Each of `common/`, `desktop/` and `mobile/` has `home.css` (Home dashboard) and
`sections.css` (My Work and every other section page; each page is scoped `.tq .pg--<key>`).

Rules:

- Style with named classes defined here (e.g. `.ac-card`, `.tq .btn`). Do not add CSS files, CSS modules or `style={{…}}` for fixed values in components.
- Values known only at runtime (a percentage, a user colour) are passed as a CSS variable — `style={{ '--pct': '40%' }}` — and used from CSS.
- Tailwind is available inside these files through `@apply`, with the `tw:` prefix: `@apply tw:flex tw:gap-2 tw:text-heading;`. Theme colours (`text-heading`, `bg-card-surface`, …) follow light/dark automatically; `tw:dark:` targets dark only.
- Breakpoint variants: `tw:desktop:` (wider than 760px), `tw:wide:` (1200px and up), `tw:max-desktop:` (phones).
- Tailwind's reset (preflight) is intentionally not loaded.

## Imports

- From another folder: `@/…` (→ `src/`), e.g. `import Icon from '@/components/ui/Icon.jsx'`.
- From the same folder: `./…`.
- Inside `src/styles/`, CSS imports stay relative.

## Running

From this folder:

```sh
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the production build
```

Theme (light / dark) is set with the `data-theme` attribute on `<html>` and remembered in `localStorage` (`astro-theme`).
