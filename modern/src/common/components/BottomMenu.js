import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Typography,
} from '@material-ui/core';

import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import MapIcon from '@material-ui/icons/Map';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useReadonly } from '../util/permissions';

const BottomMenu = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useReadonly();
  const userId = useSelector((state) => state.session.user?.id);

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
    history.push(`/settings/user/${userId}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await fetch('/api/session', { method: 'DELETE' });
    history.push('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 0:
        history.push('/');
        break;
      case 1:
        history.push('/reports/route');
        break;
      case 2:
        history.push('/settings/preferences');
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
        <BottomNavigationAction label={t('mapTitle')} icon={<MapIcon />} />
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
