import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { formatDate } from '../common/util/formatter';
import ReportFilter, { useFilterStyles } from './components/ReportFilter';
import { prefixString } from '../common/util/stringUtils';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch } from '../reactHelper';

const typesArray = [
  ['allEvents', 'eventAll'],
  ['deviceOnline', 'eventDeviceOnline'],
  ['deviceUnknown', 'eventDeviceUnknown'],
  ['deviceOffline', 'eventDeviceOffline'],
  ['deviceInactive', 'eventDeviceInactive'],
  ['deviceMoving', 'eventDeviceMoving'],
  ['deviceStopped', 'eventDeviceStopped'],
  ['deviceOverspeed', 'eventDeviceOverspeed'],
  ['deviceFuelDrop', 'eventDeviceFuelDrop'],
  ['commandResult', 'eventCommandResult'],
  ['geofenceEnter', 'eventGeofenceEnter'],
  ['geofenceExit', 'eventGeofenceExit'],
  ['alarm', 'eventAlarm'],
  ['ignitionOn', 'eventIgnitionOn'],
  ['ignitionOff', 'eventIgnitionOff'],
  ['maintenance', 'eventMaintenance'],
  ['textMessage', 'eventTextMessage'],
  ['driverChanged', 'eventDriverChanged'],
];
const typesMap = new Map(typesArray);

const columnsArray = [
  ['eventTime', 'positionFixTime'],
  ['type', 'sharedType'],
  ['geofenceId', 'sharedGeofence'],
  ['maintenanceId', 'sharedMaintenance'],
  ['alarm', 'positionAlarm'],
];
const columnsMap = new Map(columnsArray);

const EventReportPage = () => {
  const classes = useFilterStyles();
  const t = useTranslation();

  const geofences = useSelector((state) => state.geofences.items);

  const [columns, setColumns] = usePersistedState('eventColumns', ['eventTime', 'type', 'alarm']);
  const [eventTypes, setEventTypes] = useState(['allEvents']);
  const [items, setItems] = useState([]);

  const handleSubmit = useCatch(async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({
      deviceId, from, to, mail,
    });
    eventTypes.forEach((it) => query.append('type', it));
    const response = await fetch(`/api/reports/events?${query.toString()}`, { headers });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType) {
        if (contentType === 'application/json') {
          setItems(await response.json());
        } else {
          window.location.assign(window.URL.createObjectURL(await response.blob()));
        }
      }
    } else {
      throw Error(await response.text());
    }
  });

  const formatValue = (item, key) => {
    switch (key) {
      case 'eventTime':
        return formatDate(item[key]);
      case 'type':
        return t(prefixString('event', item[key]));
      case 'geofenceId':
        if (item[key] > 0) {
          const geofence = geofences[item[key]];
          return geofence && geofence.name;
        }
        return null;
      case 'maintenanceId':
        return item[key] > 0 ? item[key] > 0 : null;
      case 'alarm':
        return item.attributes[key] ? t(prefixString('alarm', item.attributes[key])) : null;
      default:
        return item[key];
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportEvents']}>
      <ReportFilter handleSubmit={handleSubmit}>
        <div className={classes.item}>
          <FormControl variant="filled" fullWidth>
            <InputLabel>{t('reportEventTypes')}</InputLabel>
            <Select
              value={eventTypes}
              onChange={(event, child) => {
                let values = event.target.value;
                const clicked = child.props.value;
                if (values.includes('allEvents') && values.length > 1) {
                  values = [clicked];
                }
                setEventTypes(values);
              }}
              renderValue={(it) => (it.length > 1 ? it.length : it.length > 0 ? t(typesMap.get(it[0])) : it)}
              multiple
            >
              {typesArray.map(([key, string]) => (
                <MenuItem value={key}>{t(string)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
      </ReportFilter>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((key) => (<TableCell>{t(columnsMap.get(key))}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((key) => (
                  <TableCell>
                    {formatValue(item, key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
};

export default EventReportPage;
