import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import yaml from '@modyfi/vite-plugin-yaml'
import path from 'path'
import fs from 'fs'

function readSiteName(configFile: string): string {
  const full = path.resolve(__dirname, 'config', configFile)
  const match = fs.readFileSync(full, 'utf8').match(/^name:\s*(.+)$/m)
  if (!match) throw new Error(`No top-level "name" in config/${configFile}`)
  return match[1].trim()
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteName = readSiteName(env.VITE_CONFIG)

  return {
  plugins: [
    react(),
    tailwindcss(),
    yaml(),
    {
      name: 'inject-site-name',
      transformIndexHtml: (html: string) => html.replace(/%SITE_NAME%/g, siteName),
    },
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
  }
})
