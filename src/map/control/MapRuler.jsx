import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import turfCircle from '@turf/circle';
import { ListItemIcon, ListItemText, Menu, MenuItem, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import StraightenIcon from '@mui/icons-material/Straighten';
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
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
    '&.active, &.active:not(:disabled):hover': {
      backgroundColor: '#e6e6e6',
      borderRadius: 'inherit',
    },
  },
}));

const modes = {
  draw_line_string: { icon: <StraightenIcon fontSize="small" />, title: 'sharedDistance' },
  draw_polygon: { icon: <PentagonOutlinedIcon fontSize="small" />, title: 'sharedArea' },
  draw_circle: { icon: <CircleOutlinedIcon fontSize="small" />, title: 'mapShapeCircle' },
};

// Line from the center to the edge, finished after the second point
const drawCircle = {
  ...MapboxDraw.modes.draw_line_string,
  clickAnywhere(state, e) {
    MapboxDraw.modes.draw_line_string.clickAnywhere.call(this, state, e);
    if (state.currentVertexPosition > 1) {
      this.changeMode('simple_select', { featureIds: [state.line.id] });
    }
  },
};

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

const distance = (from, to) =>
  new maplibregl.LngLat(...from).distanceTo(new maplibregl.LngLat(...to));

const pathLength = (points) =>
  points.slice(1).reduce((total, point, i) => total + distance(points[i], point), 0);

const MapRuler = ({ positions, onActiveChange }) => {
  const theme = useTheme();
  const t = useTranslation();
  const distanceUnit = useAttributePreference('distanceUnit');
  const { classes, cx } = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const startRef = useRef();

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const position = theme.direction === 'rtl' ? 'top-left' : 'top-right';
    let mode = null;
    let draw;
    let button;

    map.addSource('ruler', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addLayer({
      id: 'ruler-circle',
      type: 'line',
      source: 'ruler',
      filter: ['==', '$type', 'Polygon'],
      paint: { 'line-color': theme.palette.geometry.main, 'line-width': 2 },
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
          if (mode !== 'draw_circle') {
            features.push(label(last, formatLength(pathLength(coordinates))));
            return;
          }
          const radius = distance(coordinates[0], last);
          if (radius > 0) {
            const area = formatArea(Math.PI * radius * radius, distanceUnit);
            features.push(turfCircle(coordinates[0], radius, { steps: 64, units: 'meters' }));
            features.push(label(last, formatLength(radius)));
            features.push(label(coordinates[0], `${area}\n${formatLength(2 * Math.PI * radius)}`));
          }
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

    const restart = () => {
      if (!draw.getAll().features.length) {
        draw.changeMode(mode);
      }
    };

    const start = (newMode) => {
      mode = newMode;
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: { trash: true },
        styles: drawTheme,
        defaultMode: mode,
        modes: {
          ...MapboxDraw.modes,
          draw_line_string: withSnap(MapboxDraw.modes.draw_line_string),
          draw_polygon: withSnap(MapboxDraw.modes.draw_polygon),
          draw_circle: withSnap(drawCircle),
        },
      });
      map.addControl(draw, position);
      map.on('draw.render', render);
      map.on('draw.modechange', restart);
      map.on('draw.delete', restart);
      button.classList.add('active');
      onActiveChangeRef.current(true);
    };
    startRef.current = start;

    const detach = () => {
      map.off('draw.render', render);
      map.off('draw.modechange', restart);
      map.off('draw.delete', restart);
      map.removeControl(draw);
      mode = null;
      onActiveChangeRef.current(false);
    };

    const stop = () => {
      detach();
      button.classList.remove('active');
      map.getSource('ruler')?.setData({ type: 'FeatureCollection', features: [] });
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
        button.onclick = () => (mode ? stop() : setAnchorEl(button));
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
      if (mode) {
        detach();
      }
      map.removeControl(control);
      ['ruler-label', 'ruler-circle'].forEach((id) => {
        if (map.getLayer(id)) {
          map.removeLayer(id);
        }
      });
      if (map.getSource('ruler')) {
        map.removeSource('ruler');
      }
    };
  }, [theme, t, distanceUnit, classes.button, cx]);

  const handleSelect = (mode) => {
    setAnchorEl(null);
    startRef.current(mode);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: 'top', horizontal: theme.direction === 'rtl' ? 'right' : 'left' }}
      transformOrigin={{
        vertical: 'top',
        horizontal: theme.direction === 'rtl' ? 'left' : 'right',
      }}
    >
      {Object.entries(modes).map(([key, { icon, title }]) => (
        <MenuItem key={key} onClick={() => handleSelect(key)}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{t(title)}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default MapRuler;
