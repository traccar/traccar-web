import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
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
  Typography,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import DnsIcon from '@mui/icons-material/Dns';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { useTranslation } from '../common/components/LocalizationProvider';
import DeviceRow from './DeviceRow';

const useStyles = makeStyles()((theme) => ({
  heading: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(2.5, 2, 0),
  },
  toolbar: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
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
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const geofences = useSelector((state) => state.geofences.items);

  const deviceCount = Object.keys(devices).length;
  const onlineCount = Object.values(devices).filter((d) => d.status === 'online').length;

  const toolbarRef = useRef();
  const inputRef = useRef();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [devicesAnchorEl, setDevicesAnchorEl] = useState(null);

  return (
    <>
      {devicesOpen && (
        <div className={classes.heading}>
          <Typography variant="h5" component="h1">
            {t('fleetTitle')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('fleetSummary').replace('{online}', onlineCount).replace('{total}', deviceCount)}
          </Typography>
        </div>
      )}
      <Toolbar ref={toolbarRef} className={classes.toolbar}>
        {!desktop && (
          <IconButton edge="start" onClick={() => setDevicesOpen(!devicesOpen)}>
            {devicesOpen ? <MapIcon /> : <DnsIcon />}
          </IconButton>
        )}
        <OutlinedInput
          ref={inputRef}
          placeholder={t('sharedSearchDevices')}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setDevicesAnchorEl(toolbarRef.current)}
          onBlur={() => setDevicesAnchorEl(null)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => setFilterAnchorEl(inputRef.current)}
              >
                <Badge
                  color="info"
                  variant="dot"
                  invisible={!filter.groups.length && !filter.geofences.length}
                >
                  <TuneIcon fontSize="small" />
                </Badge>
              </IconButton>
            </InputAdornment>
          }
          size="small"
          fullWidth
        />
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
              style: { width: `calc(${toolbarRef.current?.clientWidth}px - ${theme.spacing(4)})` },
            },
          }}
          elevation={1}
          disableAutoFocus
          disableEnforceFocus
        >
          {filteredDevices.slice(0, 3).map((_, index) => (
            <DeviceRow key={filteredDevices[index].id} devices={filteredDevices} index={index} />
          ))}
          {filteredDevices.length > 3 && (
            <ListItemButton alignItems="center" onClick={() => setDevicesOpen(true)}>
              <ListItemText primary={t('notificationAlways')} style={{ textAlign: 'center' }} />
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
        >
          <div className={classes.filterPanel}>
            <FormControl>
              <InputLabel>{t('settingsGroups')}</InputLabel>
              <Select
                label={t('settingsGroups')}
                value={filter.groups}
                onChange={(e) => setFilter({ ...filter, groups: e.target.value })}
                multiple
              >
                {Object.values(groups)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>{t('sharedGeofences')}</InputLabel>
              <Select
                label={t('sharedGeofences')}
                value={filter.geofences}
                onChange={(e) => setFilter({ ...filter, geofences: e.target.value })}
                multiple
              >
                {Object.values(geofences)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((geofence) => (
                    <MenuItem key={geofence.id} value={geofence.id}>
                      {geofence.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>{t('sharedSortBy')}</InputLabel>
              <Select
                label={t('sharedSortBy')}
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
              >
                <MenuItem value="">{'\u00a0'}</MenuItem>
                <MenuItem value="name">{t('sharedName')}</MenuItem>
                <MenuItem value="lastUpdate">{t('deviceLastUpdate')}</MenuItem>
              </Select>
            </FormControl>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={filterMap} onChange={(e) => setFilterMap(e.target.checked)} />
                }
                label={t('sharedFilterMap')}
              />
            </FormGroup>
          </div>
        </Popover>
      </Toolbar>
    </>
  );
};

export default MainToolbar;
