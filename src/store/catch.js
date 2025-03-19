import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'catch',
  initialState: {
   items:[],
   catchDetails:null
  },
  reducers: {
    catchRecords(state, action) {
      state.items = action.payload;
    },
    catchDetails(state, action) {
      state.catchDetails = action.payload;
    },
    clearDetails(state) {
        state.catchDetails = null;
      },
  },
});

export { actions as catchActions };
export { reducer as catchReducer };
