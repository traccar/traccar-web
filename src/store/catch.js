import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "catch",
  initialState: {
    items: [],
    catchDetails: null,
    filters: {},
    period: "",
  },
  reducers: {
    setCatchRecords(state, action) {
      state.items = action.payload;
    },
    catchDetails(state, action) {
      state.catchDetails = action.payload;
    },
    clearDetails(state) {
      state.catchDetails = null;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    updatePeriod(state, action) {
      state.period = action.payload;
    },
    clearFilters(state){
      state.filters ={}
      state.period = "";
    }
  },
});

export { actions as catchActions };
export { reducer as catchReducer };
