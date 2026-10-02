import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    push(state, action) {
      state.messages.push(action.payload);
    },
    pop(state) {
      if (state.messages.length) {
        state.messages.shift();
      }
    },
  },
});

export { actions as messagesActions };
export { reducer as messagesReducer };
