import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from './store';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import StorageIcon from '@material-ui/icons/Storage';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import ReplayIcon from '@material-ui/icons/Replay';
import BuildIcon from '@material-ui/icons/Build';
import t from './common/localization';

const useStyles = makeStyles(theme => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  list: {
    width: 250
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
  const adminEnabled = useSelector(state => state.session.user && state.session.user.administrator);
  const userId = useSelector(state => state.session.user && state.session.user.id);

  const openDrawer = () => { setDrawer(true) }
  const closeDrawer = () => { setDrawer(false) }

  const handleLogout = async () => {
    const response = await fetch('/api/session', { method: 'DELETE' });
    if (response.ok) {
      dispatch(sessionActions.updateUser(null));
      history.push('/login');
    }
  }

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            onClick={openDrawer}>
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
          onKeyDown={closeDrawer}>
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
          </List>
          <Divider />
          <List
            subheader={
              <ListSubheader>
                {t('settingsTitle')}
              </ListSubheader>
            }>
            <ListItem button disabled={!userId} onClick={() => history.push(`/user/${userId}`)}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t('settingsUser')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/settings/notifications')}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary={t('sharedNotifications')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/settings/groups')}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={t('settingsGroups')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/settings/drivers')}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t('sharedDrivers')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/settings/attributes')}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={t('sharedComputedAttributes')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/settings/maintenances')}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary={t('sharedMaintenance')} />
            </ListItem>
          </List>
          {adminEnabled && (
            <>
              <Divider />
              <List
                subheader={
                  <ListSubheader>
                    {t('userAdmin')}
                  </ListSubheader>
                }>
                <ListItem button onClick={() => history.push('/admin/server')}>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('settingsServer')} />
                </ListItem>
                <ListItem button onClick={() => history.push('/admin/users')}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('settingsUsers')} />
                </ListItem>
                <ListItem button onClick={() => history.push('/admin/statistics')}>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('statisticsTitle')} />
                </ListItem>
              </List>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default MainToolbar;
