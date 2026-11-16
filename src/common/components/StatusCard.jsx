import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import dayjs from 'dayjs';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  MenuItem,
  CardMedia,
  TableFooter,
  Link,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { alpha, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import AddressValue from './AddressValue';
import { useDeviceReadonly, useRestriction } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions, eventsActions, messagesActions } from '../../store';
import { formatAlarm, formatTime } from '../util/formatter';
import { prefixString } from '../util/stringUtils';
import {
  deviceStateColor,
  deviceStateTextColor,
  formatDeviceState,
  getDeviceState,
} from '../util/deviceState';
import useOpenAlarms from '../util/useOpenAlarms';
import { useAsyncTask, useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';
import mediaUrl from '../util/mediaUrl';

const useStyles = makeStyles()((theme, { dockRight }) => ({
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.statusCardWidth,
    maxWidth: `calc(100vw - ${theme.spacing(4)})`,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      // Fill at most the space below the docking offset; only the middle section scrolls
      maxHeight: `calc(100vh - ${theme.spacing(13)})`,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(2, 1, 1, 2),
    cursor: 'move',
  },
  title: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    lineHeight: 1.2,
  },
  pill: {
    flexShrink: 0,
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.25, 1.25),
    borderRadius: 999,
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  alarm: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    margin: theme.spacing(0, 2, 1),
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.warning.main, 0.12),
    color: theme.palette.warning.main,
  },
  alarmText: {
    flex: 1,
    minWidth: 0,
  },
  tiles: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
  },
  tileValue: {
    fontWeight: 600,
    fontSize: '1.05rem',
    overflowWrap: 'anywhere',
  },
  address: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  section: {
    marginTop: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  timelineRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },
  timelineDot: {
    width: 8,
    height: 8,
    flex: '0 0 8px',
    borderRadius: 4,
  },
  timelineTime: {
    width: 44,
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    '& > div': {
      color: theme.palette.common.white,
      mixBlendMode: 'difference',
    },
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    overflow: 'auto',
    flex: '1 1 auto',
    minHeight: 0,
    maxHeight: theme.dimensions.cardContentMaxHeight,
    [theme.breakpoints.up('md')]: {
      maxHeight: 'none',
    },
  },
  wideTile: {
    gridColumn: '1 / -1',
  },
  rowValue: {
    textAlign: 'right',
    fontWeight: 500,
  },
  actionButton: {
    '&&': {
      height: 'auto',
      minHeight: 44,
      lineHeight: 1.25,
    },
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiTableCell-sizeSmall:first-of-type': {
      paddingRight: theme.spacing(1),
    },
  },
  cell: {
    borderBottom: 'none',
  },
  primaryActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2, 0),
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  actions: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0.5, 1, 1),
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    [theme.breakpoints.up('md')]: {
      // Docked top right, below the alarm toast (and left of map controls when they are there)
      top: theme.spacing(11),
      right: dockRight ?? theme.spacing(9),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
      transform: 'translateX(-50%)',
    },
  },
}));

