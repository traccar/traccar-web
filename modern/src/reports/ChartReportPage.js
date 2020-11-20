import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import ChartType from './ChartType';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 160,
  },
}));

const ReportFilterForm = ({ setItems }) => {

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType) {
        if (contentType === 'application/json') {
          setItems(await response.json());
        } else {
          window.location.assign(window.URL.createObjectURL(await response.blob()));
        }
      }
    }
  };

  return <ReportFilter handleSubmit={handleSubmit} showOnly />;
};

const CustomizedAxisTick = ({ x, y, stroke, payload }) =>{
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
    </g>
  );
}

const ChartReportPage = () => {

  const [items, setItems] = useState([]);
  const [type, setType] = useState('speed');

  return (
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems} >
      <Card>
        <CardHeader action={<ChartType type={type} setType={setType}/>} />
        <Divider />
        <CardContent>
          <Box height={400} position="relative">
            <ResponsiveContainer>
              <LineChart data={items}>
                <XAxis dataKey="fixTime" interval="preserveStartEnd" height={60} tick={<CustomizedAxisTick/>} />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={type} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            </Box>
        </CardContent>
      </Card>
    </ReportLayoutPage>
  );
}

export default ChartReportPage;
