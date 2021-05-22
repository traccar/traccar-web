import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Drawer, makeStyles, IconButton, Hidden } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import TimelineIcon from '@material-ui/icons/Timeline';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import ReportSidebar from '../components/reports/ReportSidebar'
import ReportNavbar from '../components/reports/ReportNavbar'

import { Link, useHistory, useLocation } from 'react-router-dom';

import t from '../common/localization';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  drawerContainer: {
    width: theme.dimensions.desktopDrawerWidth,
  },
  drawer: {
    width: theme.dimensions.desktopDrawerWidth,
    [theme.breakpoints.down("md")]: {
      width: theme.dimensions.tabletDrawerWidth,
    }
  }, 
  content: {
    flex: 1,
    padding: theme.spacing(5, 3, 3, 3),
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  backArrowIconContainer: {
    '&:hover': {
      backgroundColor:"transparent"
    }  
  },
  toolbar: {
    [theme.breakpoints.down("md")]: {
      ...theme.mixins.toolbar,
    }
  },
}));

const routes = [
  { name: t('reportRoute'), href: '/reports/route', icon: <TimelineIcon /> },
  { name: t('reportEvents'), href: '/reports/event', icon: <NotificationsActiveIcon /> },
  { name: t('reportTrips'), href: '/reports/trip', icon: <PlayCircleFilledIcon /> },
  { name: t('reportStops'), href: '/reports/stop', icon: <PauseCircleFilledIcon /> },
  { name: t('reportSummary'), href: '/reports/summary', icon: <FormatListBulletedIcon /> },
  { name: t('reportChart'), href: '/reports/chart', icon: <TrendingUpIcon /> },
];

const ReportLayoutPage = ({ children, filter }) => {
  const classes = useStyles();
  const history = useHistory();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div className={classes.root}>
      <Hidden only={['lg', 'xl']}>
        <ReportNavbar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(!openDrawer)}
          classes={{paper: classes.drawer}}>
          <ReportSidebar routes={routes} />
        </Drawer>
      </Hidden>
      <Hidden only={['xs', 'sm', 'md']}>
        <div className={classes.drawerContainer}>
          <Drawer
            variant="permanent"
            classes={{paper: classes.drawer}}>
            <div className={classes.drawerHeader}>
              <IconButton
                onClick={() => history.push('/')}
                className={classes.backArrowIconContainer} 
                disableRipple>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                {t('reportTitle')}
              </Typography> 
            </div>
            <Divider />
            <ReportSidebar routes={routes} />
          </Drawer>
        </div>
      </Hidden>
      <div className={classes.content}>
        <div className={classes.toolbar} />
        {filter}
        {children}
      </div>      
    </div>
  );
}

export default ReportLayoutPage;
