/**
 * Loads additional map icons at runtime from the server override folder.
 *
 * Traccar serves the folder configured with `web.override` (default
 * /opt/traccar/override) under the /override/ path. This module reads a
 * directory of icon sets from there and registers their icons as device
 * categories, so icons can be added without rebuilding the app.
 *
 *   override/iconsets/index.json          list of icon sets, optional settings
 *   override/iconsets/<set>/iconset.json  manifest of a single set
 *   override/iconsets/<set>/<file>.svg    the icons
 *
 * index.json is either an array of folder names or an object:
 *   { "markerSize": 64, "sets": ["tactical"] }
 *
 * iconset.json:
 *   { "name": "...", "version": "2026-09-25",
 *     "icons": [ { "id": "pumper", "file": "pumper.svg", "name": "Pumper" } ] }
 *
 * "name" may also be given per language: { "de": "...", "en": "..." }
 * "version" is appended to the icon URLs to bust the browser cache.
 */

import deviceCategories from './deviceCategories';

const BASE = 'override/iconsets';
const TIMEOUT = 3000;

/** Category id to icon URL. Merged into mapIcons before preloading. */
export const customIcons = {};

/** Settings from index.json. */
export const iconsetConfig = { markerSize: null };

const labels = {};

let resolveReady;
/** Resolves once all icons have been loaded and tinted. */
export const imagesReady = new Promise((resolve) => {
  resolveReady = resolve;
});
export const markImagesReady = () => resolveReady();

/** Label for a category as given in the manifest, otherwise undefined. */
export const customIconLabel = (id, language) => {
  const name = labels[id];
  if (!name) return undefined;
  if (typeof name === 'string') return name;
  return name[language] ?? name.en ?? Object.values(name)[0];
};

// Resolve against the application root instead of the current route, otherwise
// a page such as /settings/device would look for /settings/override/...
// BASE_URL keeps this working when Traccar is installed under a sub path.
const ROOT = new URL(import.meta.env?.BASE_URL ?? '/', window.location.origin);
const absolute = (path) => new URL(path, ROOT).href;

const fetchJson = async (path, signal) => {
  const response = await fetch(absolute(path), { cache: 'no-cache', signal });
  if (!response.ok) return null;
  return response.json();
};

/**
 * Resize the marker background circle.
 * prepareIcon() derives the canvas size from the background image, so changing
 * its width and height is enough to scale the whole marker.
 */
export const markerBackground = async (source) => {
  const { markerSize } = iconsetConfig;
  if (!markerSize) return source;
  try {
    const svg = await (await fetch(source)).text();
    // Depending on the bundler the attributes use single or double quotes
    const resized = svg
      .replace(/width=(["'])[^"']*\1/, `width="${markerSize}px"`)
      .replace(/height=(["'])[^"']*\1/, `height="${markerSize}px"`);
    return `data:image/svg+xml,${encodeURIComponent(resized)}`;
  } catch (error) {
    console.warn('Failed to resize the marker background:', error);
    return source;
  }
};

const loadSet = async (set, fallbackVersion, signal) => {
  if (typeof set !== 'string' || !/^[\w.-]+$/.test(set)) {
    console.warn(`Skipping icon set "${set}": invalid folder name`);
    return;
  }
  const manifest = await fetchJson(`${BASE}/${set}/iconset.json`, signal);
  if (!manifest || !Array.isArray(manifest.icons)) {
    console.warn(`Skipping icon set "${set}": iconset.json is missing or has no icons`);
    return;
  }
  const version = manifest.version ?? fallbackVersion;
  const query = version ? `?v=${encodeURIComponent(version)}` : '';

  manifest.icons.forEach((icon) => {
    const id = icon?.id;
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(id)) {
      console.warn(`Skipping icon in "${set}": invalid id ${JSON.stringify(id)}`);
      return;
    }
    if (customIcons[id]) {
      console.warn(`Skipping icon "${id}" in "${set}": id already taken`);
      return;
    }
    customIcons[id] = absolute(`${BASE}/${set}/${icon.file ?? `${id}.svg`}${query}`);
    if (icon.name) labels[id] = icon.name;
    // Built-in categories can be overridden without duplicating them
    if (!deviceCategories.includes(id)) deviceCategories.push(id);
  });
};

export default async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const index = await fetchJson(`${BASE}/index.json`, controller.signal);
    if (!index) return;
    const sets = Array.isArray(index) ? index : (index.sets ?? []);
    if (!Array.isArray(index) && Number.isFinite(index.markerSize)) {
      iconsetConfig.markerSize = index.markerSize;
    }
    await Promise.all(sets.map((set) => loadSet(set, index.version, controller.signal)));
  } catch (error) {
    // A missing or broken override folder must never block the app
    console.warn('Failed to load icon sets:', error);
  } finally {
    clearTimeout(timer);
  }
};
