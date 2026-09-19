import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import PositionDetailsContent from './PositionDetailsContent';
import StatusLabel from './StatusLabel';
import { useEffectAsync } from '../../reactHelper';
import { useDeviceReadonly, useRestriction } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';
import { formatStatus } from '../util/formatter';
import { mapIconKey, mapIcons } from '../../map/core/preloadImages';

dayjs.extend(relativeTime);

const DETAILS_PANEL_WIDTH = 340;
const DETAILS_PANEL_GAP = 10;
const VIEWPORT_MARGIN = 12;

const useStyles = makeStyles()((theme, { desktopPadding }) => ({
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.popupMaxWidth,
    borderRadius: 18,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 16px 36px rgba(0, 0, 0, 0.5)'
      : '0 20px 45px -10px rgba(15, 23, 42, 0.16), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
    backgroundImage: 'none',
    backgroundColor: theme.palette.background.paper,
    animation: 'popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.5, 1.25, 1.5, 1.75),
    cursor: 'move',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
  },
  headerInfo: {
    minWidth: 0,
    flex: 1,
  },
  deviceName: {
    fontSize: '0.92rem',
    fontWeight: 700,
    lineHeight: 1.2,
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    color: '#ffffff',
  },
  avatarOnline: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  avatarOffline: {
    background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    boxShadow: '0 2px 6px rgba(100, 116, 139, 0.2)',
  },
  avatarUnknown: {
    background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
  },
  icon: {
    width: 18,
    height: 18,
    filter: 'brightness(0) invert(1)',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '2px 8px',
    borderRadius: 12,
    marginTop: 4,
    fontSize: '0.7rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  statusOnline: {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
    color: theme.palette.success.main,
  },
  statusOffline: {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9',
    color: theme.palette.text.secondary,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    flexShrink: 0,
  },
  content: {
    padding: theme.spacing(1, 1.75, 1.25),
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: 'auto',
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#fcfcfd',
    '&:last-child': {
      paddingBottom: theme.spacing(1.25),
    },
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0.7, 0),
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  labelCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    minWidth: 0,
    maxWidth: '48%',
    flexShrink: 0,
  },
  labelIconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 8,
    flexShrink: 0,
  },
  label: {
    color: theme.palette.text.secondary,
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    flexShrink: 0,
    maxWidth: '42%',
    lineHeight: 1.4,
    paddingTop: 1,
  },
  labelText: {
    color: theme.palette.text.secondary,
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    lineHeight: 1.35,
    minWidth: 0,
  },
  value: {
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'right',
    lineHeight: 1.35,
    wordBreak: 'break-word',
    color: theme.palette.text.primary,
    '& a': {
      fontSize: 'inherit',
      fontWeight: 600,
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  cardGroup: {
    position: 'relative',
    display: 'inline-block',
  },
  detailsToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    marginRight: 'auto',
    padding: '4px 8px',
    borderRadius: 8,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    transition: 'background-color 200ms ease',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}12`,
    },
  },
  detailsIcon: {
    fontSize: 15,
    transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  detailsIconOpen: {
    transform: 'rotate(90deg)',
  },
  detailsPanel: {
    position: 'fixed',
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    width: DETAILS_PANEL_WIDTH,
    maxHeight: 'min(70vh, 520px)',
    borderRadius: 18,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 16px 36px rgba(0, 0, 0, 0.5)'
      : '0 20px 45px -10px rgba(15, 23, 42, 0.16), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
    backgroundColor: theme.palette.background.paper,
    pointerEvents: 'none',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s',
    [theme.breakpoints.down('md')]: {
      width: `min(${DETAILS_PANEL_WIDTH}px, calc(100vw - ${VIEWPORT_MARGIN * 2}px))`,
      maxHeight: 'min(45vh, 360px)',
    },
  },
  detailsPanelOpen: {
    pointerEvents: 'auto',
    opacity: 1,
    visibility: 'visible',
  },
  detailsPanelRight: {
    animation: 'slideInRight 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  detailsPanelLeft: {
    animation: 'slideInLeft 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  detailsPanelTop: {
    animation: 'slideInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  detailsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1.25, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
    flexShrink: 0,
  },
  detailsTitle: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
  },
  detailsContent: {
    padding: theme.spacing(0.5, 1.75, 1),
    overflow: 'auto',
    flex: 1,
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#fcfcfd',
  },
  actions: {
    justifyContent: 'flex-end',
    gap: 4,
    padding: theme.spacing(0.75, 1.25, 0.85),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
    color: theme.palette.text.secondary,
    transition: 'all 150ms ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    color: theme.palette.error.main,
    transition: 'all 150ms ease',
    '&:hover': {
      backgroundColor: `${theme.palette.error.main}12`,
    },
  },
  closeButton: {
    padding: 5,
    borderRadius: 8,
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
    transform: 'translateX(-50%)',
  },
  menuPaper: {
    borderRadius: 14,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.12)',
    minWidth: 160,
  },
}));

const StatusRow = ({ fieldKey, name, content, classes }) => (
  <div className={classes.row}>
    <StatusLabel fieldKey={fieldKey} name={name} classes={classes} />
    <Typography className={classes.value} component="div">{content}</Typography>
  </div>
);

const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  const { classes, cx } = useStyles({ desktopPadding });
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference('positionItems', 'fixTime,address,speed,totalDistance');

  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const cardRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [positionDetails, setPositionDetails] = useState(null);
  const [panelStyle, setPanelStyle] = useState({});
  const [panelPlacement, setPanelPlacement] = useState('right');

  const updatePanelPosition = useCallback(() => {
    if (!detailsOpen || !cardRef.current) {
      return;
    }

    const cardRect = cardRef.current.getBoundingClientRect();
    const panelWidth = desktop
      ? DETAILS_PANEL_WIDTH
      : Math.min(DETAILS_PANEL_WIDTH, window.innerWidth - (VIEWPORT_MARGIN * 2));
    const panelHeight = desktop
      ? Math.min(window.innerHeight * 0.7, 520)
      : Math.min(window.innerHeight * 0.45, 360);
    const gap = DETAILS_PANEL_GAP;

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

    const fitsRight = cardRect.right + gap + panelWidth <= window.innerWidth - VIEWPORT_MARGIN;
    const fitsLeft = cardRect.left - gap - panelWidth >= VIEWPORT_MARGIN;
    const fitsTop = cardRect.top - gap - panelHeight >= VIEWPORT_MARGIN;

    let placement = 'right';
    let left = cardRect.right + gap;
    let top = cardRect.top;

    if (desktop && fitsRight) {
      placement = 'right';
      left = cardRect.right + gap;
    } else if (desktop && fitsLeft) {
      placement = 'left';
      left = cardRect.left - gap - panelWidth;
    } else if (fitsTop) {
      placement = 'top';
      left = cardRect.left + ((cardRect.width - panelWidth) / 2);
      top = cardRect.top - gap - panelHeight;
    } else if (desktop) {
      const preferRight = (window.innerWidth - cardRect.right) >= cardRect.left;
      placement = preferRight ? 'right' : 'left';
      left = preferRight
        ? cardRect.right + gap
        : cardRect.left - gap - panelWidth;
    } else {
      placement = 'top';
      left = cardRect.left + ((cardRect.width - panelWidth) / 2);
      top = cardRect.top - gap - panelHeight;
    }

    left = clamp(left, VIEWPORT_MARGIN, window.innerWidth - panelWidth - VIEWPORT_MARGIN);
    top = clamp(top, VIEWPORT_MARGIN, window.innerHeight - panelHeight - VIEWPORT_MARGIN);

    setPanelPlacement(placement);
    setPanelStyle({
      left,
      top,
      width: panelWidth,
      maxHeight: panelHeight,
    });
  }, [detailsOpen, desktop]);

  useEffect(() => {
    setDetailsOpen(false);
    setPositionDetails(null);
  }, [deviceId]);

  useEffect(() => {
    if (!detailsOpen) {
      return undefined;
    }

    updatePanelPosition();

    const handleViewportChange = () => updatePanelPosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [detailsOpen, updatePanelPosition]);

  useEffectAsync(async () => {
    if (detailsOpen && position?.id) {
      const response = await fetchOrThrow(`/api/positions?id=${position.id}`);
      const positions = await response.json();
      if (positions.length > 0) {
        setPositionDetails(positions[0]);
      }
    } else if (!detailsOpen) {
      setPositionDetails(null);
    }
  }, [detailsOpen, position?.id]);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetchOrThrow('/api/devices');
      dispatch(devicesActions.refresh(await response.json()));
    }
    setRemoving(false);
  });

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetchOrThrow('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const item = await response.json();
    await fetchOrThrow('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
    });
    navigate(`/settings/geofence/${item.id}`);
  }, [navigate, position]);

  const isOnline = device?.status === 'online';
  const avatarClass = isOnline
    ? classes.avatarOnline
    : (device?.status === 'offline' ? classes.avatarOffline : classes.avatarUnknown);

  const statusText = device && (isOnline || !device.lastUpdate)
    ? formatStatus(device.status, t)
    : dayjs(device?.lastUpdate).fromNow();

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Rnd
            default={{ x: 0, y: 0, width: 'auto', height: 'auto' }}
            enableResizing={false}
            dragHandleClassName="draggable-header"
            style={{ position: 'relative' }}
            onDrag={updatePanelPosition}
            onDragStop={updatePanelPosition}
          >
            <div className={classes.cardGroup}>
            <Card ref={cardRef} elevation={0} className={classes.card}>
              <div className={`${classes.header} draggable-header`}>
                <Avatar
                  className={`${classes.avatar} ${avatarClass}`}
                  src={deviceImage ? `/api/media/${device.uniqueId}/${deviceImage}` : undefined}
                >
                  <img className={classes.icon} src={mapIcons[mapIconKey(device.category)]} alt="" />
                </Avatar>
                <div className={classes.headerInfo}>
                  <Typography variant="subtitle2" noWrap className={classes.deviceName}>
                    {device.name}
                  </Typography>
                  <div className={`${classes.statusPill} ${isOnline ? classes.statusOnline : classes.statusOffline}`}>
                    <span className={classes.statusDot} />
                    <span>{statusText}</span>
                  </div>
                </div>
                <IconButton
                  size="small"
                  onClick={onClose}
                  onTouchStart={onClose}
                  className={classes.closeButton}
                >
                  <CloseIcon fontSize="small" sx={{ fontSize: 18 }} />
                </IconButton>
              </div>

              {position && (
                <CardContent className={classes.content}>
                  {positionItems.split(',').filter((key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)).map((key) => (
                    <StatusRow
                      key={key}
                      fieldKey={key}
                      classes={classes}
                      name={positionAttributes[key]?.name || key}
                      content={(
                        <PositionValue
                          position={position}
                          property={position.hasOwnProperty(key) ? key : null}
                          attribute={position.hasOwnProperty(key) ? null : key}
                        />
                      )}
                    />
                  ))}
                </CardContent>
              )}

              <CardActions classes={{ root: classes.actions }} disableSpacing>
                {position && (
                  <button
                    type="button"
                    className={classes.detailsToggle}
                    onClick={() => setDetailsOpen((open) => !open)}
                  >
                    {t('sharedShowDetails')}
                    <ChevronRightIcon className={cx(classes.detailsIcon, detailsOpen && classes.detailsIconOpen)} />
                  </button>
                )}
                <Tooltip title={t('sharedExtra')}>
                  <IconButton
                    size="small"
                    className={classes.actionButton}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    disabled={!position}
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('reportReplay')}>
                  <IconButton
                    size="small"
                    className={classes.actionButton}
                    onClick={() => navigate(`/replay?deviceId=${deviceId}`)}
                    disabled={disableActions || !position}
                  >
                    <ReplayIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('commandTitle')}>
                  <IconButton
                    size="small"
                    className={classes.actionButton}
                    onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                    disabled={disableActions}
                  >
                    <PublishIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('sharedEdit')}>
                  <IconButton
                    size="small"
                    className={classes.actionButton}
                    onClick={() => navigate(`/settings/device/${deviceId}`)}
                    disabled={disableActions || deviceReadonly}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('sharedRemove')}>
                  <IconButton
                    size="small"
                    className={classes.deleteButton}
                    onClick={() => setRemoving(true)}
                    disabled={disableActions || deviceReadonly}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>

            </div>
          </Rnd>
        )}
      </div>

      {position && detailsOpen && createPortal(
        <div
          className={cx(
            classes.detailsPanel,
            classes.detailsPanelOpen,
            panelPlacement === 'left' && classes.detailsPanelLeft,
            panelPlacement === 'right' && classes.detailsPanelRight,
            panelPlacement === 'top' && classes.detailsPanelTop,
          )}
          style={panelStyle}
        >
          <div className={classes.detailsHeader}>
            <Typography className={classes.detailsTitle}>
              {desktop ? t('sharedShowDetails') : device.name}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setDetailsOpen(false)}
              className={classes.closeButton}
            >
              <CloseIcon fontSize="small" sx={{ fontSize: 18 }} />
            </IconButton>
          </div>
          <div className={classes.detailsContent}>
            <PositionDetailsContent item={positionDetails || position} classes={classes} />
          </div>
        </div>,
        document.body,
      )}

      {position && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          slotProps={{
            paper: {
              className: classes.menuPaper,
            },
          }}
        >
          {!readonly && <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>}
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
          {navigationAppTitle && <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>{navigationAppTitle}</MenuItem>}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}><Typography color="secondary">{t('deviceShare')}</Typography></MenuItem>
          )}
        </Menu>
      )}

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