const StatusRow = ({ name, content }) => {
  const { classes } = useStyles({});

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">
          {name}
        </Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" className={classes.rowValue}>
          {content}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, position, onClose, disableActions, dockRight }) => {
  const { classes, cx } = useStyles({ dockRight });
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const limitCommands = useRestriction('limitCommands');
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference(
    'positionItems',
    'fixTime,address,speed,totalDistance',
  );

  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const [anchorEl, setAnchorEl] = useState(null);

  const deviceAlarms = useOpenAlarms()[deviceId] || [];
  const state = getDeviceState(device, position, deviceAlarms.length > 0);
  const stateColor = theme.palette[deviceStateColor[state]].main;

  // Newest unacknowledged alarm event, else an alarm reported on the latest position
  const alarm = deviceAlarms.length
    ? { type: deviceAlarms[0].attributes.alarm, time: deviceAlarms[0].eventTime }
    : position?.attributes.alarm && { type: position.attributes.alarm, time: position.fixTime };
  const acknowledge = () => deviceAlarms.forEach((event) => dispatch(eventsActions.delete(event)));

  // Key figures shown as tiles; the rest of the configured items stay in the table below
  const tileItems = [
    { key: 'speed', property: true, name: positionAttributes.speed?.name },
    { key: 'ignition', property: false, name: positionAttributes.ignition?.name },
    { key: 'batteryLevel', property: false, name: positionAttributes.batteryLevel?.name },
    { key: 'fixTime', property: true, name: t('deviceLastUpdate') },
  ].filter(({ key, property }) =>
    property ? position?.hasOwnProperty(key) : position?.attributes.hasOwnProperty(key),
  );
  // Address has its own line, so it is not repeated in the table
  const shownKeys = [...tileItems.map(({ key }) => key), 'address'];

  // Today's events for this device, newest first; refreshed when an alarm arrives or is acknowledged
  const [todayEvents, setTodayEvents] = useState([]);
  useAsyncTask(
    async ({ signal }) => {
      setTodayEvents([]);
      if (!deviceId) {
        return;
      }
      const query = new URLSearchParams({
        deviceId,
        from: dayjs().startOf('day').toISOString(),
        to: dayjs().toISOString(),
        type: 'allEvents',
      });
      const response = await fetchOrThrow(`api/reports/events?${query.toString()}`, { signal });
      const items = await response.json();
      setTodayEvents(
        items
          .sort((a, b) => dayjs(b.eventTime).valueOf() - dayjs(a.eventTime).valueOf())
          .slice(0, 5),
      );
    },
    // deviceAlarms.length is a refresh trigger: reload when an alarm arrives or is acknowledged
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [deviceId, deviceAlarms.length],
  );

  // Engine stop is offered only when the device protocol supports it
  const [commandTypes, setCommandTypes] = useState([]);
  useAsyncTask(
    async ({ signal }) => {
      setCommandTypes([]);
      if (!deviceId || disableActions || readonly || limitCommands) {
        return;
      }
      const query = new URLSearchParams({ deviceId });
      const response = await fetchOrThrow(`api/commands/types?${query.toString()}`, { signal });
      setCommandTypes((await response.json()).map((it) => it.type));
    },
    [deviceId, disableActions, readonly, limitCommands],
  );
  const canStopEngine = commandTypes.includes('engineStop');
  const [confirmingStop, setConfirmingStop] = useState(false);

  const handleEngineStop = useCatch(async () => {
    setConfirmingStop(false);
    const response = await fetchOrThrow('api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, type: 'engineStop', attributes: {} }),
    });
    dispatch(
      messagesActions.push({
        message: t(response.status === 202 ? 'commandQueued' : 'commandSent'),
        severity: 'success',
      }),
    );
  });

  const [removing, setRemoving] = useState(false);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetchOrThrow('api/devices');
      dispatch(devicesActions.refresh(await response.json()));
    }
    setRemoving(false);
  });

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetchOrThrow('api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const item = await response.json();
    await fetchOrThrow('api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
    });
    navigate(`/settings/geofence/${item.id}`);
  }, [navigate, position, t]);

  const eventLabel = (event) =>
    event.type === 'alarm'
      ? formatAlarm(event.attributes.alarm, t)
      : t(prefixString('event', event.type));

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Rnd
            default={{ x: 0, y: 0, width: 'auto', height: 'auto' }}
            enableResizing={false}
            dragHandleClassName="draggable-header"
            style={{ position: 'relative' }}
          >
            <Card elevation={9} className={classes.card}>
              <CardMedia
                className={cx('draggable-header', deviceImage && classes.media)}
                image={mediaUrl(device?.uniqueId, deviceImage)}
              >
                <div className={classes.header}>
                  <div className={classes.title}>
                    <Typography variant="h6" className={classes.name} noWrap>
                      {device.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {[device.model, device.uniqueId].filter(Boolean).join(' · ')}
                    </Typography>
                  </div>
                  <span
                    className={classes.pill}
                    style={{
                      backgroundColor: alpha(stateColor, 0.16),
                      color: theme.palette[deviceStateTextColor[state]].main,
                    }}
                  >
                    {formatDeviceState(state, t)}
                  </span>
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                    aria-label={t('sharedHide')}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              </CardMedia>
              {alarm && (
                <div className={classes.alarm} role="alert">
                  <WarningAmberIcon fontSize="small" />
                  <Typography variant="body2" className={classes.alarmText}>
                    <strong>{formatAlarm(alarm.type, t)}</strong>
                    {` · ${formatTime(alarm.time, 'seconds')}`}
                  </Typography>
                  {deviceAlarms.length > 0 && (
                    <Button size="small" variant="outlined" color="warning" onClick={acknowledge}>
                      {t('sharedAcknowledge')}
                    </Button>
                  )}
                </div>
              )}
              {position && (
                <CardContent className={classes.content}>
                  {tileItems.length > 0 && (
                    <div className={classes.tiles}>
                      {tileItems.map(({ key, property, name }, index) => (
                        <div
                          key={key}
                          className={cx(
                            classes.tile,
                            // An odd last tile spans the row instead of leaving a gap
                            tileItems.length % 2 === 1 &&
                              index === tileItems.length - 1 &&
                              classes.wideTile,
                          )}
                        >
                          <Typography variant="caption" color="textSecondary">
                            {name || key}
                          </Typography>
                          <span className={classes.tileValue}>
                            {key === 'fixTime' ? (
                              formatTime(
                                position.fixTime,
                                dayjs(position.fixTime).isSame(dayjs(), 'day') ? 'time' : 'minutes',
                              )
                            ) : (
                              <PositionValue
                                position={position}
                                property={property ? key : null}
                                attribute={property ? null : key}
                              />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={classes.address}>
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      <AddressValue
                        latitude={position.latitude}
                        longitude={position.longitude}
                        originalAddress={position.address}
                      />
                    </Typography>
                  </div>
                  <Table size="small" className={classes.table}>
                    <TableBody>
                      {positionItems
                        .split(',')
                        .filter(
                          (key) =>
                            !shownKeys.includes(key) &&
                            (position.hasOwnProperty(key) ||
                              position.attributes.hasOwnProperty(key)),
                        )
                        .map((key) => (
                          <StatusRow
                            key={key}
                            name={positionAttributes[key]?.name || key}
                            content={
                              <PositionValue
                                position={position}
                                property={position.hasOwnProperty(key) ? key : null}
                                attribute={position.hasOwnProperty(key) ? null : key}
                              />
                            }
                          />
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2} className={classes.cell}>
                          <Typography variant="body2">
                            <Link component={RouterLink} to={`/position/${position.id}`}>
                              {t('sharedShowDetails')}
                            </Link>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  {todayEvents.length > 0 && (
                    <div className={classes.section}>
                      <Typography variant="overline" color="textSecondary" lineHeight={1.5}>
                        {t('reportToday')}
                      </Typography>
                      {todayEvents.map((event) => (
                        <div key={event.id} className={classes.timelineRow}>
                          <span
                            className={classes.timelineDot}
                            style={{
                              backgroundColor:
                                event.type === 'alarm'
                                  ? theme.palette.alarm.main
                                  : theme.palette.stopped.main,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            className={classes.timelineTime}
                          >
                            {dayjs(event.eventTime).format('HH:mm')}
                          </Typography>
                          <Typography variant="body2" noWrap>
                            {eventLabel(event)}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
              <div className={classes.primaryActions}>
                <Button
                  variant="contained"
                  className={classes.actionButton}
                  onClick={() => navigate(`/replay?deviceId=${deviceId}`)}
                  disabled={disableActions || !position}
                >
                  {t('reportReplay')}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  className={classes.actionButton}
                  onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                  disabled={disableActions}
                >
                  {t('commandTitle')}
                </Button>
                {canStopEngine && (
                  <Button
                    variant="outlined"
                    color="error"
                    className={cx(classes.fullWidth, classes.actionButton)}
                    onClick={() => setConfirmingStop(true)}
                  >
                    {`${t('commandEngineStop')}…`}
                  </Button>
                )}
              </div>
              <CardActions className={classes.actions} disableSpacing>
                <Tooltip title={t('sharedExtra')}>
                  <span>
                    <IconButton
                      aria-label={t('sharedExtra')}
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      disabled={!position}
                    >
                      <PendingIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('sharedEdit')}>
                  <span>
                    <IconButton
                      aria-label={t('sharedEdit')}
                      onClick={() => navigate(`/settings/device/${deviceId}`)}
                      disabled={disableActions || deviceReadonly}
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('sharedRemove')}>
                  <span>
                    <IconButton
                      aria-label={t('sharedRemove')}
                      color="error"
                      onClick={() => setRemoving(true)}
                      disabled={disableActions || deviceReadonly}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </Rnd>
        )}
      </div>
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => navigate(`/stream?deviceId=${deviceId}`)}
            disabled={position.protocol !== 'jt808'}
          >
            {t('linkLiveVideo')}
          </MenuItem>
          {!readonly && <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>}
          <MenuItem
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}
          >
            {t('linkGoogleMaps')}
          </MenuItem>
          <MenuItem
            component="a"
            target="_blank"
            href={`https://maps.apple.com/?ll=${position.latitude},${position.longitude}`}
          >
            {t('linkAppleMaps')}
          </MenuItem>
          <MenuItem
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}
          >
            {t('linkStreetView')}
          </MenuItem>
          {navigationAppTitle && navigationAppLink && (
            <MenuItem
              component="a"
              target="_blank"
              href={navigationAppLink
                .replace('{latitude}', position.latitude)
                .replace('{longitude}', position.longitude)}
            >
              {navigationAppTitle}
            </MenuItem>
          )}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}>
              <Typography color="secondary">{t('sharedShare')}</Typography>
            </MenuItem>
          )}
        </Menu>
      )}
      <Dialog open={confirmingStop} onClose={() => setConfirmingStop(false)}>
        <DialogTitle>{`${t('commandEngineStop')}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{device?.name}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirmingStop(false)}>
            {t('sharedCancel')}
          </Button>
          <Button variant="contained" color="error" onClick={handleEngineStop}>
            {t('commandSend')}
          </Button>
        </DialogActions>
      </Dialog>
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
