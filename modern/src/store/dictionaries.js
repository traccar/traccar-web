import { createSlice } from '@reduxjs/toolkit';
import dictionariesApi from '../services/dictionaries';

const { reducer, actions } = createSlice({
  name: 'dictionaries',
  initialState: {
    mobileGroupStatuses: [],
    mobileGroupCarTypes: [],
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addMatcher(dictionariesApi.endpoints.mobileGroupCarTypes.matchFulfilled, (state, action) => {
      state.mobileGroupCarTypes = action.payload?.data;
    }),
    builder.addMatcher(dictionariesApi.endpoints.mobileGroupStatuses.matchFulfilled, (state, action) => {
      state.mobileGroupStatuses = action.payload?.data;
    })
  }
});

export { actions as dictionariesActions };
export { reducer as dictionariesReducer };
