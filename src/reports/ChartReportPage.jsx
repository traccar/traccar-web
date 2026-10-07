import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, useTheme } from '@mui/material';
import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ReportFilter from './components/ReportFilter';
import ResizeHandle from './components/ResizeHandle';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapCamera from '../map/MapCamera';
import MapPositionMarkers from '../map/MapPositionMarkers';
import MapGeofence from '../map/MapGeofence';
import MapScale from '../map/MapScale';
import { formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatchCallback } from '../reactHelper';
import useAttributeUnits from '../common/util/useAttributeUnits';
import { formatAttributeNumber } from '../common/util/attributeUnits';
import { speedToKnots } from '../common/util/converter';
import useReportStyles from './common/useReportStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';

const ChartReportPage = () => {
  const { classes, cx } = useReportStyles();
  const theme = useTheme();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const units = useAttributeUnits();

  const [items, setItems] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [types, setTypes] = useState(['speed']);
  const [selectedTypes, setSelectedTypes] = useState(['speed']);
  const [timeType, setTimeType] = useState('fixTime');
  const [brushStartIndex, setBrushStartIndex] = useState(0);

  const selectedChartItem = items.find((item) => item.id === selectedItem?.id);

  const onMapPointClick = useCallback(
    (positionId) => setSelectedItem(positions.find((position) => position.id === positionId)),
    [positions],
  );

  const onChartClick = ({ activeTooltipIndex, isTooltipActive }) => {
    if (isTooltipActive && activeTooltipIndex != null) {
      const position = positions[brushStartIndex + Number(activeTooltipIndex)];
      if (position) {
        setSelectedItem((previous) => (previous?.id === position.id ? null : position));
      }
    }
  };

  const values = items
    .map((it) => selectedTypes.map((type) => it[type]).filter((value) => value != null))
    .flat();
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 100;
  const valueRange = maxValue - minValue;

  const onShow = useCatchCallback(
    async ({ deviceIds, from, to }) => {
      const query = new URLSearchParams({ from, to });
      deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
      const response = await fetchOrThrow(`/api/reports/route?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      const positions = await response.json();
      const keySet = new Set();
      const keyList = [];
      const formattedPositions = positions.map((position) => {
        const data = { ...position, ...position.attributes };
        const formatted = { id: position.id };
        formatted.fixTime = dayjs(position.fixTime).valueOf();
        formatted.deviceTime = dayjs(position.deviceTime).valueOf();
        formatted.serverTime = dayjs(position.serverTime).valueOf();
        Object.keys(data)
          .filter((key) => !['id', 'deviceId'].includes(key))
          .forEach((key) => {
            const value = data[key];
            if (typeof value === 'number') {
              keySet.add(key);
              const definition = positionAttributes[key] || {};
              const rawValue = key === 'obdSpeed' ? speedToKnots(value, 'kmh') : value;
              const converted = formatAttributeNumber(rawValue, definition.dataType, units);
              formatted[key] = definition.dataType === 'hours' ? converted.toFixed(2) : converted;
            }
          });
        return formatted;
      });
      Object.keys(positionAttributes).forEach((key) => {
        if (keySet.has(key)) {
          keyList.push(key);
          keySet.delete(key);
        }
      });
      setTypes([...keyList, ...keySet]);
      setItems(formattedPositions);
      setPositions(positions);
      setSelectedItem(null);
      setBrushStartIndex(0);
    },
    [positionAttributes, units],
  );

  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.text.secondary,
  ];

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <div className={classes.container}>
        {selectedItem && (
          <>
            <div className={classes.containerMap}>
              <MapView>
                <MapGeofence />
                <MapRoutePath positions={positions} />
                <MapRoutePoints positions={positions} onClick={onMapPointClick} />
                <MapPositionMarkers positions={[selectedItem]} titleField="fixTime" />
                <MapCamera positions={positions} />
              </MapView>
              <MapScale />
            </div>
            <ResizeHandle />
          </>
        )}
        <div className={cx(classes.container, classes.containerMain)}>
          <ReportFilter onShow={onShow} onExport={() => {}} deviceType="single" formats={[]}>
            <div className={classes.filterItem}>
              <FormControl fullWidth>
                <InputLabel>{t('reportChartType')}</InputLabel>
                <Select
                  label={t('reportChartType')}
                  value={selectedTypes}
                  onChange={(e) => setSelectedTypes(e.target.value)}
                  multiple
                  disabled={!items.length}
                >
                  {types.map((key) => (
                    <MenuItem key={key} value={key}>
                      {positionAttributes[key]?.name || key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.filterItem}>
              <FormControl fullWidth>
                <InputLabel>{t('reportTimeType')}</InputLabel>
                <Select
                  label={t('reportTimeType')}
                  value={timeType}
                  onChange={(e) => setTimeType(e.target.value)}
                  disabled={!items.length}
                >
                  <MenuItem value="fixTime">{t('positionFixTime')}</MenuItem>
                  <MenuItem value="deviceTime">{t('positionDeviceTime')}</MenuItem>
                  <MenuItem value="serverTime">{t('positionServerTime')}</MenuItem>
                </Select>
              </FormControl>
            </div>
          </ReportFilter>
          {items.length > 0 && (
            <div className={classes.chart}>
              <ResponsiveContainer>
                <LineChart
                  data={items}
                  onClick={onChartClick}
                  margin={{
                    top: 10,
                    right: 40,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <XAxis
                    stroke={theme.palette.text.primary}
                    dataKey={timeType}
                    type="number"
                    tickFormatter={(value) => formatTime(value, 'time')}
                    domain={['dataMin', 'dataMax']}
                    scale="time"
                  />
                  <YAxis
                    stroke={theme.palette.text.primary}
                    type="number"
                    tickFormatter={(value) => parseFloat(value.toFixed(2))}
                    domain={[minValue - valueRange / 5, maxValue + valueRange / 5]}
                  />
                  <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                  {selectedChartItem && (
                    <ReferenceLine
                      x={selectedChartItem[timeType]}
                      stroke={theme.palette.text.primary}
                      strokeDasharray="3 3"
                    />
                  )}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                    }}
                    formatter={(value, key) => [value, positionAttributes[key]?.name || key]}
                    labelFormatter={(value) => formatTime(value, 'seconds')}
                  />
                  <Brush
                    dataKey={timeType}
                    height={30}
                    onChange={({ startIndex }) => setBrushStartIndex(startIndex)}
                    stroke={theme.palette.primary.main}
                    tickFormatter={() => ''}
                  />
                  {selectedTypes.map((type, index) => (
                    <Line
                      key={type}
                      type="monotone"
                      dataKey={type}
                      stroke={colorPalette[index % colorPalette.length]}
                      dot={false}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ChartReportPage;
