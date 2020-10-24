import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { deviceCategories } from '../common/deviceCategories';
import { loadIcon, loadImage } from './mapUtil';

let readyListeners = [];

const onMapReady = listener => {
  if (!readyListeners) {
    listener();
  } else {
    readyListeners.push(listener);
  }
};

const layerClickCallbacks = {};
const layerMouseEnterCallbacks = {};
const layerMauseLeaveCallbacks = {};

const addLayer = (id, source, icon, text, onClick) => {
  const layer = {
    'id': id,
    'type': 'symbol',
    'source': source,
    'layout': {
      'icon-image': icon,
      'icon-allow-overlap': true,
    },
  };
  if (text) {
    layer.layout = {
      ...layer.layout,
      'text-field': text,
      'text-allow-overlap': true,
      'text-anchor': 'bottom',
      'text-offset': [0, -2],
      'text-font': ['Roboto Regular'],
      'text-size': 12,
    }
    layer.paint = {
      'text-halo-color': 'white',
      'text-halo-width': 1,
    }
  }
  map.addLayer(layer);

  layerClickCallbacks[id] = onClick;
  map.on('click', id, onClick);

  layerMouseEnterCallbacks[id] = () => {
    map.getCanvas().style.cursor = 'pointer';
  };
  map.on('mouseenter', id, layerMouseEnterCallbacks[id]);

  layerMauseLeaveCallbacks[id] = () => {
    map.getCanvas().style.cursor = '';
  };
  map.on('mouseleave', id, layerMauseLeaveCallbacks[id]);
}

const removeLayer = (id, source) => {
  const popups = element.getElementsByClassName('mapboxgl-popup');
  if (popups.length) {
      popups[0].remove();
  }

  map.off('click', id, layerClickCallbacks[id]);
  delete layerClickCallbacks[id];

  map.off('mouseenter', id, layerMouseEnterCallbacks[id]);
  delete layerMouseEnterCallbacks[id];

  map.off('mouseleave', id, layerMauseLeaveCallbacks[id]);
  delete layerMauseLeaveCallbacks[id];

  map.removeLayer(id);
  map.removeSource(source);
}

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';

const map = new mapboxgl.Map({
  container: element,
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
    layers: [{
      id: 'osm',
      type: 'raster',
      source: 'osm',
    }],
  },
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', async () => {
  const background = await loadImage('images/background.svg');
  await Promise.all(deviceCategories.map(async category => {
    const imageData = await loadIcon(category, background, `images/icon/${category}.svg`);
    map.addImage(category, imageData, { pixelRatio: window.devicePixelRatio });
  }));
  if (readyListeners) {
    readyListeners.forEach(listener => listener());
    readyListeners = null;
  }
});

export default {
  element,
  map,
  onMapReady,
  addLayer,
  removeLayer,
};
