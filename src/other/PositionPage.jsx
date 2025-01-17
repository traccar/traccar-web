import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PositionValue from '../common/components/PositionValue';
import usePositionAttributes from '../common/attributes/usePositionAttributes';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    overflow: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));
//! Implementation of how api is set up.
//  {
//   id: 92,
//   attributes: {
//     distance: 78.78110594267385,
//     totalDistance: 6024.829574884233,
//     motion: false,
//   },
//   deviceId: 1,
//   protocol: 'osmand',
//   serverTime: '2025-01-13T15:02:14.895+00:00',
//   deviceTime: '2025-01-12T20:45:00.000+00:00',
//   fixTime: '2025-01-12T20:45:00.000+00:00',
//   outdated: false,
//   valid: true,
//   latitude: 59.9445,
//   longitude: 30.358,
//   altitude: 0,
//   speed: 0,
//   course: 0,
//   address: null,
//   accuracy: 0,
//   network: null,
//   geofenceIds: null,
// };

function ExcludeItems(Items) {
  const filtered = { ...Items };
  const EXCLUDED_ATTRIBUTES = ['adc2', 'adc3', 'output', 'input', 'protocol', 'Blocked', 'outdated', 'status', 'network', 'RSSI', 'door'];

  EXCLUDED_ATTRIBUTES.forEach((attr) => {
    delete filtered[attr];
  });
  if (filtered.attributes) {
    filtered.attributes = Object.keys(filtered.attributes)
      .filter((key) => !EXCLUDED_ATTRIBUTES.includes(key))
      .reduce((obj, key) => {
        obj[key] = filtered.attributes[key];
        return obj;
      }, {});
  }

  return filtered;
}

const PositionPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const { id } = useParams();

  const [item, setItem] = useState();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/positions?id=${id}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(ExcludeItems(positions.at(0)));
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [id]);

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
            <ArrowBackIcon />
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
                  <TableCell>{t('stateName')}</TableCell>
                  <TableCell>{t('sharedName')}</TableCell>
                  <TableCell>{t('stateValue')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item && Object.getOwnPropertyNames(item).filter((it) => it !== 'attributes').map((property) => (
                  <TableRow key={property}>
                    <TableCell>{property}</TableCell>
                    <TableCell><strong>{positionAttributes[property]?.name}</strong></TableCell>
                    <TableCell><PositionValue position={item} property={property} /></TableCell>
                  </TableRow>
                ))}
                {item && Object.getOwnPropertyNames(item.attributes).map((attribute) => (
                  <TableRow key={attribute}>
                    <TableCell>{attribute}</TableCell>
                    <TableCell><strong>{positionAttributes[attribute]?.name}</strong></TableCell>
                    <TableCell><PositionValue position={item} attribute={attribute} /></TableCell>
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

export default PositionPage;
