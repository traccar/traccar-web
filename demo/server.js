import { WebSocketServer, WebSocket } from 'ws';
import { createFleet } from './fleet.js';

export const demoServer = (server) => {
  const fleet = createFleet();
  const sockets = new WebSocketServer({ noServer: true });
  const settings = {
    id: 1,
    readonly: true,
    attributes: {},
  };
  const user = {
    id: 1,
    name: 'Demo',
    attributes: {},
  };
  server.middlewares.use((request, response, next) => {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return next();
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (request.method !== 'GET') {
      response.writeHead(403).end('This demo is read-only.');
      return;
    }
    fleet.advance();
    let data;
    switch (url.pathname) {
      case '/api/server':
        data = settings;
        break;
      case '/api/session':
        data = user;
        break;
      case '/api/devices':
        data = fleet.devices;
        break;
      case '/api/positions':
        data = fleet.query(url.searchParams);
        break;
      case '/api/groups':
      case '/api/geofences':
      case '/api/drivers':
      case '/api/maintenance':
      case '/api/calendars':
        data = [];
        break;
      default:
        response.writeHead(404).end('Unavailable in this demo.');
        return;
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(data));
  });
  server.httpServer.on('upgrade', (request, socket, head) => {
    if (new URL(request.url, 'http://localhost').pathname === '/api/socket') {
      sockets.handleUpgrade(request, socket, head, (client) => {
        fleet.advance();
        client.send(JSON.stringify({ devices: fleet.devices, positions: fleet.positions }));
      });
    }
  });
  const timer = setInterval(() => {
    fleet.advance();
    const message = JSON.stringify({ devices: fleet.devices, positions: fleet.positions });
    sockets.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(message);
    });
  }, 5000);
  server.httpServer.on('close', () => {
    clearInterval(timer);
    sockets.clients.forEach((client) => client.terminate());
    sockets.close();
  });
};
