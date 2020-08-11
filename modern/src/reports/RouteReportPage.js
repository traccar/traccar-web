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

const RouteReportPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);

  const handleShow = (deviceId, selectedFrom, selectedTo) => {

    const query = new URLSearchParams({
      deviceId,
      from: selectedFrom.toISOString(),
      to: selectedTo.toISOString(),
    });
    fetch(`/api/reports/route?${query.toString()}`, { headers: { 'Accept': 'application/json' } })
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
                    <TableCell>{t('positionFixTime')}</TableCell>
                    <TableCell>{t('positionLatitude')}</TableCell>
                    <TableCell>{t('positionLongitude')}</TableCell>
                    <TableCell>{t('positionSpeed')}</TableCell>
                    <TableCell>{t('positionAddress')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatter(item, 'fixTime')}</TableCell>
                      <TableCell>{formatter(item, 'latitude')}</TableCell>
                      <TableCell>{formatter(item, 'longitude')}</TableCell>
                      <TableCell>{formatter(item, 'speed')}</TableCell>
                      <TableCell>{formatter(item, 'address')}</TableCell>
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

export default RouteReportPage;
