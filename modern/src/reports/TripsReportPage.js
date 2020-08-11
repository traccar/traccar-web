import React, { useState } from 'react';
import MainToobar from '../MainToolbar';
import { useHistory } from 'react-router-dom';
import { Grid, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper, makeStyles, FormControl, InputLabel, Select, MenuItem, Button, TextField } from '@material-ui/core';
import t from '../common/localization';
import { useSelector } from 'react-redux';
import moment from 'moment';
import formatter from '../common/formatter';
import ReportParameters from './ReportParameters'

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

const TripsReportPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);

  const handleShow = (deviceId, selectedFrom, selectedTo) => {

    const query = new URLSearchParams({
      deviceId,
      from: selectedFrom.toISOString(),
      to: selectedTo.toISOString(),
    });
    fetch(`/api/reports/trips?${query.toString()}`, { headers: { 'Accept': 'application/json' } })
      .then(response => {
        if (response.ok) {
          response.json().then(setData);
        }
      });
  }

  return (
    <div className={classes.root}>
      <MainToobar history={history} />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <ReportParameters handleShow={handleShow}></ReportParameters>
          <Grid item xs={12} md={9} lg={10}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('reportDeviceName')}</TableCell>
                    <TableCell>{t('reportStartTime')}</TableCell>
                    <TableCell>{t('reportStartOdometer')}</TableCell>
                    <TableCell>{t('reportStartAddress')}</TableCell>
                    <TableCell>{t('reportEndTime')}</TableCell>
                    <TableCell>{t('reportEndOdometer')}</TableCell>

                    <TableCell>{t('reportEndAddress')}</TableCell>
                    <TableCell>{t('positionDistance')}</TableCell>
                    <TableCell>{t('reportAverageSpeed')}</TableCell>
                    <TableCell>{t('reportMaximumSpeed')}</TableCell>
                    <TableCell>{t('reportDuration')}</TableCell>
                    <TableCell>{t('reportSpentFuel')}</TableCell>
                    <TableCell>{t('sharedDriver')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatter(item, 'deviceName')}</TableCell>
                      <TableCell>{formatter(item, 'startTime')}</TableCell>
                      <TableCell>{formatter(item, 'startOdometer')}</TableCell>
                      <TableCell>{formatter(item, 'startAddress')}</TableCell>
                      <TableCell>{formatter(item, 'endTime')}</TableCell>
                      <TableCell>{formatter(item, 'endOdometer')}</TableCell>

                      <TableCell>{formatter(item, 'endAddress')}</TableCell>
                      <TableCell>{formatter(item, 'distance')}</TableCell>
                      <TableCell>{formatter(item, 'averageSpeed')}</TableCell>
                      <TableCell>{formatter(item, 'maxSpeed')}</TableCell>
                      <TableCell>{formatter(item, 'duration')}</TableCell>
                      <TableCell>{formatter(item, 'spentFuel')}</TableCell>
                      <TableCell>{formatter(item, 'driverName')}</TableCell>
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

export default TripsReportPage
