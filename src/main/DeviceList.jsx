import { forwardRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { devicesActions } from '../store';
import { useEffectAsync } from '../reactHelper';
import DeviceRow from './DeviceRow';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { useTranslation } from '../common/components/LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
  listWrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#f8fafc',
  },
  list: {
    maxHeight: '100%',
    '& > div': {
      scrollbarWidth: 'thin',
      scrollbarColor: `${theme.palette.divider} transparent`,
    },
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  emptyIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1.5),
    color: theme.palette.text.secondary,
  },
  emptyTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5),
  },
  emptySubtitle: {
    fontSize: '0.78rem',
    color: theme.palette.text.secondary,
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
        paddingTop: 6,
        paddingBottom: 6,
        direction: theme.direction,
      }}
      {...rest}
    />
  );
});

const DeviceList = ({ devices }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffectAsync(async () => {
    const response = await fetchOrThrow('/api/devices');
    dispatch(devicesActions.refresh(await response.json()));
  }, []);

  if (!devices || devices.length === 0) {
    return (
      <div className={classes.emptyState}>
        <div className={classes.emptyIconWrapper}>
          <SearchOffIcon fontSize="medium" />
        </div>
        <Typography className={classes.emptyTitle}>
          {t('sharedNoResults') || 'No devices found'}
        </Typography>
        <Typography className={classes.emptySubtitle}>
          {t('sharedSearchDevices') || 'Try adjusting your search or filters'}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.listWrapper}>
      <AutoSizer className={classes.list}>
        {({ height, width }) => (
          <FixedSizeList
            width={width}
            height={height}
            itemCount={devices.length}
            itemData={devices}
            itemSize={72}
            overscanCount={8}
            outerElementType={OuterElement}
          >
            {DeviceRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

export default DeviceList;
