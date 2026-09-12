import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import SplitButton from '../../common/components/SplitButton';
import SelectField from '../../common/components/SelectField';
import { useRestriction } from '../../common/util/permissions';
import { deviceEquality } from '../../common/util/deviceEquality';

const getPeriodRange = (period) => {
  const now = dayjs();
  if (period === 'custom') {
    return [now.subtract(1, 'hour').toISOString(), now.toISOString()];
  }
  return [now.startOf(period).toISOString(), now.endOf(period).toISOString()];
};

export const updateReportParams = (searchParams, setSearchParams, key, values) => {
  const newParams = new URLSearchParams(searchParams);
  newParams.delete(key);
  newParams.delete('from');
  newParams.delete('to');
  values.forEach((value) => newParams.append(key, value));
  setSearchParams(newParams, { replace: true });
};

const ReportFilter = ({ children, onShow, onExport, onSchedule, deviceType, loading, formats }) => {
  const { classes } = useReportStyles();
  const t = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const readonly = useRestriction('readonly');

  const devices = useSelector((state) => state.devices.items, deviceEquality(['id', 'name']));
  const groups = useSelector((state) => state.groups.items);
  const deviceList = useMemo(
    () => [
      { id: 'all', name: t('notificationAlways') },
      ...Object.values(devices).sort((a, b) => a.name.localeCompare(b.name)),
    ],
    [devices, t],
  );
  const groupList = useMemo(
    () => Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)),
    [groups],
  );

  const deviceIds = useMemo(
    () => searchParams.getAll('deviceId').map((it) => (it === 'all' ? it : Number(it))),
    [searchParams],
  );
  const groupIds = useMemo(() => searchParams.getAll('groupId').map(Number), [searchParams]);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [period, setPeriod] = useState(searchParams.get('period') || 'day');
  const [range, setRange] = useState(() => (from && to ? [from, to] : getPeriodRange(period)));
  const [selectedOption, setSelectedOption] = useState('json');

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const selectedFrom = dayjs(range[0]);
  const selectedTo = dayjs(range[1]);
  const validRange =
    selectedFrom.isValid() && selectedTo.isValid() && selectedTo.isAfter(selectedFrom);

  const evaluateDisabled = () => {
    if (deviceType === 'single' && !deviceIds.length) {
      return true;
    }
    if (deviceType === 'multiple' && !deviceIds.length && !groupIds.length) {
      return true;
    }
    if (selectedOption === 'schedule' && (!description || !calendarId)) {
      return true;
    }
    return loading || (selectedOption !== 'schedule' && !validRange);
  };
  const disabled = evaluateDisabled();
  const loaded = from && to && !loading;

  const evaluateOptions = () => {
    const result = {
      json: t('reportShow'),
    };
    if (onExport && loaded) {
      formats.forEach((format) => {
        result[format] = `${t('reportExport')} (${format.toUpperCase()})`;
      });
      result.print = t('reportPrint');
    }
    if (onSchedule && !readonly) {
      result.schedule = t('reportSchedule');
    }
    return result;
  };
  const options = evaluateOptions();

  useEffect(() => {
    if (from && to) {
      onShow({ deviceIds: deviceIds.filter((it) => it !== 'all'), groupIds, from, to });
    }
  }, [deviceIds, groupIds, from, to, onShow]);

  const dateFormat = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: period === 'month' ? 'long' : 'short',
    day: period === 'month' ? undefined : 'numeric',
  });
  const periodLabel =
    period === 'custom' || !validRange
      ? t('reportCustom')
      : dateFormat.formatRange(selectedFrom.toDate(), selectedTo.toDate());

  const showReport = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('period', period);
    newParams.set('from', selectedFrom.toISOString());
    newParams.set('to', selectedTo.toISOString());
    setSearchParams(newParams, { replace: true });
  };

  const shiftPeriod = (direction) => {
    const offset = selectedTo.diff(selectedFrom) * direction;
    const start =
      period === 'custom'
        ? selectedFrom.add(offset, 'millisecond')
        : selectedFrom.add(direction, period).startOf(period);
    const end = period === 'custom' ? selectedTo.add(offset, 'millisecond') : start.endOf(period);
    setRange([start.toISOString(), end.toISOString()]);
  };

  const onSelected = (type) => {
    switch (type) {
      case 'xlsx':
      case 'csv':
      case 'gpx':
      case 'kml':
      case 'kmz':
        onExport({
          deviceIds: deviceIds.filter((it) => it !== 'all'),
          groupIds,
          from,
          to,
          format: type,
        });
        break;
      case 'print':
        window.print();
        break;
      default:
        setSelectedOption(type);
        break;
    }
  };

  const onClick = (type) => {
    switch (type) {
      case 'schedule':
        onSchedule(
          deviceIds.filter((it) => it !== 'all'),
          groupIds,
          {
            description,
            calendarId,
            attributes: {},
          },
        );
        break;
      case 'json':
      default:
        showReport();
        break;
    }
  };

  return (
    <div className={classes.filter}>
      {deviceType !== 'none' && (
        <div className={classes.filterItem}>
          <SelectField
            label={t(deviceType === 'multiple' ? 'deviceTitle' : 'reportDevice')}
            data={
              deviceType === 'multiple' ? deviceList : deviceList.filter((it) => it.id !== 'all')
            }
            value={deviceType === 'multiple' ? deviceIds : deviceIds.find(() => true)}
            allValue="all"
            onChange={(e) => {
              const values =
                deviceType === 'multiple' ? e.target.value : [e.target.value].filter((id) => id);
              updateReportParams(searchParams, setSearchParams, 'deviceId', values);
            }}
            multiple={deviceType === 'multiple'}
            singleLine={deviceType === 'multiple'}
            fullWidth
          />
        </div>
      )}
      {deviceType === 'multiple' && (
        <div className={classes.filterItem}>
          <SelectField
            label={t('settingsGroups')}
            data={groupList}
            value={groupIds}
            onChange={(e) => {
              const values = e.target.value;
              updateReportParams(searchParams, setSearchParams, 'groupId', values);
            }}
            multiple
            singleLine
            fullWidth
          />
        </div>
      )}
      {selectedOption !== 'schedule' ? (
        <>
          <div className={classes.filterItem} style={{ flexBasis: 220 }}>
            <FormControl fullWidth>
              <InputLabel shrink>{t('reportPeriod')}</InputLabel>
              <Select
                label={t('reportPeriod')}
                value=""
                displayEmpty
                renderValue={() => periodLabel}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  if (e.target.value !== 'custom') {
                    setRange(getPeriodRange(e.target.value));
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton
                      edge="start"
                      size="small"
                      disabled={loading || !validRange}
                      onClick={() => shiftPeriod(-1)}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={loading || !validRange}
                      onClick={() => shiftPeriod(1)}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </InputAdornment>
                }
              >
                <MenuItem value="day">{t('reportToday')}</MenuItem>
                <MenuItem value="week">{t('reportThisWeek')}</MenuItem>
                <MenuItem value="month">{t('reportThisMonth')}</MenuItem>
                <MenuItem value="custom">{t('reportCustom')}</MenuItem>
              </Select>
            </FormControl>
          </div>
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportFrom')}
                type="datetime-local"
                value={range[0] ? selectedFrom.locale('en').format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setRange([e.target.value, range[1]])}
                fullWidth
              />
            </div>
          )}
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportTo')}
                type="datetime-local"
                value={range[1] ? selectedTo.locale('en').format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setRange([range[0], e.target.value])}
                fullWidth
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
              value={calendarId}
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
        {Object.keys(options).length === 1 ? (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={onClick}
          >
            <Typography variant="button" noWrap>
              {t(loading ? 'sharedLoading' : 'reportShow')}
            </Typography>
          </Button>
        ) : (
          <SplitButton
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={onClick}
            selected={selectedOption}
            setSelected={onSelected}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
