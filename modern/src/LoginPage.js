import React, { useState } from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";

import green from "@material-ui/core/colors/green";

import { useAuth } from "./context/auth";
import UserRegistrationDialog from "./UserRegistrationDialog";

/**
 * Component MUI styles
 * @type: Object
 */
const styles = theme => ({
  root: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  formMessage: {
    color: green[500],
    padding: theme.spacing.unit
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 3}px`
  },
  logo: {
    margin: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit}px`
  },
  buttons: {
    width: "100%",
    display: "flex",
    flexDirection: "row"
  },
  button: {
    flex: "1 1 0",
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px 0`
  }
});

/**
 * Full-page login form
 * @type: React Component
 */
function LoginPage({ classes }) {
  let [failed, setFailed] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [registering, setRegistering] = useState(false);
  let [formMessage, setFormMessage] = useState("");

  let { login } = useAuth();
  let handleSubmit = event => {
    event.preventDefault();
    login(email, password).catch(() => {
      setFailed(true);
      setPassword("");
    });
  };

  return (
    <main className={classes.root}>
      <Paper className={classes.paper}>
        <img className={classes.logo} src="/logo.svg" alt="Traccar" />

        {formMessage && (
          <Typography paragraph className={classes.formMessage}>
            {formMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth error={failed}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              value={email}
              autoComplete="email"
              autoFocus
              onChange={event => setEmail(event.target.value)}
            />
            {failed && (
              <FormHelperText>Invalid username or password</FormHelperText>
            )}
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={event => setPassword(event.target.value)}
            />
          </FormControl>

          <div className={classes.buttons}>
            <Button
              type="button"
              variant="contained"
              className={classes.button}
              onClick={() => setRegistering(true)}
            >
              Register
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!email || !password}
              className={classes.button}
            >
              Login
            </Button>
          </div>
        </form>
      </Paper>
      <UserRegistrationDialog
        open={registering}
        onCancel={() => setRegistering(false)}
        onSave={() => {
          setRegistering(false);
          setFormMessage("User created! Login with email and password.");
        }}
      />
    </main>
  );
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginPage);
