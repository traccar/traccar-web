import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      failed: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    console.log();
    fetch("/api/session", {
      method: "POST",
      body: new URLSearchParams(`email=admin&password=admin`)
    }).then(response => {
      if (response.ok) {
        this.props.history.push('/'); // TODO avoid calling sessions twice
      } else {
        this.setState({
          failed: true
        });
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { failed } = this.state;
    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="headline">Traccar</Typography>
          {
            failed &&
            <Typography>Login failed</Typography>
          }
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password" />
          </FormControl>
          <Button type="submit" fullWidth variant="raised" color="primary" className={classes.submit} onClick={this.handleSubmit}>
            Login
          </Button>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(LoginPage);
