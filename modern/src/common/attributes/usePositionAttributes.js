import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  id: {
    name: t('deviceIdentifier'),
    type: 'number',
    property: true,
  },
  latitude: {
    name: t('positionLatitude'),
    type: 'number',
    property: true,
  },
  longitude: {
    name: t('positionLongitude'),
    type: 'number',
    property: true,
  },
  speed: {
    name: t('positionSpeed'),
    type: 'number',
    dataType: 'speed',
    property: true,
  },
  course: {
    name: t('positionCourse'),
    type: 'number',
    property: true,
  },
  altitude: {
    name: t('positionAltitude'),
    type: 'number',
    property: true,
  },
  accuracy: {
    name: t('positionAccuracy'),
    type: 'number',
    dataType: 'distance',
    property: true,
  },
  valid: {
    name: t('positionValid'),
    type: 'boolean',
    property: true,
  },
  protocol: {
    name: t('positionProtocol'),
    type: 'string',
    property: true,
  },
  address: {
    name: t('positionAddress'),
    type: 'string',
    property: true,
  },
  deviceTime: {
    name: t('positionDeviceTime'),
    type: 'string',
    property: true,
  },
  fixTime: {
    name: t('positionFixTime'),
    type: 'string',
    property: true,
  },
  serverTime: {
    name: t('positionServerTime'),
    type: 'string',
    property: true,
  },
  geofenceIds: {
    name: t('sharedGeofences'),
    property: true,
  },
  raw: {
    name: t('positionRaw'),
    type: 'string',
  },
  index: {
    name: t('positionIndex'),
    type: 'number',
  },
  hdop: {
    name: t('positionHdop'),
    type: 'number',
  },
  vdop: {
    name: t('positionVdop'),
    type: 'number',
  },
  pdop: {
    name: t('positionPdop'),
    type: 'number',
  },
  sat: {
    name: t('positionSat'),
    type: 'number',
  },
  satVisible: {
    name: t('positionSatVisible'),
    type: 'number',
  },
  rssi: {
    name: t('positionRssi'),
    type: 'number',
  },
  coolantTemp: {
    name: t('positionCoolantTemp'),
    type: 'number',
  },
  engineTemp: {
    name: t('positionEngineTemp'),
    type: 'number',
  },
  gps: {
    name: t('positionGps'),
    type: 'number',
  },
  roaming: {
    name: t('positionRoaming'),
    type: 'boolean',
  },
  faultCount: {
    name: t('positionFaultCount'),
    type: 'string',
  },
  event: {
    name: t('positionEvent'),
    type: 'string',
  },
  alarm: {
    name: t('positionAlarm'),
    type: 'string',
  },
  status: {
    name: t('positionStatus'),
    type: 'string',
  },
  odometer: {
    name: t('positionOdometer'),
    type: 'number',
    dataType: 'distance',
  },
  serviceOdometer: {
    name: t('positionServiceOdometer'),
    type: 'number',
    dataType: 'distance',
  },
  tripOdometer: {
    name: t('positionTripOdometer'),
    type: 'number',
    dataType: 'distance',
  },
  hours: {
    name: t('positionHours'),
    type: 'number',
    dataType: 'hours',
  },
  steps: {
    name: t('positionSteps'),
    type: 'number',
  },
  input: {
    name: t('positionInput'),
    type: 'number',
  },
  in1: {
    name: `${t('positionInput')} 1`,
    type: 'boolean',
  },
  in2: {
    name: `${t('positionInput')} 2`,
    type: 'boolean',
  },
  in3: {
    name: `${t('positionInput')} 3`,
    type: 'boolean',
  },
  in4: {
    name: `${t('positionInput')} 4`,
    type: 'boolean',
  },
  output: {
    name: t('positionOutput'),
    type: 'number',
  },
  out1: {
    name: `${t('positionOutput')} 1`,
    type: 'boolean',
  },
  out2: {
    name: `${t('positionOutput')} 2`,
    type: 'boolean',
  },
  out3: {
    name: `${t('positionOutput')} 3`,
    type: 'boolean',
  },
  out4: {
    name: `${t('positionOutput')} 4`,
    type: 'boolean',
  },
  coolantTemp: {
    name: t('positionCoolantTemp'),
    type: 'number',
    dataType: 'celsius',
  },
  engineTemp: {
    name: t('positionEngineTemp'),
    type: 'number',
    dataType: 'celsius',
  },
  power: {
    name: t('positionPower'),
    type: 'number',
    dataType: 'voltage',
  },
  battery: {
    name: t('positionBattery'),
    type: 'number',
    dataType: 'voltage',
  },
  batteryLevel: {
    name: t('positionBatteryLevel'),
    type: 'number',
    dataType: 'percentage',
  },
  fuel: {
    name: t('positionFuel'),
    type: 'number',
    dataType: 'volume',
  },
  fuelConsumption: {
    name: t('positionFuelConsumption'),
    type: 'number',
  },
  versionFw: {
    name: t('positionVersionFw'),
    type: 'string',
  },
  versionHw: {
    name: t('positionVersionHw'),
    type: 'string',
  },
  type: {
    name: t('sharedType'),
    type: 'string',
  },
  ignition: {
    name: t('positionIgnition'),
    type: 'boolean',
  },
  flags: {
    name: t('positionFlags'),
    type: 'string',
  },
  charge: {
    name: t('positionCharge'),
    type: 'boolean',
  },
  ip: {
    name: t('positionIp'),
    type: 'string',
  },
  archive: {
    name: t('positionArchive'),
    type: 'boolean',
  },
  distance: {
    name: t('positionDistance'),
    type: 'number',
    dataType: 'distance',
  },
  totalDistance: {
    name: t('deviceTotalDistance'),
    type: 'number',
    dataType: 'distance',
  },
  rpm: {
    name: t('positionRpm'),
    type: 'number',
  },
  vin: {
    name: t('positionVin'),
    type: 'string',
  },
  approximate: {
    name: t('positionApproximate'),
    type: 'boolean',
  },
  throttle: {
    name: t('positionThrottle'),
    type: 'number',
  },
  motion: {
    name: t('positionMotion'),
    type: 'boolean',
  },
  armed: {
    name: t('positionArmed'),
    type: 'boolean',
  },
  geofence: {
    name: t('sharedGeofence'),
    type: 'string',
  },
  acceleration: {
    name: t('positionAcceleration'),
    type: 'number',
  },
  deviceTemp: {
    name: t('positionDeviceTemp'),
    type: 'number',
  },
  temp1: {
    name: `${t('positionTemp')} 1`,
    type: 'number',
  },
  temp2: {
    name: `${t('positionTemp')} 2`,
    type: 'number',
  },
  temp3: {
    name: `${t('positionTemp')} 3`,
    type: 'number',
  },
  temp4: {
    name: `${t('positionTemp')} 4`,
    type: 'number',
  },
  operator: {
    name: t('positionOperator'),
    type: 'string',
  },
  command: {
    name: t('deviceCommand'),
    type: 'string',
  },
  blocked: {
    name: t('positionBlocked'),
    type: 'boolean',
  },
  lock: {
    name: t('alarmLock'),
    type: 'boolean',
  },
  dtcs: {
    name: t('positionDtcs'),
    type: 'string',
  },
  obdSpeed: {
    name: t('positionObdSpeed'),
    type: 'number',
    dataType: 'speed',
  },
  obdOdometer: {
    name: t('positionObdOdometer'),
    type: 'number',
    dataType: 'distance',
  },
  result: {
    name: t('eventCommandResult'),
    type: 'string',
  },
  driverUniqueId: {
    name: t('positionDriverUniqueId'),
    type: 'string',
  },
  card: {
    name: t('positionCard'),
    type: 'string',
  },
  drivingTime: {
    name: t('positionDrivingTime'),
    type: 'number',
    dataType: 'hours',
  },
  color: {
    name: t('attributeColor'),
    type: 'string',
  },
  image: {
    name: t('positionImage'),
    type: 'string',
  },
  video: {
    name: t('positionVideo'),
    type: 'string',
  },
  audio: {
    name: t('positionAudio'),
    type: 'string',
  },
}), [t]);
