import { defineConfig } from 'vite';
import appConfig from '../vite.config.js';
import { demoServer } from './server.js';

export default defineConfig((env) => {
  const config = appConfig(env);
  return {
    ...config,
    server: { host: 'localhost', port: 3000 },
    plugins: [
      ...config.plugins,
      {
        name: 'demo-server',
        configureServer: demoServer,
        transformIndexHtml: (html) =>
          html
            .replaceAll('${title}', 'Traccar Demo')
            .replaceAll('${description}', 'Traccar Demo')
            .replaceAll('${colorPrimary}', '#1a237e'),
      },
    ],
  };
});
