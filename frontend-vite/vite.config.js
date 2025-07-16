// frontend-vite/vite.config.js
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
  server: { // <-- AÑADE ESTA SECCIÓN SI NO LA TIENES
    proxy: {
      '/api': { // Todas las peticiones que empiecen con /api
        target: 'http://localhost:5000', // <-- Redirige a tu backend (asegúrate que el puerto sea el correcto)
        changeOrigin: true, // Cambia el origen de la petición para evitar problemas de CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina '/api' del path antes de enviarlo al backend
      },
    },
  },
});
