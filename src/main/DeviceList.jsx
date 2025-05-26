import { forwardRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTheme } from '@mui/material/styles';
import { devicesActions } from '../store';
import { useEffectAsync } from '../reactHelper';
import DeviceRow from './DeviceRow';

const useStyles = makeStyles()((theme) => ({
  list: {
    maxHeight: '100%',
  },
  listInner: {
    position: 'relative',
    margin: theme.spacing(1.5, 0),
  },
}));

const OuterElement = forwardRef(function OuterElement(props, ref) {
  const theme = useTheme();
  const { className, style, ...rest } = props;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        direction: theme.direction, 
      }}
      {...rest}
    />
  );
});

const DeviceList = ({ devices }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffectAsync(async () => {
    const response = await fetch('/api/devices');
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, []);

  return (
    <AutoSizer className={classes.list}>
      {({ height, width }) => (
        <FixedSizeList
          width={width}
          height={height}
          itemCount={devices.length}
          itemData={devices}
          itemSize={72}
          overscanCount={10}
          outerElementType={OuterElement}
        >
          {DeviceRow}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default DeviceList;
