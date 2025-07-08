import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { nagpurAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'hotelOwner' | 'admin';
  profile?: {
    avatar?: string;
    address?: {
      city: string;
      state: string;
      area?: string;
    };
    preferences?: {
      roomType: string[];
      amenities: string[];
      priceRange: {
        min: number;
        max: number;
      };
    };
  };
  favorites: string[];
  loyaltyPoints: number;
  verification: {
    email: boolean;
    phone: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'hotelOwner';
  }, { rejectWithValue }) => {
    try {
      // Validate phone number format for India
      if (!/^[6-9]\d{9}$/.test(userData.phone)) {
        throw new Error('Please enter a valid 10-digit Indian mobile number');
      }
      
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const response = await nagpurAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.getProfile();
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await nagpurAPI.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      return response.data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.favorites = state.user.favorites.filter(id => id !== action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, addToFavorites, removeFromFavorites } = authSlice.actions;
export default authSlice.reducer;