import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Grid, Typography, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import moment from 'moment';
import t from '../common/localization';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    margin: theme.spacing(0, -1),
    '& > .MuiGrid-item': {
      padding: theme.spacing(1.5, 1)
    }
  } 
}));

const ReportFilter = ({ children, handleSubmit, showOnly }) => {

  const classes = useStyles();

  const devices = useSelector(state => Object.values(state.devices.items));
  const [deviceId, setDeviceId] = useState();
  const [period, setPeriod] = useState('today');
  const [from, setFrom] = useState(moment().subtract(1, 'hour'));
  const [to, setTo] = useState(moment());

  const handleClick = (mail, json) => {
    let selectedFrom;
    let selectedTo;
    switch (period) {
      case 'today':
        selectedFrom = moment().startOf('day');
        selectedTo = moment().endOf('day');
        break;
      case 'yesterday':
        selectedFrom = moment().subtract(1, 'day').startOf('day');
        selectedTo = moment().subtract(1, 'day').endOf('day');
        break;
      case 'thisWeek':
        selectedFrom = moment().startOf('week');
        selectedTo = moment().endOf('week');
        break;
      case 'previousWeek':
        selectedFrom = moment().subtract(1, 'week').startOf('week');
        selectedTo = moment().subtract(1, 'week').endOf('week');
        break;
      case 'thisMonth':
        selectedFrom = moment().startOf('month');
        selectedTo = moment().endOf('month');
        break;
      case 'previousMonth':
        selectedFrom = moment().subtract(1, 'month').startOf('month');
        selectedTo = moment().subtract(1, 'month').endOf('month');
        break;
      default:
        selectedFrom = from;
        selectedTo = to;
        break;
    }

    const accept = json ? 'application/json' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    handleSubmit(
      deviceId,
      selectedFrom.toISOString(),
      selectedTo.toISOString(),
      mail,
      { Accept: accept }
    );
  }

  return (
    <Grid container spacing={2} className={classes.gridContainer}>
      <Grid item xs={12} sm={period === 'custom' ? 3 : 6}>
        <FormControl variant="filled" fullWidth>
          <InputLabel>{t('reportDevice')}</InputLabel>
          <Select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            {devices.map((device) => (
              <MenuItem value={device.id}>{device.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={period === 'custom' ? 3 : 6}>
        <FormControl variant="filled" fullWidth>
          <InputLabel>{t('reportPeriod')}</InputLabel>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="today">{t('reportToday')}</MenuItem>
            <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
            <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
            <MenuItem value="previousWeek">{t('reportPreviousWeek')}</MenuItem>
            <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
            <MenuItem value="previousMonth">{t('reportPreviousMonth')}</MenuItem>
            <MenuItem value="custom">{t('reportCustom')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {period === 'custom' && <Grid item xs={12} sm={3}>
        <TextField
          variant="filled"
          label={t('reportFrom')}
          type="datetime-local"
          value={from.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={e => setFrom(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
          fullWidth />
      </Grid>}
      {period === 'custom' && <Grid item xs={12} sm={3}>
        <TextField
          variant="filled"
          label={t('reportTo')}
          type="datetime-local"
          value={to.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={e => setTo(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
          fullWidth />
      </Grid>}
      {children}
      <Grid item xs={!showOnly ? 4 : 12} sm={!showOnly ? 2 : 6}>
        <Button 
          onClick={() => handleClick(false, true)}
          variant='outlined'
          color='secondary'
          fullWidth>
          {t('reportShow')}
        </Button>
      </Grid>
      {!showOnly && 
        <Grid item xs={4} sm={2}>
            <Button 
              onClick={() => handleClick(false, false)}
              variant='outlined'
              color='secondary'
              fullWidth>
              {t('reportExport')}
            </Button>
        </Grid>}
      {!showOnly && 
        <Grid item xs={4} sm={2}>
            <Button 
              onClick={() => handleClick(true, false)}
              variant='outlined'
              color='secondary'
              fullWidth>
              <Typography variant="button" noWrap>{t('reportEmail')}</Typography>
            </Button>
        </Grid>}
    </Grid>
  );
}

export default ReportFilter;
