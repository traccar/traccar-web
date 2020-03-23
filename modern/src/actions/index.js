export const updateDevices = devices => ({
  type: 'UPDATE_DEVICES',
  devices
})

export const updatePositions = positions => ({
  type: 'UPDATE_POSITIONS',
  positions
});

export const updateEvents = events => ({
  type: 'UPDATE_EVENTS',
  events
})

export const selectDevice = device => ({
  type: 'SELECT_DEVICE',
  device
})
