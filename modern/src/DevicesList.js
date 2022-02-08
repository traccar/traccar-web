import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import BatteryFullIcon from '@material-ui/icons/BatteryFull';
import { ReactComponent as IgnitionIcon } from '../public/images/ignition.svg';

import { devicesActions } from './store';
import EditCollectionView from './EditCollectionView';
import { useEffectAsync } from './reactHelper';
import { formatPosition } from './common/formatter';
import { getDevices, getPosition } from './common/selectors';
import { useTranslation } from './LocalizationProvider';

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: '100%',
  },
  listInner: {
    position: 'relative',
    margin: theme.spacing(1.5, 0),
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  listItem: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
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
  indicators: {
    lineHeight: 1,
  },
}));

const getStatusColor = (status) => {
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
  const t = useTranslation();

  const { items } = data;
  const item = items[index];
  const position = useSelector(getPosition(item.id));
  const showIgnition = position?.attributes.hasOwnProperty('ignition') && position.attributes.ignition;

  return (
    <div style={style}>
      <ListItem button key={item.id} className={classes.listItem} onClick={() => dispatch(devicesActions.select(item))}>
        <ListItemAvatar>
          <Avatar>
            <img className={classes.icon} src={`images/icon/${item.category || 'default'}.svg`} alt="" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.name} secondary={item.status} classes={{ secondary: classes[getStatusColor(item.status)] }} />
        <ListItemSecondaryAction className={classes.indicators}>
          {position && (
          <Grid container direction="row" alignItems="center" alignContent="center" spacing={2}>
            {showIgnition && (
            <Grid item>
              <SvgIcon component={IgnitionIcon} />
            </Grid>
            )}
            {position.attributes.hasOwnProperty('batteryLevel') && (
            <Grid item container xs alignItems="center" alignContent="center">
              <Grid item>
                <span className={classes.batteryText}>{formatPosition(position.attributes.batteryLevel, 'batteryLevel', t)}</span>
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
    </div>
  );
};

const DeviceView = ({ updateTimestamp, onMenuClick, filter }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const listInnerEl = useRef(null);

  const items = useSelector(getDevices);
  const [filteredItems, setFilteredItems] = useState(null);

  useEffect(() => {
    setFilteredItems(
      filter.trim().length > 0
        ? items.filter((item) => `${item.name} ${item.uniqueId}`.toLowerCase().includes(filter?.toLowerCase()))
        : items,
    );
  }, [filter, items]);

  if (listInnerEl.current) {
    listInnerEl.current.className = classes.listInner;
  }

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
            itemCount={filteredItems.length}
            itemData={{ items: filteredItems, onMenuClick }}
            itemSize={72}
            overscanCount={10}
            innerRef={listInnerEl}
          >
            {DeviceRow}
          </FixedSizeList>
        </List>
      )}
    </AutoSizer>
  );
};

const DevicesList = ({ filter }) => (
  <EditCollectionView content={DeviceView} editPath="/device" endpoint="devices" disableAdd filter={filter} />
);

export default DevicesList;
