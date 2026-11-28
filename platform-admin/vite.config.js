import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Platform Admin runs on its own port so it never clashes with the
// Astrologer App (5173) or the User App (5174).
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: true },
  preview: { port: 5175, strictPort: true },
});
