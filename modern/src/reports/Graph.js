import React from 'react';
import { Box, Paper } from '@material-ui/core';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomizedAxisTick = ({ x, y, payload }) =>{
  const parts = payload.value.split(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{parts[0]}</text>
      <text x={0} y={16} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{parts[1]}</text>
    </g>
  );
}

const Graph = ({ type, items }) => {

  return (
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
  );
}

export default Graph;
