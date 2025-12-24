import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import parcelReducer from './parcelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcels: parcelReducer,
  },
});