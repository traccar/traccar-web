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

import { Link, useHistory, useLocation } from 'react-router-dom';

import t from '../common/localization';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  drawerContainer: {
    width: theme.dimensions.drawerWidth,
  },
  drawer: {
    width: theme.dimensions.drawerWidth,
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
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();

  const navigationList = (
    <List disablePadding>
      {routes.map((route, index) => (
        <ListItem
          disableRipple
          component={Link}
          key={`${route}${index}`}
          button
          to={route.href}
          selected={route.href === location.pathname}>
          <ListItemIcon>
            {route.icon}
          </ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItem>
      ))}
    </List>
  );

  const drawerHeader = (
    <> 
      <div className={classes.drawerHeader}>
        <IconButton 
          className={classes.backArrowIconContainer} 
          disableRipple>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          {t('reportTitle')}
        </Typography> 
      </div>
      <Divider />
    </>
  );

  const appBar = (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setOpenDrawer(!openDrawer)}
          className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {t('reportTitle')}
        </Typography>        
      </Toolbar>
    </AppBar>   
  );

  return (
    <div className={classes.root}>
      <Hidden mdUp>
        {appBar}
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(!openDrawer)}
          classes={{paper: classes.drawer}}>
          {drawerHeader}
          {navigationList}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <div className={classes.drawerContainer}>
          <Drawer
            variant="permanent"
            classes={{paper: classes.drawer}}>
            {drawerHeader}
            {navigationList}
          </Drawer>
        </div>
      </Hidden>
      <div className={classes.content}>
        <div className={classes.toolbar} />
        {filter}
      </div>      
    </div>
  );
}

export default ReportLayoutPage;
