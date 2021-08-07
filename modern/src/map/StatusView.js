import React, { useState } from 'react';
import {
  makeStyles, Paper, IconButton, Grid, Button,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector } from 'react-redux';

import ReplayIcon from '@material-ui/icons/Replay';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  formatPosition, getStatusColor, getBatteryStatus, formatDistance, formatSpeed,
} from '../common/formatter';
import { useAttributePreference } from '../common/preferences';
import RemoveDialog from '../RemoveDialog';
import t from '../common/localization';
import { getPosition } from '../common/selectors';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '300px',
  },
  ...theme.palette.colors,
  listItemContainer: {
    maxWidth: '240px',
  },
}));

const StatusView = ({
  deviceId, onShowDetails, onShowHistory, onEditClick,
}) => {
  const classes = useStyles();

  const [removeDialogShown, setRemoveDialogShown] = useState(false);
  const device = useSelector((state) => state.devices.items[deviceId]);
  const position = useSelector(getPosition(deviceId));

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');

  const handleClick = (e) => {
    e.preventDefault();
    onShowDetails(position.id);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    onEditClick(deviceId);
  };

  const handleRemove = () => {
    setRemoveDialogShown(true);
  };

  const handleRemoveResult = () => {
    setRemoveDialogShown(false);
  };

  return (
    <>
      <Paper className={classes.paper} elevation={0} square>
        <Grid container direction="column">
          <Grid item>
            <List>
              <ListItem classes={{ container: classes.listItemContainer }}>
                <ListItemText primary={t('deviceStatus')} />
                <ListItemSecondaryAction>
                  <span className={classes[getStatusColor(device.status)]}>{device.status}</span>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem classes={{ container: classes.listItemContainer }}>
                <ListItemText primary={t('positionSpeed')} />
                <ListItemSecondaryAction>
                  <span>{formatSpeed(position.speed, speedUnit)}</span>
                </ListItemSecondaryAction>
              </ListItem>
              {position.attributes.batteryLevel && (
                <ListItem classes={{ container: classes.listItemContainer }}>
                  <ListItemText primary={t('positionBattery')} />
                  <ListItemSecondaryAction>
                    <span className={classes[getBatteryStatus(position.attributes.batteryLevel)]}>{formatPosition(position.attributes.batteryLevel, 'batteryLevel')}</span>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
              <ListItem classes={{ container: classes.listItemContainer }}>
                <ListItemText primary={t('positionDistance')} />
                <ListItemSecondaryAction>
                  <span>{formatDistance(position.attributes.totalDistance, distanceUnit)}</span>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem classes={{ container: classes.listItemContainer }}>
                <ListItemText primary={t('positionCourse')} />
                <ListItemSecondaryAction>
                  <span>{formatPosition(position.course, 'course')}</span>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Grid>
          <Grid item container>
            <Grid item>
              <Button color="secondary" onClick={handleClick}>More Info</Button>
            </Grid>
            <Grid item>
              <IconButton onClick={onShowHistory}>
                <ReplayIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton>
                <ExitToAppIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleRemove} className={classes.red}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <RemoveDialog open={removeDialogShown} endpoint="devices" itemId={deviceId} onResult={handleRemoveResult} />
    </>
  );
};

export default StatusView;
