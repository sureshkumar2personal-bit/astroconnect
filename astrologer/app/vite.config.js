import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The original design assets live one level up (astrologer/asst), so the
// dev server is allowed to serve files from the parent folder.
export default defineConfig({
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
});
