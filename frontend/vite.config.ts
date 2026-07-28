import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'],
  },
  server: {
    // Always proxy to the local backend. Do not point this at production —
    // prod ALLOWED_ORIGINS rejects localhost and other non-SPA origins.
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      },
    },
  },
});
