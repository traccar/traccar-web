import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import StraightenIcon from '@mui/icons-material/Straighten';
import MapboxDraw from '../draw/MapDraw';
import drawTheme from '../draw/theme';
import { map } from '../core/MapView';
import { findFonts, toMapCoordinates } from '../core/mapUtil';
import { useAttributePreference } from '../../common/util/preferences';
import { formatArea, formatDistance } from '../../common/util/formatter';
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

const earthRadius = 6371008.8;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const polygonArea = (ring) => {
  let total = 0;
  for (let i = 1; i < ring.length; i += 1) {
    const [lng1, lat1] = ring[i - 1];
    const [lng2, lat2] = ring[i];
    total += toRadians(lng2 - lng1) * (2 + Math.sin(toRadians(lat1)) + Math.sin(toRadians(lat2)));
  }
  return Math.abs((total * earthRadius * earthRadius) / 2);
};

const pathLength = (points) => {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += new maplibregl.LngLat(...points[i - 1]).distanceTo(
      new maplibregl.LngLat(...points[i]),
    );
  }
  return total;
};

const MapRuler = ({ positions, onActiveChange }) => {
  const theme = useTheme();
  const t = useTranslation();
  const distanceUnit = useAttributePreference('distanceUnit');
  const { classes, cx } = useStyles();

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const position = theme.direction === 'rtl' ? 'top-left' : 'top-right';
    let active = false;
    let draw;
    let button;

    map.addSource('ruler', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
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

    const snap = (e) => {
      for (const p of positionsRef.current) {
        const mapped = toMapCoordinates(p.longitude, p.latitude);
        if (map.project(mapped).dist(e.point) < 15) {
          return { ...e, lngLat: { lng: mapped[0], lat: mapped[1] } };
        }
      }
      return e;
    };

    const withSnap = (drawMode) => ({
      ...drawMode,
      onClick(state, e) {
        drawMode.onClick.call(this, state, snap(e));
      },
      onTap(state, e) {
        drawMode.onTap.call(this, state, snap(e));
      },
    });

    const label = (coordinates, text) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates },
      properties: { label: text },
    });

    const formatLength = (value) => formatDistance(value, distanceUnit, t);

    const render = () => {
      const features = [];
      draw.getAll().features.forEach(({ geometry: { type, coordinates } }) => {
        if (type === 'LineString' && coordinates.length > 1) {
          const last = coordinates[coordinates.length - 1];
          features.push(label(last, formatLength(pathLength(coordinates))));
        } else if (type === 'Polygon' && coordinates[0].length > 3) {
          const ring = coordinates[0];
          const area = formatArea(polygonArea(ring), distanceUnit);
          const center = ring
            .slice(1)
            .reduce(([lng, lat], [x, y]) => [lng + x, lat + y], [0, 0])
            .map((value) => value / (ring.length - 1));
          features.push(label(center, `${area}\n${formatLength(pathLength(ring))}`));
        }
      });
      map.getSource('ruler')?.setData({ type: 'FeatureCollection', features });
    };

    const start = () => {
      active = true;
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: { line_string: true, polygon: true, trash: true },
        styles: drawTheme,
        defaultMode: 'draw_line_string',
        modes: {
          ...MapboxDraw.modes,
          draw_line_string: withSnap(MapboxDraw.modes.draw_line_string),
          draw_polygon: withSnap(MapboxDraw.modes.draw_polygon),
        },
      });
      map.addControl(draw, position);
      map.on('draw.render', render);
      button.classList.add('active');
      onActiveChangeRef.current(true);
    };

    const stop = () => {
      active = false;
      map.off('draw.render', render);
      map.removeControl(draw);
      map.getSource('ruler').setData({ type: 'FeatureCollection', features: [] });
      button.classList.remove('active');
      onActiveChangeRef.current(false);
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
        button.className = cx('maplibregl-ctrl-icon', classes.button);
        button.onclick = () => (active ? stop() : start());
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
    map.addControl(control, position);

    return () => {
      if (active) {
        stop();
      }
      map.removeControl(control);
      if (map.getLayer('ruler-label')) {
        map.removeLayer('ruler-label');
      }
      if (map.getSource('ruler')) {
        map.removeSource('ruler');
      }
    };
  }, [theme, t, distanceUnit, classes.button, cx]);

  return null;
};

export default MapRuler;
