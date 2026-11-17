import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  Typography,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import MapSvg from '@material-symbols/svg-600/rounded/map.svg?react';
import NotificationsSvg from '@material-symbols/svg-600/rounded/notifications.svg?react';
import BarChartSvg from '@material-symbols/svg-600/rounded/bar_chart.svg?react';
import HexagonSvg from '@material-symbols/svg-600/rounded/hexagon.svg?react';
import SettingsSvg from '@material-symbols/svg-600/rounded/settings.svg?react';
import PersonSvg from '@material-symbols/svg-600/rounded/person.svg?react';
import LogoutSvg from '@material-symbols/svg-600/rounded/logout.svg?react';
import LocationOnSvg from '@material-symbols/svg-600/rounded/location_on.svg?react';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';
import useFeatures from '../util/useFeatures';

// Navigation icons use Material Symbols (Rounded), Google's current icon set, which the
// category icons on the map already use
const NavSymbol = ({ svg: Svg }) => (
  <Svg width={24} height={24} fill="currentColor" aria-hidden="true" />
);

const useStyles = makeStyles()((theme) => ({
  rail: {
    position: 'fixed',
    zIndex: 7,
    left: 0,
    top: 0,
    bottom: 0,
    width: theme.dimensions.railWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(2, 0),
    boxSizing: 'border-box',
    backgroundColor: '#0F172A',
    borderRadius: 0,
    // In dark mode the rail is close to the page color; a hairline keeps it separate
    borderRight: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
  },
  logo: {
    width: 40,
    height: 40,
    flex: '0 0 40px',
    borderRadius: 12,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  railButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    color: '#CBD5E1',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
  },
  railSelected: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.14)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
  },
  spacer: {
    flex: 1,
  },
}));

// Main navigation: a bottom bar (phones, and desktop pages without the rail) or,
// with `rail`, a vertical bar fixed to the left edge.
const BottomMenu = ({ rail = false }) => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();
  const features = useFeatures();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const devices = useSelector((state) => state.devices.items);
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  // Pending notifications (alarms and other subscribed events) not yet marked as seen
  const pendingCount = useSelector((state) => state.events.items.length);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      return 'account';
    }
    if (location.pathname.startsWith('/settings')) {
      return 'settings';
    }
    if (location.pathname.startsWith('/reports')) {
      return 'reports';
    }
    if (location.pathname.startsWith('/alerts')) {
      return 'alerts';
    }
    if (location.pathname.startsWith('/geofences')) {
      return 'geofences';
    }
    if (location.pathname === '/') {
      return 'map';
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(',')
                : undefined,
          },
        };
        await fetch(`api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;
      case 'alerts':
        navigate('/alerts');
        break;
      case 'geofences':
        navigate('/geofences');
        break;
      case 'reports': {
        let id = selectedDeviceId;
        if (id == null) {
          const deviceIds = Object.keys(devices);
          if (deviceIds.length === 1) {
            id = deviceIds[0];
          }
        }

        if (id != null) {
          navigate(`/reports/combined?deviceId=${id}`);
        } else {
          navigate('/reports/combined');
        }
        break;
      }
      case 'settings':
        navigate('/settings/preferences?menu=true');
        break;
      case 'account':
        setAnchorEl(event.currentTarget);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const items = [
    {
      value: 'map',
      label: t('mapTitle'),
      icon: (
        <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
          <NavSymbol svg={MapSvg} />
        </Badge>
      ),
    },
    !features.disableEvents && {
      value: 'alerts',
      label: t('alertsTitle'),
      icon: (
        <Badge color="warning" badgeContent={pendingCount} max={99}>
          <NavSymbol svg={NotificationsSvg} />
        </Badge>
      ),
    },
    !disableReports && {
      value: 'reports',
      label: t('reportTitle'),
      icon: <NavSymbol svg={BarChartSvg} />,
    },
    rail &&
      !readonly && {
        value: 'geofences',
        label: t('sharedGeofences'),
        icon: <NavSymbol svg={HexagonSvg} />,
      },
    !readonly && {
      value: 'settings',
      label: t('settingsTitle'),
      icon: <NavSymbol svg={SettingsSvg} />,
    },
    readonly
      ? { value: 'logout', label: t('loginLogout'), icon: <NavSymbol svg={LogoutSvg} />, end: true }
      : {
          value: 'account',
          label: t('settingsUser'),
          icon: <NavSymbol svg={PersonSvg} />,
          end: true,
        },
  ].filter(Boolean);

  const accountMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
      <MenuItem onClick={handleAccount}>
        <Typography color="textPrimary">{t('settingsUser')}</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Typography color="error">{t('loginLogout')}</Typography>
      </MenuItem>
    </Menu>
  );

  if (rail) {
    const selected = currentSelection();
    const renderButton = (item) => (
      <Tooltip key={item.value} title={item.label} placement="right">
        <IconButton
          aria-label={item.label}
          aria-current={selected === item.value ? 'page' : undefined}
          className={cx(classes.railButton, selected === item.value && classes.railSelected)}
          onClick={(event) => handleSelection(event, item.value)}
        >
          {item.icon}
        </IconButton>
      </Tooltip>
    );
    return (
      <Paper component="nav" elevation={0} className={classes.rail}>
        <span className={classes.logo} aria-hidden="true">
          <NavSymbol svg={LocationOnSvg} />
        </span>
        {items.filter((item) => !item.end).map(renderButton)}
        <div className={classes.spacer} />
        {items.filter((item) => item.end).map(renderButton)}
        {accountMenu}
      </Paper>
    );
  }

  return (
    <Paper square elevation={3}>
      <BottomNavigation value={currentSelection()} onChange={handleSelection} showLabels>
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            icon={item.icon}
            value={item.value}
          />
        ))}
      </BottomNavigation>
      {accountMenu}
    </Paper>
  );
};

export default BottomMenu;
