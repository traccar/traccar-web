import React, { useState } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import { useAuth } from "./context/auth";

/**
 * Component MUI styles
 * @type: Object
 */
const styles = theme => ({
  textField: {
    width: "100%",
    marginTop: theme.spacing.unit
  }
});

/**
 * Dialog for registering/creating new users
 * @type: React Component
 */
function UserRegistrationDialog({
  classes,
  fullScreen,
  open,
  onSave,
  onCancel
}) {
  let [failed, setFailed] = useState(false);
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let { register } = useAuth();

  const saveHandler = () => {
    register(name, email, password)
      .then(user => onSave(user))
      .catch(() => {
        setFailed(true);
        setPassword("");
      });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onCancel}
      aria-labelledby="registration-dialog-title"
    >
      <DialogTitle id="registration-dialog-title">Register User</DialogTitle>
      <DialogContent>
        {failed && <FormHelperText>Error while creating user</FormHelperText>}
        <TextField
          required
          autoFocus
          label="Name"
          className={classes.textField}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          required
          label="Email"
          autoComplete="email"
          className={classes.textField}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          required
          label="Password"
          type="password"
          className={classes.textField}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <DialogActions>
          <Button color="primary" onClick={saveHandler}>
            Save
          </Button>
          <Button color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

UserRegistrationDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default withStyles(styles)(withMobileDialog()(UserRegistrationDialog));
