# Astrologer App — folder map

| Folder | What lives here |
|---|---|
| `reference/` | HTML reference designs (view only — never imported by code). `desktop/` and `mobile/` hold `home-*` and `text-questions-*` in `-dark` / `-light`; `mockups/` holds dashboard screenshot images. |
| `desktop/` | Desktop React app. `index.html`, then `src/`: `main.jsx`, `App.jsx`, `layout/` (sidebar, headers, nav), `pages/`, `components/home/`, `components/work/`. |
| `mobile/` | Mobile React app — *planned (Phase 3)*. |
| `shared/` | Code used by more than one screen/app: `components/` (Icon, Logo, Bell, ThemeToggle, Toggle, Card, ui), `hooks/`, `lib/` (router, Text Questions rules), `data/` (mock data), `config/` (theme → image map). |
| `assets/` | Images, by theme: `images/light/`, `images/dark/`. |
| `astrology-css/` | All Astrologer styling (Tailwind CSS v4). No CSS files live inside React folders — see below. |

## Styling (`astrology-css/`)

| File / folder | Contents |
|---|---|
| `desktop.css` | Entry stylesheet of the desktop app (imported by `desktop/src/main.jsx`). Its import order is the cascade order. |
| `tailwind.css` | Tailwind setup: theme colours, fonts, breakpoints, `dark` variant. |
| `tokens.css` | Light and dark theme values (colours, shadows, theme background images). |
| `base.css` | Page-wide defaults (body, links, buttons, focus ring). |
| `shared/` | Rules used at every screen size (`home.css`, `work.css`). |
| `desktop/` | Desktop and tablet rules — wider than 760px. |
| `mobile/` | Phone rules — 760px and narrower. |

Rules:

- Style with named classes defined here (e.g. `.ac-card`, `.tq .btn`). Do not add CSS files, CSS modules or `style={{…}}` for fixed values in components.
- Values known only at runtime (a percentage, a user colour) are passed as a CSS variable — `style={{ '--pct': '40%' }}` — and used from CSS.
- Tailwind is available inside these files through `@apply`, with the `tw:` prefix: `@apply tw:flex tw:gap-2 tw:text-heading;`. Theme colours (`text-heading`, `bg-card-surface`, …) follow light/dark automatically; `tw:dark:` targets dark only.
- Breakpoint variants: `tw:desktop:` (wider than 760px), `tw:wide:` (1200px and up), `tw:max-desktop:` (phones).
- Tailwind's reset (preflight) is intentionally not loaded.

## Imports

Cross-folder imports use aliases (defined in `vite.config.js`):

- `@shared/…` → `shared/`
- `@assets/…` → `assets/`
- `@astrology-css/…` → `astrology-css/`

Imports inside the same app folder stay relative.

## Running

From this folder:

```sh
npm install
npm run dev:desktop      # dev server
npm run build:desktop    # production build → dist/desktop/
npm run preview:desktop  # serve the production build
```

Theme (light / dark) is set with the `data-theme` attribute on `<html>` and remembered in `localStorage` (`astro-theme`).
