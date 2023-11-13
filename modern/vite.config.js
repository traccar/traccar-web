import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({ path: '.env.dev.local' });
/* eslint-disable no-template-curly-in-string */
export default defineConfig(() => ({
  server: {
    port: 3000,
    proxy: {
      '/api/socket': `ws://${process.env.APP_TRACCAR_DOMAIN}:8082`,
      '/api': `https://${process.env.APP_TRACCAR_DOMAIN}`,
      '/axelor-api': {
        target: `https://${process.env.APP_AXE_DOMAIN}/`,
        changeOrigin: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic YWRtaW46QWRtaW4yMDIz',
        },
        rewrite: (path) => path.replace(/^\/axelor-api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // eslint-disable-next-line no-console
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            // eslint-disable-next-line no-console
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            // eslint-disable-next-line no-console
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    svgr(),
    react(),
    VitePWA({
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      },
      manifest: {
        short_name: '${title}',
        name: '${description}',
        theme_color: '${colorPrimary}',
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
