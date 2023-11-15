import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'mobile-groups',
  initialState: {
    selectedId: null,
    selectedIds: [],
    positions: [],
  },
  reducers: {
    selectId(state, action) {
      state.selectedId = action.payload;
      state.selectedIds = state.selectedId ? [state.selectedId] : [];
    },
    selectIds(state, action) {
      state.selectedIds = action.payload;
      [state.selectedId] = state.selectedIds;
    },
    updatePositions(state, action) {
      state.positions = action.payload
    },
  }
});

export { actions as mobileGroupsActions };
export { reducer as mobileGroupsReducer };
