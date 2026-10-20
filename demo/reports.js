export const geofences = [
  {
    id: 1,
    name: 'Whitehall',
    area: 'POLYGON ((51.499 -0.129, 51.509 -0.129, 51.509 -0.125, 51.499 -0.125, 51.499 -0.129))',
    attributes: {},
  },
];

export const eventTypes = [
  'ignitionOn',
  'deviceMoving',
  'geofenceEnter',
  'geofenceExit',
  'deviceStopped',
  'ignitionOff',
];

export const sampleEvent = (position, type) => ({
  id: position.id * 10 + eventTypes.indexOf(type),
  type,
  deviceId: position.deviceId,
  positionId: position.id,
  eventTime: position.fixTime,
  ...(type.startsWith('geofence') ? { geofenceId: 1 } : {}),
  attributes: {},
});

export const report = (fleet, type, params) => {
  const from = params.has('from') ? Date.parse(params.get('from')) : -Infinity;
  const to = params.has('to') ? Date.parse(params.get('to')) : Infinity;
  const deviceIds = params.getAll('deviceId').map(Number);
  const types = params.getAll('type');
  const geofenceIds = params.getAll('geofenceId').map(Number);
  const history = fleet.query(new URLSearchParams({ from: '1970-01-01', to: '9999-01-01' }));
  return fleet.devices
    .filter(
      (device) => deviceIds.includes(device.id) || (!deviceIds.length && !params.has('groupId')),
    )
    .flatMap((device) => {
      const all = history.filter((position) => position.deviceId === device.id);
      const positions = all.filter(
        (position) => Date.parse(position.fixTime) >= from && Date.parse(position.fixTime) <= to,
      );
      // Sample trip from 15 to 5 minutes ago, followed by a stop.
      const start = all.at(-181);
      const end = all.at(-61);
      const latest = all.at(-1);
      const trip = {
        deviceId: device.id,
        startTime: start.fixTime,
        endTime: end.fixTime,
        startPositionId: start.id,
        endPositionId: end.id,
        startLat: start.latitude,
        startLon: start.longitude,
        endLat: end.latitude,
        endLon: end.longitude,
        startAddress: start.address,
        endAddress: end.address,
        startOdometer: start.attributes.totalDistance - 4000,
        endOdometer: end.attributes.totalDistance,
        distance: 4000,
        duration: 600000,
        averageSpeed: 13,
        maxSpeed: 20,
        engineHours: 600000,
        spentFuel: 0.4,
        business: false,
      };
      const events = [
        sampleEvent(start, 'ignitionOn'),
        sampleEvent(start, 'deviceMoving'),
        sampleEvent(start, 'geofenceEnter'),
        sampleEvent(end, 'geofenceExit'),
        sampleEvent(end, 'deviceStopped'),
        sampleEvent(end, 'ignitionOff'),
      ].filter((event) => Date.parse(event.eventTime) >= from && Date.parse(event.eventTime) <= to);
      let rows;
      switch (type) {
        case 'route':
          return positions;
        case 'combined':
          return positions.length
            ? [
                {
                  deviceId: device.id,
                  positions,
                  events,
                  route: positions.map((position) => [position.longitude, position.latitude]),
                },
              ]
            : [];
        case 'events':
          return events.filter(
            (event) => !types.length || types.includes('allEvents') || types.includes(event.type),
          );
        case 'trips':
        case 'summary':
          rows = [trip];
          break;
        case 'stops':
          rows = [
            {
              deviceId: device.id,
              startTime: end.fixTime,
              endTime: latest.fixTime,
              duration: 300000,
              positionId: end.id,
              latitude: end.latitude,
              longitude: end.longitude,
              address: end.address,
              startOdometer: end.attributes.totalDistance,
              engineHours: 0,
            },
          ];
          break;
        case 'geofences':
          rows =
            !geofenceIds.length || geofenceIds.includes(1)
              ? [
                  {
                    deviceId: device.id,
                    geofenceId: 1,
                    startTime: start.fixTime,
                    endTime: end.fixTime,
                  },
                ]
              : [];
          break;
        default:
          return [];
      }
      return rows.filter(
        (row) => Date.parse(row.endTime) >= from && Date.parse(row.startTime) <= to,
      );
    });
};
