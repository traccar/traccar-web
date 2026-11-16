import 'maplibre-gl/dist/maplibre-gl.css';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { googleProtocol } from 'maplibre-google-maps';
import { Protocol } from 'pmtiles';
import { useRef, useLayoutEffect, useEffect, useState, useMemo } from 'react';
import { useTheme } from '@mui/material';
import MapSwitcher from '../control/MapSwitcher';
import MapTypeSwitch from '../control/MapTypeSwitch';
import { useAttributePreference, usePreference } from '../../common/util/preferences';
import usePersistedState from '../../common/util/usePersistedState';
import { mapImages } from './preloadImages';
import useMapStyles from './useMapStyles';
import { useAsyncTask } from '../../reactHelper';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';
element.style.boxSizing = 'initial';

maplibregl.setWorkerUrl(maplibreWorkerUrl);
maplibregl.addProtocol('google', googleProtocol);
maplibregl.addProtocol('pmtiles', new Protocol().tile);

export const map = new maplibregl.Map({
  container: element,
  attributionControl: false,
});

let ready = false;
const readyListeners = new Set();

const addReadyListener = (listener) => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = (listener) => {
  readyListeners.delete(listener);
};

const updateReadyValue = (value) => {
  ready = value;
  readyListeners.forEach((listener) => listener(value));
};

export const useMapReady = () => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const listener = (value) => setMapReady(value);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  return mapReady;
};

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage('background')) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value, {
        pixelRatio: window.devicePixelRatio,
      });
    });
  }
};

// `mapTypes` ([{ id, label }]) switches to the compact main-map controls: a map type switch
// limited to those styles, and zoom buttons at the bottom start corner without the compass.
const MapView = ({ children, mapTypes }) => {
  const theme = useTheme();

  const containerRef = useRef(null);

  const mapReady = useMapReady();

  const mapStyles = useMapStyles();
  const activeMapStyles = useAttributePreference(
    'activeMapStyles',
    'googleRoad,googleRoadTraffic,googleHybrid',
  );
  const [selectedStyleId, setSelectedStyleId] = usePersistedState(
    'selectedMapStyle',
    usePreference('map', 'googleRoad'),
  );
  const maxZoom = useAttributePreference('web.maxZoom');

  // A string key keeps the style list stable while callers pass a new array each render
  const mapTypeIds = mapTypes?.map((it) => it.id).join(',');
  const compact = Boolean(mapTypeIds);

  const styles = useMemo(() => {
    const allowed = mapTypeIds ? mapTypeIds.split(',') : activeMapStyles;
    const filtered = mapStyles.filter((s) => s.available && allowed.includes(s.id));
    return filtered.length ? filtered : mapStyles.filter((s) => s.id === 'osm');
  }, [mapStyles, activeMapStyles, mapTypeIds]);

  useAsyncTask(async () => {
    if (theme.direction === 'rtl') {
      maplibregl.setRTLTextPlugin(new URL('mapbox-gl-rtl-text.js', document.baseURI).href);
    }
  }, [theme.direction]);

  useEffect(() => {
    const attribution = new maplibregl.AttributionControl({ compact: true });
    const navigation = new maplibregl.NavigationControl(compact ? { showCompass: false } : {});
    const rtl = theme.direction === 'rtl';
    map.addControl(attribution, rtl ? 'bottom-left' : 'bottom-right');
    if (compact) {
      map.addControl(navigation, rtl ? 'bottom-right' : 'bottom-left');
    } else {
      map.addControl(navigation, rtl ? 'top-left' : 'top-right');
    }
    return () => {
      map.removeControl(navigation);
      map.removeControl(attribution);
    };
  }, [theme.direction, compact]);

  useEffect(() => {
    if (maxZoom) {
      map.setMaxZoom(maxZoom);
    }
  }, [maxZoom]);

  useEffect(() => {
    const style = styles.find((s) => s.id === selectedStyleId);
    if (!style) {
      setSelectedStyleId(styles[0].id);
      return;
    }
    updateReadyValue(false);
    map.coordinateSystem = style.coordinateSystem;
    map.setStyle(style.style, { diff: false });
    map.setTransformRequest(style.transformRequest);
    let timeoutId;
    const waiting = () => {
      if (!map.loaded()) {
        timeoutId = setTimeout(waiting, 33);
      } else {
        initMap();
        updateReadyValue(true);
      }
    };
    map.once('styledata', waiting);
    return () => clearTimeout(timeoutId);
  }, [styles, selectedStyleId, setSelectedStyleId]);

  useLayoutEffect(() => {
    const currentEl = containerRef.current;
    currentEl.appendChild(element);
    map.resize();
    return () => {
      currentEl.removeChild(element);
    };
  }, [containerRef]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerRef}>
      {compact ? (
        <MapTypeSwitch
          options={mapTypes}
          selectedId={selectedStyleId}
          onSelect={setSelectedStyleId}
        />
      ) : (
        <MapSwitcher styles={styles} selectedId={selectedStyleId} onSelect={setSelectedStyleId} />
      )}
      {mapReady && children}
    </div>
  );
};

export default MapView;
