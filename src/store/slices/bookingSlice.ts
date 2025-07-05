import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { nagpurAPI } from '../../utils/api';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  bookingId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  hotel: {
    _id: string;
    name: string;
    location: {
      address: string;
      area: string;
    };
    images: Array<{
      url: string;
      isPrimary?: boolean;
    }>;
    contact: {
      phone: string;
      email: string;
    };
  };
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  nights: number;
  pricing: {
    roomPrice: number;
    totalRoomCost: number;
    taxes: number;
    serviceFee: number;
    discount?: number;
    totalAmount: number;
  };
  payment: {
    method: string;
    transactionId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paidAt?: string;
    refundAmount?: number;
    refundedAt?: string;
  };
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  guestDetails: {
    primaryGuest: {
      name: string;
      phone: string;
      email: string;
      idType?: string;
      idNumber?: string;
    };
    specialRequests?: string;
    arrivalTime?: string;
  };
  cancellation?: {
    cancelledAt: string;
    cancelledBy: string;
    reason: string;
    refundAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
  analytics: {
    todayBookings: number;
    todayRevenue: number;
    currentOccupancy: number;
    todayCheckIns: number;
    timestamp: string;
  } | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  analytics: null,
};

// Async thunks
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData: {
    hotelId: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number };
    guestDetails: {
      name: string;
      phone: string;
      email: string;
      idType?: string;
      idNumber?: string;
    };
    specialRequests?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.createBooking(bookingData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create booking';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'bookings/verifyPayment',
  async (paymentData: {
    bookingId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.verifyPayment(paymentData);
      toast.success('Payment verified! Booking confirmed.');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Payment verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMy',
  async (params: { status?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getMyBookings(params);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  }
);

export const fetchBookingDetails = createAsyncThunk(
  'bookings/fetchDetails',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getBookingDetails(bookingId);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch booking details';
      return rejectWithValue(message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async ({ bookingId, reason }: { bookingId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.cancelBooking(bookingId, { reason });
      toast.success('Booking cancelled successfully');
      return { bookingId, ...response.data };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchBookingAnalytics = createAsyncThunk(
  'bookings/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getBookingAnalytics();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      return rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    updateBookingStatus: (state, action: PayloadAction<{ bookingId: string; status: string }>) => {
      const booking = state.bookings.find(b => b.bookingId === action.payload.bookingId);
      if (booking) {
        booking.status = action.payload.status as any;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentBooking) {
          state.currentBooking.status = 'confirmed';
          state.currentBooking.payment.status = 'completed';
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch My Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Booking Details
      .addCase(fetchBookingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const booking = state.bookings.find(b => b.bookingId === action.payload.bookingId);
        if (booking) {
          booking.status = 'cancelled';
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Analytics
      .addCase(fetchBookingAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { clearError, clearCurrentBooking, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;