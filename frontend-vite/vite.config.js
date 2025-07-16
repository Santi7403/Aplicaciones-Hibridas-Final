import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: { 
    proxy: {
      '/api': { 
        target: 'http://localhost:5000', 
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});
