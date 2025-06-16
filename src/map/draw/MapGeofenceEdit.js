import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';
import { findFonts, geofenceToFeature, geometryToArea } from '../core/mapUtil';
import { errorsActions, geofencesActions } from '../../store';
import { useCatchCallback } from '../../reactHelper';
import drawTheme from './theme';
import { useTranslation } from '../../common/components/LocalizationProvider';

MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

const MapGeofenceEdit = ({
  selectedGeofenceId,
  onUnsavedChange,
  onSaved,
  onEditStateChange,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const draw = useMemo(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          line_string: true,
          trash: true,
        },
        userProperties: true,
        styles: [
          ...drawTheme,
          {
            id: 'gl-draw-title',
            type: 'symbol',
            filter: ['all'],
            layout: {
              'text-field': '{user_name}',
              'text-font': findFonts(map),
              'text-size': 12,
            },
            paint: {
              'text-halo-color': 'white',
              'text-halo-width': 1,
            },
          },
        ],
      }),
    []
  );

  const geofences = useSelector((state) => state.geofences.items);
  const [editedGeofenceId, setEditedGeofenceId] = useState(null);
  const unsavedChangesRef = useRef(false);
  const pendingFeatureRef = useRef(null);

  const refreshGeofences = useCatchCallback(async () => {
    const response = await fetch('/api/geofences');
    if (response.ok) {
      dispatch(geofencesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, [dispatch]);

  const saveChanges = useCatchCallback(
    async (id, feature) => {
      const item = Object.values(geofences).find((i) => i.id === id);
      if (!item) return;

      const updatedItem = { ...item, area: geometryToArea(feature.geometry) };

      try {
        const response = await fetch(`/api/geofences/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        });

        if (response.ok) {
          unsavedChangesRef.current = false;
          setEditedGeofenceId(null);
          pendingFeatureRef.current = null;
          await refreshGeofences();
          if (onSaved) onSaved();
          if (onEditStateChange) onEditStateChange(false, null);
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    },
    [dispatch, geofences, refreshGeofences, onSaved, onEditStateChange]
  );

  const discardChanges = useCatchCallback(
    (id) => {
      draw.delete(id);
      const geofence = geofences[id];
      if (geofence) {
        draw.add(geofenceToFeature(theme, geofence));
      }
      unsavedChangesRef.current = false;
      setEditedGeofenceId(null);
      pendingFeatureRef.current = null;
      if (onEditStateChange) onEditStateChange(false, null);
    },
    [draw, theme, geofences, onEditStateChange]
  );

  const handleGeofenceUpdate = useCatchCallback(
    (event) => {
      const feature = event.features[0];
      const { id } = feature;

      if (
        editedGeofenceId &&
        editedGeofenceId !== id &&
        unsavedChangesRef.current
      ) {
        draw.delete(id);
        const originalGeofence = geofences[id];
        if (originalGeofence) {
          draw.add(geofenceToFeature(theme, originalGeofence));
        }
        draw.changeMode('simple_select', { featureIds: [editedGeofenceId] });
        return;
      }

      unsavedChangesRef.current = true;
      setEditedGeofenceId(id);
      pendingFeatureRef.current = feature;

      if (onUnsavedChange) onUnsavedChange();
      if (onEditStateChange) onEditStateChange(true, id);
    },
    [
      editedGeofenceId,
      geofences,
      draw,
      theme,
      onUnsavedChange,
      onEditStateChange,
    ]
  );

  const focusSelectedGeofence = useCallback(
    (selectedId) => {
      if (!selectedId) return null;
      if (
        editedGeofenceId &&
        editedGeofenceId !== selectedId &&
        unsavedChangesRef.current
      ) {
        return false;
      }

      // Focus on the selected geofence
      const geofence = geofences[selectedId];
      if (geofence) {
        // Change selection mode
        draw.changeMode('simple_select', { featureIds: [selectedId] });

        // Get the feature from the draw instance
        const feature = draw.get(selectedId);
        if (feature && feature.geometry) {
          try {
            // Calculate bounds for the feature
            const bounds = new maplibregl.LngLatBounds();

            if (feature.geometry.type === 'Polygon') {
              // For polygons, use all coordinates
              feature.geometry.coordinates[0].forEach((coord) => {
                bounds.extend(coord);
              });
            } else if (feature.geometry.type === 'LineString') {
              // For line strings, use all coordinates
              feature.geometry.coordinates.forEach((coord) => {
                bounds.extend(coord);
              });
            } else if (feature.geometry.type === 'Point') {
              // For points, center on the point
              bounds.extend(feature.geometry.coordinates);
            }

            // Fit the map to the bounds with some padding
            map.fitBounds(bounds, {
              padding: 50,
              maxZoom: 16, // Don't zoom in too much
              duration: 1000, // Smooth animation
            });
          } catch (error) {
            console.log('Error fitting bounds to geofence:', error);
          }
        }
      }
      return true;
    },
    [editedGeofenceId, geofences, draw]
  );

  useEffect(() => {
    const enableMapInteraction = () => {
      if (map) {
        map.dragPan.enable();
        map.scrollZoom.enable();
        map.boxZoom.enable();
        map.doubleClickZoom.enable();
        map.keyboard.enable();
      }
    };

    const handleModeChange = () => {
      setTimeout(enableMapInteraction, 100);
    };

    map.on('draw.modechange', handleModeChange);

    enableMapInteraction();

    return () => {
      map.off('draw.modechange', handleModeChange);
    };
  }, []);

  useEffect(() => {
    window.geofenceEditor = {
      save: () => {
        if (
          editedGeofenceId && unsavedChangesRef.current &&
          pendingFeatureRef.current) {
          saveChanges(editedGeofenceId, pendingFeatureRef.current);
        }
      },
      discard: () => {
        if (editedGeofenceId) {
          discardChanges(editedGeofenceId);
        }
      },
      hasUnsavedChanges: () => unsavedChangesRef.current,
      getEditedGeofenceId: () => editedGeofenceId,
      canSelectGeofence: (id) =>
        !editedGeofenceId ||
        editedGeofenceId === id ||
        !unsavedChangesRef.current,
      resetMapInteraction: () => {
        draw.changeMode('simple_select');
        if (map) {
          map.dragPan.enable();
          map.scrollZoom.enable();
          map.boxZoom.enable();
          map.doubleClickZoom.enable();
          map.keyboard.enable();
        }
      },
    };
  }, [editedGeofenceId, saveChanges, discardChanges]);

  useEffect(() => {
    refreshGeofences();
    map.addControl(draw, 'top-left');
    return () => map.removeControl(draw);
  }, [refreshGeofences]);

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0];
      const newItem = {
        name: t('sharedGeofence'),
        area: geometryToArea(feature.geometry),
      };
      draw.delete(feature.id);
      try {
        const response = await fetch('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (response.ok) {
          const item = await response.json();
          navigate(`/settings/geofence/${item.id}`);
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };
    map.on('draw.create', listener);
    return () => map.off('draw.create', listener);
  }, [dispatch, navigate, t]);

  useEffect(() => {
    map.on('draw.update', handleGeofenceUpdate);
    return () => map.off('draw.update', handleGeofenceUpdate);
  }, [handleGeofenceUpdate]);

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0];
      try {
        const response = await fetch(`/api/geofences/${feature.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // If we're deleting the currently edited geofence, reset state
          if (feature.id === editedGeofenceId) {
            unsavedChangesRef.current = false;
            setEditedGeofenceId(null);
            pendingFeatureRef.current = null;
            if (onEditStateChange) onEditStateChange(false, null);
          }
          refreshGeofences();
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };
    map.on('draw.delete', listener);
    return () => map.off('draw.delete', listener);
  }, [dispatch, refreshGeofences, editedGeofenceId, onEditStateChange]);

  useEffect(() => {
    draw.deleteAll();
    Object.values(geofences).forEach((geofence) => {
      draw.add(geofenceToFeature(theme, geofence));
    });
  }, [geofences]);

  useEffect(() => {
    if (selectedGeofenceId && focusSelectedGeofence(selectedGeofenceId)) {
      // Successfully focused on selected geofence
    }
  }, [selectedGeofenceId, focusSelectedGeofence]);

  return null;
};

export default MapGeofenceEdit;
