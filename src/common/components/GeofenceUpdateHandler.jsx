import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import React, { useState } from 'react';

const GeofenceUpdateHandler = ({
  draw,
  originalFeature,
  updatedFeature,
  onConfirm,
  onDone,
}) => {
  const [dialogOpen, setDialogOpen] = useState(true);
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
      draw.delete(updatedFeature.id);
      draw.add(originalFeature);
      setSnackbar({
        open: true,
        type: 'error',
        message: error.message || 'Something went wrong',
      });
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    draw.delete(updatedFeature.id);
    draw.add(originalFeature);
    setDialogOpen(false);
    setSnackbar({
      open: true,
      type: 'info',
      message: 'Update cancelled',
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));

    // ✅ Close everything only after snackbar hides
    if (!dialogOpen && onDone) {
      onDone();
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleCancel}>
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
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.type}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GeofenceUpdateHandler;
