import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ setOpenDrawer, title }) => (
  <AppBar position="sticky" color="inherit">
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        sx={{ mr: 2 }}
        onClick={() => setOpenDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
