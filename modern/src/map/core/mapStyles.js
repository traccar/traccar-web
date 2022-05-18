export const styleCustom = (url, attribution) => ({
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [url],
      attribution,
      tileSize: 256,
    },
  },
  glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
  layers: [{
    id: 'osm',
    type: 'raster',
    source: 'osm',
  }],
});

export const styleOsm = () => styleCustom(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
);

export const styleCarto = () => ({
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a target="_top" rel="noopener" href="https://carto.com/attribution">CARTO</a>',
    },
  },
  glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
});

export const styleMapbox = (style) => `mapbox://styles/mapbox/${style}`;

export const styleMapTiler = (style, key) => `https://api.maptiler.com/maps/${style}/style.json?key=${key}`;

export const styleLocationIq = (style, key) => `https://tiles.locationiq.com/v3/${style}/vector.json?key=${key}`;

export const styleOSMaps = (style, key, year) => styleCustom(`https://api.os.uk/maps/raster/v1/zxy/${style}/{z}/{x}/{y}.png?key=${key}`, `<img src="https://raw.githubusercontent.com/OrdnanceSurvey/os-api-branding/master/img/os-logo-maps.png"> <br> Contains OS data &copy; Crown copyright and database rights ${year}`,);