const initialState = {
  devices: [],
  positions: [],
  events: []
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_POSITIONS':
      return Object.assign({}, {
        positions: [...state.positions, ...action.positions]
      });
    default:
      return state;
  }
}

export default rootReducer
