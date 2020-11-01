import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { deviceCategories } from '../common/deviceCategories';
import { loadIcon, loadImage } from './mapUtil';
import { styleOsm } from './mapStyles';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';

export const map = new mapboxgl.Map({
  container: element,
  style: styleOsm(),
});

map.addControl(new mapboxgl.NavigationControl());

let readyListeners = [];

const onMapReady = listener => {
  if (!readyListeners) {
    listener();
  } else {
    readyListeners.push(listener);
  }
};

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

const Map = ({ children }) => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => onMapReady(() => setMapReady(true)), []);

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
