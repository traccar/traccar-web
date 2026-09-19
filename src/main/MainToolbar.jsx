import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Badge,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useDeviceReadonly } from '../common/util/permissions';
import DeviceRow from './DeviceRow';

const useStyles = makeStyles()((theme) => ({
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1.25),
    minHeight: 0,
    padding: theme.spacing(1.75, 1.5, 1.25),
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& .MuiIconButton-root': {
      color: theme.palette.text.secondary,
    },
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
  },
  totalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    borderRadius: 999,
    backgroundColor: `${theme.palette.primary.main}14`,
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  filterPills: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 150ms ease',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  pillDefault: {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9',
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
      color: theme.palette.text.primary,
    },
  },
  pillActiveAll: {
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.paper,
  },
  pillActiveOnline: {
    backgroundColor: theme.palette.success.main,
    color: '#ffffff',
    boxShadow: `0 2px 8px ${theme.palette.success.main}40`,
  },
  pillActiveOffline: {
    backgroundColor: theme.palette.error.main,
    color: '#ffffff',
    boxShadow: `0 2px 8px ${theme.palette.error.main}40`,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
  },
  search: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc',
    fontSize: '0.85rem',
    transition: 'background-color 150ms ease, border-color 150ms ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1.5,
    },
    '& .MuiInputBase-input': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(0.5),
    fontSize: '1.15rem',
  },
  actionButton: {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    width: 38,
    height: 38,
    borderRadius: 12,
    transition: 'all 150ms ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.text.secondary,
    },
  },
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
  },
  popoverPaper: {
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
  },
}));

