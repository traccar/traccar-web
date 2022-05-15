import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
  FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { formatDate } from '../common/util/formatter';
import ReportFilter, { useFilterStyles } from './components/ReportFilter';
import { prefixString } from '../common/util/stringUtils';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';

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

const Filter = ({ setItems }) => {
  const classes = useFilterStyles();
  const t = useTranslation();

  const [eventTypes, setEventTypes] = useState(['allEvents']);

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
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
    }
  };

  return (
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
    </ReportFilter>
  );
};

const EventReportPage = () => {
  const theme = useTheme();
  const t = useTranslation();

  const geofences = useSelector((state) => state.geofences.items);

  const [items, setItems] = useState([]);

  const formatGeofence = (value) => {
    if (value > 0) {
      const geofence = geofences[value];
      return geofence ? geofence.name : '';
    }
    return null;
  };

  const columns = [{
    headerName: t('positionFixTime'),
    field: 'serverTime',
    type: 'dateTime',
    width: theme.dimensions.columnWidthDate,
    valueFormatter: ({ value }) => formatDate(value),
  }, {
    headerName: t('sharedType'),
    field: 'type',
    type: 'string',
    width: theme.dimensions.columnWidthString,
    valueFormatter: ({ value }) => t(prefixString('event', value)),
  }, {
    headerName: t('sharedGeofence'),
    field: 'geofenceId',
    width: theme.dimensions.columnWidthString,
    valueFormatter: ({ value }) => formatGeofence(value),
  }, {
    headerName: t('sharedMaintenance'),
    field: 'maintenanceId',
    type: 'number',
    width: theme.dimensions.columnWidthString,
  }];

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportEvents']}>
      <Filter setItems={setItems} />
      <DataGrid
        rows={items}
        columns={columns}
        hideFooter
        autoHeight
      />
    </PageLayout>
  );
};

export default EventReportPage;
