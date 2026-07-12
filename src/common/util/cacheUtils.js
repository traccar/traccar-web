const CACHE_PREFIX = 'traccar_cache_';
const DEFAULT_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

export const getCacheItem = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (Date.now() - item.timestamp > DEFAULT_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return item;
  } catch {
    return null;
  }
};

export const setCacheItem = (key, data) => {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
};
