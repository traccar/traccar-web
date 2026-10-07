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

const loadPoiIcon = (href, signal) =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    signal.addEventListener(
      'abort',
      () => {
        image.src = '';
        resolve(null);
      },
      { once: true },
    );
    image.src = href;
  });

const resolvePoiIcon = async (href, signal) => {
  const id = `poi-icon:${href}`;
  if (!map.hasImage(id)) {
    const image = await loadPoiIcon(href, signal);
    if (!image || signal.aborted) {
      return null;
    }
    if (!map.hasImage(id)) {
      map.addImage(id, image);
    }
  }
  return { id, height: map.getImage(id).data.height };
};

const isPoint = (feature) => ['Point', 'MultiPoint'].includes(feature.geometry?.type);

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
        const collection =
          map.coordinateSystem === 'gcj02'
            ? gcoord.transform(parsed, gcoord.WGS84, gcoord.GCJ02)
            : parsed;
        setData(collection);
        const hrefs = [
          ...new Set(collection.features.filter(isPoint).map((f) => f.properties?.icon)),
        ].filter((href) => href && URL.canParse(href, file.url));
        const icons = new Map(
          await Promise.all(
            hrefs.map(async (href) => [
              href,
              await resolvePoiIcon(new URL(href, file.url).href, signal),
            ]),
          ),
        );
        if (!signal.aborted && [...icons.values()].some(Boolean)) {
          setData({
            ...collection,
            features: collection.features.map((feature) => {
              const icon = isPoint(feature) && icons.get(feature.properties?.icon);
              return icon
                ? {
                    ...feature,
                    properties: {
                      ...feature.properties,
                      iconImage: icon.id,
                      iconHeight: icon.height * (feature.properties['icon-scale'] ?? 1),
                    },
                  }
                : feature;
            }),
          });
        }
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
        filter: ['!has', 'iconImage'],
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
          'text-variable-anchor': ['bottom'],
          'text-radial-offset': [
            'case',
            ['has', 'iconHeight'],
            ['+', ['/', ['get', 'iconHeight'], 24], 0.25],
            0.5,
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
