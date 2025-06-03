import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
     proxy: {
    '/chat': 'http://localhost:3000',
  },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    //
  },
});
