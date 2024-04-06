import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'errors',
  initialState: {
    errors: [],
  },
  reducers: {
    push(state, action) {
      state.errors.push(action.payload);
    },
    pop(state) {
      if (state.errors.length) {
        state.errors.shift();
      }
    },
  },
});

export { actions as errorsActions };
export { reducer as errorsReducer };