const MainToolbar = ({
  filteredDevices,
  devicesOpen,
  setDevicesOpen,
  keyword,
  setKeyword,
  filter,
  setFilter,
  filterSort,
  setFilterSort,
  filterMap,
  setFilterMap,
}) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();

  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);

  const toolbarRef = useRef();
  const inputRef = useRef();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [devicesAnchorEl, setDevicesAnchorEl] = useState(null);

  const deviceStatusCount = (status) => Object.values(devices).filter((d) => d.status === status).length;
  const totalCount = Object.keys(devices).length;
  const onlineCount = deviceStatusCount('online');
  const offlineCount = deviceStatusCount('offline');

  const isAllSelected = !filter.statuses.length;
  const isOnlineSelected = filter.statuses.length === 1 && filter.statuses.includes('online');
  const isOfflineSelected = filter.statuses.length === 1 && filter.statuses.includes('offline');

  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setFilter({ ...filter, statuses: [] });
    } else if (filter.statuses.includes(status) && filter.statuses.length === 1) {
      setFilter({ ...filter, statuses: [] });
    } else {
      setFilter({ ...filter, statuses: [status] });
    }
  };

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      <div className={classes.headerRow}>
        <div className={classes.titleWrapper}>
          <Typography className={classes.title}>{t('deviceTitle')}</Typography>
          <span className={classes.totalBadge}>{totalCount}</span>
        </div>
      </div>

      <div className={classes.filterPills}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilter('all')}
          onKeyDown={(e) => e.key === 'Enter' && handleStatusFilter('all')}
          className={`${classes.pill} ${isAllSelected ? classes.pillActiveAll : classes.pillDefault}`}
        >
          {t('sharedAll') || 'All'} ({totalCount})
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilter('online')}
          onKeyDown={(e) => e.key === 'Enter' && handleStatusFilter('online')}
          className={`${classes.pill} ${isOnlineSelected ? classes.pillActiveOnline : classes.pillDefault}`}
        >
          <span className={classes.statusDot} style={{ color: isOnlineSelected ? '#ffffff' : theme.palette.success.main }} />
          {t('deviceStatusOnline')} ({onlineCount})
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilter('offline')}
          onKeyDown={(e) => e.key === 'Enter' && handleStatusFilter('offline')}
          className={`${classes.pill} ${isOfflineSelected ? classes.pillActiveOffline : classes.pillDefault}`}
        >
          <span className={classes.statusDot} style={{ color: isOfflineSelected ? '#ffffff' : theme.palette.error.main }} />
          {t('deviceStatusOffline')} ({offlineCount})
        </div>
      </div>

      <div className={classes.controlsRow}>
        <IconButton
          edge="start"
          onClick={() => setDevicesOpen(!devicesOpen)}
          className={classes.actionButton}
          size="small"
          aria-label={devicesOpen ? t('mapTitle') : t('sharedSearchDevices')}
        >
          {devicesOpen ? <MapIcon fontSize="small" /> : <ViewListIcon fontSize="small" />}
        </IconButton>
        <OutlinedInput
          ref={inputRef}
          className={classes.search}
          placeholder={t('sharedSearchDevices')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setDevicesAnchorEl(toolbarRef.current)}
          onBlur={() => setDevicesAnchorEl(null)}
          endAdornment={(
            <InputAdornment position="end">
              {keyword && (
                <IconButton size="small" onClick={() => setKeyword('')} sx={{ p: 0.5, mr: 0.25 }}>
                  <ClearIcon fontSize="small" sx={{ fontSize: 16 }} />
                </IconButton>
              )}
              <IconButton size="small" edge="end" onClick={() => setFilterAnchorEl(inputRef.current)}>
                <Badge color="primary" variant="dot" invisible={!filter.statuses.length && !filter.groups.length}>
                  <TuneIcon fontSize="small" />
                </Badge>
              </IconButton>
            </InputAdornment>
          )}
          startAdornment={<SearchIcon className={classes.searchIcon} />}
          size="small"
          fullWidth
        />
        <IconButton
          edge="end"
          onClick={() => navigate('/settings/device')}
          disabled={deviceReadonly}
          className={classes.actionButton}
          size="small"
          aria-label={t('sharedAdd')}
        >
          <Tooltip open={!deviceReadonly && Object.keys(devices).length === 0} title={t('deviceRegisterFirst')} arrow>
            <AddIcon fontSize="small" />
          </Tooltip>
        </IconButton>
      </div>

      <Popover
        open={!!devicesAnchorEl && !devicesOpen}
        anchorEl={devicesAnchorEl}
        onClose={() => setDevicesAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: Number(theme.spacing(2).slice(0, -2)),
        }}
        marginThreshold={0}
        slotProps={{
          paper: {
            className: classes.popoverPaper,
            style: { width: `calc(${toolbarRef.current?.clientWidth}px - ${theme.spacing(4)})` },
          },
        }}
        elevation={0}
        disableAutoFocus
        disableEnforceFocus
      >
        {filteredDevices.slice(0, 3).map((_, index) => (
          <DeviceRow key={filteredDevices[index].id} data={filteredDevices} index={index} />
        ))}
        {filteredDevices.length > 3 && (
          <ListItemButton alignItems="center" onClick={() => setDevicesOpen(true)}>
            <ListItemText
              primary={t('notificationAlways')}
              style={{ textAlign: 'center' }}
            />
          </ListItemButton>
        )}
      </Popover>

      <Popover
        open={!!filterAnchorEl}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            className: classes.popoverPaper,
          },
        }}
      >
        <div className={classes.filterPanel}>
          <FormControl>
            <InputLabel>{t('deviceStatus')}</InputLabel>
            <Select
              label={t('deviceStatus')}
              value={filter.statuses}
              onChange={(e) => setFilter({ ...filter, statuses: e.target.value })}
              multiple
            >
              <MenuItem value="online">{`${t('deviceStatusOnline')} (${deviceStatusCount('online')})`}</MenuItem>
              <MenuItem value="offline">{`${t('deviceStatusOffline')} (${deviceStatusCount('offline')})`}</MenuItem>
              <MenuItem value="unknown">{`${t('deviceStatusUnknown')} (${deviceStatusCount('unknown')})`}</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>{t('settingsGroups')}</InputLabel>
            <Select
              label={t('settingsGroups')}
              value={filter.groups}
              onChange={(e) => setFilter({ ...filter, groups: e.target.value })}
              multiple
            >
              {Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>{t('sharedSortBy')}</InputLabel>
            <Select
              label={t('sharedSortBy')}
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">{'\u00a0'}</MenuItem>
              <MenuItem value="name">{t('sharedName')}</MenuItem>
              <MenuItem value="lastUpdate">{t('deviceLastUpdate')}</MenuItem>
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={filterMap} onChange={(e) => setFilterMap(e.target.checked)} />}
              label={t('sharedFilterMap')}
            />
          </FormGroup>
        </div>
      </Popover>
    </Toolbar>
  );
};

export default MainToolbar;
