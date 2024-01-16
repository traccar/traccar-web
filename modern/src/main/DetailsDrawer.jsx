import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Drawer, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody, AppBar, IconButton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { useTranslation } from '../common/components/LocalizationProvider';
import { prefixString } from '../common/util/stringUtils';
import { useEffectAsync } from '../reactHelper';
import PositionValue from '../common/components/PositionValue';
import usePositionAttributes from '../common/attributes/usePositionAttributes';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.dimensions.detailsDrawerWidth,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const DetailsDrawer = ({ deviceId, open, onClose }) => {
  const classes = useStyles();
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);

  const device = useSelector((state) => state.devices.items[deviceId]);

  const [item, setItem] = useState();

  useEffectAsync(async () => {
    if (device) {
      const response = await fetch(`/api/positions?id=${device.positionId}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [deviceId]);

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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <AppBar position="sticky" color="inherit">
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography variant="h6" className={classes.title}>
            {deviceName}
          </Typography>
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>
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
              <TableCell><strong>{positionAttributes[property]?.name || property}</strong></TableCell>
              <TableCell><PositionValue position={item} property={property} /></TableCell>
            </TableRow>
          ))}
          {item && Object.getOwnPropertyNames(item.attributes).map((attribute) => (
            <TableRow key={attribute}>
              <TableCell>{attribute}</TableCell>
              <TableCell><strong>{positionAttributes[attribute]?.name || attribute}</strong></TableCell>
              <TableCell><PositionValue position={item} attribute={attribute} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Drawer>
  );
};

export default DetailsDrawer;
