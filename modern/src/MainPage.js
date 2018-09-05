import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import MainToobar from './MainToolbar';
import MainMap from './MainMap';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column"
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
          <MainToobar history={this.props.history} />
          <div className={classes.mapContainer}>
            <ContainerDimensions>
              <MainMap/>
            </ContainerDimensions>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(MainPage);
