import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    overflow: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const NetworkPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { positionId } = useParams();

  const [item, setItem] = useState({});

  useEffectAsync(async () => {
    if (positionId) {
      const response = await fetchOrThrow(`/api/positions?id=${positionId}`);
      const positions = await response.json();
      if (positions.length > 0) {
        setItem(positions[0]);
      }
    }
  }, [positionId]);

  const deviceName = useSelector((state) => {
    if (item) {
      const device = state.devices.items[item.deviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  return (
    <div className={classes.root}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6">
            {deviceName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <Container maxWidth="sm">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MCC</TableCell>
                  <TableCell>MNC</TableCell>
                  <TableCell>LAC</TableCell>
                  <TableCell>CID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(item.network?.cellTowers || []).map((cell) => (
                  <TableRow key={cell.cellId}>
                    <TableCell>{cell.mobileCountryCode}</TableCell>
                    <TableCell>{cell.mobileNetworkCode}</TableCell>
                    <TableCell>{cell.locationAreaCode}</TableCell>
                    <TableCell>{cell.cellId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
        <Container maxWidth="sm">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MAC</TableCell>
                  <TableCell>RSSI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(item.network?.wifiAccessPoints || []).map((wifi) => (
                  <TableRow key={wifi.macAddress}>
                    <TableCell>{wifi.macAddress}</TableCell>
                    <TableCell>{wifi.signalStrength}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default NetworkPage;
