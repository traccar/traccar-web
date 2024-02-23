import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

/* eslint-disable no-template-curly-in-string */
export default defineConfig(() => ({
  server: {
    port: 3000,
    proxy: {
      '/api/socket': 'wss:https://api.gonzher.com/',
      '/api': 'https://api.gonzher.com/',
    },
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    svgr(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      },
      manifest: {
        short_name: 'GPS GONZHER',
        name: 'GPS GONZHER',
        theme_color: '#14B8A6',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
}));
