import route from './route.js';

const interval = 5000;
const retention = 24 * 60 * 60 * 1000;

export const createFleet = (now = Date.now()) => {
  const anchor = Math.floor(now / interval) * interval;
  const devices = ['Delivery Van', 'Service Van', 'City Shuttle', 'Courier', 'Support Car'].map(
    (name, index) => ({
      id: index + 1,
      name,
      uniqueId: `demo-${index + 1}`,
      status: 'online',
      category: 'car',
      disabled: false,
      groupId: 0,
      attributes: {},
    }),
  );
  let lastTick = -1;
  let history = [];
  let positions = [];

  const sample = (timestamp) =>
    devices.map((device, index) => {
      const step =
        (timestamp - anchor) / interval + Math.floor((index * route.length) / devices.length);
      const [longitude, latitude, speed, course] =
        route[((step % route.length) + route.length) % route.length];
      const time = new Date(timestamp).toISOString();
      return {
        id: (timestamp / interval) * 10 + device.id,
        deviceId: device.id,
        protocol: 'demo',
        serverTime: time,
        deviceTime: time,
        fixTime: time,
        valid: true,
        outdated: false,
        latitude,
        longitude,
        speed,
        course,
        attributes: {},
      };
    });

  const advance = (time = Date.now()) => {
    const tick = Math.floor(time / interval) * interval;
    if (tick <= lastTick) return;
    const from =
      lastTick < 0 ? tick - 20 * 60 * 1000 : Math.max(lastTick + interval, tick - retention);
    for (let timestamp = from; timestamp <= tick; timestamp += interval) {
      positions = sample(timestamp);
      history.push(...positions);
    }
    lastTick = tick;
    history = history.filter((position) => Date.parse(position.fixTime) >= tick - retention);
    devices.forEach((device, index) => {
      device.positionId = positions[index].id;
      device.lastUpdate = positions[index].fixTime;
    });
  };
  advance(now);
  return {
    advance,
    devices,
    get positions() {
      return positions;
    },
    query: (params) => {
      const ids = params.getAll('id').map(Number);
      if (ids.length) return history.filter((position) => ids.includes(position.id));
      const deviceId = Number(params.get('deviceId'));
      const hasRange = params.has('from') && params.has('to');
      const from = params.has('from') ? Date.parse(params.get('from')) : -Infinity;
      const to = params.has('to') ? Date.parse(params.get('to')) : Infinity;
      const source = hasRange ? history : positions;
      return source.filter(
        (position) =>
          (!deviceId || position.deviceId === deviceId) &&
          Date.parse(position.fixTime) >= from &&
          Date.parse(position.fixTime) <= to,
      );
    },
  };
};
