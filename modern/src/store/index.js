import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './modules';

export default configureStore({ reducer: rootReducer });
