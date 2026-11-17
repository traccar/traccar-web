import { createSlice } from '@reduxjs/toolkit';

// Pending alerts of the current user, newest first. Filled from live notifications and from the
// server's unseen list at login; an item is removed when the user marks it as seen.
const { reducer, actions } = createSlice({
  name: 'events',
  initialState: {
    items: [],
  },
  reducers: {
    add(state, action) {
      const known = new Set(state.items.map((item) => item.id));
      state.items.push(...action.payload.filter((item) => !known.has(item.id)));
      state.items.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));
      state.items.splice(50);
    },
    delete(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    deleteAll(state) {
      state.items = [];
    },
  },
});

export { actions as eventsActions };
export { reducer as eventsReducer };
