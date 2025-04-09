import { Box, Typography } from '@mui/material';
import React, { useEffect, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

const CatchPerVesselChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const tempData = [];
    if (props.catchesList?.length) {
      props.catchesList?.map((item) => {
        const tempCatches = Object.keys(item.catchDetails).map((ele) => {
          return {
            [item.catchDetails[ele].species_name]: item.catchDetails[ele].quantity,
          };
        });
        tempData.push({
          name: item.vesselName,
          ...Object.assign({}, ...tempCatches),
        });
        setData(tempData);
      });
    } else {
      setData([]);
    }
  }, [props.catchesList]);

  const getAllKeys = (data) => {
    const keys = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'name') {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  const allKeys = getAllKeys(data);

  const getBarColor = (index) => {
    const colors = [
      '#4E79A7',
      '#F28E2B',
      '#E15759',
      '#76B7B2',
      '#59A14F',
      '#EDC949',
      '#AF7AA1',
      '#FF9DA7',
      '#9C755F',
      '#BAB0AC',
      '#86BCB6',
      '#D37295',
      '#8CD17D',
      '#B09EE1',
      '#FFBE7D',
      '#6A3D9A',
      '#DD8452',
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      {data?.length > 0 && (
        <Box sx={{ margin: '20px' }}>
          <Typography
            sx={{
              marginBottom: '10px',
              color: 'rgb(25, 118, 210)',
              fontSize: '18px',
              fontWeight: '400',
            }}
          >
            Catch Per Vessel
          </Typography>
          <Box
            ref={ref}
            style={{ width: '100%', height: 450, background: 'white' }}
          >
            <ResponsiveContainer width={'100%'} height={400}>
              <BarChart
                {...{
                  overflow: 'visible',
                }}
                width={700}
                height={400}
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis domain={[0, 'auto']} interval={0} />
                <Tooltip />
                <Legend align="right" verticalAlign="top" layout="vertical" />
                {allKeys.map((key, index) => (
                  <Bar
                    key={index}
                    dataKey={key}
                    stackId="a"
                    fill={getBarColor(index)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </>
  );
});

export default CatchPerVesselChart;
