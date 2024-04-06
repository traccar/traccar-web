import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'drivers',
  initialState: {
    items: {},
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => state.items[item.uniqueId] = item);
    },
  },
});

export { actions as driversActions };
export { reducer as driversReducer };
