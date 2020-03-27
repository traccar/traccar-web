import React, { Fragment } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { useDispatch, useSelector } from 'react-redux';
import { devicesActions } from './store';

const DeviceList = () => {
  const devices = useSelector(state => Object.values(state.devices.items));
  const dispatch = useDispatch();

  return (<List>
    {devices.map((device, index, list) => (
      <Fragment key={device.id}>
        <ListItem button key={device.id} onClick={() => dispatch(devicesActions.select(device))}>
          <ListItemAvatar>
            <Avatar>
              <LocationOnIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={device.name} secondary={device.uniqueId} />
          <ListItemSecondaryAction>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {index < list.length - 1 ? <Divider /> : null}
      </Fragment>
    ))
    }
  </List>);
}

export default DeviceList;

