import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'mobile-groups',
  initialState: {
    selectedId: null,
    selectedIds: []
  },
  reducers: {
    selectId(state, action) {
      state.selectedId = action.payload;
      state.selectedIds = state.selectedId ? [state.selectedId] : [];
    },
    selectIds(state, action) {
      state.selectedIds = action.payload;
      [state.selectedId] = state.selectedIds;
    }
  },
});

export { actions as mobileGroupsActions };
export { reducer as mobileGroupsReducer };
