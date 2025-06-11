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
    '/gemini/chat': 'http://localhost:3003',
  },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  define: {
    //
  },
});
