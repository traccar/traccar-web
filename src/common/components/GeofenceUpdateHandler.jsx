import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import React, { useState, useCallback } from 'react';

const GeofenceUpdateHandler = ({
  draw,
  theme,
  originalFeature,
  updatedFeature,
  onConfirm,
}) => {
  const [open, setOpen] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setSnackbar({
        open: true,
        type: 'success',
        message: 'Geofence updated successfully',
      });
    } catch (error) {
      setSnackbar({ open: true, type: 'error', message: error.message });
      draw.delete(updatedFeature.id);
      draw.add(originalFeature);
    } finally {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    draw.delete(updatedFeature.id);
    draw.add(originalFeature);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          Do you want to save changes to this geofence?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color='secondary'>
            No
          </Button>
          <Button onClick={handleConfirm} variant='contained' color='primary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GeofenceUpdateHandler;
