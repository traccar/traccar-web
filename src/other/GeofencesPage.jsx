import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider,
  Typography,
  IconButton,
  Toolbar,
  Paper,
  TextField,
  Button,
  Box,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import { makeStyles } from 'tss-react/mui';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

import MapView from '../map/core/MapView';
import MapCurrentLocation from '../map/MapCurrentLocation';
import MapGeofenceEdit from '../map/draw/MapGeofenceEdit';
import GeofencesList from './GeofencesList';

import { useTranslation } from '../common/components/LocalizationProvider';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import MapScale from '../map/MapScale';
import BackIcon from '../common/components/BackIcon';

import { errorsActions } from '../store';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: { height: '100%', display: 'flex', flexDirection: 'column' },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: { flexDirection: 'column-reverse' },
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: { width: theme.dimensions.drawerWidthDesktop },
    [theme.breakpoints.down('sm')]: { height: theme.dimensions.drawerHeightPhone },
  },
  mapContainer: { flexGrow: 1 },
  title: { flexGrow: 1 },
  fileInput: { display: 'none' },
  sortBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    margin: theme.spacing(1, 1, 1, 1), // margem inferior
  },
}));

const GeofencesPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const geofencesItems = useSelector((state) => state.geofences.items);
  const [selectedGeofenceId, setSelectedGeofenceId] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const geofences = useMemo(() => {
    const list = Object.values(geofencesItems || {});

    const sorted = [...list].sort((a, b) => {
      if (!a.name) return 1;
      if (!b.name) return -1;
      return sortOrderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    if (searchInput.trim() === '') return sorted;

    return sorted.filter((g) => g.name.toLowerCase().includes(searchInput.toLowerCase()));
  }, [geofencesItems, sortOrderAsc, searchInput]);

  const geofenceOptions = useMemo(
    () => geofences.map((g) => ({ type: 'geofence', id: g.id, label: g.name })),
    [geofences],
  );


  const handleSearchChange = (value) => setSearchInput(value);

  const handleSelect = (value) => {
    if (!value) return;

    if (value.type === 'geofence') {
      setSelectedGeofenceId(value.id);
      const selected = geofences.find((g) => g.id === value.id);
      if (selected?.area) {
        window.dispatchEvent(
          new CustomEvent('map.fitGeofence', { detail: { area: selected.area } }),
        );
      }
    } else if (value.type === 'coords') {
      window.dispatchEvent(
        new CustomEvent('map.panTo', { detail: { lat: value.lat, lon: value.lon, zoom: 16 } }),
      );
      setSelectedGeofenceId(null);
    }
  };

  const options = [...geofenceOptions];

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    const reader = new FileReader();

    reader.onload = async () => {
      const xml = new DOMParser().parseFromString(reader.result, 'text/xml');
      const segment = xml.getElementsByTagName('trkseg')[0];
      const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
        .map((p) => `${p.getAttribute('lat')} ${p.getAttribute('lon')}`)
        .join(', ');

      const area = `LINESTRING (${coordinates})`;
      const newItem = { name: t('sharedGeofence'), area };

      try {
        const response = await fetchOrThrow('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        const item = await response.json();
        navigate(`/settings/geofence/${item.id}`);
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };

    reader.readAsText(file);
  };

  const toggleSortOrder = () => setSortOrderAsc((prev) => !prev);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Paper square className={classes.drawer}>
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {t('sharedGeofences')}
            </Typography>
            <label htmlFor="upload-gpx">
              <input
                accept=".gpx"
                id="upload-gpx"
                type="file"
                className={classes.fileInput}
                onChange={handleFile}
              />
              <IconButton edge="end" component="span">
                <Tooltip title={t('sharedUpload')}>
                  <UploadFileIcon />
                </Tooltip>
              </IconButton>
            </label>
          </Toolbar>

          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.label || ''}
            onInputChange={(event, value) => handleSearchChange(value)}
            onChange={(event, value) => handleSelect(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('sharedSearch')}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
              />
            )}
            sx={{ m: 1 }}
          />

          <Box className={classes.sortBox}>
            <Button variant="outlined" size="small" onClick={toggleSortOrder}>
              {sortOrderAsc ? 'A → Z' : 'Z → A'}
            </Button>
          </Box>

          <Divider />

          <GeofencesList
            geofences={geofences}
            selectedGeofenceId={selectedGeofenceId}
            onGeofenceSelected={setSelectedGeofenceId}
          />
        </Paper>

        <div className={classes.mapContainer}>
          <MapView>
            <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
          </MapView>
          <MapScale />
          <MapCurrentLocation />
          <MapGeocoder />
        </div>
      </div>
    </div>
  );
};

export default GeofencesPage;
