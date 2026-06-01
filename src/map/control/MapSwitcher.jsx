import { useEffect, useState } from 'react';
import { useTheme, Menu, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { createRoot } from 'react-dom/client';
import LayersIcon from '@mui/icons-material/Layers';
import { map } from '../core/MapView';

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
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

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
    </Menu>
  );
};

export default MapSwitcher;
