import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { createRoot } from 'react-dom/client';
import LayersIcon from '@mui/icons-material/Layers';
import TuneIcon from '@mui/icons-material/Tune';
import { map } from '../core/MapView';
import usePersistedState from '../../common/util/usePersistedState';
import { useTranslation } from '../../common/components/LocalizationProvider';

const collectTitles = () => {
  const titles = [];
  map.getStyle()?.layers?.forEach((layer) => {
    const title = layer.metadata?.['traccar:title'];
    if (title && !titles.includes(title)) {
      titles.push(title);
    }
  });
  return titles;
};

const applyVisibility = (hidden) => {
  map.getStyle()?.layers?.forEach((layer) => {
    const title = layer.metadata?.['traccar:title'];
    if (title) {
      const visibility = hidden.includes(title) ? 'none' : 'visible';
      if ((map.getLayoutProperty(layer.id, 'visibility') || 'visible') !== visibility) {
        map.setLayoutProperty(layer.id, 'visibility', visibility);
      }
    }
  });
};

const useStyles = makeStyles()(() => ({
  button: {
    '&&': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
    },
  },
}));

const MapSwitcher = ({ styles, selectedId, onSelect }) => {
  const theme = useTheme();
  const t = useTranslation();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const [hidden, setHidden] = usePersistedState('hiddenMapLayers', []);
  const [titles, setTitles] = useState(collectTitles);

  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;

  useEffect(() => {
    const update = () => {
      setTitles(collectTitles());
      applyVisibility(hiddenRef.current);
    };
    map.on('styledata', update);
    update();
    return () => map.off('styledata', update);
  }, []);

  useEffect(() => applyVisibility(hidden), [hidden]);

  useEffect(() => {
    let element;
    let iconRoot;
    const control = {
      onAdd: () => {
        element = document.createElement('div');
        element.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `maplibregl-ctrl-icon ${classes.button}`;
        button.onclick = () => setAnchorEl(button);
        element.appendChild(button);
        iconRoot = createRoot(button);
        iconRoot.render(<LayersIcon fontSize="small" />);
        return element;
      },
      onRemove: () => {
        queueMicrotask(() => iconRoot.unmount());
        element.remove();
      },
    };
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => map.removeControl(control);
  }, [theme.direction, classes.button]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {styles.map((style) => (
        <MenuItem
          key={style.id}
          selected={style.id === selectedId}
          onClick={() => {
            onSelect(style.id);
            setAnchorEl(null);
          }}
        >
          {style.title}
        </MenuItem>
      ))}
      {titles.length > 0 && <Divider />}
      {titles.map((title) => (
        <MenuItem
          key={title}
          onClick={() =>
            setHidden((previous) =>
              previous.includes(title)
                ? previous.filter((value) => value !== title)
                : [...previous, title],
            )
          }
        >
          <ListItemText>{title}</ListItemText>
          <Switch edge="end" size="small" checked={!hidden.includes(title)} onChange={() => {}} />
        </MenuItem>
      ))}
      <Divider />
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          navigate('/settings/preferences');
        }}
      >
        <ListItemIcon>
          <TuneIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{t('sharedPreferences')}</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MapSwitcher;
