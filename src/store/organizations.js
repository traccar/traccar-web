import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
    name: 'organizations',
    initialState: {
        items: {},
    },
    reducers: {
        refresh(state, action) {
            state.items = {};
            action.payload.forEach((item) => state.items[item.id] = item);
        },
    },
});

export { actions as organizationsActions };
export { reducer as organizationsReducer };
