import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import turfCircle from '@turf/circle';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import StraightenIcon from '@mui/icons-material/Straighten';
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FenceIcon from '@mui/icons-material/Fence';
import { map } from '../core/MapView';
import { findFonts, toMapCoordinates } from '../core/mapUtil';
import { useAttributePreference } from '../../common/util/preferences';
import { formatArea, formatDistance } from '../../common/util/formatter';
import { useTranslation } from '../../common/components/LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
  bar: {
    position: 'absolute',
    top: theme.spacing(1.5),
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 0.5, 0.5, 1.5),
    borderRadius: theme.spacing(3),
  },
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
  distance: { icon: <StraightenIcon fontSize="small" />, title: 'sharedDistance' },
  area: { icon: <PentagonOutlinedIcon fontSize="small" />, title: 'sharedArea' },
  circle: { icon: <CircleOutlinedIcon fontSize="small" />, title: 'mapShapeCircle' },
};

const earthRadius = 6371008.8;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const polygonArea = (points) => {
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [lng1, lat1] = points[i];
    const [lng2, lat2] = points[(i + 1) % points.length];
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

const formatLength = (value, unit, t) =>
  (!unit || unit === 'km') && value < 1000
    ? `${Math.round(value)} ${t('sharedMeters')}`
    : formatDistance(value, unit, t);

const MapRuler = ({ positions, onActiveChange }) => {
  const theme = useTheme();
  const t = useTranslation();
  const distanceUnit = useAttributePreference('distanceUnit');
  const { classes, cx } = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [result, setResult] = useState({});
  const controlsRef = useRef();

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const color = theme.palette.geometry.main;
    const points = [];
    let mode = null;
    let button;

    map.addSource('ruler', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addLayer({
      id: 'ruler-fill',
      type: 'fill',
      source: 'ruler',
      filter: ['==', '$type', 'Polygon'],
      paint: { 'fill-color': color, 'fill-opacity': 0.1 },
    });
    map.addLayer({
      id: 'ruler-line',
      type: 'line',
      source: 'ruler',
      filter: ['==', '$type', 'LineString'],
      paint: { 'line-color': color, 'line-width': 2 },
    });
    map.addLayer({
      id: 'ruler-midpoint',
      type: 'circle',
      source: 'ruler',
      filter: ['has', 'midpoint'],
      paint: {
        'circle-radius': 4,
        'circle-color': 'white',
        'circle-stroke-color': color,
        'circle-stroke-width': 1.5,
      },
    });
    map.addLayer({
      id: 'ruler-point',
      type: 'circle',
      source: 'ruler',
      filter: ['has', 'vertex'],
      paint: {
        'circle-radius': 5,
        'circle-color': color,
        'circle-stroke-color': 'white',
        'circle-stroke-width': 2,
      },
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
        'text-anchor': ['case', ['has', 'below'], 'top', ['has', 'center'], 'center', 'bottom'],
        'text-offset': [
          'case',
          ['has', 'below'],
          ['literal', [0, 0.8]],
          ['has', 'center'],
          ['literal', [0, 0]],
          ['literal', [0, -0.8]],
        ],
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

    const vertex = (coordinates, index, label) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates },
      properties: { vertex: true, index, ...(label ? { label } : {}) },
    });

    const shape = (ring, label, center, below) => [
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: ring } },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: center },
        properties: { center: true, label, ...(below ? { below } : {}) },
      },
    ];

    const renderCircle = () => {
      const features = points.map((coord, i) => vertex(coord, i));
      if (points.length < 2) {
        setResult({});
        return features;
      }
      const radius = pathLength(points);
      const ring = turfCircle(points[0], radius, { steps: 64, units: 'meters' }).geometry
        .coordinates[0];
      const area = formatArea(Math.PI * radius * radius, distanceUnit);
      const radiusLabel = formatLength(radius, distanceUnit, t);
      setResult({
        main: area,
        perimeter: formatLength(2 * Math.PI * radius, distanceUnit, t),
        radius: radiusLabel,
      });
      features[1] = vertex(points[1], 1, radiusLabel);
      features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: points } });
      return [...features, ...shape(ring, area, points[0], true)];
    };

    const renderPath = () => {
      const area = mode === 'area' && points.length > 2;
      const line = area ? [...points, points[0]] : points;
      const length = points.length > 1 ? formatLength(pathLength(line), distanceUnit, t) : null;
      const areaLabel = area ? formatArea(polygonArea(points), distanceUnit) : null;
      setResult(area ? { main: areaLabel, perimeter: length } : { main: length });
      const features = points.map((coord, i) =>
        vertex(coord, i, !area && i === points.length - 1 ? length : null),
      );
      for (let i = 1; i < line.length; i += 1) {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [(line[i - 1][0] + line[i][0]) / 2, (line[i - 1][1] + line[i][1]) / 2],
          },
          properties: { midpoint: true, index: i },
        });
      }
      if (area) {
        const center = points
          .reduce(([lng, lat], [x, y]) => [lng + x, lat + y], [0, 0])
          .map((value) => value / points.length);
        return [...features, ...shape(line, areaLabel, center)];
      }
      if (points.length > 1) {
        features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: line } });
      }
      return features;
    };

    const render = () => {
      const features = mode === 'circle' ? renderCircle() : renderPath();
      map.getSource('ruler')?.setData({ type: 'FeatureCollection', features });
    };

    const handleLayers = ['ruler-point', 'ruler-midpoint'];
    const canvas = map.getCanvas();
    let dragIndex = null;

    const onClick = (event) => {
      if (map.queryRenderedFeatures(event.point, { layers: handleLayers }).length) {
        return;
      }
      const point = snap(event.lngLat, event.point);
      if (mode === 'circle' && points.length === 2) {
        points[1] = point;
      } else {
        points.push(point);
      }
      render();
    };

    const onMove = (event) => {
      const point = snap(event.lngLat, event.point);
      if (mode === 'circle' && dragIndex === 0 && points.length === 2) {
        points[1] = [
          points[1][0] + point[0] - points[0][0],
          points[1][1] + point[1] - points[0][1],
        ];
      }
      points[dragIndex] = point;
      render();
    };

    const onUp = () => {
      dragIndex = null;
      map.off('mousemove', onMove);
      map.off('touchmove', onMove);
    };

    const onDown = (event) => {
      if (event.originalEvent.button) {
        return;
      }
      event.preventDefault();
      const { midpoint, index } = event.features[0].properties;
      if (midpoint) {
        points.splice(index, 0, [event.lngLat.lng, event.lngLat.lat]);
      }
      dragIndex = index;
      const touch = event.type === 'touchstart';
      map.on(touch ? 'touchmove' : 'mousemove', onMove);
      map.once(touch ? 'touchend' : 'mouseup', onUp);
    };

    const onRemove = (event) => {
      event.preventDefault();
      points.splice(event.features[0].properties.index, 1);
      render();
    };

    const onKeyDown = (event) => {
      if (
        event.key === 'Backspace' &&
        points.length &&
        !event.target.closest?.('input, textarea')
      ) {
        points.pop();
        render();
      }
    };

    const onEnter = () => {
      canvas.style.cursor = 'move';
    };

    const onLeave = () => {
      canvas.style.cursor = dragIndex === null ? 'crosshair' : 'move';
    };

    const start = (newMode) => {
      mode = newMode;
      setActiveMode(newMode);
      button.classList.add('active');
      onActiveChangeRef.current(true);
      canvas.style.cursor = 'crosshair';
      map.on('click', onClick);
      handleLayers.forEach((layer) => {
        map.on('mousedown', layer, onDown);
        map.on('touchstart', layer, onDown);
        map.on('mouseenter', layer, onEnter);
        map.on('mouseleave', layer, onLeave);
      });
      map.on('contextmenu', 'ruler-point', onRemove);
      window.addEventListener('keydown', onKeyDown);
    };

    const detach = () => {
      onUp();
      canvas.style.cursor = '';
      map.off('click', onClick);
      handleLayers.forEach((layer) => {
        map.off('mousedown', layer, onDown);
        map.off('touchstart', layer, onDown);
        map.off('mouseenter', layer, onEnter);
        map.off('mouseleave', layer, onLeave);
      });
      map.off('contextmenu', 'ruler-point', onRemove);
      window.removeEventListener('keydown', onKeyDown);
    };

    const stop = () => {
      mode = null;
      setActiveMode(null);
      button.classList.remove('active');
      onActiveChangeRef.current(false);
      detach();
      points.length = 0;
      render();
    };
    controlsRef.current = { start, stop };

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
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');

    return () => {
      if (mode) {
        detach();
        setActiveMode(null);
        onActiveChangeRef.current(false);
      }
      map.removeControl(control);
      ['ruler-label', 'ruler-point', 'ruler-midpoint', 'ruler-line', 'ruler-fill'].forEach((id) => {
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
    controlsRef.current.start(mode);
  };

  return (
    <>
      {activeMode &&
        createPortal(
          <Paper className={classes.bar} elevation={3}>
            {modes[activeMode].icon}
            <Typography variant="body2">{result.main || t(modes[activeMode].title)}</Typography>
            {result.perimeter && (
              <>
                <FenceIcon fontSize="small" />
                <Typography variant="body2">{result.perimeter}</Typography>
              </>
            )}
            {result.radius && (
              <>
                <StraightenIcon fontSize="small" />
                <Typography variant="body2">{result.radius}</Typography>
              </>
            )}
            <IconButton size="small" onClick={() => controlsRef.current.stop()}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>,
          map.getContainer(),
        )}
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
    </>
  );
};

export default MapRuler;
