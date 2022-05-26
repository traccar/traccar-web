import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Typography, Badge,
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useReadonly } from '../util/permissions';

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useReadonly();
  const userId = useSelector((state) => state.session.user?.id);
  const socket = useSelector((state) => state.session.socket);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${userId}`) {
      return 3;
    } if (location.pathname.startsWith('/settings')) {
      return 2;
    } if (location.pathname.startsWith('/reports')) {
      return 1;
    } if (location.pathname === '/') {
      return 0;
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${userId}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await fetch('/api/session', { method: 'DELETE' });
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/reports/route');
        break;
      case 2:
        navigate('/settings/preferences');
        break;
      case 3:
        if (readonly) {
          handleLogout();
        } else {
          setAnchorEl(event.currentTarget);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Paper square elevation={3}>
      <BottomNavigation value={currentSelection()} onChange={handleSelection} showLabels>
        <BottomNavigationAction
          label={t('mapTitle')}
          icon={(
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <MapIcon />
            </Badge>
          )}
        />
        <BottomNavigationAction label={t('reportTitle')} icon={<DescriptionIcon />} />
        <BottomNavigationAction label={t('settingsTitle')} icon={<SettingsIcon />} />
        {readonly
          ? (<BottomNavigationAction label={t('loginLogout')} icon={<ExitToAppIcon />} />)
          : (<BottomNavigationAction label={t('settingsUser')} icon={<PersonIcon />} />)}
      </BottomNavigation>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleAccount}>
          <Typography color="textPrimary">{t('settingsUser')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography color="error">{t('loginLogout')}</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BottomMenu;
