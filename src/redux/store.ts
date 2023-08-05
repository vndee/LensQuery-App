import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slice/index';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;