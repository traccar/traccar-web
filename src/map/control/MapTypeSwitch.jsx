import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { map } from '../core/MapView';
import { useTranslation } from '../../common/components/LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
  root: {
    '&&': {
      display: 'flex',
      gap: 4,
      padding: 4,
      borderRadius: 12,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      pointerEvents: 'auto',
    },
  },
  button: {
    height: 36,
    padding: theme.spacing(0, 1.75),
    border: 0,
    borderRadius: 9,
    background: 'transparent',
    color: theme.palette.text.secondary,
    font: 'inherit',
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  // Triple class beats MapLibre's `.maplibregl-ctrl button:not(:disabled):hover` rule,
  // which would otherwise lighten the active button on hover and hide its white text
  active: {
    '&&&, &&&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  },
}));

// Segmented control at the top start corner of the map, choosing between a few map types
// ({ id, label } with id = map style id). Rendered through a portal so it keeps the app theme.
const MapTypeSwitch = ({ options, selectedId, onSelect }) => {
  const theme = useTheme();
  const t = useTranslation();
  const { classes, cx } = useStyles();
  const [element] = useState(() => document.createElement('div'));

  useEffect(() => {
    element.className = cx('maplibregl-ctrl', classes.root);
    const control = {
      onAdd: () => element,
      onRemove: () => element.remove(),
    };
    map.addControl(control, theme.direction === 'rtl' ? 'top-right' : 'top-left');
    return () => map.removeControl(control);
  }, [element, theme.direction, classes.root, cx]);

  return createPortal(
    <div role="group" aria-label={t('mapLayer')} style={{ display: 'contents' }}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === selectedId}
          className={cx(classes.button, option.id === selectedId && classes.active)}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>,
    element,
  );
};

export default MapTypeSwitch;
