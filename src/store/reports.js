import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'reports',
  initialState: {
    period: 'day',
    range: null,
  },
  reducers: {
    updatePeriod(state, action) {
      state.period = action.payload.period;
      state.range = action.payload.range;
    },
  },
});

export { actions as reportsActions };
export { reducer as reportsReducer };
