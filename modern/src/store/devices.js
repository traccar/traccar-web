import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'devices',
  initialState: {
    items: {},
    selectedId: null,
    filteredItems: {},
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => state.items[item.id] = item);
    },
    update(state, action) {
      action.payload.forEach((item) => state.items[item.id] = item);
    },
    select(state, action) {
      state.selectedId = action.payload.id;
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
    filterByName(state, action) {
      return {
        ...state,
        filteredItems: action.payload ? 
          Object.values(state.items).filter((item) => item.name?.toLowerCase().includes(action.payload?.toLowerCase()))
          : state.items,
      }
    }
  },
});

export { actions as devicesActions };
export { reducer as devicesReducer };
