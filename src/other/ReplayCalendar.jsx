import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import { useTranslation } from '../common/components/LocalizationProvider';
import { distanceFromMeters, distanceUnitString } from '../common/util/converter';
import { useAttributePreference } from '../common/util/preferences';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { getCacheItem, setCacheItem } from '../common/util/cacheUtils';

const CELL_SIZE = 56;

const useStyles = makeStyles()((theme) => ({
  calendarPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    userSelect: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
  },
  monthTitle: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  weekdayRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
  weekdayLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.5, 0),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 1,
  },
  dayCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: CELL_SIZE,
    minWidth: 0,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    padding: theme.spacing(0.25, 0),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  today: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  todayDimmed: {
    fontWeight: 600,
    textDecoration: 'underline',
    textDecorationColor: theme.palette.primary.main,
    textUnderlineOffset: 2,
    opacity: 0.55,
  },
  selected: {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
    borderRadius: '50%',
    fontWeight: 700,
  },
  dayNumber: {
    fontSize: '0.85rem',
    lineHeight: 1.2,
  },
  dayDistance: {
    fontSize: '0.6rem',
    lineHeight: 1.1,
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    padding: '0 2px',
  },
  todayDistance: {
    color: 'inherit',
    opacity: 0.85,
  },
  futureDay: {
    opacity: 0.35,
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  emptyCell: {
    height: CELL_SIZE,
  },
  loadingOverlay: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1, 0, 0, 0),
  },
}));

const cacheKey = (deviceId, year, month) => `summary_${deviceId}_${year}-${String(month).padStart(2, '0')}`;

const ReplayCalendar = ({ selectedDeviceId, selectedDate, onDaySelect }) => {
  const t = useTranslation();
  const { classes, cx } = useStyles();
  const distanceUnit = useAttributePreference('distanceUnit');

  const today = useMemo(() => dayjs(), []);
  const [viewDate, setViewDate] = useState(today);
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(false);

  const year = viewDate.year();
  const month = viewDate.month(); // 0-based

  // Helper: get the last day to fetch (today for current month, end of month for past months)
  const getFetchRange = useCallback(() => {
    const startOfMonth = viewDate.startOf('month');
    const endOfFetch = viewDate.isSame(today, 'month')
      ? today.endOf('day')
      : viewDate.endOf('month').endOf('day');
    return { from: startOfMonth, to: endOfFetch };
  }, [viewDate, today]);

  // Fetch monthly summary data
  useEffect(() => {
    if (!selectedDeviceId) return;

    const key = cacheKey(selectedDeviceId, year, month + 1);
    const cached = getCacheItem(key);

    if (cached) {
      // Check if cache was fetched before today but we're in the current month
      // (meaning today's data might be missing)
      const cachedDate = dayjs(cached.timestamp);
      if (
        viewDate.isSame(today, 'month') &&
        !cachedDate.isSame(today, 'day') &&
        cachedDate.isBefore(today, 'day')
      ) {
        // Cache is stale for current month - refetch
        fetchMonthlyData();
      } else {
        setDailyData(buildDailyMap(cached.data));
        return;
      }
    } else {
      fetchMonthlyData();
    }

    async function fetchMonthlyData() {
      const { from, to } = getFetchRange();
      setLoading(true);
      try {
        const query = new URLSearchParams({
          deviceId: selectedDeviceId,
          from: from.toISOString(),
          to: to.toISOString(),
          daily: true,
        });
        const response = await fetchOrThrow(`/api/reports/summary?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setCacheItem(key, data);
        setDailyData(buildDailyMap(data));
      } catch (e) {
        // If no data, just show empty calendar
        setDailyData({});
      } finally {
        setLoading(false);
      }
    }
  }, [selectedDeviceId, year, month, viewDate, today, getFetchRange]);

  const buildDailyMap = (data) => {
    const map = {};
    data.forEach((item) => {
      const dateKey = dayjs(item.startTime).format('YYYY-MM-DD');
      // If multiple entries for same day (e.g. multiple devices), keep this device's
      if (!map[dateKey] || item.deviceId === selectedDeviceId) {
        map[dateKey] = item.distance;
      }
    });
    return map;
  };

  const firstDayOfMonth = viewDate.startOf('month');
  const daysInMonth = viewDate.daysInMonth();
  const startDayOfWeek = firstDayOfMonth.day(); // 0=Sunday
  const todayFormatted = today.format('YYYY-MM-DD');

  const handlePrevMonth = () => {
    setViewDate((prev) => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    const next = viewDate.add(1, 'month');
    if (next.isAfter(today, 'month')) return;
    setViewDate((prev) => {
      const n = prev.add(1, 'month');
      if (n.isAfter(today, 'month')) return prev;
      return n;
    });
  };

  const handleDayClick = (day) => {
    const clickedDate = viewDate.date(day);
    if (clickedDate.isAfter(today, 'day')) return;
    const dayStart = clickedDate.startOf('day').toISOString();
    const dayEnd = clickedDate.endOf('day').toISOString();
    onDaySelect(selectedDeviceId, dayStart, dayEnd);
  };

  const formatDist = (meters) => {
    if (meters === undefined || meters === null) return '';
    const value = Math.round(distanceFromMeters(meters, distanceUnit));
    return `${value} ${distanceUnitString(distanceUnit, t)}`;
  };

  const weekdays = Array.from({ length: 7 }, (_, i) => dayjs().day(i).format('dd'));

  const cells = [];

  // Empty cells before the first day
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className={classes.emptyCell} />);
  }

  // Day cells (skip future dates)
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = viewDate.date(day);
    if (dateObj.isAfter(today, 'day')) break;
    const dateFormatted = dateObj.format('YYYY-MM-DD');
    const isToday = dateFormatted === todayFormatted;
    const isSelected = selectedDate && dateFormatted === dayjs(selectedDate).format('YYYY-MM-DD');
    const distance = dailyData[dateFormatted];
    const hasDistance = distance !== undefined && distance !== null;

    const hasSelected = !!selectedDate;
    const cellClasses = cx(classes.dayCell, {
      [classes.today]: isToday && (!hasSelected || isSelected),
      [classes.todayDimmed]: isToday && hasSelected && !isSelected,
      [classes.selected]: isSelected && !isToday,
    });

    cells.push(
      <div
        key={`day-${day}`}
        className={cellClasses}
        onClick={() => handleDayClick(day)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleDayClick(day);
        }}
      >
        <span className={classes.dayNumber}>{day}</span>
        {hasDistance && (
          <span className={cx(classes.dayDistance, { [classes.todayDistance]: isToday && !isSelected })}>
            {formatDist(distance)}
          </span>
        )}
      </div>,
    );
  }

  return (
    <div className={classes.calendarPanel}>
      <div className={classes.header}>
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography className={classes.monthTitle}>
          {viewDate.format('YYYY MMMM')}
        </Typography>
        <IconButton
          size="small"
          onClick={handleNextMonth}
          disabled={viewDate.isSame(today, 'month')}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div className={classes.weekdayRow}>
        {weekdays.map((wd) => (
          <Typography key={wd} className={classes.weekdayLabel}>
            {wd}
          </Typography>
        ))}
      </div>
      <div className={classes.grid}>
        {cells}
      </div>
      {loading && (
        <div className={classes.loadingOverlay}>
          <CircularProgress size={20} />
        </div>
      )}
      {!loading && Object.keys(dailyData).length === 0 && (
        <div className={classes.footer}>
          <Typography variant="caption" color="textSecondary">
            {t('sharedNoData')}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ReplayCalendar;
