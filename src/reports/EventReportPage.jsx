import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl, InputLabel, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Link, IconButton,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { useSelector } from 'react-redux';
import { formatSpeed, formatTime } from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { prefixString, unprefixString } from '../common/util/stringUtils';
import { useTranslation, useTranslationKeys } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch, useEffectAsync } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import { useAttributePreference } from '../common/util/preferences';
import MapView from '../map/core/MapView';
import MapGeofence from '../map/MapGeofence';
import MapPositions from '../map/MapPositions';
import MapCamera from '../map/MapCamera';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import SelectField from '../common/components/SelectField';
import fetchOrThrow from '../common/util/fetchOrThrow';

const columnsArray = [
  ['eventTime', 'positionFixTime'],
  ['type', 'sharedType'],
  ['geofenceId', 'sharedGeofence'],
  ['maintenanceId', 'sharedMaintenance'],
  ['attributes', 'commandData'],
];
const columnsMap = new Map(columnsArray);

const EventReportPage = () => {
  const navigate = useNavigate();
  const { classes } = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const geofences = useSelector((state) => state.geofences.items);

  const speedUnit = useAttributePreference('speedUnit');

  const [allEventTypes, setAllEventTypes] = useState([['allEvents', 'eventAll']]);

  const alarms = useTranslationKeys((it) => it.startsWith('alarm')).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  const [columns, setColumns] = usePersistedState('eventColumns', ['eventTime', 'type', 'attributes']);
  const [eventTypes, setEventTypes] = useState(['allEvents']);
  const [alarmTypes, setAlarmTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [position, setPosition] = useState(null);

  useEffectAsync(async () => {
    if (selectedItem) {
      const response = await fetchOrThrow(`/api/positions?id=${selectedItem.positionId}`);
      const positions = await response.json();
      if (positions.length > 0) {
        setPosition(positions[0]);
      }
    } else {
      setPosition(null);
    }
  }, [selectedItem]);

  useEffectAsync(async () => {
    const response = await fetchOrThrow('/api/notifications/types');
    const types = await response.json();
    setAllEventTypes([...allEventTypes, ...types.map((it) => [it.type, prefixString('event', it.type)])]);
  }, []);

  const onShow = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    eventTypes.forEach((it) => query.append('type', it));
    if (eventTypes[0] !== 'allEvents' && eventTypes.includes('alarm')) {
      alarmTypes.forEach((it) => query.append('alarm', it));
    }
    setLoading(true);
    try {
      const response = await fetchOrThrow(`/api/reports/events?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  });

  const onExport = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    eventTypes.forEach((it) => query.append('type', it));
    if (eventTypes[0] !== 'allEvents' && eventTypes.includes('alarm')) {
      alarmTypes.forEach((it) => query.append('alarm', it));
    }
    window.location.assign(`/api/reports/events/xlsx?${query.toString()}`);
  });

  const onSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'events';
    if (eventTypes[0] !== 'allEvents') {
      report.attributes.types = eventTypes.join(',');
    }
    await scheduleReport(deviceIds, groupIds, report);
    navigate('/reports/scheduled');
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'deviceId':
        return devices[value].name;
      case 'eventTime':
        return formatTime(value, 'seconds');
      case 'type':
        return t(prefixString('event', value));
      case 'geofenceId':
        if (value > 0) {
          const geofence = geofences[value];
          return geofence && geofence.name;
        }
        return null;
      case 'maintenanceId':
        return value > 0 ? value : null;
      case 'attributes':
        switch (item.type) {
          case 'alarm':
            return t(prefixString('alarm', item.attributes.alarm));
          case 'deviceOverspeed':
            return formatSpeed(item.attributes.speed, speedUnit, t);
          case 'driverChanged':
            return item.attributes.driverUniqueId;
          case 'media':
            return (<Link href={`/api/media/${devices[item.deviceId]?.uniqueId}/${item.attributes.file}`} target="_blank">{item.attributes.file}</Link>);
          case 'commandResult':
            return item.attributes.result;
          default:
            return '';
        }
      default:
        return value;
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportEvents']}>
      <div className={classes.container}>
        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {position && <MapPositions positions={[position]} titleField="fixTime" />}
            </MapView>
            <MapScale />
            {position && <MapCamera latitude={position.latitude} longitude={position.longitude} />}
          </div>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter onShow={onShow} onExport={onExport} onSchedule={onSchedule} deviceType="multiple" loading={loading}>
              <div className={classes.filterItem}>
                <FormControl fullWidth>
                  <InputLabel>{t('reportEventTypes')}</InputLabel>
                  <Select
                    label={t('reportEventTypes')}
                    value={eventTypes}
                    onChange={(e, child) => {
                      let values = e.target.value;
                      const clicked = child.props.value;
                      if (values.includes('allEvents') && values.length > 1) {
                        values = [clicked];
                      }
                      setEventTypes(values);
                    }}
                    multiple
                  >
                    {allEventTypes.map(([key, string]) => (
                      <MenuItem key={key} value={key}>{t(string)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {eventTypes[0] !== 'allEvents' && eventTypes.includes('alarm') && (
                <div className={classes.filterItem}>
                  <SelectField
                    multiple
                    value={alarmTypes}
                    onChange={(e) => setAlarmTypes(e.target.value)}
                    data={alarms}
                    keyGetter={(it) => it.key}
                    label={t('sharedAlarms')}
                    fullWidth
                  />
                </div>
              )}
              <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
            </ReportFilter>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                <TableCell>{t('sharedDevice')}</TableCell>
                {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.columnAction} padding="none">
                    {(item.positionId && (selectedItem === item ? (
                      <IconButton size="small" onClick={() => setSelectedItem(null)}>
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => setSelectedItem(item)}>
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    ))) || ''}
                  </TableCell>
                  <TableCell>{devices[item.deviceId].name}</TableCell>
                  {columns.map((key) => (
                    <TableCell key={key}>
                      {formatValue(item, key)}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (<TableShimmer columns={columns.length + 2} />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default EventReportPage;
