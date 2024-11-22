import React, { useState } from "react";
import {
  AppBar,
  Breadcrumbs,
  // Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./LocalizationProvider";

const useStyles = makeStyles((theme) => ({
  desktopRoot: {
    height: "100%",
    display: "flex",
    // backgroundColor:"#F9FAFB",

  },
  mobileRoot: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor:"#ffffff",
  },
  desktopDrawer: {
    width: theme.dimensions.drawerWidthDesktop,
    // backgroundColor: "#303234",
    backgroundColor:"#ffffff",
    borderRadius: 10,
    margin: 10,
    border: "1px solid transparent",
    height: "98%",
    // boxShadow: "0 0 12px 0 rgba(0, 0, 0, 20%)",
  },
  mobileDrawer: {
    width: theme.dimensions.drawerWidthTablet,
  },
  mobileToolbar: {
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
}));

const PageTitle = ({ breadcrumbs }) => {
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  if (desktop) {
    return (
      <Typography variant="h6" color='#637381' noWrap>
        {t(breadcrumbs[0])}
      </Typography>
    );
  }
  return (
    <Breadcrumbs>
      {breadcrumbs.slice(0, -1).map((breadcrumb) => (
        <Typography variant="h6" color="inherit" key={breadcrumb}>
          {t(breadcrumb)}
        </Typography>
      ))}
      <Typography variant="h6" color="textPrimary">
        {t(breadcrumbs[breadcrumbs.length - 1])}
      </Typography>
    </Breadcrumbs>
  );
};

const PageLayout = ({ menu, breadcrumbs, children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const [openDrawer, setOpenDrawer] = useState(false);

  return desktop ? (
    <div className={classes.desktopRoot}>
      <Drawer
        variant="permanent"
        className={classes.desktopDrawer}
        classes={{ paper: classes.desktopDrawer }}
      >
        <Toolbar
          sx={{
            backgroundColor:"#F6F7F9",
            m:1,
            p:2,
            borderRadius:'6px'
          }}
        >
          <IconButton
            color="inherit"
            edge="start"
            sx={{
              mr: 2,
              // backgroundColor: "#F6F7F9",
              // border: "1px solid transparent",
            }}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon sx={{
              color:'#637381'
            }} />
          </IconButton>
          <PageTitle breadcrumbs={breadcrumbs} />
        </Toolbar>
        {/* <Divider /> */}
        {menu}
      </Drawer>
      <div className={classes.content}>{children}</div>
    </div>
  ) : (
    <div className={classes.mobileRoot}>
      <Drawer
        variant="temporary"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{ paper: classes.mobileDrawer }}
      >
        {menu}
      </Drawer>
      <AppBar
        className={classes.mobileToolbar}
        position="static"
        color="inherit"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <PageTitle breadcrumbs={breadcrumbs} />
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default PageLayout;