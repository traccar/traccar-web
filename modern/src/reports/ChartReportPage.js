import React, { useState } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ReportLayoutPage from './ReportLayoutPage';
import ReportFilter from './ReportFilter';
import Graph from './Graph';
import { useAttributePreference } from '../common/preferences';
import { formatDate } from '../common/formatter';
import { speedFromKnots } from '../common/converter';
import t from '../common/localization';

const Filter = ({ children, setItems }) => {

  const speedUnit = useAttributePreference('speedUnit');

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {
      const positions = await response.json();
      let formattedPositions = positions.map(position => {
        return {
          speed: Number(speedFromKnots(position.speed, speedUnit)),
          altitude: position.altitude,
          accuracy: position.accuracy,
          fixTime: formatDate(position.fixTime)
        }
      });
      setItems(formattedPositions);
    }
  }
  return (
    <>
      <ReportFilter handleSubmit={handleSubmit} showOnly />
      {children}
    </>
  )
}

const ChartType = ({ type, setType }) => {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl variant="filled" margin="normal" fullWidth>
          <InputLabel>{t('reportChartType')}</InputLabel>
          <Select value={type} onChange={e => setType(e.target.value)}>
            <MenuItem value="speed">{t('positionSpeed')}</MenuItem>
            <MenuItem value="accuracy">{t('positionAccuracy')}</MenuItem>
            <MenuItem value="altitude">{t('positionAltitude')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}


const ChartReportPage = () => {
  
  const [items, setItems] = useState([]);
  const [type, setType] = useState('speed');

  return (
    <ReportLayoutPage filter={ 
      <Filter setItems={setItems}>
        <ChartType type={type} setType={setType} />
      </Filter>
    }>
      <Graph items={items} type={type} />
    </ReportLayoutPage>
  )
}

export default ChartReportPage;
