import React, { Fragment } from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon, Divider, ListSubheader,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const SideNav = ({ routes }) => {
  const location = useLocation();

  return (
    <List disablePadding style={{ paddingTop: '16px' }}>
      {routes.map((route) => (route.subheader ? (
        <Fragment key={route.subheader}>
          <Divider />
          <ListSubheader>{route.subheader}</ListSubheader>
        </Fragment>
      ) : (
        <ListItem
          disableRipple
          component={Link}
          key={route.href}
          button
          to={route.href}
          selected={location.pathname.match(route.match || route.href) !== null}
        >
          <ListItemIcon>{route.icon}</ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItem>
      )))}
    </List>
  );
};

export default SideNav;
