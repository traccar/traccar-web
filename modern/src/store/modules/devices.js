import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'devices',
  initialState: {
    items: {},
    selectedId: null
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['id']] = item);
    },
    select(state, action) {
      state.selectedId = action.payload.id;
    }
  }
});

export { actions as devicesActions };
export { reducer as devicesReducer };
