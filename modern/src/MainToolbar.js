import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import PersonIcon from '@material-ui/icons/Person';
import DescriptionIcon from '@material-ui/icons/Description';
import ReplayIcon from '@material-ui/icons/Replay';
import { sessionActions } from './store';
import t from './common/localization';
import * as selectors from './common/selectors';

const useStyles = makeStyles((theme) => ({
  flex: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  list: {
    width: 250,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}));

const MainToolbar = () => {
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const userId = useSelector(selectors.getUserId);

  const openDrawer = () => { setDrawer(true); };
  const closeDrawer = () => { setDrawer(false); };

  const handleLogout = async () => {
    const response = await fetch('/api/session', { method: 'DELETE' });
    if (response.ok) {
      dispatch(sessionActions.updateUser(null));
      history.push('/login');
    }
  };

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            onClick={openDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Traccar
          </Typography>
          <Button color="inherit" onClick={handleLogout}>{t('loginLogout')}</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={drawer} onClose={closeDrawer}>
        <div
          tabIndex={0}
          className={classes.list}
          role="button"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
        >
          <List>
            <ListItem button onClick={() => history.push('/')}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={t('mapTitle')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/replay')}>
              <ListItemIcon>
                <ReplayIcon />
              </ListItemIcon>
              <ListItemText primary={t('reportReplay')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/reports/route')}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={t('reportTitle')} />
            </ListItem>
            <ListItem
              button
              disabled={!userId}
              onClick={() => history.push('/settings/notifications')}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t('settingsTitle')} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default MainToolbar;
