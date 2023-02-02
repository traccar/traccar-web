import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const { reducer, actions } = createSlice({
  name: 'reports',
  initialState: {
    groupIds: [],
    period: 'today',
    from: moment().subtract(1, 'hour').locale('en').format(moment.HTML5_FMT.DATETIME_LOCAL),
    to: moment().locale('en').format(moment.HTML5_FMT.DATETIME_LOCAL),
    button: 'json',
  },
  reducers: {
    updateGroupIds(state, action) {
      state.groupIds = action.payload;
    },
    updatePeriod(state, action) {
      state.period = action.payload;
    },
    updateFrom(state, action) {
      state.from = action.payload;
    },
    updateTo(state, action) {
      state.to = action.payload;
    },
    updateButton(state, action) {
      state.button = action.payload;
    },
  },
});

export { actions as reportsActions };
export { reducer as reportsReducer };
