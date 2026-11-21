import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// One Vite project for the Astrologer app: index.html here, all code, styles and images in src/.
// Imports from another folder use the `@/` alias (→ src/); files in the same folder use `./`.
const dir = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: dir('.'),
  // optimize: false — CSS is minified by Vite's default minifier (as before Tailwind), so the
  // existing stylesheets ship unchanged; Tailwind's own optimizer would rewrite some values.
  plugins: [react(), tailwindcss({ optimize: false })],
  resolve: {
    alias: { '@': dir('./src') },
  },
  // Only index.html is an app entry; reference/*.html are view-only design files.
  optimizeDeps: { entries: ['index.html'] },
  build: { outDir: dir('./dist'), emptyOutDir: true },
});
