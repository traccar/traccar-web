export function mockApiMiddleware(req, res, next) {
  // Mock /api/session endpoint
  if (req.url === '/api/session') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      id: 1,
      name: 'Demo User',
      login: 'demo@traccar.org',
      email: 'demo@traccar.org',
      administrator: true,
      attributes: {
        termsAccepted: true,
        theme: 'light',
      },
    }));
    return;
  }

  // Mock /api/users endpoint
  if (req.url.startsWith('/api/users/') && req.method === 'PUT') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      id: 1,
      name: 'Demo User',
      login: 'demo@traccar.org',
      email: 'demo@traccar.org',
      administrator: true,
      attributes: {
        termsAccepted: true,
        theme: 'light',
      },
    }));
    return;
  }

  // Mock /api/devices endpoint
  if (req.url === '/api/devices') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([]));
    return;
  }

  next();
}
