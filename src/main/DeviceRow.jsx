import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { ListItemButton, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import { formatBoolean } from '../common/util/formatter';
import {
  deviceStateColor,
  deviceStateTextColor,
  formatDeviceState,
  getDeviceState,
} from '../common/util/deviceState';
import useOpenAlarms from '../common/util/useOpenAlarms';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import { useAttributePreference } from '../common/util/preferences';
import GeofencesValue from '../common/components/GeofencesValue';
import DriverValue from '../common/components/DriverValue';
import MotionBar from './components/MotionBar';
import mediaUrl from '../common/util/mediaUrl';

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  wrapper: {
    padding: theme.spacing(0.25, 1),
    boxSizing: 'border-box',
  },
  row: {
    height: '100%',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 1.5),
    borderRadius: 14,
    border: '1px solid transparent',
  },
  selected: {
    '&&': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
  },
  avatar: {
    width: 44,
    height: 44,
    flex: '0 0 44px',
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: 'solid',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Uploaded pictures fill the circle (cropped round), like a profile photo; the ring
  // around it keeps the state color. Matches the round marker on the map.
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: theme.palette.common.white,
  },
  // Category icons are single-color SVGs: draw them as a mask so they take the state color
  categoryIcon: {
    width: 24,
    height: 24,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
  },
  text: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(0.75),
    flexShrink: 0,
  },
  pill: {
    padding: theme.spacing(0.25, 1.1),
    borderRadius: 999,
    fontSize: '0.75rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
}));

const DeviceRow = ({ devices, index, style }) => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = devices[index];
  const icon = mediaUrl(item.uniqueId, item.attributes?.deviceIcon);
  const fallbackIcon = mapIcons[mapIconKey(item.category)];
  // If the uploaded icon fails to load (e.g. file missing), show the category icon instead.
  // Keyed by URL so a re-uploaded icon is tried again.
  const [failedIcon, setFailedIcon] = useState(null);
  const showUploadedIcon = icon && failedIcon !== icon;
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const resolveFieldValue = (field) => {
    if (field === 'geofenceIds') {
      const geofenceIds = position?.geofenceIds;
      return geofenceIds?.length ? <GeofencesValue geofenceIds={geofenceIds} /> : null;
    }
    if (field === 'driverUniqueId') {
      const driverUniqueId = position?.attributes?.driverUniqueId;
      return driverUniqueId ? <DriverValue driverUniqueId={driverUniqueId} /> : null;
    }
    if (field === 'motion') {
      return <MotionBar deviceId={item.id} />;
    }
    return item[field];
  };

  const primaryValue = resolveFieldValue(devicePrimary);
  // Detail line: the user's chosen field, else ignition and address from the latest position,
  // else the model or identifier
  const chosenDetail = resolveFieldValue(deviceSecondary);
  const positionDetail = [
    position?.attributes?.hasOwnProperty('ignition')
      ? `${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`
      : null,
    position?.address,
  ]
    .filter(Boolean)
    .join(' · ');
  const detail = chosenDetail || positionDetail || item.model || item.uniqueId;

  const openAlarms = useOpenAlarms();
  const state = getDeviceState(item, position, !!openAlarms[item.id]);
  const fillColor = theme.palette[deviceStateColor[state]].main;
  const textColor = theme.palette[deviceStateTextColor[state]].main;

  let time = '';
  if (item.lastUpdate) {
    time =
      state === 'offline' || !dayjs(item.lastUpdate).isSame(dayjs(), 'day')
        ? dayjs(item.lastUpdate).fromNow()
        : dayjs(item.lastUpdate).format('HH:mm');
  }

  const selected = selectedDeviceId === item.id;

  return (
    <div style={style} className={classes.wrapper}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
        selected={selected}
        className={cx(classes.row, selected && classes.selected)}
      >
        <span
          className={classes.avatar}
          style={{
            backgroundColor: alpha(fillColor, 0.14),
            borderColor: fillColor,
          }}
        >
          {showUploadedIcon ? (
            <img className={classes.photo} src={icon} alt="" onError={() => setFailedIcon(icon)} />
          ) : (
            <span
              className={classes.categoryIcon}
              style={{
                backgroundColor: textColor,
                // Quoted: inlined SVG data URLs contain characters that break an unquoted url()
                maskImage: `url("${fallbackIcon}")`,
                WebkitMaskImage: `url("${fallbackIcon}")`,
              }}
            />
          )}
        </span>
        <span className={classes.text}>
          <Typography fontWeight={600} noWrap>
            {primaryValue}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {detail}
          </Typography>
        </span>
        <span className={classes.side}>
          <span
            className={classes.pill}
            style={{ backgroundColor: alpha(fillColor, 0.16), color: textColor }}
          >
            {formatDeviceState(state, t)}
          </span>
          <Typography variant="caption" color="textSecondary" noWrap>
            {time}
          </Typography>
        </span>
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
