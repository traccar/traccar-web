const initialState = {
  devices: new Map(),
  positions: new Map()
};

function updateMap(map, array, key) {
  for (let value of array) {
    map.set(value[key], value);
  }
  return map;
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_DEVICES':
      return Object.assign({}, {
        ...state,
        devices: updateMap(state.devices, action.devices, 'id')
      });
    case 'UPDATE_POSITIONS':
      return Object.assign({}, {
        ...state,
        positions: updateMap(state.positions, action.positions, 'deviceId')
      });
    case 'SELECT_DEVICE':
      return Object.assign({}, {
        ...state,
        selectedDevice: action.device.id
      });
    default:
      return state;
  }
}

export default rootReducer
