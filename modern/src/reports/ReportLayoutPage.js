import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Grid, Paper, Drawer, makeStyles, useMediaQuery, IconButton } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import TimelineIcon from '@material-ui/icons/Timeline';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { Link } from "react-router-dom";

import t from '../common/localization';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  drawer: {
    width: 360,
    [theme.breakpoints.down("md")]: {
      width: 320,
    }
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  form: {
    padding: theme.spacing(1, 2, 2),
  },
}));

const ReportLayoutPage = ({ children, filter }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = useState(false);

  const routes = [
    { name: t('reportRoute'), link: '/reports/route', icon: <TimelineIcon />, activeIndex: 0 },
    { name: t('reportEvents'), link: '/reports/event', icon: <NotificationsActiveIcon />, activeIndex: 1 },
    { name: t('reportTrips'), link: '/reports/trip', icon: <PlayCircleFilledIcon />, activeIndex: 2 },
    { name: t('reportStops'), link: '/reports/stop', icon: <PauseCircleFilledIcon />, activeIndex: 3 },
    { name: t('reportSummary'), link: '/reports/summary', icon: <FormatListBulletedIcon />, activeIndex: 4 },
    { name: t('reportChart'), link: '/reports/chart', icon: <TrendingUpIcon />, activeIndex: 5 },
  ];

  return (
    <div className={classes.root}>
      {matchesMD && <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setOpenDrawer(!openDrawer)}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Reports
            </Typography>          
          </Toolbar>
        </AppBar>
      }
      <Drawer
        variant={matchesMD ? "temporary": "permanent"}
        open={openDrawer}
        onClose={() => setOpenDrawer(!openDrawer)}
        classes={{ paper: classes.drawer }}
      >
        <div className={classes.drawerHeader}>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List disablePadding>
          {routes.map(route => (
            <ListItem
              key={`${route}${route.activeIndex}`}
              button
              component={Link}
              to={route.link}
              onClick={() => setOpenDrawer(false)}
            >
              <ListItemIcon>
                {route.icon}
              </ListItemIcon>
              <ListItemText className={classes.drawerItem} disableTypography>
                {route.name}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

export default ReportLayoutPage;
