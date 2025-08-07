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
  search?: string;
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

// Async thunks with proper error handling
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params: HotelFilters & { page?: number; limit?: number; sortBy?: string }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getHotels(params);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch hotels';
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
      const message = error.response?.data?.message || error.message || 'Failed to fetch featured hotels';
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
      const message = error.response?.data?.message || error.message || 'Failed to fetch hotel details';
      return rejectWithValue(message);
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<HotelFilters>) => {
      // Only update if filters are actually different
      const newFilters = { ...state.filters, ...action.payload };
      const filtersChanged = JSON.stringify(state.filters) !== JSON.stringify(newFilters);
      
      if (filtersChanged) {
        state.filters = newFilters;
      }
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
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
        state.hotels = action.payload.hotels || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.availableFilters = action.payload.filters || initialState.availableFilters;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hotels = [];
      })
      // Fetch Featured Hotels
      .addCase(fetchFeaturedHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredHotels = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFeaturedHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.featuredHotels = [];
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
        state.selectedHotel = null;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearSelectedHotel, setLoading } = hotelSlice.actions;
export default hotelSlice.reducer;