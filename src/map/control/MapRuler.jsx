import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import StraightenIcon from '@mui/icons-material/Straighten';
import { map } from '../core/MapView';
import { findFonts, toMapCoordinates } from '../core/mapUtil';
import { useAttributePreference } from '../../common/util/preferences';
import { formatDistance } from '../../common/util/formatter';
import { useTranslation } from '../../common/components/LocalizationProvider';

const useStyles = makeStyles()(() => ({
  button: {
    '&&': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
    },
    '&.active': {
      backgroundColor: '#e6e6e6',
      borderRadius: 'inherit',
    },
  },
}));

const MapRuler = ({ positions, onActiveChange }) => {
  const theme = useTheme();
  const t = useTranslation();
  const distanceUnit = useAttributePreference('distanceUnit');
  const { classes } = useStyles();

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const color = theme.palette.geometry.main;
    const points = [];
    let active = false;
    let button;

    map.addSource('ruler', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addLayer({
      id: 'ruler-line',
      type: 'line',
      source: 'ruler',
      filter: ['==', '$type', 'LineString'],
      paint: { 'line-color': color, 'line-width': 2 },
    });
    map.addLayer({
      id: 'ruler-point',
      type: 'circle',
      source: 'ruler',
      filter: ['==', '$type', 'Point'],
      paint: { 'circle-radius': 4, 'circle-color': color },
    });
    map.addLayer({
      id: 'ruler-label',
      type: 'symbol',
      source: 'ruler',
      filter: ['has', 'label'],
      layout: {
        'text-field': ['get', 'label'],
        'text-font': findFonts(map),
        'text-size': 12,
        'text-allow-overlap': true,
        'text-anchor': 'bottom',
        'text-offset': [0, -0.8],
      },
      paint: { 'text-halo-color': 'white', 'text-halo-width': 1 },
    });

    const snap = (lngLat, pixel) => {
      for (const p of positionsRef.current) {
        const mapped = toMapCoordinates(p.longitude, p.latitude);
        if (map.project(mapped).dist(pixel) < 15) {
          return mapped;
        }
      }
      return [lngLat.lng, lngLat.lat];
    };

    const render = () => {
      let total = 0;
      for (let i = 1; i < points.length; i += 1) {
        total += new maplibregl.LngLat(...points[i - 1]).distanceTo(
          new maplibregl.LngLat(...points[i]),
        );
      }
      const features = points.map((coord, i) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: coord },
        properties:
          i === points.length - 1 && points.length > 1
            ? { label: formatDistance(total, distanceUnit, t) }
            : {},
      }));
      if (points.length > 1) {
        features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: points },
        });
      }
      map.getSource('ruler')?.setData({ type: 'FeatureCollection', features });
    };

    const onClick = (event) => {
      points.push(snap(event.lngLat, event.point));
      render();
    };

    const toggle = () => {
      active = !active;
      button.classList.toggle('active', active);
      onActiveChangeRef.current(active);
      if (active) {
        map.on('click', onClick);
      } else {
        map.off('click', onClick);
        points.length = 0;
        render();
      }
    };

    let container;
    let root;
    const control = {
      onAdd: () => {
        container = document.createElement('div');
        container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        button = document.createElement('button');
        button.type = 'button';
        button.title = t('sharedDistance');
        button.className = `maplibregl-ctrl-icon ${classes.button}`;
        button.onclick = toggle;
        container.appendChild(button);
        root = createRoot(button);
        root.render(<StraightenIcon fontSize="small" />);
        return container;
      },
      onRemove: () => {
        queueMicrotask(() => root.unmount());
        container.remove();
      },
    };
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');

    return () => {
      if (active) {
        map.off('click', onClick);
        onActiveChangeRef.current(false);
      }
      map.removeControl(control);
      ['ruler-label', 'ruler-point', 'ruler-line'].forEach((id) => {
        if (map.getLayer(id)) {
          map.removeLayer(id);
        }
      });
      if (map.getSource('ruler')) {
        map.removeSource('ruler');
      }
    };
  }, [theme, t, distanceUnit, classes.button]);

  return null;
};

export default MapRuler;
