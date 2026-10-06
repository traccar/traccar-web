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

// KML placemarks may name an icon (<IconStyle><Icon><href>), which togeojson
// surfaces as the `icon` property. Each distinct URL is loaded once and
// registered under this prefix; a placemark whose icon fails to load falls
// back to the plain circle.
const iconImageId = (href) => `poi-icon:${href}`;

const loadPoiIcon = (href) =>
  new Promise((resolve) => {
    const image = new Image();
    // Required so the image can be read back into the map's sprite canvas;
    // the icon host must answer with Access-Control-Allow-Origin.
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = href;
  });

const registerPoiIcons = async (features) => {
  const hrefs = [...new Set(features.map((f) => f.properties?.icon).filter(Boolean))];
  const loaded = new Set();
  await Promise.all(
    hrefs.map(async (href) => {
      const id = iconImageId(href);
      if (map.hasImage(id)) {
        loaded.add(href);
        return;
      }
      const image = await loadPoiIcon(href);
      if (image && !map.hasImage(id)) {
        map.addImage(id, image, { pixelRatio: 2 });
      }
      if (image) loaded.add(href);
    }),
  );
  return loaded;
};

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
        const loaded = await registerPoiIcons(parsed.features);
        parsed.features.forEach((feature) => {
          const href = feature.properties?.icon;
          if (href && loaded.has(href)) {
            feature.properties.iconImage = iconImageId(href);
          }
        });
        setData(
          map.coordinateSystem === 'gcj02'
            ? gcoord.transform(parsed, gcoord.WGS84, gcoord.GCJ02)
            : parsed,
        );
      } else {
        setData(null);
      }
    },
    [poiLayer],
  );

  useMapLayer({
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
        filter: ['all', ['==', '$type', 'Point'], ['!has', 'iconImage']],
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
        key: 'icon',
        type: 'symbol',
        filter: ['has', 'iconImage'],
        metadata: { 'traccar:title': t('mapPoiLayer') },
        layout: {
          'icon-image': ['get', 'iconImage'],
          'icon-size': ['coalesce', ['get', 'icon-scale'], 1],
          'icon-allow-overlap': true,
        },
      },
      {
        key: 'title',
        type: 'symbol',
        metadata: { 'traccar:title': t('mapPoiLayer') },
        layout: {
          'text-field': '{name}',
          'text-anchor': 'bottom',
          'text-offset': [
            'case',
            ['has', 'iconImage'],
            ['literal', [0, -1.6]],
            ['literal', [0, -0.5]],
          ],
          'text-font': findFonts(map),
          'text-size': 12,
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1,
        },
      },
    ],
    layersDeps: [t, theme.palette.geometry.main],
    data,
    dataDeps: [data],
  });

  return null;
};

export default PoiMap;
