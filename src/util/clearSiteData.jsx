export async function clearSiteData() {

  try {
    await fetch('/api/session', {
      method: 'DELETE',
      credentials: 'same-origin',
    });
  } catch (_) {}

  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      try { await reg.unregister(); } catch (_) {}
    }
  }

  if ('caches' in window) {
    for (const key of await caches.keys()) {
      try { await caches.delete(key); } catch (_) {}
    }
  }

  document.cookie.split(';').forEach(c => {
    const [name] = c.split('=');
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });

  localStorage.clear();
  sessionStorage.clear();

  const bust = Date.now();
  const url  = window.location.origin + window.location.pathname + '?v=' + bust;
  window.location.replace(url);
}
