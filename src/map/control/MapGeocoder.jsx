import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useTheme,
  Popover,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Box,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { createRoot } from 'react-dom/client';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { map } from '../core/MapView';
import { toMapCoordinates } from '../core/mapUtil';
import { errorsActions } from '../../store';
import { useTranslation } from '../../common/components/LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
  button: {
    '&&': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
    },
  },
  panel: {
    width: theme.spacing(40),
    maxHeight: theme.spacing(50),
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: theme.spacing(1),
  },
  results: {
    overflowY: 'auto',
  },
}));

const MapGeocoder = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const t = useTranslation();
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson&addressdetails=1`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        setResults(data.features || []);
      } catch (e) {
        if (e.name !== 'AbortError') {
          dispatch(errorsActions.push(e.message));
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query, dispatch]);

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
        iconRoot.render(<TravelExploreIcon fontSize="small" />);
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

  const onSelect = (feature) => {
    const [minX, minY, maxX, maxY] = feature.bbox;
    map.fitBounds([toMapCoordinates(minX, minY), toMapCoordinates(maxX, maxY)], { padding: 40 });
    setAnchorEl(null);
    setQuery('');
    setResults([]);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box className={classes.panel}>
        <Box className={classes.input}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder={t('sharedSearch')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
        <List className={classes.results} dense disablePadding>
          {loading
            ? Array.from({ length: 3 }, (_, i) => (
                <ListItemButton key={i} disabled>
                  <ListItemText primary={<Skeleton width="100%" />} />
                </ListItemButton>
              ))
            : results.map((feature) => (
                <ListItemButton key={feature.properties.place_id} onClick={() => onSelect(feature)}>
                  <ListItemText primary={feature.properties.display_name} />
                </ListItemButton>
              ))}
        </List>
      </Box>
    </Popover>
  );
};

export default MapGeocoder;
