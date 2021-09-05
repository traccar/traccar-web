import { useEffect, useState } from 'react';
import { kml } from '@tmcw/togeojson';

import { map } from './Map';
import { useEffectAsync } from '../reactHelper';
import { usePreference } from '../common/preferences';

const PoiMap = () => {
  const id = 'poi';

  const poiLayer = usePreference('poiLayer');

  const [data, setData] = useState(null);

  useEffectAsync(async () => {
    if (poiLayer) {
      const file = await fetch(poiLayer);
      const dom = new DOMParser().parseFromString(await file.text(), 'text/xml');
      setData(kml(dom));
    }
  }, [poiLayer]);

  useEffect(() => {
    if (data) {
      map.addSource(id, {
        type: 'geojson',
        data,
      });
      map.addLayer({
        source: id,
        id: 'poi-point',
        type: 'circle',
        paint: {
          'circle-radius': 5,
          'circle-color': '#3bb2d0',
        },
      });
      map.addLayer({
        source: id,
        id: 'poi-title',
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'text-anchor': 'bottom',
          'text-offset': [0, -0.5],
          'text-font': ['Roboto Regular'],
          'text-size': 12,
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1,
        },
      });
      return () => {
        if (map.getLayer('poi-point')) {
          map.removeLayer('poi-point');
        }
        if (map.getLayer('poi-title')) {
          map.removeLayer('poi-title');
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      };
    }
    return null;
  }, [data]);

  return null;
};

export default PoiMap;
