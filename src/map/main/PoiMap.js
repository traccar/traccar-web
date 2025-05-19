import { useId, useEffect, useState } from 'react';
import { kml } from '@tmcw/togeojson';
import { useTheme } from '@mui/material/styles';
import { map } from '../core/MapView';
import { useEffectAsync } from '../../reactHelper';
import { usePreference } from '../../common/util/preferences';
import { findFonts } from '../core/mapUtil';

const PoiMap = ({ mapReady }) => {
  const id = useId();

  const theme = useTheme();

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
    if (data && mapReady) {
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
          'circle-color': theme.palette.geometry.main,
        },
      });
      map.addLayer({
        source: id,
        id: 'poi-line',
        type: 'line',
        paint: {
          'line-color': theme.palette.geometry.main,
          'line-width': 2,
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
          'text-font': findFonts(map),
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
        if (map.getLayer('poi-line')) {
          map.removeLayer('poi-line');
        }
        if (map.getLayer('poi-title')) {
          map.removeLayer('poi-title');
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      };
    }
    return () => {};
  }, [data, mapReady]);

  return null;
};

PoiMap.handlesMapReady = true;

export default PoiMap;
