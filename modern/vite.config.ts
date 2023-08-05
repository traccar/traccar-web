import { resolve } from 'path';
import { defineConfig, loadEnv, transformWithEsbuild, splitVendorChunkPlugin } from 'vite'
import reactRefreshPlugin from '@vitejs/plugin-react'
import envCompatiblePlugin from 'vite-plugin-env-compatible'
import svgrPlugin from 'vite-plugin-svgr'
import legacyPlugin from '@vitejs/plugin-legacy'
import 'dotenv/config';

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    process.env = { ...process.env, ...env };

    const rootDir = resolve(__dirname);
    const legacyBuild = JSON.parse(env.LEGACY_BROWSER) ?? false
    const plugins = [
        envCompatiblePlugin(),
        reactRefreshPlugin(),
        jsAsJsxPlugin,
        splitVendorChunkPlugin(),
        svgrPlugin()
    ];

    if (legacyBuild) {
        plugins.push(legacyPlugin({
            modernPolyfills: true,
            renderLegacyChunks: true,
            renderModernChunks: true,
            targets: 'Edge >= 20 or chrome >= 50 or Firefox >= 59 or defaults',
            ignoreBrowserslistConfig: true
        }));
    }

    const config: any = {
        resolve: {
            alias: [
                { find: '~', replacement: resolve(rootDir, 'src') },
                { find: '@', replacement: resolve(rootDir, 'src') },
            ],
        },
        plugins,
        optimizeDeps: {
            force: true,
            esbuildOptions: {
                loader: {
                    '.js': 'jsx',
                },
            },
        },
        server: {
            host: '0.0.0.0',
            port: JSON.parse(env.VITE_PORT) ?? 3000,
            open: false,
            cors: true,
            proxy: {
                "/api": {
                    target: `http://${env.URL_NAME}`,
                    changeOrigin: true,
                    secure: false,
                },
                "/api/socket": {
                    target: `ws://${env.URL_NAME}`,
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                },
            }
        },
        build: {
            chunkSizeWarningLimit: 1500,
            outDir: 'build',
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            },
        }
    };

    return defineConfig(config);
}

const jsAsJsxPlugin: any = {
    name: 'treat-js-files-as-jsx',
    async transform(code: any, id: any) {
        if (!id.match(/src\/.*\.js$/)) return null
        // Use the exposed transform from vite, instead of directly
        return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
        })
    },
};
