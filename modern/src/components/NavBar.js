import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const Navbar = ({ setOpenDrawer, title }) => (
  <AppBar position="sticky" color="inherit">
    <Toolbar>
      <IconButton color="inherit" edge="start" onClick={() => setOpenDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
