import { defineConfig, loadEnv, transformWithEsbuild } from 'vite'
import reactRefresh from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible'
import svgrPlugin from 'vite-plugin-svgr'

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    const config: any = {
        plugins: [
            envCompatible(),
            react(),
            reactRefresh(),
            svgrPlugin(),
            {
                name: 'treat-js-files-as-jsx',
                async transform(code, id) {
                    if (!id.match(/src\/.*\.js$/)) return null
                    // Use the exposed transform from vite, instead of directly
                    return transformWithEsbuild(code, id, {
                        loader: 'jsx',
                        jsx: 'automatic',
                    })
                },
            },
        ],
        optimizeDeps: {
            force: true,
            esbuildOptions: {
                loader: {
                    '.js': 'jsx',
                },
            },
        },
        server: {
            proxy: {
                "/api": {
                    target: `http://${process.env.VITE_URL_NAME}`,
                    changeOrigin: true,
                    secure: false,
                },
                "/api/socket": {
                    target: `ws://${process.env.VITE_URL_NAME}`,
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                },
            }
        }
    };

    return defineConfig(config);
}