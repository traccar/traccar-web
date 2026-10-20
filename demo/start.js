import { fileURLToPath } from 'node:url';
import process from 'node:process';
import express from 'express';
import { demoServer } from './server.js';

const app = express();
const httpServer = app.listen(Number(process.env.PORT || 8080), '0.0.0.0');
const build = fileURLToPath(new URL('../build/', import.meta.url));

demoServer({ middlewares: app, httpServer });
app.use(express.static(build));
app.get('/{*path}', (request, response) => {
  response.sendFile('index.html', { root: build });
});
