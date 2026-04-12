import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/gymapp/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'GymApp — Wedding Prep Tracker',
        short_name: 'GymApp',
        description: 'Personal gym tracker — 5-day split, protein logging, progress tracking',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/gymapp/',
        start_url: '/gymapp/',
        icons: [
          { src: '/gymapp/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/gymapp/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all',
    hmr: { clientPort: 443, protocol: 'wss' },
  },
})
