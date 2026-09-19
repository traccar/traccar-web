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
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';

const useStyles = makeStyles()((theme) => ({
  paper: {
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  navigation: {
    height: 58,
    backgroundColor: 'transparent',
    '& .MuiBottomNavigationAction-root': {
      minWidth: 0,
      padding: '6px 4px',
      color: theme.palette.text.secondary,
      transition: 'all 150ms ease',
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.02)',
      },
    },
    '& .MuiBottomNavigationAction-root.Mui-selected': {
      color: theme.palette.primary.main,
      '& .MuiBottomNavigationAction-label': {
        fontWeight: 700,
        color: theme.palette.primary.main,
      },
      '& .MuiSvgIcon-root': {
        transform: 'scale(1.08)',
      },
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.7rem',
      marginTop: 2,
      fontWeight: 500,
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
      transition: 'transform 150ms ease',
    },
  },
  menuPaper: {
    borderRadius: 14,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.12)',
    minWidth: 140,
  },
}));

const BottomMenu = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user?.id}`) {
      return 'account';
    }
    if (location.pathname.startsWith('/settings')) {
      return 'settings';
    }
    if (location.pathname.startsWith('/reports')) {
      return 'reports';
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
            notificationTokens: tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;
      case 'reports':
        navigate('/reports/combined');
        break;
      case 'settings':
        navigate('/settings/preferences');
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

  return (
    <Paper elevation={0} className={classes.paper}>
      <BottomNavigation
        value={currentSelection()}
        onChange={handleSelection}
        showLabels
        className={classes.navigation}
      >
        <BottomNavigationAction
          label={t('mapTitle')}
          icon={(
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <MapOutlinedIcon />
            </Badge>
          )}
          value="map"
        />
        {!disableReports && (
          <BottomNavigationAction label={t('reportTitle')} icon={<DescriptionOutlinedIcon />} value="reports" />
        )}
        <BottomNavigationAction label={t('settingsTitle')} icon={<SettingsOutlinedIcon />} value="settings" />
        {readonly ? (
          <BottomNavigationAction label={t('loginLogout')} icon={<ExitToAppIcon />} value="logout" />
        ) : (
          <BottomNavigationAction label={t('settingsUser')} icon={<PersonOutlineOutlinedIcon />} value="account" />
        )}
      </BottomNavigation>
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
        <MenuItem onClick={handleAccount}>
          <Typography variant="body2" color="textPrimary" fontWeight={600}>{t('settingsUser')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography variant="body2" color="error" fontWeight={600}>{t('loginLogout')}</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BottomMenu;
