import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  description: string;
  rooms: number;
  ownerId: string;
}

interface HotelState {
  hotels: Hotel[];
  filteredHotels: Hotel[];
  loading: boolean;
  searchQuery: string;
  filters: {
    city: string;
    priceRange: [number, number];
    amenities: string[];
  };
}

const initialState: HotelState = {
  hotels: [],
  filteredHotels: [],
  loading: false,
  searchQuery: '',
  filters: {
    city: '',
    priceRange: [0, 1000],
    amenities: [],
  },
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setHotels: (state, action: PayloadAction<Hotel[]>) => {
      state.hotels = action.payload;
      state.filteredHotels = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<HotelState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    filterHotels: (state) => {
      let filtered = state.hotels;

      if (state.searchQuery) {
        filtered = filtered.filter(hotel =>
          hotel.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      if (state.filters.city) {
        filtered = filtered.filter(hotel =>
          hotel.location.toLowerCase().includes(state.filters.city.toLowerCase())
        );
      }

      if (state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 1000) {
        filtered = filtered.filter(hotel =>
          hotel.price >= state.filters.priceRange[0] && hotel.price <= state.filters.priceRange[1]
        );
      }

      state.filteredHotels = filtered;
    },
  },
});

export const { setHotels, setLoading, setSearchQuery, setFilters, filterHotels } = hotelSlice.actions;
export default hotelSlice.reducer;