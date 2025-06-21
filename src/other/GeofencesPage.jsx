import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider,
  Typography,
  IconButton,
  Toolbar,
  Paper,
  Snackbar,
  Button,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import MapView from '../map/core/MapView';
import MapCurrentLocation from '../map/MapCurrentLocation';
import MapGeofenceEdit from '../map/draw/MapGeofenceEdit';
import GeofencesList from './GeofencesList';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import { errorsActions, geofencesActions } from '../store';
import MapScale from '../map/MapScale';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();
  const geofences = useSelector((state) => state.geofences.items);

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editedGeofenceId, setEditedGeofenceId] = useState(null);
  const [pendingGeofenceId, setPendingGeofenceId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: '',
    geofenceId: null,
  });

  const geofenceNameMap = useMemo(() => {
    const map = {};
    Object.values(geofences).forEach((g) => (map[g.id] = g.name));
    return map;
  }, [geofences]);

  const handleGeofenceSelect = (id) => {
    // Check if we can select this geofence (no unsaved changes or same geofence)
    const canSelect = window.geofenceEditor
      ? window.geofenceEditor.canSelectGeofence(id)
      : !unsavedChanges || selectedGeofenceId === id;

    if (!canSelect) {
      const currentEditedId = window.geofenceEditor
        ? window.geofenceEditor.getEditedGeofenceId()
        : editedGeofenceId;

      setPendingGeofenceId(id);
      setSnackbar({
        open: true,
        message: `Please save or discard changes to ${geofenceNameMap[currentEditedId]}`,
        type: 'block',
        geofenceId: currentEditedId,
      });
      return;
    }

    // Select the geofence
    setSelectedGeofenceId(id);

    // Clear any pending selection
    setPendingGeofenceId(null);

    // Close any blocking snackbar if selecting the same geofence that was being edited
    if (snackbar.type === 'block' && snackbar.geofenceId === id) {
      setSnackbar({ ...snackbar, open: false });
    }
  };

  const handleSave = async () => {
    // Use the exposed save method from MapGeofenceEdit
    if (window.geofenceEditor) {
      window.geofenceEditor.save();
    }

    // Don't immediately clear state - let the onSaved callback handle it
  };

  const handleDiscard = () => {
    // Use the exposed discard method from MapGeofenceEdit
    if (window.geofenceEditor) {
      window.geofenceEditor.discard();
    }

    // Refresh geofences to ensure consistency
    dispatch(geofencesActions.refresh());

    // Clear local state
    setUnsavedChanges(false);
    setEditedGeofenceId(null);

    // Handle pending geofence selection
    if (pendingGeofenceId) {
      const pendingId = pendingGeofenceId;
      setPendingGeofenceId(null);
      setSelectedGeofenceId(pendingId);
    }

    // Close snackbar
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUnsavedChange = () => {
    setUnsavedChanges(true);
  };

  const handleSaved = () => {
    setUnsavedChanges(false);
    setEditedGeofenceId(null);

    // Handle pending geofence selection after save
    if (pendingGeofenceId) {
      const pendingId = pendingGeofenceId;
      setPendingGeofenceId(null);
      setSelectedGeofenceId(pendingId);
    }

    // Close snackbar
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditStateChange = (hasChanges, geofenceId) => {
    setUnsavedChanges(hasChanges);
    setEditedGeofenceId(geofenceId);

    if (hasChanges && geofenceId && !snackbar.open) {
      // Show save prompt snackbar
      setSnackbar({
        open: true,
        message: `Save changes to ${geofenceNameMap[geofenceId]}`,
        type: 'prompt',
        geofenceId,
      });
    } else if (!hasChanges) {
      // Close snackbar if no more changes
      setSnackbar({ ...snackbar, open: false });
    }
  };

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const xml = new DOMParser().parseFromString(reader.result, 'text/xml');

        const trkpts = Array.from(xml.getElementsByTagName('trkpt'));
        if (trkpts.length === 0) {
          throw new Error('No track points (trkpt) found in file.');
        }

        const coordsArray = trkpts.map(
          (pt) => `${pt.getAttribute('lon')} ${pt.getAttribute('lat')}`
        );

        if (coordsArray.length === 0) {
          throw new Error('No valid coordinates extracted.');
        }

        const isClosed =
          coordsArray[0] === coordsArray[coordsArray.length - 1] &&
          coordsArray.length >= 4;

        const area = isClosed
          ? `POLYGON ((${coordsArray.join(', ')}))`
          : `LINESTRING (${coordsArray.join(', ')})`;

        const newItem = { name: t('sharedGeofence'), area };
        const response = await fetch('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to save geofence.');
        }

        const savedItem = await response.json();
        navigate(`/settings/geofence/${savedItem.id}`);
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };

    reader.onerror = (event) => {
      dispatch(errorsActions.push(event.target.error));
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (
      selectedGeofenceId &&
      editedGeofenceId === selectedGeofenceId &&
      unsavedChanges &&
      !snackbar.open
    ) {
      setSnackbar({
        open: true,
        message: `Save changes to ${geofenceNameMap[selectedGeofenceId]}`,
        type: 'prompt',
        geofenceId: selectedGeofenceId,
      });
    }
  }, [
    selectedGeofenceId,
    editedGeofenceId,
    unsavedChanges,
    geofenceNameMap,
    snackbar.open,
  ]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Paper square className={classes.drawer}>
          <Toolbar>
            <IconButton
              edge="start"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {t('sharedGeofences')}
            </Typography>
            <label htmlFor="upload-gpx">
              <input
                accept=".gpx,.kml,.txt"
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
          <Divider />
          <GeofencesList onGeofenceSelected={handleGeofenceSelect} />
        </Paper>
        <div className={classes.mapContainer}>
          <MapView>
            <MapGeofenceEdit
              selectedGeofenceId={selectedGeofenceId}
              onUnsavedChange={handleUnsavedChange}
              onSaved={handleSaved}
              onEditStateChange={handleEditStateChange}
            />
          </MapView>
          <MapScale />
          <MapCurrentLocation />
          <MapGeocoder />
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        action={
          (snackbar.type === 'prompt' || snackbar.type === 'block') && (
            <>
              <Button color="primary" size="small" onClick={handleSave}>
                Save
              </Button>
              <Button color="error" size="small" onClick={handleDiscard}>
                Discard
              </Button>
            </>
          )
        }
      />
    </div>
  );
};

export default GeofencesPage;
