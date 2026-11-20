import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// One Vite project for the Astrologer app. The desktop app lives in desktop/;
// shared code, assets and CSS live in sibling folders and are imported via aliases.
const dir = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: dir('./desktop'),
  plugins: [react()],
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
