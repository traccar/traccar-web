import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'session',
  initialState: {
    authenticated: false,
  },
  reducers: {
    authenticated(state, action) {
      state.authenticated = action.payload;
    },
  }
});

export { actions as sessionActions };
export { reducer as sessionReducer };
