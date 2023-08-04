import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
    build: {
        outDir: 'build',
    },
    plugins: [
        react(),
        reactRefresh(),
        svgrPlugin({
            svgrOptions: {
                icon: true
            },
        }),
    ],
})
