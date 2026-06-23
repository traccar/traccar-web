import { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { map } from '../core/MapView';
import { interpolateTurbo } from '../../common/util/colors';
import { speedFromKnots, speedUnitString } from '../../common/util/converter';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

const gradientStops = Array.from({ length: 10 }, (_, i) => {
  const [r, g, b] = interpolateTurbo(i / 9);
  return `rgb(${r}, ${g}, ${b})`;
}).join(', ');

const useStyles = makeStyles()(() => ({
  colorBar: {
    background: `linear-gradient(to right, ${gradientStops})`,
    height: 10,
  },
}));

const MapSpeedLegend = ({ positions }) => {
  const theme = useTheme();
  const t = useTranslation();
  const speedUnit = useAttributePreference('speedUnit');
  const { classes } = useStyles();

  useEffect(() => {
    if (!positions.length) return undefined;
    const maxSpeed = positions.reduce((a, p) => Math.max(a, p.speed), -Infinity);
    const minSpeed = positions.reduce((a, p) => Math.min(a, p.speed), Infinity);
    if (!maxSpeed) return undefined;

    let container;
    const control = {
      onAdd: () => {
        container = document.createElement('div');
        container.className = 'maplibregl-ctrl maplibregl-ctrl-scale';
        const colorBar = document.createElement('div');
        colorBar.className = classes.colorBar;
        const label = document.createElement('span');
        const min = Math.round(speedFromKnots(minSpeed, speedUnit));
        const max = Math.round(speedFromKnots(maxSpeed, speedUnit));
        label.textContent = `${min} - ${max} ${speedUnitString(speedUnit, t)}`;
        container.appendChild(colorBar);
        container.appendChild(label);
        return container;
      },
      onRemove: () => container?.remove(),
    };
    map.addControl(control, theme.direction === 'rtl' ? 'bottom-right' : 'bottom-left');
    return () => map.removeControl(control);
  }, [positions, speedUnit, t, theme.direction, classes.colorBar]);

  return null;
};

export default MapSpeedLegend;
