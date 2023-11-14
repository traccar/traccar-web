import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { sessionActions } from '../store';
import { nativePostMessage } from '../common/components/NativeInterface';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#0f5696',
  },
  toolbarRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    width: '100%',
    padding: `${theme.spacing(1)} 0`,
  },
  formControl: {
    minWidth: '300px',
  },
}));

const MainToolbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const t = useTranslation();
  const classes = useStyles();

  const [filterOpen, setFilterOpen] = useState(false);

  const toolbarRef = useRef();

  const handleLogout = async () => {
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
              tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
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

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      <Box className={classes.toolbarRow}>
        <IconButton edge="start" onClick={() => setFilterOpen(!filterOpen)}>
          <FilterAltIcon />
        </IconButton>

        <Tooltip arrow title={t('loginLogout')}>
          <IconButton edge="end" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={filterOpen} sx={{ width: '100%' }}>
        <Divider />
        <Box className={classes.toolbarRow}>
          <Box display="flex" gap={1}>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('deviceStatus')}</InputLabel>
              <Select label={t('deviceStatus')}>
                <MenuItem value="online">1dfgsdjsdgj sdkfjskdfjskdjf</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('settingsGroups')}</InputLabel>
              <Select label={t('settingsGroups')}>
                <MenuItem value="online">1dfgsdjsdgj sdkfjskdfjskdjf</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Collapse>
    </Toolbar>
  );
};

export default MainToolbar;
