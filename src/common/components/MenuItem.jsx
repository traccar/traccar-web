import makeStyles from '@mui/styles/makeStyles';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const MenuItem = ({
  title, link, icon, selected,
}) => {
  const classes = makeStyles({
    menuItemText: {
      whiteSpace: 'nowrap',
    },
  });
  return (
    <ListItemButton key={link} component={Link} to={link} selected={selected}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} className={classes.menuItemText} />
    </ListItemButton>
  );
};

export default MenuItem;
