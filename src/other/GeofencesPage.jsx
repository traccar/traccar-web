import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Typography, IconButton, Toolbar, Paper, TextField } from '@mui/material';
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
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: theme.dimensions.drawerWidthDesktop,
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.dimensions.drawerHeightPhone,
    },
  },
  mapContainer: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  fileInput: {
    display: 'none',
  },
}));

const GeofencesPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const geofences = useSelector((state) => Object.values(state.geofences.items || {}));

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();
  const [setSearchInput] = useState('');

  const parseCoordinates = (text) => {
    const match = text.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    if (!match) return null;

    return {
      lat: parseFloat(match[1]),
      lon: parseFloat(match[3]),
    };
  };

  const geofenceOptions = useMemo(() => {
    return geofences.map((g) => ({
      type: 'geofence',
      id: g.id,
      label: g.name,
    }));
  }, [geofences]);

  const searchAddress = async (query) => {
    try {
      const response = await fetchOrThrow(
        `/api/geocoder/search?query=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      return data.map((item) => ({
        type: 'address',
        label: item.displayName,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      dispatch(errorsActions.push(error.message));
      return [];
    }
  };

  const [addressOptions, setAddressOptions] = useState([]);

  const handleSearchChange = async (value) => {
    setSearchInput(value);

    if (!value || value.length < 3) {
      setAddressOptions([]);
      return;
    }

    const coords = parseCoordinates(value);

    if (coords) {
      setAddressOptions([
        {
          type: 'coords',
          label: `${coords.lat}, ${coords.lon}`,
          lat: coords.lat,
          lon: coords.lon,
        },
      ]);
      return;
    }

    const results = await searchAddress(value);
    setAddressOptions(results);
  };

  const options = [...geofenceOptions, ...addressOptions];

  const handleSelect = (value) => {
    if (!value) return;

    if (value.type === 'geofence') {
      setSelectedGeofenceId(value.id);
    }

    if (value.type === 'coords' || value.type === 'address') {
      window.dispatchEvent(
        new CustomEvent('map.panTo', {
          detail: {
            lat: value.lat,
            lon: value.lon,
            zoom: 16,
          },
        }),
      );
    }
  };

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;

    const reader = new FileReader();

    reader.onload = async () => {
      const xml = new DOMParser().parseFromString(reader.result, 'text/xml');
      const segment = xml.getElementsByTagName('trkseg')[0];

      const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
        .map((point) => `${point.getAttribute('lat')} ${point.getAttribute('lon')}`)
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

          <Divider />

          <GeofencesList onGeofenceSelected={setSelectedGeofenceId} />
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
