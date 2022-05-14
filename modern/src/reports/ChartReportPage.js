import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import ReportFilter, { useFilterStyles } from './components/ReportFilter';
import Graph from './components/Graph';
import { useAttributePreference } from '../common/util/preferences';
import { formatDate } from '../common/util/formatter';
import { speedFromKnots } from '../common/util/converter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';

const ChartReportPage = () => {
  const classes = useFilterStyles();
  const t = useTranslation();

  const speedUnit = useAttributePreference('speedUnit');

  const [items, setItems] = useState([]);
  const [type, setType] = useState('speed');

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({
      deviceId, from, to, mail,
    });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {
      const positions = await response.json();
      const formattedPositions = positions.map((position) => ({
        speed: Number(speedFromKnots(position.speed, speedUnit)),
        altitude: position.altitude,
        accuracy: position.accuracy,
        fixTime: formatDate(position.fixTime),
      }));
      setItems(formattedPositions);
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly>
        <div className={classes.item}>
          <FormControl variant="filled" fullWidth>
            <InputLabel>{t('reportChartType')}</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="speed">{t('positionSpeed')}</MenuItem>
              <MenuItem value="accuracy">{t('positionAccuracy')}</MenuItem>
              <MenuItem value="altitude">{t('positionAltitude')}</MenuItem>
            </Select>
          </FormControl>
        </div>
      </ReportFilter>
      <Graph items={items} type={type} />
    </PageLayout>
  );
};

export default ChartReportPage;
