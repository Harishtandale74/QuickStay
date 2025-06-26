import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import hotelSlice from './slices/hotelSlice';
import bookingSlice from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    hotels: hotelSlice,
    bookings: bookingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;