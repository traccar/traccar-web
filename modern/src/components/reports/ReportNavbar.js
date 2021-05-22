import React from 'react';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Drawer, makeStyles, IconButton, Hidden } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import t from '../../common/localization';

const useStyles = makeStyles(theme => ({
  menuButton: {
  }
}));
const ReportNavbar = ({ openDrawer, setOpenDrawer, reportName }) => {
  
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setOpenDrawer(!openDrawer)}
          className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {t('reportTitle')} / {reportName}
        </Typography>        
      </Toolbar>
    </AppBar> 
  )
}

export default ReportNavbar;
