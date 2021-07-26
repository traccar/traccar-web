import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  makeStyles, Paper, Toolbar, IconButton, useMediaQuery, useTheme,
} from '@material-ui/core';

import ReplayIcon from '@material-ui/icons/Replay';
import DescriptionIcon from '@material-ui/icons/Description';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import MapIcon from '@material-ui/icons/Map';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import { sessionActions } from '../store';
import t from '../common/localization';

const useStyles = makeStyles((theme) => ({
  container: {
    bottom: theme.spacing(0),
    left: '0px',
    width: '100%',
    position: 'fixed',
    zIndex: 1301,
    [theme.breakpoints.up('lg')]: {
      left: theme.spacing(1.5),
      bottom: theme.spacing(1.5),
      width: theme.dimensions.drawerWidthDesktop,
    },
  },
  toolbar: {
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: theme.dimensions.bottomNavMaxWidth,
    margin: 'auto',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.75rem',
    fontWeight: 'normal',
  },
}));

const BottomNav = ({ showOnDesktop }) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const dispatch = useDispatch();

  const NavLink = ({ children, location }) => (
    <IconButton component={Link} classes={{ label: classes.navItem }} to={location}>
      {children}
    </IconButton>
  );

  const handleLogout = async () => {
    const response = await fetch('/api/session', { method: 'DELETE' });
    if (response.ok) {
      dispatch(sessionActions.updateUser(null));
      history.push('/login');
    }
  };

  if (isDesktop && !showOnDesktop) return null;

  return (
    <div className={classes.container}>
      <Paper square elevation={3}>
        <Toolbar className={classes.toolbar} disableGutters>

          {isDesktop ? (
            <NavLink location="/replay">
              <ReplayIcon />
              {t('reportReplay')}
            </NavLink>
          ) : (
            <NavLink location="/">
              <MapIcon />
              {t('mapTitle')}
            </NavLink>
          )}

          <NavLink location="/reports/route">
            <DescriptionIcon />
            {t('reportTitle')}
          </NavLink>

          <NavLink location="/settings/notifications">
            <ShuffleIcon />
            {t('settingsTitle')}
          </NavLink>

          <IconButton classes={{ label: classes.navItem }} onClick={handleLogout}>
            <LogoutIcon />
            {t('loginLogout')}
          </IconButton>
        </Toolbar>
      </Paper>
    </div>
  );
};

export default BottomNav;
