import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'commands',
  initialState: {
    items: {},
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['id']] = item);
    },
  }
});

export { actions as commandsActions };
export { reducer as commandsReducer };
