import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/experts': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/services': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/bookings': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/reviews': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/user-dashboard': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/expert-dashboard': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/availability': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/call-sessions': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/disputes': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/notifications': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/payouts': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
