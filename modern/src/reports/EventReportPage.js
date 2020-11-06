import React, { useState } from 'react';
import MainToolbar from '../MainToolbar';
import { Grid, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper, makeStyles } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import t from '../common/localization';
import { formatPosition } from '../common/formatter';
import ReportFilter from './ReportFilter';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(1, 2, 2),
  },
}));

const EventReportPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [eventType, setEventType] = useState(['allEvents']);

  const handleSubmit = async (deviceId, from, to) => {
    const query = new URLSearchParams({
      deviceId,
      from: from.toISOString(),
      to: to.toISOString(),
    });
    eventType.map(t=>query.append('type',t));
    const response = await fetch(`/api/reports/events?${query.toString()}`, { headers: { Accept: 'application/json' } })
    
    if(response.ok) {
      const data = await response.json();
      setData(data);
    }
  }

  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} lg={2}>
            <Paper className={classes.form}>
              <ReportFilter handleSubmit={handleSubmit}>
                <FormControl variant="filled" margin="normal" fullWidth>
                  <InputLabel>{t('reportEventTypes')}</InputLabel>
                  <Select value={eventType} onChange={(e) => setEventType(e.target.value)} multiple>
                    <MenuItem value="allEvents">{t('eventAll')}</MenuItem>
                    <MenuItem value="deviceOnline">{t('eventDeviceOnline')}</MenuItem>
                    <MenuItem value="deviceUnknown">{t('eventDeviceUnknown')}</MenuItem>
                    <MenuItem value="deviceOffline">{t('eventDeviceOffline')}</MenuItem>
                    <MenuItem value="deviceInactive">{t('eventDeviceInactive')}</MenuItem>
                    <MenuItem value="deviceMoving">{t('eventDeviceMoving')}</MenuItem>
                    <MenuItem value="deviceStopped">{t('eventDeviceStopped')}</MenuItem>
                    <MenuItem value="deviceOverspeed">{t('eventDeviceOverspeed')}</MenuItem>
                    <MenuItem value="deviceFuelDrop">{t('eventDeviceFuelDrop')}</MenuItem>
                    <MenuItem value="commandResult">{t('eventCommandResult')}</MenuItem>
                    <MenuItem value="geofenceEnter">{t('eventGeofenceEnter')}</MenuItem>
                    <MenuItem value="geofenceExit">{t('eventGeofenceExit')}</MenuItem>
                    <MenuItem value="alarm">{t('eventAlarm')}</MenuItem>
                    <MenuItem value="ignitionOn">{t('eventIgnitionOn')}</MenuItem>
                    <MenuItem value="ignitionOff">{t('eventIgnitionOff')}</MenuItem>
                    <MenuItem value="maintenance">{t('eventMaintenance')}</MenuItem>
                    <MenuItem value="textMessage">{t('eventTextMessage')}</MenuItem>
                    <MenuItem value="driverChanged">{t('eventDriverChanged')}</MenuItem>
                  </Select>
                </FormControl>
              </ReportFilter>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('positionFixTime')}</TableCell>
                    <TableCell>{t('sharedType')}</TableCell>
                    <TableCell>{t('sharedGeofence')}</TableCell>
                    <TableCell>{t('sharedMaintenance')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {formatPosition(item, 'serverTime')}
                      </TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{}</TableCell>
                      <TableCell>{}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default EventReportPage;
