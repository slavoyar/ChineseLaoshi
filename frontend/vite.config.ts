/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import eslint from 'vite-plugin-eslint';

import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: [
      { find: '@app', replacement: fileURLToPath(new URL('./src/app', import.meta.url)) },
      { find: '@pages', replacement: fileURLToPath(new URL('./src/pages', import.meta.url)) },
      { find: '@widgets', replacement: fileURLToPath(new URL('./src/widgets', import.meta.url)) },
      {
        find: '@features',
        replacement: fileURLToPath(new URL('./src/features', import.meta.url)),
      },
      { find: '@entities', replacement: fileURLToPath(new URL('./src/entities', import.meta.url)) },
      { find: '@shared', replacement: fileURLToPath(new URL('./src/shared', import.meta.url)) },
    ],
  },
});
