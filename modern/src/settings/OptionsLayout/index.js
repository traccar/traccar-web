import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Divider,
  Drawer,
  makeStyles,
  IconButton,
  Hidden,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import SideNav from '../../components/SideNav';
import NavBar from '../../components/NavBar';
import t from '../../common/localization';
import useRoutes from './useRoutes';

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
  const classes = useStyles();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [optionTitle, setOptionTitle] = useState();
  const routes = useRoutes();

  useEffect(() => {
    const activeRoute = routes.find(
      (route) => route.href && location.pathname.match(route.match || route.href),
    );
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
            <IconButton component="a" href="/">
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
