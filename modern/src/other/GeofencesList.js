import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { devicesActions } from '../store';
import EditCollectionView from '../settings/components/EditCollectionView';

const useStyles = makeStyles(() => ({
  list: {
    maxHeight: '100%',
    overflow: 'auto',
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
}));

const GeofenceView = ({ onMenuClick }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.geofences.items);

  return (
    <List className={classes.list}>
      {Object.values(items).map((item, index, list) => (
        <Fragment key={item.id}>
          <ListItem button key={item.id} onClick={() => dispatch(devicesActions.select(item.id))}>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={(event) => onMenuClick(event.currentTarget, item.id)}>
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {index < list.length - 1 ? <Divider /> : null}
        </Fragment>
      ))}
    </List>
  );
};

const GeofencesList = () => (
  <EditCollectionView content={GeofenceView} editPath="/settings/geofence" endpoint="geofences" disableAdd />
);

export default GeofencesList;
