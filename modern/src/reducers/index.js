const initialState = {
  devices: [],
  positions: [],
  events: []
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_DEVICES':
      return Object.assign({}, {
        ...state,
        devices: [...action.devices]
      });
    case 'UPDATE_POSITIONS':
      return Object.assign({}, {
        ...state,
        positions: [...action.positions]
      });
    default:
      return state;
  }
}

export default rootReducer
