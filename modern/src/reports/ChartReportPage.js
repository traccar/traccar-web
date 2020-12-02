import React, { useState } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';
import { formatDate } from '../common/formatter';
import { speedConverter } from '../common/converter';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import t from '../common/localization';

const ReportFilterForm = ({ setItems, type, setType }) => {

  const speedUnit = useAttributePreference('speedUnit');

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {

      const positions = await response.json();

      let formattedPositions = positions.map(position => {
        return {
          speed: Number(speedConverter(position.speed, speedUnit)),
          altitude: position.altitude,
          accuracy: position.accuracy,
          fixTime: formatDate(position.fixTime)
        }
      });
      
      setItems(formattedPositions);
    }
  }

  return (
    <React.Fragment>
      <ReportFilter handleSubmit={handleSubmit} showOnly />
      <FormControl variant="filled" margin="normal" fullWidth>
      <InputLabel>{t('reportChartType')}</InputLabel>
      <Select value={type} onChange={e => setType(e.target.value)}>
        <MenuItem value="speed">{t('positionSpeed')}</MenuItem>
        <MenuItem value="accuracy">{t('positionAccuracy')}</MenuItem>
        <MenuItem value="altitude">{t('positionAltitude')}</MenuItem>
      </Select>
      </FormControl>
    </React.Fragment>
  )
};

const CustomizedAxisTick = ({ x, y, payload }) =>{
  const parts = payload.value.split(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{parts[0]}</text>
      <text x={0} y={16} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{parts[1]}</text>
    </g>
  );
}

const ChartReportPage = () => {

  const [items, setItems] = useState([]);
  const [type, setType] = useState('speed');

  return (
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems} type={type} setType={setType}>
      <Paper>
        <Box height={400}>
          <ResponsiveContainer>
            <LineChart data={items}>
              <XAxis dataKey="fixTime" tick={<CustomizedAxisTick/>} height={60} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="natural" dataKey={type} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </ReportLayoutPage>
  );
};

export default ChartReportPage;
