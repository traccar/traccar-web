import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(() => ({
  server: {
    port: 3000,
    proxy: {
      "/api/socket": "ws://localhost:8082",
      "/api": "http://localhost:8082",
    },
  },
  build: {
    outDir: "build",
  },
  plugins: [
    svgr(),
    react(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,woff,woff2,mp3}"],
      },
      manifest: {
        short_name: "${title}",
        name: "${description}",
        theme_color: "${colorPrimary}",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js",
          dest: "",
        },
      ],
    }),
  ],
}));
