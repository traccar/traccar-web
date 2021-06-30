import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import BatteryFullIcon from '@material-ui/icons/BatteryFull';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import { devicesActions } from './store';
import EditCollectionView from './EditCollectionView';
import { useEffectAsync } from './reactHelper';
import { formatPosition } from './common/formatter';

const useStyles = makeStyles(theme => ({
  list: {
    maxHeight: '100%',
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  batteryText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    lineHeight: '0.875rem'
  },
  green: {
    color: theme.palette.statusGreen
  },
  red: {
    color: theme.palette.statusRed
  },
  grey: {
    color: theme.palette.statusGrey
  }
}));

const DeviceRow = ({ data, index, style }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { items, onMenuClick } = data;
  const item = items[index];
  
  return (
    <div style={style}>
      <Fragment key={index}>
        <ListItem button key={item.id} onClick={() => dispatch(devicesActions.select(item))}>
          <ListItemAvatar>
            <Avatar>
              <img className={classes.icon} src={`images/icon/${item.category || 'default'}.svg`} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.name} secondary={item.uniqueId} />
          <ListItemSecondaryAction>
            <IconButton onClick={(event) => onMenuClick(event.currentTarget, item.id)}>
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {index < items.length - 1 ? <Divider /> : null}
      </Fragment>
    </div>
  );
};

const DeviceView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector(state => Object.values(state.devices.items));

  useEffectAsync(async () => {
    const response = await fetch('/api/devices');
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    }
  }, [updateTimestamp]);

  return (
    <AutoSizer className={classes.list}>
      {({ height, width }) => (
        <List disablePadding>
          <FixedSizeList
            width={width}
            height={height}
            itemCount={items.length}
            itemData={{ items, onMenuClick }}
            itemSize={72 + 1} >
            {DeviceRow}
          </FixedSizeList>
        </List>
      )}
    </AutoSizer>
  );
};

const DevicesList = () => {
  return (
    <EditCollectionView content={DeviceView} editPath="/device" endpoint="devices" />
  );
};

export default DevicesList;
