import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// One Vite project for the Astrologer app. The desktop app lives in desktop/;
// shared code, assets and CSS live in sibling folders and are imported via aliases.
const dir = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: dir('./desktop'),
  // optimize: false — CSS is minified by Vite's default minifier (as before Tailwind), so the
  // existing stylesheets ship unchanged; Tailwind's own optimizer would rewrite some values.
  plugins: [react(), tailwindcss({ optimize: false })],
  resolve: {
    alias: {
      '@shared': dir('./shared'),
      '@assets': dir('./assets'),
      '@astrology-css': dir('./astrology-css'),
    },
  },
  server: { fs: { allow: [dir('.')] } },
  build: { outDir: dir('./dist/desktop'), emptyOutDir: true },
});
