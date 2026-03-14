import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'motion',
  initialState: {
    items: {},
  },
  reducers: {
    set(state, action) {
      state.items = action.payload;
    },
    clear(state) {
      state.items = {};
    },
  },
});

export { actions as motionActions };
export { reducer as motionReducer };
