import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';

const ReportSidebar = ({ routes }) => {

  const location = useLocation();

  return (
    <List disablePadding style={{paddingTop: '16px'}}>
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
  )
}

export default ReportSidebar;
