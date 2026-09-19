import {
  useState, useCallback, useEffect,
} from 'react';
import { Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import DeviceList from './DeviceList';
import BottomMenu from '../common/components/BottomMenu';
import StatusCard from '../common/components/StatusCard';
import { devicesActions } from '../store';
import usePersistedState from '../common/util/usePersistedState';
import EventsDrawer from './EventsDrawer';
import useFilter from './useFilter';
import MainToolbar from './MainToolbar';
import MainMap from './MainMap';
import { useAttributePreference } from '../common/util/preferences';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
  },
  sidebar: {
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: `calc(100% - ${theme.spacing(3)})`,
      width: theme.dimensions.drawerWidthDesktop,
      margin: theme.spacing(1.5),
      zIndex: 3,
      animation: 'slideInLeft 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
    },
    [theme.breakpoints.down('md')]: {
      height: '100%',
      width: '100%',
    },
  },
  sidebarPaper: {
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
    backgroundColor: theme.palette.background.paper,
  },
  listArea: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#f8fafc',
  },
  dockFooter: {
    marginTop: 'auto',
  },
  floatingHeader: {
    pointerEvents: 'auto',
    borderRadius: 18,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
    backgroundColor: theme.palette.background.paper,
    animation: 'slideInLeft 0.95s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  floatingFooter: {
    pointerEvents: 'auto',
    borderRadius: 18,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
    backgroundColor: theme.palette.background.paper,
    animation: 'slideInLeft 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
  },
  mobileHeader: {
    pointerEvents: 'auto',
    zIndex: 6,
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    animation: 'slideInDown 0.75s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  middle: {
    flex: 1,
    display: 'grid',
    minHeight: 0,
    animation: 'fadeIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  contentMap: {
    pointerEvents: 'auto',
    gridArea: '1 / 1',
  },
  contentList: {
    pointerEvents: 'auto',
    gridArea: '1 / 1',
    zIndex: 4,
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
}));

const MainPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const mapOnSelect = useAttributePreference('mapOnSelect', true);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId);

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', 'lastUpdate');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);

  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(keyword, filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  return (
    <div className={classes.root}>
      {desktop && (
        <MainMap
          filteredPositions={filteredPositions}
          selectedPosition={selectedPosition}
          onEventsClick={onEventsClick}
        />
      )}
      <div className={classes.sidebar}>
        {desktop ? (
          devicesOpen ? (
            <Paper elevation={0} className={classes.sidebarPaper}>
              <MainToolbar
                filteredDevices={filteredDevices}
                devicesOpen={devicesOpen}
                setDevicesOpen={setDevicesOpen}
                keyword={keyword}
                setKeyword={setKeyword}
                filter={filter}
                setFilter={setFilter}
                filterSort={filterSort}
                setFilterSort={setFilterSort}
                filterMap={filterMap}
                setFilterMap={setFilterMap}
              />
              <div className={classes.listArea}>
                <DeviceList devices={filteredDevices} />
              </div>
              <div className={classes.dockFooter}>
                <BottomMenu />
              </div>
            </Paper>
          ) : (
            <>
              <Paper elevation={0} className={classes.floatingHeader}>
                <MainToolbar
                  filteredDevices={filteredDevices}
                  devicesOpen={devicesOpen}
                  setDevicesOpen={setDevicesOpen}
                  keyword={keyword}
                  setKeyword={setKeyword}
                  filter={filter}
                  setFilter={setFilter}
                  filterSort={filterSort}
                  setFilterSort={setFilterSort}
                  filterMap={filterMap}
                  setFilterMap={setFilterMap}
                />
              </Paper>
              <div style={{ flex: 1 }} />
              <Paper elevation={0} className={classes.floatingFooter}>
                <BottomMenu />
              </Paper>
            </>
          )
        ) : (
          <>
            <Paper elevation={0} className={classes.mobileHeader}>
              <MainToolbar
                filteredDevices={filteredDevices}
                devicesOpen={devicesOpen}
                setDevicesOpen={setDevicesOpen}
                keyword={keyword}
                setKeyword={setKeyword}
                filter={filter}
                setFilter={setFilter}
                filterSort={filterSort}
                setFilterSort={setFilterSort}
                filterMap={filterMap}
                setFilterMap={setFilterMap}
              />
            </Paper>
            <div className={classes.middle}>
              <div className={classes.contentMap}>
                <MainMap
                  filteredPositions={filteredPositions}
                  selectedPosition={selectedPosition}
                  onEventsClick={onEventsClick}
                />
              </div>
              <Paper elevation={0} className={classes.contentList} style={devicesOpen ? {} : { visibility: 'hidden' }}>
                <DeviceList devices={filteredDevices} />
              </Paper>
            </div>
          </>
        )}
      </div>
      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default MainPage;
