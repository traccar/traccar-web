import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  IconButton,
  Tooltip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Typography,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import {
  formatAlarm,
  formatBoolean,
  formatPercentage,
  formatStatus,
  formatSpeed,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import EngineIcon from '../resources/images/data/engine.svg?react';
import { useAttributePreference } from '../common/util/preferences';

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  rowContainer: {
    padding: '3px 8px',
    boxSizing: 'border-box',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 14,
    minHeight: 64,
    padding: '8px 12px',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
    transition: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f8fafc',
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
      transform: 'translateX(2px)',
      '& .chevron-icon': {
        transform: 'translateX(3px)',
        color: theme.palette.text.primary,
      },
      '& .device-avatar': {
        transform: 'scale(1.05)',
      },
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.primary.main}25` : `${theme.palette.primary.main}10`,
      borderColor: theme.palette.primary.main,
      boxShadow: `0 4px 14px ${theme.palette.primary.main}20`,
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.primary.main}30` : `${theme.palette.primary.main}16`,
      },
      '& .device-name': {
        color: theme.palette.primary.main,
      },
      '& .chevron-icon': {
        color: theme.palette.primary.main,
      },
    },
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
    minWidth: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    color: '#ffffff',
    transition: 'transform 160ms ease',
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
  statusDotBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.background.paper}`,
  },
  dotOnline: {
    backgroundColor: theme.palette.success.main,
  },
  dotOffline: {
    backgroundColor: theme.palette.error.main,
  },
  dotUnknown: {
    backgroundColor: theme.palette.neutral.main,
  },
  icon: {
    width: '20px',
    height: '20px',
    filter: 'brightness(0) invert(1)',
  },
  content: {
    margin: 0,
    minWidth: 0,
    flex: 1,
  },
  primary: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.25,
    color: theme.palette.text.primary,
  },
  secondaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
    fontSize: '0.72rem',
    lineHeight: 1.2,
    color: theme.palette.text.secondary,
  },
  statusText: {
    fontWeight: 500,
  },
  statusOnline: {
    color: theme.palette.success.main,
    fontWeight: 600,
  },
  statusOffline: {
    color: theme.palette.text.secondary,
  },
  speedBadge: {
    padding: '1px 5px',
    borderRadius: 6,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
    fontSize: '0.68rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  telemetry: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    marginLeft: 6,
  },
  telemetryBtn: {
    padding: 3,
  },
  chevron: {
    fontSize: 18,
    color: theme.palette.text.disabled,
    marginLeft: 2,
    transition: 'all 160ms ease',
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
}));

const DeviceRow = ({ data, index, style }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');
  const speedUnit = useAttributePreference('speedUnit');

  const isOnline = item.status === 'online';
  const isOffline = item.status === 'offline';

  const avatarClass = isOnline
    ? classes.avatarOnline
    : (isOffline ? classes.avatarOffline : classes.avatarUnknown);

  const dotClass = isOnline
    ? classes.dotOnline
    : (isOffline ? classes.dotOffline : classes.dotUnknown);

  const statusText = isOnline || !item.lastUpdate
    ? formatStatus(item.status, t)
    : dayjs(item.lastUpdate).fromNow();

  return (
    <div style={style} className={classes.rowContainer}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
        selected={selectedDeviceId === item.id}
        className={classes.card}
      >
        <ListItemAvatar className={classes.avatarWrapper}>
          <Avatar className={`device-avatar ${classes.avatar} ${avatarClass}`}>
            <img className={classes.icon} src={mapIcons[mapIconKey(item.category)]} alt="" />
          </Avatar>
          <span className={`${classes.statusDotBadge} ${dotClass}`} />
        </ListItemAvatar>

        <ListItemText
          className={classes.content}
          primary={item[devicePrimary]}
          secondary={(
            <div className={classes.secondaryRow}>
              {deviceSecondary && item[deviceSecondary] && (
                <span>{item[deviceSecondary]} • </span>
              )}
              <span className={`${classes.statusText} ${isOnline ? classes.statusOnline : classes.statusOffline}`}>
                {statusText}
              </span>
              {position && position.speed > 0 && (
                <span className={classes.speedBadge}>
                  {formatSpeed(position.speed, speedUnit, t)}
                </span>
              )}
            </div>
          )}
          slots={{
            primary: Typography,
            secondary: 'div',
          }}
          slotProps={{
            primary: { noWrap: true, className: `device-name ${classes.primary}` },
          }}
        />

        <div className={classes.telemetry}>
          {position && (
            <>
              {position.attributes.hasOwnProperty('alarm') && (
                <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                  <IconButton size="small" className={classes.telemetryBtn}>
                    <ErrorIcon fontSize="small" className={classes.error} sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
              {position.attributes.hasOwnProperty('ignition') && (
                <Tooltip title={`${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`}>
                  <IconButton size="small" className={classes.telemetryBtn}>
                    {position.attributes.ignition ? (
                      <EngineIcon width={17} height={17} className={classes.success} />
                    ) : (
                      <EngineIcon width={17} height={17} className={classes.neutral} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              {position.attributes.hasOwnProperty('batteryLevel') && (
                <Tooltip title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)}`}>
                  <IconButton size="small" className={classes.telemetryBtn}>
                    {(position.attributes.batteryLevel > 70 && (
                      position.attributes.charge
                        ? (<BatteryChargingFullIcon fontSize="small" className={classes.success} sx={{ fontSize: 18 }} />)
                        : (<BatteryFullIcon fontSize="small" className={classes.success} sx={{ fontSize: 18 }} />)
                    )) || (position.attributes.batteryLevel > 30 && (
                      position.attributes.charge
                        ? (<BatteryCharging60Icon fontSize="small" className={classes.warning} sx={{ fontSize: 18 }} />)
                        : (<Battery60Icon fontSize="small" className={classes.warning} sx={{ fontSize: 18 }} />)
                    )) || (
                      position.attributes.charge
                        ? (<BatteryCharging20Icon fontSize="small" className={classes.error} sx={{ fontSize: 18 }} />)
                        : (<Battery20Icon fontSize="small" className={classes.error} sx={{ fontSize: 18 }} />)
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          <ChevronRightIcon className={`chevron-icon ${classes.chevron}`} />
        </div>
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
