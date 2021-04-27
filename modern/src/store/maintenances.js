import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'maintenances',
  initialState: {
    items: {},
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['id']] = item);
    },
  }
});

export { actions as maintenancesActions };
export { reducer as maintenancesReducer };
