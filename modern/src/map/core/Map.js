import 'maplibre-gl/dist/maplibre-gl.css';
import '../switcher/switcher.css';
import maplibregl from 'maplibre-gl';
import React, {
  useRef, useLayoutEffect, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { SwitcherControl } from '../switcher/switcher';
import deviceCategories from '../../common/util/deviceCategories';
import { prepareIcon, loadImage } from './mapUtil';
import {
  styleCarto, styleCustom, styleLocationIq, styleMapbox, styleMapTiler, styleOsm,
} from './mapStyles';
import { useAttributePreference } from '../../common/util/preferences';
import palette from '../../common/theme/palette';
import { useTranslation } from '../../common/components/LocalizationProvider';
import usePersistedState, { savePersistedState } from '../../common/util/usePersistedState';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';
element.style.boxSizing = 'initial';

export const map = new maplibregl.Map({
  container: element,
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

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage('background')) {
    const background = await loadImage('images/background.svg');
    map.addImage('background', await prepareIcon(background), {
      pixelRatio: window.devicePixelRatio,
    });
    await Promise.all(deviceCategories.map(async (category) => {
      const results = [];
      ['positive', 'negative', 'neutral'].forEach((color) => {
        results.push(loadImage(`images/icon/${category}.svg`).then((icon) => {
          map.addImage(`${category}-${color}`, prepareIcon(background, icon, palette.colors[color]), {
            pixelRatio: window.devicePixelRatio,
          });
        }));
      });
      await Promise.all(results);
    }));
  }
  updateReadyValue(true);
};

map.addControl(new maplibregl.NavigationControl({
  showCompass: false,
}));

const switcher = new SwitcherControl(
  () => updateReadyValue(false),
  (layerId) => savePersistedState('mapLayer', layerId),
  () => {
    map.once('styledata', () => {
      const waiting = () => {
        if (!map.loaded()) {
          setTimeout(waiting, 33);
        } else {
          initMap();
        }
      };
      waiting();
    });
  },
);

map.addControl(switcher);

const Map = ({ children }) => {
  const containerEl = useRef(null);
  const t = useTranslation();

  const [mapReady, setMapReady] = useState(false);

  const [defaultMapLayer] = usePersistedState('mapLayer', 'locationIqStreets');
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const mapTilerKey = useAttributePreference('mapTilerKey');
  const locationIqKey = useAttributePreference('locationIqKey', 'pk.0f147952a41c555a5b70614039fd148b');
  const customMapUrl = useSelector((state) => state.session.server?.mapUrl);

  useEffect(() => {
    maplibregl.accessToken = mapboxAccessToken;
  }, [mapboxAccessToken]);

  useEffect(() => {
    switcher.updateStyles([
      { id: 'locationIqStreets', title: t('mapLocationIqStreets'), uri: styleLocationIq('streets', locationIqKey) },
      { id: 'locationIqEarth', title: t('mapLocationIqEarth'), uri: styleLocationIq('earth', locationIqKey) },
      { id: 'locationIqHybrid', title: t('mapLocationIqHybrid'), uri: styleLocationIq('hybrid', locationIqKey) },
      { id: 'osm', title: t('mapOsm'), uri: styleOsm() },
      { id: 'carto', title: t('mapCarto'), uri: styleCarto() },
      { id: 'mapboxStreets', title: t('mapMapboxStreets'), uri: styleMapbox('streets-v11') },
      { id: 'mapboxOutdoors', title: t('mapMapboxOutdoors'), uri: styleMapbox('outdoors-v11') },
      { id: 'mapboxSatellite', title: t('mapMapboxSatellite'), uri: styleMapbox('satellite-v9') },
      { id: 'mapTilerBasic', title: t('mapMapTilerBasic'), uri: styleMapTiler('basic', mapTilerKey) },
      { id: 'mapTilerHybrid', title: t('mapMapTilerHybrid'), uri: styleMapTiler('hybrid', mapTilerKey) },
      { id: 'custom', title: t('mapCustom'), uri: styleCustom(customMapUrl) },
    ], defaultMapLayer);
  }, [t, locationIqKey, mapTilerKey, customMapUrl, defaultMapLayer]);

  useEffect(() => {
    const listener = (ready) => setMapReady(ready);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(element);
    map.resize();
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
