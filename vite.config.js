import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Mirrors Jekyll's `future: false`: posts dated after the build time are hidden.
  // The GitHub Action rebuilds daily, so scheduled posts go live automatically.
  define: {
    __BUILD_TIME__: JSON.stringify(Date.now()),
  },
});
