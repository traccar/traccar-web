import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import { devicesActions, reportsActions } from '../../store';
import SplitButton from '../../common/components/SplitButton';
import SelectField from '../../common/components/SelectField';
import { useRestriction } from '../../common/util/permissions';

const ReportFilter = ({ children, handleSubmit, handleSchedule, showOnly, ignoreDevice, multiDevice, includeGroups }) => {
  const classes = useReportStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);

  const deviceId = useSelector((state) => state.devices.selectedId);
  const deviceIds = useSelector((state) => state.devices.selectedIds);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const period = useSelector((state) => state.reports.period);
  const from = useSelector((state) => state.reports.from);
  const to = useSelector((state) => state.reports.to);
  const [button, setButton] = useState('json');

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const scheduleDisabled = button === 'schedule' && (!description || !calendarId);
  const disabled = (!ignoreDevice && !deviceId && !deviceIds.length && !groupIds.length) || scheduleDisabled;

  // Step 1: Add state to keep track of the selected "from" date
  const [selectedFrom, setSelectedFrom] = useState(moment().startOf('day'));

  // Step 2: Handle changes in the "from" date and adjust the "to" date accordingly
  const handleFromDateChange = (value) => {
    const newFromDate = moment(value, moment.HTML5_FMT.DATETIME_LOCAL);
    setSelectedFrom(newFromDate);
    // Automatically adjust the "to" date to be one month beyond the new "from" date
    const newToDate = newFromDate.clone().add(1, 'month');
    dispatch(reportsActions.updateFrom(value)); // Update the Redux state with the new "from" value
    dispatch(reportsActions.updateTo(newToDate.format(moment.HTML5_FMT.DATETIME_LOCAL))); // Update the Redux state with the new "to" value
  };

  // Step 3: Update the handleClick function to set the correct "from" and "to" values before submitting the form
  const handleClick = (type) => {
    let selectedFromDate; // Declare selectedFromDate variable here
    let selectedToDate; // Declare selectedToDate variable here
    let diffInMonths;
    let adjustedToDate;
    if (type === 'schedule') {
      handleSchedule(deviceIds, groupIds, {
        description,
        calendarId,
        attributes: {},
      });
    } else {
      switch (period) {
        case 'today':
          selectedFromDate = moment().startOf('day');
          selectedToDate = moment().endOf('day');
          break;
        case 'yesterday':
          selectedFromDate = moment().subtract(1, 'day').startOf('day');
          selectedToDate = moment().subtract(1, 'day').endOf('day');
          break;
        case 'thisWeek':
          selectedFromDate = moment().startOf('week');
          selectedToDate = moment().endOf('week');
          break;
        case 'previousWeek':
          selectedFromDate = moment().subtract(1, 'week').startOf('week');
          selectedToDate = moment().subtract(1, 'week').endOf('week');
          break;
        case 'thisMonth':
          selectedFromDate = moment().startOf('month');
          selectedToDate = moment().endOf('month');
          break;
        case 'previousMonth':
          selectedFromDate = moment().subtract(1, 'month').startOf('month');
          selectedToDate = moment().subtract(1, 'month').endOf('month');
          break;
        case 'custom':
          // In case of 'custom', use the value directly from the 'TextField' as the "from" date
          selectedFromDate = moment(from, moment.HTML5_FMT.DATETIME_LOCAL);
          // If "to" date is beyond one month from "from" date, adjust it to be one month beyond the "from" date
          selectedToDate = moment(to, moment.HTML5_FMT.DATETIME_LOCAL);
          diffInMonths = selectedToDate.diff(selectedFromDate, 'months', true);
          adjustedToDate = diffInMonths > 1 ? selectedFromDate.clone().add(1, 'month') : selectedToDate;

          // Update the Redux state and local state with the new "from" value
          dispatch(reportsActions.updateFrom(selectedFromDate.toISOString()));
          setSelectedFrom(selectedFromDate);

          // Update the Redux state with the new "to" value
          dispatch(reportsActions.updateTo(adjustedToDate.toISOString()));
          break;
        default:
          break;
      }

      handleSubmit({
        deviceId,
        deviceIds,
        groupIds,
        from: selectedFromDate ? selectedFromDate.toISOString() : selectedFrom.toISOString(), // Use the new selectedFromDate if available, otherwise use the previous selectedFrom
        to: selectedToDate.toISOString(),
        calendarId,
        type,
      });
    }
  };

  return (
    <div className={classes.filter}>
      {!ignoreDevice && (
        <div className={classes.filterItem}>
          <FormControl fullWidth>
            <InputLabel>{t(multiDevice ? 'deviceTitle' : 'reportDevice')}</InputLabel>
            <Select
              label={t(multiDevice ? 'deviceTitle' : 'reportDevice')}
              value={multiDevice ? deviceIds : deviceId || ''}
              onChange={(e) => dispatch(multiDevice ? devicesActions.selectIds(e.target.value) : devicesActions.selectId(e.target.value))}
              multiple={multiDevice}
            >
              {Object.values(devices).sort((a, b) => a.name.localeCompare(b.name)).map((device) => (
                <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      {includeGroups && (
        <div className={classes.filterItem}>
          <FormControl fullWidth>
            <InputLabel>{t('settingsGroups')}</InputLabel>
            <Select
              label={t('settingsGroups')}
              value={groupIds}
              onChange={(e) => dispatch(reportsActions.updateGroupIds(e.target.value))}
              multiple
            >
              {Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      {button !== 'schedule' ? (
        <>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportPeriod')}</InputLabel>
              <Select label={t('reportPeriod')} value={period} onChange={(e) => dispatch(reportsActions.updatePeriod(e.target.value))}>
                <MenuItem value="today">{t('reportToday')}</MenuItem>
                <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
                <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
                <MenuItem value="previousWeek">{t('reportPreviousWeek')}</MenuItem>
                <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
                <MenuItem value="previousMonth">{t('reportPreviousMonth')}</MenuItem>
                <MenuItem value="custom">{t('reportCustom')}</MenuItem>
              </Select>
            </FormControl>
          </div>
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportFrom')}
                type="datetime-local"
                value={from}
                onChange={(e) => handleFromDateChange(e.target.value)} // Use the new function to handle "from" date changes
                fullWidth
              />
            </div>
          )}
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportTo')}
                type="datetime-local"
                value={to}
                onChange={(e) => dispatch(reportsActions.updateTo(e.target.value))}
                fullWidth
                inputProps={{
                  max: moment(selectedFrom).add(1, 'month').format(moment.HTML5_FMT.DATETIME_LOCAL), // Use the adjusted "to" date value
                }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={classes.filterItem}>
            <TextField
              value={description || ''}
              onChange={(event) => setDescription(event.target.value)}
              label={t('sharedDescription')}
              fullWidth
            />
          </div>
          <div className={classes.filterItem}>
            <SelectField
              value={calendarId || 0}
              onChange={(event) => setCalendarId(Number(event.target.value))}
              endpoint="/api/calendars"
              label={t('sharedCalendar')}
              fullWidth
            />
          </div>
        </>
      )}
      {children}
      <div className={classes.filterItem}>
        {showOnly ? (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={() => handleClick('json')}
          >
            <Typography variant="button" noWrap>{t('reportShow')}</Typography>
          </Button>
        ) : (
          <SplitButton
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={handleClick}
            selected={button}
            setSelected={(value) => setButton(value)}
            options={readonly ? {
              json: t('reportShow'),
              export: t('reportExport'),
              mail: t('reportEmail'),
            } : {
              json: t('reportShow'),
              export: t('reportExport'),
              mail: t('reportEmail'),
              schedule: t('reportSchedule'),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
