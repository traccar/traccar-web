import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Typography,
  Divider,
  Drawer,
  makeStyles,
  IconButton,
  Hidden,
} from '@material-ui/core';

import { useSelector } from 'react-redux';
import CreateIcon from '@material-ui/icons/Create';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FolderIcon from '@material-ui/icons/Folder';
import PersonIcon from '@material-ui/icons/Person';
import StorageIcon from '@material-ui/icons/Storage';
import BuildIcon from '@material-ui/icons/Build';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import TodayIcon from '@material-ui/icons/Today';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import SideNav from '../components/SideNav';
import NavBar from '../components/NavBar';
import { useTranslation } from '../LocalizationProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  drawerContainer: {
    width: theme.dimensions.drawerWidthDesktop,
  },
  drawer: {
    width: theme.dimensions.drawerWidthDesktop,
    [theme.breakpoints.down('md')]: {
      width: theme.dimensions.drawerWidthTablet,
    },
  },
  content: {
    flex: 1,
    padding: theme.spacing(5, 3, 3, 3),
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(10),
    },
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  toolbar: {
    [theme.breakpoints.down('md')]: {
      ...theme.mixins.toolbar,
    },
  },
}));

const OptionsLayout = ({ children }) => {
  const t = useTranslation();
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [optionTitle, setOptionTitle] = useState();

  const admin = useSelector((state) => state.session.user?.administrator);
  const userId = useSelector((state) => state.session.user?.id);

  const adminRoutes = useMemo(() => [
    { subheader: t('userAdmin') },
    { name: t('settingsServer'), href: '/admin/server', icon: <StorageIcon /> },
    { name: t('settingsUsers'), href: '/admin/users', icon: <PeopleIcon /> },
    { name: t('statisticsTitle'), href: '/admin/statistics', icon: <BarChartIcon /> },
  ], [t]);

  const mainRoutes = useMemo(() => [
    { name: t('sharedNotifications'), href: '/settings/notifications', icon: <NotificationsIcon /> },
    { name: t('settingsUser'), href: `/user/${userId}`, icon: <PersonIcon /> },
    { name: t('sharedGeofences'), href: '/geofences', icon: <CreateIcon /> },
    { name: t('settingsGroups'), href: '/settings/groups', icon: <FolderIcon /> },
    { name: t('sharedDrivers'), href: '/settings/drivers', icon: <PersonIcon /> },
    { name: t('sharedCalendars'), href: '/settings/calendars', icon: <TodayIcon /> },
    { name: t('sharedComputedAttributes'), href: '/settings/attributes', icon: <StorageIcon /> },
    { name: t('sharedMaintenance'), href: '/settings/maintenances', icon: <BuildIcon /> },
    { name: t('sharedSavedCommands'), href: '/settings/commands', icon: <ExitToAppIcon /> },
  ], [t, userId]);

  const routes = useMemo(() => [...mainRoutes, ...(admin ? adminRoutes : [])], [mainRoutes, admin, adminRoutes]);

  useEffect(() => {
    const activeRoute = routes.find((route) => route.href && location.pathname.includes(route.href));
    setOptionTitle(activeRoute?.name);
  }, [location, routes]);

  const title = `${t('settingsTitle')} / ${optionTitle}`;

  return (
    <div className={classes.root}>
      <Hidden lgUp>
        <NavBar setOpenDrawer={setOpenDrawer} title={title} />
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(!openDrawer)}
          classes={{ paper: classes.drawer }}
        >
          <SideNav routes={routes} />
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Drawer
          variant="permanent"
          classes={{ root: classes.drawerContainer, paper: classes.drawer }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={() => history.push('/')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {t('settingsTitle')}
            </Typography>
          </div>
          <Divider />
          <SideNav routes={routes} />
        </Drawer>
      </Hidden>

      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default OptionsLayout;
