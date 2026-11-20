# Astrologer App — folder map

| Folder | What lives here |
|---|---|
| `reference/` | HTML reference designs (view only — never imported by code). `desktop/` and `mobile/` hold `home-*` and `text-questions-*` in `-dark` / `-light`; `mockups/` holds dashboard screenshot images. |
| `desktop/` | Desktop React app. `index.html`, then `src/`: `main.jsx`, `App.jsx`, `layout/` (sidebar, headers, nav), `pages/`, `components/home/`, `components/work/`. |
| `mobile/` | Mobile React app — *planned (Phase 3)*. |
| `shared/` | Code used by more than one screen/app: `components/` (Icon, Logo, Bell, ThemeToggle, Toggle, Card, ui), `hooks/`, `lib/` (router, Text Questions rules), `data/` (mock data), `config/` (theme → image map). |
| `assets/` | Images, by theme: `images/light/`, `images/dark/`. |
| `astrology-css/` | All Astrologer styling. No CSS files live inside React folders. |

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
