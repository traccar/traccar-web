import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  makeStyles, Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams } from 'react-router-dom';
import { useEffectAsync } from './reactHelper';
import { prefixString } from './common/stringUtils';
import { useTranslation } from './LocalizationProvider';
import PositionValue from './components/PositionValue';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const PositionPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const t = useTranslation();

  const { id } = useParams();

  const [item, setItem] = useState();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/positions?id=${id}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(positions[0]);
        }
      }
    } else {
      setItem({});
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
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => history.push('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {deviceName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" className={classes.root}>
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
                  <TableCell><strong>{t(prefixString('position', property))}</strong></TableCell>
                  <TableCell><PositionValue position={item} property={property} /></TableCell>
                </TableRow>
              ))}
              {item && Object.getOwnPropertyNames(item.attributes).map((attribute) => (
                <TableRow key={attribute}>
                  <TableCell>{attribute}</TableCell>
                  <TableCell><strong>{t(prefixString('position', attribute)) || t(prefixString('device', attribute))}</strong></TableCell>
                  <TableCell><PositionValue position={item} attribute={attribute} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default PositionPage;
