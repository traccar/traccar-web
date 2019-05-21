import React from "react";
import PropTypes from "prop-types";
import ContainerDimensions from "react-container-dimensions";

import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import SocketController from "./SocketController";
import MainToolbar from "./MainToolbar";
import MainMap from "./MainMap";
import DeviceList from "./DeviceList";

/**
 * Component MUI styles
 * @type: Object
 */
const styles = theme => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column-reverse"
    }
  },
  drawerPaper: {
    position: "relative",
    [theme.breakpoints.up("sm")]: {
      width: 350
    },
    [theme.breakpoints.down("xs")]: {
      height: 250
    }
  },
  mapContainer: {
    flexGrow: 1
  }
});

/**
 * Main container for authenticated users
 * @type: React Component
 */
function MainPage({ classes, width }) {
  return (
    <div className={classes.root}>
      <SocketController />
      <MainToolbar />
      <div className={classes.content}>
        <Drawer
          anchor={isWidthUp("sm", width) ? "left" : "bottom"}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <DeviceList />
        </Drawer>
        <div className={classes.mapContainer}>
          <ContainerDimensions>
            <MainMap />
          </ContainerDimensions>
        </div>
      </div>
    </div>
  );
}

MainPage.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired
};

export default withWidth()(withStyles(styles)(MainPage));
