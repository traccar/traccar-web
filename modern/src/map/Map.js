import 'mapbox-gl/dist/mapbox-gl.css';
import './switcher/switcher.css';
import mapboxgl from 'mapbox-gl';
import { SwitcherControl } from './switcher/switcher';
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { deviceCategories } from '../common/deviceCategories';
import { loadIcon, loadImage } from './mapUtil';
import { styleCarto, styleMapbox, styleOsm } from './mapStyles';
import t from '../common/localization';
import { useAttributePreference } from '../common/preferences';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';

export const map = new mapboxgl.Map({
  container: element,
  style: styleOsm(),
});

let ready = false;
const readyListeners = new Set();

const addReadyListener = listener => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = listener => {
  readyListeners.delete(listener);
};

const updateReadyValue = value => {
  ready = value;
  readyListeners.forEach(listener => listener(value));
};

const initMap = async () => {
  const background = await loadImage('images/background.svg');
  await Promise.all(deviceCategories.map(async category => {
    if (!map.hasImage(category)) {
      const imageData = await loadIcon(category, background, `images/icon/${category}.svg`);
      map.addImage(category, imageData, { pixelRatio: window.devicePixelRatio });
    }
  }));
  updateReadyValue(true);
};

map.on('load', initMap);

map.addControl(new mapboxgl.NavigationControl({
  showCompass: false,
}));

map.addControl(new SwitcherControl(
  [
    { title: t('mapOsm'), uri: styleOsm() },
    { title: t('mapCarto'), uri: styleCarto() },
    { title: t('mapMapboxStreets'), uri: styleMapbox('streets-v11') },
    { title: t('mapMapboxOutdoors'), uri: styleMapbox('outdoors-v11') },
    { title: t('mapMapboxSatellite'), uri: styleMapbox('satellite-v9') },
  ],
  t('mapOsm'),
  () => updateReadyValue(false),
  () => {
    const waiting = () => {
      if (!map.loaded()) {
        setTimeout(waiting, 100);
      } else {
        initMap();
      }
    };
    waiting();
  },
));

const Map = ({ children }) => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');

  useEffect(() => {
    mapboxgl.accessToken = mapboxAccessToken;
  }, [mapboxAccessToken]);

  useEffect(() => {
    const listener = ready => setMapReady(ready);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(element);
    if (map) {
      map.resize();
    }
    return () => {
      currentEl.removeChild(element);
    };
  }, [containerEl]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerEl}>
      {mapReady && children}
    </div>
  );
};

export default Map;
