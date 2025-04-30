import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ea85-2001-4451-2b3-800-744b-1242-a53-d10e.ngrok-free.app',
      '.ngrok-free.app', // This will allow all ngrok-free.app subdomains
    ],
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
})