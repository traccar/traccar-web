/* Web Push handlers, imported into the generated service worker (see vite.config.js). */

self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  const base = self.registration.scope;
  event.waitUntil(
    self.registration.showNotification(data.title || 'Traccar', {
      body: data.body || '',
      icon: new URL('pwa-192x192.png', base).href,
      badge: new URL('pwa-64x64.png', base).href,
      tag: data.tag,
      renotify: Boolean(data.tag),
      data: { url: data.url || base },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || self.registration.scope;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => client.url.startsWith(self.registration.scope));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
