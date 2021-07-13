import React from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon, Divider, ListSubheader,
} from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';

const SideNav = ({ routes }) => {
  const location = useLocation();

  return (
    <List disablePadding style={{ paddingTop: '16px' }}>
      {routes.map((route) => (route.subheader ? (
        <>
          <Divider />
          <ListSubheader>{route.subheader}</ListSubheader>
        </>
      ) : (
        <ListItem
          disableRipple
          component={Link}
          key={route.href || route.subheader}
          button
          to={route.href}
          selected={location.pathname.match(route.match || route.href)}
        >
          <ListItemIcon>{route.icon}</ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItem>
      )))}
    </List>
  );
};

export default SideNav;
