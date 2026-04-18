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
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8080',
      '/photos-proxy': {
        target: 'https://photos.iaingriesdale.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/photos-proxy/, ''),
      },
    }
  },
  preview: {
    port: 3000
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    }
  }
})
