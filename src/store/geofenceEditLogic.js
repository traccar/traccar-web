import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { geometryToArea, geofenceToFeature } from '../core/mapUtil';
import { errorsActions, geofencesActions } from '../../store';
import { map } from '../core/MapView';
import { useCatchCallback } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';

export const useGeofenceEditing = ({
    dispatch,
    draw,
    theme,
    geofences,
    refreshGeofences,
    editedGeofenceId,
    setEditedGeofenceId,
    unsavedChangesRef,
    snackbarKeyRef,
}) => {
    const t = useTranslation();

    const saveChanges = useCatchCallback(async (id, feature) => {
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
                snackbarKeyRef.current = null;
                await refreshGeofences();
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            dispatch(errorsActions.push(error.message));
        }
    }, [dispatch, geofences, refreshGeofences]);

    const discardChanges = useCatchCallback((id) => {
        draw.delete(id);
        const geofence = geofences[id];
        if (geofence) {
            draw.add(geofenceToFeature(theme, geofence));
        }
        unsavedChangesRef.current = false;
        setEditedGeofenceId(null);
        snackbarKeyRef.current = null;
    }, [draw, theme, geofences]);

    const handleGeofenceUpdate = useCatchCallback((event) => {
        const feature = event.features[0];
        const id = feature.id;

        // If there's already an edited geofence and it's different from current
        if (editedGeofenceId && editedGeofenceId !== id && unsavedChangesRef.current) {
            // Revert this change and focus back on the edited geofence
            draw.delete(id);
            const originalGeofence = geofences[id];
            if (originalGeofence) {
                draw.add(geofenceToFeature(theme, originalGeofence));
            }
            draw.changeMode('simple_select', { featureIds: [editedGeofenceId] });
            return;
        }

        // Mark as having unsaved changes
        unsavedChangesRef.current = true;
        setEditedGeofenceId(id);
    }, [editedGeofenceId, geofences, draw, theme]);

    const focusSelectedGeofence = useCatchCallback((selectedId) => {
        if (!selectedId) return;

        // If there are unsaved changes to a different geofence, don't allow selection change
        if (editedGeofenceId && editedGeofenceId !== selectedId && unsavedChangesRef.current) {
            return;
        }

        // Focus on the selected geofence
        const geofence = geofences[selectedId];
        if (geofence) {
            draw.changeMode('simple_select', { featureIds: [selectedId] });

            // If this geofence is being edited, show the snackbar
            if (editedGeofenceId === selectedId && unsavedChangesRef.current) {
                snackbarKeyRef.current = selectedId;
            }
        }
    }, [editedGeofenceId, geofences, draw]);

    return {
        handleGeofenceUpdate,
        focusSelectedGeofence,
        saveChanges,
        discardChanges,
    };
};