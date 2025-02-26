import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Ensure Vite runs on port 3000
    open: true,  // Automatically open browser
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
