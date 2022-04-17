import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  makeStyles, Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams } from 'react-router-dom';
import { useEffectAsync } from './reactHelper';
import { formatPosition } from './common/formatter';
import { prefixString } from './common/stringUtils';
import { useTranslation } from './LocalizationProvider';

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
      const response = await fetch(`/api/positions?id=${id}`, {
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const items = await response.json();
        setItem(items[0]);
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

  const attributesList = () => {
    const combinedList = { ...item, ...item.attributes };
    return Object.entries(combinedList).filter(([, value]) => typeof value !== 'object');
  };

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
              {item && attributesList().map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell><strong>{t(prefixString('position', key))}</strong></TableCell>
                  <TableCell>{formatPosition(value, key, t)}</TableCell>
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
