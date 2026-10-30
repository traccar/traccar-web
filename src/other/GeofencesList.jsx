import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import { geofencesActions, messagesActions } from '../store';
import CollectionActions from '../settings/components/CollectionActions';
import { useAsyncTask, useCatch, useCatchCallback } from '../reactHelper';
import fetchOrThrow from '../common/util/fetchOrThrow';
import SelectField from '../common/components/SelectField';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useRestriction } from '../common/util/permissions';

const useStyles = makeStyles()(() => ({
  list: {
    flexGrow: 1,
    overflow: 'auto',
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
}));

const GeofencesList = ({ onGeofenceSelected }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();
  const readonly = useRestriction('readonly');
  const [geofenceId, setGeofenceId] = useState(null);
  const [deviceIds, setDeviceIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [devices, setDevices] = useState([]);
  const [linkedDeviceIds, setLinkedDeviceIds] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  useAsyncTask(
    async ({ signal }) => {
      if (!geofenceId) return;
      setLoadingDevices(true);
      try {
        const response = await fetchOrThrow('api/devices', { signal });
        const available = await response.json();
        const linked = await Promise.all(
          available.map(async (device) => {
            const result = await fetchOrThrow(`api/geofences?deviceId=${device.id}`, { signal });
            const geofences = await result.json();
            return geofences.some((geofence) => geofence.id === geofenceId) ? device.id : null;
          }),
        );
        if (!signal.aborted) {
          const ids = linked.filter((id) => id != null);
          setDevices(available.sort((a, b) => a.name.localeCompare(b.name)));
          setLinkedDeviceIds(ids);
          setDeviceIds(ids);
        }
      } finally {
        if (!signal.aborted) setLoadingDevices(false);
      }
    },
    [geofenceId],
  );

  const handleLink = useCatch(async () => {
    setSaving(true);
    try {
      const added = deviceIds.filter((id) => !linkedDeviceIds.includes(id));
      const removed = linkedDeviceIds.filter((id) => !deviceIds.includes(id));
      for (const id of added) {
        await fetchOrThrow('api/permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId: id, geofenceId }),
        });
        setLinkedDeviceIds((previous) => [...previous, id]);
      }
      for (const id of removed) {
        await fetchOrThrow('api/permissions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId: id, geofenceId }),
        });
        setLinkedDeviceIds((previous) => previous.filter((device) => device !== id));
      }
      dispatch(messagesActions.push({ message: t('sharedSaved'), severity: 'success' }));
      setGeofenceId(null);
    } finally {
      setSaving(false);
    }
  });

  const items = useSelector((state) => state.geofences.items);

  const refreshGeofences = useCatchCallback(async () => {
    const response = await fetchOrThrow('api/geofences');
    dispatch(geofencesActions.refresh(await response.json()));
  }, [dispatch]);

  return (
    <>
      <List className={classes.list}>
        {Object.values(items).map((item, index, list) => (
          <Fragment key={item.id}>
            <ListItemButton key={item.id} onClick={() => onGeofenceSelected(item.id)}>
              <ListItemText primary={item.name} />
              <Box onClick={(event) => event.stopPropagation()}>
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/geofence"
                  endpoint="geofences"
                  onReload={refreshGeofences}
                  readonly={readonly}
                  onLink={(id) => {
                    setDeviceIds([]);
                    setDevices([]);
                    setLinkedDeviceIds([]);
                    setGeofenceId(id);
                  }}
                />
              </Box>
            </ListItemButton>
            {index < list.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </List>
      <Dialog
        open={Boolean(geofenceId)}
        onClose={() => {
          if (!saving) setGeofenceId(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {t('sharedConnections')} — {items[geofenceId]?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          <SelectField
            data={devices}
            label={t('sharedDevice')}
            value={deviceIds}
            onChange={(event) => setDeviceIds(event.target.value)}
            multiple
            disabled={saving || loadingDevices}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGeofenceId(null)} disabled={saving}>
            {t('sharedCancel')}
          </Button>
          <Button
            onClick={handleLink}
            disabled={
              saving ||
              loadingDevices ||
              (deviceIds.length === linkedDeviceIds.length &&
                deviceIds.every((id) => linkedDeviceIds.includes(id)))
            }
            variant="contained"
          >
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GeofencesList;
