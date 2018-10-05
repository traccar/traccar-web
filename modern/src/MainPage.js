import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import MainToobar from './MainToolbar';
import MainMap from './MainMap';
import Drawer from '@material-ui/core/Drawer';
import withStyles from '@material-ui/core/styles/withStyles';
import SocketController from './SocketController';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeviceList from './DeviceList';

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
    [theme.breakpoints.down('xs')]: {
      flexDirection: "column-reverse"
    }
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350
    },
    [theme.breakpoints.down('xs')]: {
      height: 250
    }
  },
  mapContainer: {
    flexGrow: 1
  }
});

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    fetch('/api/session').then(response => {
      if (response.ok) {
        this.setState({
          loading: false
        });
      } else {
        this.props.history.push('/login');
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    if (loading) {
      return (
        <div>Loading...</div>
      );
    } else {
      return (
        <div className={classes.root}>
          <SocketController />
          <MainToobar history={this.props.history} />
          <div className={classes.content}>
            <Drawer
              anchor={isWidthUp('sm', this.props.width) ? "left" : "bottom"}
              variant="permanent"
              classes={{ paper: classes.drawerPaper }}>
              <DeviceList />
            </Drawer>
            <div className={classes.mapContainer}>
              <ContainerDimensions>
                <MainMap/>
              </ContainerDimensions>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withWidth()(withStyles(styles)(MainPage));
