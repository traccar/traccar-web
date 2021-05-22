import React from 'react';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Drawer, makeStyles, IconButton, Hidden } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';

const ReportNavbar = ({ routes, setReportName }) => {

  const location = useLocation();

  return (
    <List disablePadding>
      {routes.map((route, index) => (
        <ListItem
          disableRipple
          component={Link}
          key={`${route}${index}`}
          button
          to={route.href}
          selected={route.href === location.pathname}
          onClick={() =>  setReportName(route.name)}>
          <ListItemIcon>
            {route.icon}
          </ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItem>
      ))}
    </List>
  )
}

export default ReportNavbar;
