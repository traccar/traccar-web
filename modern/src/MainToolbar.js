import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  flex: {
    flexGrow: 1
  }
};

class MainToobar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    fetch("/api/session", {
      method: "DELETE"
    }).then(response => {
      if (response.ok) {
        this.props.history.push('/login');
      }
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Traccar
          </Typography>
          <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(MainToobar);
