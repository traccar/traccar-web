import React from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import t from '../common/localization';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 160,
  },
}));

const ChartType = ({ type, setType }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select value={type} onChange={e => setType(e.target.value)} >
        <MenuItem value="speed">{t('positionSpeed')}</MenuItem>
        <MenuItem value="accuracy">{t('positionAccuracy')}</MenuItem>
        <MenuItem value="altitude">{t('positionAltitude')}</MenuItem>
        <MenuItem value="index">{t('positionIndex')}</MenuItem>
        <MenuItem value="hdop">{t('positionHdop')}</MenuItem>
        <MenuItem value="vdop">{t('positionVdop')}</MenuItem>
        <MenuItem value="pdop">{t('positionPdop')}</MenuItem>
        <MenuItem value="sat">{t('positionSat')}</MenuItem>
        <MenuItem value="satVisible">{t('positionSatVisible')}</MenuItem>
        <MenuItem value="rssi">{t('positionRssi')}</MenuItem>
        <MenuItem value="gps">{t('positionGps')}</MenuItem>
        <MenuItem value="odometer">{t('positionOdometer')}</MenuItem>
        <MenuItem value="serviceOdometer">{t('positionServiceOdometer')}</MenuItem>
        <MenuItem value="tripOdometer">{t('positionTripOdometer')}</MenuItem>
        <MenuItem value="hours">{t('positionHours')}</MenuItem>
        <MenuItem value="steps">{t('positionSteps')}</MenuItem>
        <MenuItem value="power">{t('positionPower')}</MenuItem>
        <MenuItem value="battery">{t('positionBattery')}</MenuItem>
        <MenuItem value="batteryLevel">{t('positionBatteryLevel')}</MenuItem>
        <MenuItem value="fuel">{t('positionFuel')}</MenuItem>
        <MenuItem value="fuelConsumption">{t('positionFuelConsumption')}</MenuItem>
        <MenuItem value="distance">{t('positionDistance')}</MenuItem>
        <MenuItem value="totalDistance">{t('deviceTotalDistance')}</MenuItem>
        <MenuItem value="rpm">{t('positionRpm')}</MenuItem>
        <MenuItem value="throttle">{t('positionThrottle')}</MenuItem>
        <MenuItem value="armed">{t('positionArmed')}</MenuItem>
        <MenuItem value="acceleration">{t('positionAcceleration')}</MenuItem>
        <MenuItem value="deviceTemp">{t('positionDeviceTemp')}</MenuItem>
        <MenuItem value="obdSpeed">{t('positionObdSpeed')}</MenuItem>
        <MenuItem value="obdOdometer">{t('positionObdOdometer')}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default ChartType;
