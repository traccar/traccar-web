import { useState } from 'react';
import { kml } from '@tmcw/togeojson';
import gcoord from 'gcoord';
import { useTheme } from '@mui/material/styles';
import { map } from '../core/MapView';
import useMapLayer from '../core/useMapLayer';
import { useAsyncTask } from '../../reactHelper';
import { usePreference } from '../../common/util/preferences';
import { findFonts } from '../core/mapUtil';
import { useTranslation } from '../../common/components/LocalizationProvider';

const PoiMap = () => {
  const theme = useTheme();
  const t = useTranslation();

  const poiLayer = usePreference('poiLayer');

  const [data, setData] = useState(null);

  useAsyncTask(
    async ({ signal }) => {
      if (poiLayer) {
        const file = await fetch(poiLayer, { signal });
        const dom = new DOMParser().parseFromString(await file.text(), 'text/xml');
        const parsed = kml(dom);
        setData(
          map.coordinateSystem === 'gcj02'
            ? gcoord.transform(parsed, gcoord.WGS84, gcoord.GCJ02)
            : parsed,
        );
      }
    },
    [poiLayer],
  );

  useMapLayer({
    enabled: !!data,
    layers: [
      {
        key: 'fill',
        type: 'fill',
        filter: ['==', '$type', 'Polygon'],
        metadata: { 'traccar:title': t('mapPoiLayer') },
        paint: {
          'fill-color': ['coalesce', ['get', 'fill'], theme.palette.geometry.main],
          'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.3],
        },
      },
      {
        key: 'point',
        type: 'circle',
        metadata: { 'traccar:title': t('mapPoiLayer') },
        paint: {
          'circle-radius': 5,
          'circle-color': ['coalesce', ['get', 'icon-color'], theme.palette.geometry.main],
        },
      },
      {
        key: 'line',
        type: 'line',
        metadata: { 'traccar:title': t('mapPoiLayer') },
        paint: {
          'line-color': ['coalesce', ['get', 'stroke'], theme.palette.geometry.main],
          'line-width': ['coalesce', ['get', 'stroke-width'], 2],
          'line-opacity': ['coalesce', ['get', 'stroke-opacity'], 1],
        },
      },
      {
        key: 'title',
        type: 'symbol',
        metadata: { 'traccar:title': t('mapPoiLayer') },
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
      },
    ],
    layersDeps: [t, theme.palette.geometry.main, data],
    data,
    dataDeps: [data],
  });

  return null;
};

export default PoiMap;
