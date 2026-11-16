// Operational state of a device, shared by the device list, filter chips and map markers.
// Priority: unacknowledged alarm > offline > alarm on latest position > moving > stopped.

export const deviceStates = ['moving', 'stopped', 'offline', 'alarm'];

// Palette key used for fills (map markers, avatar rings)
export const deviceStateColor = {
  moving: 'info',
  stopped: 'stopped',
  offline: 'neutral',
  alarm: 'alarm',
};

// Palette key used for text, chosen to keep 4.5:1 contrast on surfaces
export const deviceStateTextColor = {
  moving: 'info',
  stopped: 'stopped',
  offline: 'neutral',
  alarm: 'warning',
};

export const getDeviceState = (device, position, openAlarm = false) => {
  if (device && openAlarm) {
    return 'alarm';
  }
  if (!device || device.status === 'offline' || !position) {
    return 'offline';
  }
  if (position.attributes?.alarm) {
    return 'alarm';
  }
  if (position.attributes?.motion) {
    return 'moving';
  }
  return 'stopped';
};

export const formatDeviceState = (state, t) => {
  switch (state) {
    case 'moving':
      return t('deviceStateMoving');
    case 'stopped':
      return t('deviceStateStopped');
    case 'alarm':
      return t('eventAlarm');
    case 'offline':
    default:
      return t('deviceStatusOffline');
  }
};
