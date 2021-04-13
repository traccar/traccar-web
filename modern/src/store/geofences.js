import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'geofences',
  initialState: {
    items: {},
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['id']] = item);
    },
  }
});

export { actions as geofencesActions };
export { reducer as geofencesReducer };
