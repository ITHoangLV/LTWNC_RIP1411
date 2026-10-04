import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách vendor chunks — giảm initial bundle size (Code Splitting)
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'window-vendor': ['react-window', 'react-virtualized-auto-sizer'],
        },
      },
    },
  },
});
