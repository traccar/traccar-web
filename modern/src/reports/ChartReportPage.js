import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, makeStyles,
} from '@material-ui/core';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import ReportFilter, { useFilterStyles } from './components/ReportFilter';
import { formatDate } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';

const useStyles = makeStyles(() => ({
  chart: {
    flexGrow: 1,
    overflow: 'hidden',
  },
}));

const ChartReportPage = () => {
  const classes = useStyles();
  const filterClasses = useFilterStyles();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [items, setItems] = useState([]);
  const [type, setType] = useState('speed');

  const dataRange = (() => {
    const values = items.map((it) => it[type]);
    const result = Math.max(...values) - Math.min(...values);
    return result;
  })();

  const handleSubmit = useCatch(async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({
      deviceId, from, to, mail,
    });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {
      const positions = await response.json();
      const formattedPositions = positions.map((position) => ({
        ...position,
        ...position.attributes,
        fixTime: formatDate(position.fixTime, 'HH:mm:ss'),
      }));
      setItems(formattedPositions);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly>
        <div className={filterClasses.item}>
          <FormControl variant="filled" fullWidth>
            <InputLabel>{t('reportChartType')}</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {Object.keys(positionAttributes).filter((key) => positionAttributes[key].type === 'number').map((key) => (
                <MenuItem key={key} value={key}>{positionAttributes[key].name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </ReportFilter>
      {items.length > 0 && (
        <div className={classes.chart}>
          <ResponsiveContainer>
            <LineChart
              data={items}
              margin={{
                top: 10, right: 40, left: 0, bottom: 10,
              }}
            >
              <XAxis dataKey="fixTime" />
              <YAxis type="number" domain={[`dataMin - ${dataRange / 5}`, `dataMax + ${dataRange / 5}`]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value, name) => [value, positionAttributes[name].name]} />
              <Line type="natural" dataKey={type} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageLayout>
  );
};

export default ChartReportPage;
