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
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
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

const MainToolbar = ({ filter, setFilter, setFilterMap }) => {
  setFilterMap(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const t = useTranslation();
  const { language } = useLocalization();
  const classes = useStyles();

  const user = useSelector((state) => state.session.user);
  const deviceStatuses = useSelector((state) => state.dictionaries.deviceStatuses);
  const mobileGroupStatuses = useSelector((state) => state.dictionaries.mobileGroupStatuses);
  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);

  const [filterOpen, setFilterOpen] = useState(false);

  const toolbarRef = useRef();

  const deviceStatusCount = (status) => Object.values(devices).filter((d) => d.status === status).length;

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
              <Select
                label={t('deviceStatus')}
                value={filter.statuses}
                onChange={(e) => setFilter({ ...filter, statuses: e.target.value })}
              >
                <MenuItem value="online">{`${t('deviceStatusOnline')} (${deviceStatusCount('online')})`}</MenuItem>
                <MenuItem value="offline">{`${t('deviceStatusOffline')} (${deviceStatusCount('offline')})`}</MenuItem>
                <MenuItem value="unknown">{`${t('deviceStatusUnknown')} (${deviceStatusCount('unknown')})`}</MenuItem>
                {/* {deviceStatuses?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item[`title_${language}`] || item.title}</MenuItem>
                ))} */}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('settingsGroups')}</InputLabel>
              <Select
                label={t('settingsGroups')}
                value={filter.groups}
                onChange={(e) => setFilter({ ...filter, groups: e.target.value })}
              >
                {Object.values(groups)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                {/* {mobileGroupStatuses?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item[`title_${language}`] || item.title}</MenuItem>
                ))} */}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Collapse>
    </Toolbar>
  );
};

export default MainToolbar;
