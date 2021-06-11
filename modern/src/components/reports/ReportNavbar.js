import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import t from '../../common/localization';

const ReportNavbar = ({ setOpenDrawer, reportTitle }) => {

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setOpenDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {t('reportTitle')} {` / ${reportTitle}`}
        </Typography>        
      </Toolbar>
    </AppBar> 
  )
}

export default ReportNavbar;
