import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { nagpurAPI } from '../../utils/api';
import toast from 'react-hot-toast';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    area: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    nearbyLandmarks: string[];
  };
  images: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
  amenities: string[];
  roomTypes: Array<{
    type: string;
    price: number;
    capacity: {
      adults: number;
      children: number;
    };
    amenities: string[];
    totalRooms: number;
    availableRooms: number;
    images: string[];
  }>;
  rating: {
    average: number;
    count: number;
  };
  reviews: Array<{
    user: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    date: string;
    helpful: number;
  }>;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation?: string;
    petPolicy?: string;
    smokingPolicy: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  featured: boolean;
  verified: boolean;
  totalBookings: number;
  revenue: number;
  isAvailable?: boolean;
  lowestPrice?: number;
  highestPrice?: number;
}

interface HotelFilters {
  area?: string[];
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  roomType?: string;
  rating?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface HotelState {
  hotels: Hotel[];
  featuredHotels: Hotel[];
  selectedHotel: Hotel | null;
  loading: boolean;
  error: string | null;
  filters: HotelFilters;
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  availableFilters: {
    areas: string[];
    amenities: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

const initialState: HotelState = {
  hotels: [],
  featuredHotels: [],
  selectedHotel: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  availableFilters: {
    areas: [],
    amenities: [],
    priceRange: { min: 0, max: 10000 },
  },
};

// Async thunks
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params: HotelFilters & { page?: number; limit?: number; sortBy?: string }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getHotels(params);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch hotels';
      return rejectWithValue(message);
    }
  }
);

export const fetchFeaturedHotels = createAsyncThunk(
  'hotels/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getFeaturedHotels();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch featured hotels';
      return rejectWithValue(message);
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getHotelById(id);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch hotel details';
      return rejectWithValue(message);
    }
  }
);

export const fetchHotelsByArea = createAsyncThunk(
  'hotels/fetchByArea',
  async (area: string, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getHotelsByArea(area);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch hotels by area';
      return rejectWithValue(message);
    }
  }
);

export const createHotel = createAsyncThunk(
  'hotels/create',
  async (hotelData: any, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.createHotel(hotelData);
      toast.success('Hotel submitted for approval!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create hotel';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addHotelReview = createAsyncThunk(
  'hotels/addReview',
  async ({ hotelId, reviewData }: { hotelId: string; reviewData: { rating: number; comment: string } }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.addReview(hotelId, reviewData);
      toast.success('Review added successfully!');
      return { hotelId, review: reviewData };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add review';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<HotelFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.hotels;
        state.pagination = action.payload.pagination;
        state.availableFilters = action.payload.filters;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Featured Hotels
      .addCase(fetchFeaturedHotels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredHotels = action.payload;
      })
      .addCase(fetchFeaturedHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Hotel by ID
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Hotel
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearSelectedHotel } = hotelSlice.actions;
export default hotelSlice.reducer;