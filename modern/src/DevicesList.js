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
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import BatteryFullIcon from '@material-ui/icons/BatteryFull';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import { devicesActions } from './store';
import EditCollectionView from './EditCollectionView';
import { useEffectAsync } from './reactHelper';
import { formatPosition } from './common/formatter';

const useStyles = makeStyles((theme) => ({
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
    lineHeight: '0.875rem',
  },
  green: {
    color: theme.palette.common.green,
  },
  red: {
    color: theme.palette.common.red,
  },
  gray: {
    color: theme.palette.common.gray,
  },
}));

const getOnlineStatus = (status) => {
  switch (status) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    case 'unknown':
    default:
      return 'gray';
  }
};

const getBatteryStatus = (batteryLevel) => {
  if (batteryLevel >= 70) {
    return 'green';
  }
  if (batteryLevel > 30) {
    return 'gray';
  }
  return 'red';
};

const DeviceRow = ({ data, index, style }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { items } = data;
  const item = items[index];
  const position = useSelector((state) => state.positions.items[item.id]);

  return (
    <div style={style}>
      <Fragment key={index}>
        <ListItem button key={item.id} onClick={() => dispatch(devicesActions.select(item))}>
          <ListItemAvatar>
            <Avatar>
              <img className={classes.icon} src={`images/icon/${item.category || 'default'}.svg`} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.name} secondary={item.status} classes={{ secondary: classes[getOnlineStatus(item.status)] }} />
          <ListItemSecondaryAction>
            {position && (
              <Grid container direction="row" alignItems="center" alignContent="center" spacing={1}>
                {position.attributes.hasOwnProperty('ignition') && (
                  <Grid item>
                    <VpnKeyIcon className={`${position.attributes.ignition ? classes.green : classes.gray}`} />
                  </Grid>
                )}
                {position.attributes.hasOwnProperty('batteryLevel') && (
                  <Grid item container xs alignItems="center" alignContent="center">
                    <Grid item>
                      <span className={classes.batteryText}>{formatPosition(position.attributes.batteryLevel, 'batteryLevel')}</span>
                    </Grid>
                    <Grid item>
                      <BatteryFullIcon className={classes[getBatteryStatus(position.attributes.batteryLevel)]} />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
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

  const items = useSelector((state) => Object.values(state.devices.items));

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
            itemSize={72 + 1}
          >
            {DeviceRow}
          </FixedSizeList>
        </List>
      )}
    </AutoSizer>
  );
};

const DevicesList = () => (
  <EditCollectionView content={DeviceView} editPath="/device" endpoint="devices" />
);

export default DevicesList;
