import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  id: string;
  hotelId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  currentBooking: Booking | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  currentBooking: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setBookings, addBooking, setCurrentBooking, setLoading } = bookingSlice.actions;
export default bookingSlice.reducer;