import React, { useState } from 'react';
import { Box, Paper } from '@material-ui/core';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';
import { formatDate } from '../common/formatter';
import { getConverter } from '../common/converter';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportFilterForm = ({ setItems }) => {

  const speedUnit = useAttributePreference('speedUnit');

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {

      const data = await response.json();

      let formattedData = data.map(obj => {
        return Object.assign(
          obj, 
          {speed: Number(getConverter('speed')(obj.speed, speedUnit))},
          {fixTime: formatDate(obj.fixTime)}
        );
      });
      
      setItems(formattedData);
    }
  }

  return (
    <ReportFilter handleSubmit={handleSubmit} showOnly />
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
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems} type={type} setType={setType} showChartType>
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
