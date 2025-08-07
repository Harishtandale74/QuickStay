import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Don't redirect if already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Mock API responses for development
const mockResponses = {
  // Auth endpoints
  '/auth/register': (data: any) => ({
    data: {
      message: 'Registration successful',
      user: {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        profile: {
          address: {
            city: 'Nagpur',
            state: 'Maharashtra'
          }
        },
        favorites: [],
        loyaltyPoints: 0,
        verification: {
          email: false,
          phone: false
        }
      },
      token: `mock_token_${Date.now()}`
    }
  }),
  
  '/auth/login': (data: any) => ({
    data: {
      message: 'Login successful',
      user: {
        id: '1',
        name: data.email.includes('admin') ? 'Admin User' : 
              data.email.includes('owner') ? 'Hotel Owner' : 'User',
        email: data.email,
        phone: '9876543210',
        role: data.email.includes('admin') ? 'admin' : 
              data.email.includes('owner') ? 'hotelOwner' : 'user',
        profile: {
          address: {
            city: 'Nagpur',
            state: 'Maharashtra'
          }
        },
        favorites: [],
        loyaltyPoints: 150,
        verification: {
          email: true,
          phone: true
        }
      },
      token: `mock_token_${Date.now()}`
    }
  }),

  '/auth/me': () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    
    return {
      data: {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        phone: '9876543210',
        role: 'user',
        profile: {
          address: {
            city: 'Nagpur',
            state: 'Maharashtra'
          }
        },
        favorites: [],
        loyaltyPoints: 150,
        verification: {
          email: true,
          phone: true
        }
      }
    };
  },

  // Hotels endpoints
  '/hotels': () => ({
    data: {
      hotels: [
        {
          _id: '1',
          name: 'The Pride Hotel Nagpur',
          description: 'Luxury hotel in the heart of Nagpur with world-class amenities',
          location: {
            address: 'Sitabuldi, Nagpur',
            area: 'Sitabuldi',
            coordinates: { latitude: 21.1458, longitude: 79.0882 },
            nearbyLandmarks: ['Sitabuldi Fort', 'Central Mall']
          },
          images: [
            { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', isPrimary: true }
          ],
          amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa'],
          roomTypes: [
            {
              type: 'Standard',
              price: 2500,
              capacity: { adults: 2, children: 1 },
              amenities: ['WiFi', 'AC', 'TV'],
              totalRooms: 50,
              availableRooms: 25,
              images: []
            }
          ],
          rating: { average: 4.5, count: 234 },
          reviews: [],
          owner: { _id: '1', name: 'Hotel Owner', email: 'owner@hotel.com', phone: '9876543210' },
          contact: { phone: '0712-2345678', email: 'info@pridehotel.com' },
          policies: {
            checkIn: '14:00',
            checkOut: '11:00',
            cancellation: 'Free cancellation up to 24 hours',
            smokingPolicy: 'No Smoking'
          },
          status: 'approved',
          featured: true,
          verified: true,
          totalBookings: 156,
          revenue: 450000,
          isAvailable: true,
          lowestPrice: 2500,
          highestPrice: 5000
        },
        {
          _id: '2',
          name: 'Radisson Blu Hotel Nagpur',
          description: 'Premium business hotel with modern facilities',
          location: {
            address: 'Wardha Road, Nagpur',
            area: 'Wardha Road',
            coordinates: { latitude: 21.1200, longitude: 79.0500 },
            nearbyLandmarks: ['Airport', 'AIIMS Nagpur']
          },
          images: [
            { url: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800', isPrimary: true }
          ],
          amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Conference Hall'],
          roomTypes: [
            {
              type: 'Deluxe',
              price: 3500,
              capacity: { adults: 2, children: 2 },
              amenities: ['WiFi', 'AC', 'TV', 'Minibar'],
              totalRooms: 40,
              availableRooms: 18,
              images: []
            }
          ],
          rating: { average: 4.7, count: 189 },
          reviews: [],
          owner: { _id: '2', name: 'Hotel Group', email: 'owner2@hotel.com', phone: '9876543211' },
          contact: { phone: '0712-3456789', email: 'info@radissonblu.com' },
          policies: {
            checkIn: '15:00',
            checkOut: '12:00',
            cancellation: 'Free cancellation up to 48 hours',
            smokingPolicy: 'No Smoking'
          },
          status: 'approved',
          featured: true,
          verified: true,
          totalBookings: 203,
          revenue: 680000,
          isAvailable: true,
          lowestPrice: 3500,
          highestPrice: 7000
        }
      ],
      pagination: {
        current: 1,
        pages: 1,
        total: 2,
        hasNext: false,
        hasPrev: false
      },
      filters: {
        areas: ['Sitabuldi', 'Wardha Road', 'Civil Lines', 'Dharampeth'],
        amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa'],
        priceRange: { min: 1000, max: 10000 }
      }
    }
  }),

  '/hotels/featured': () => ({
    data: [
      {
        _id: '1',
        name: 'The Pride Hotel Nagpur',
        description: 'Luxury hotel in the heart of Nagpur',
        location: {
          address: 'Sitabuldi, Nagpur',
          area: 'Sitabuldi',
          coordinates: { latitude: 21.1458, longitude: 79.0882 }
        },
        images: [
          { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', isPrimary: true }
        ],
        amenities: ['WiFi', 'AC', 'Restaurant', 'Gym'],
        roomTypes: [
          { type: 'Standard', price: 2500, totalRooms: 50, availableRooms: 25 }
        ],
        rating: { average: 4.5, count: 234 },
        featured: true,
        isAvailable: true
      }
    ]
  }),

  // Bookings endpoints
  '/bookings/my-bookings': () => ({
    data: {
      bookings: [
        {
          _id: '1',
          bookingId: 'NGP202401001',
          user: {
            _id: '1',
            name: 'John Doe',
            email: 'user@example.com',
            phone: '9876543210'
          },
          hotel: {
            _id: '1',
            name: 'The Pride Hotel Nagpur',
            location: { address: 'Sitabuldi, Nagpur', area: 'Sitabuldi' },
            images: [{ url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=300' }],
            contact: { phone: '0712-2345678', email: 'info@pridehotel.com' }
          },
          roomType: 'Standard',
          checkIn: '2024-02-20',
          checkOut: '2024-02-23',
          guests: { adults: 2, children: 0 },
          nights: 3,
          pricing: {
            roomPrice: 2500,
            totalRoomCost: 7500,
            taxes: 900,
            serviceFee: 150,
            totalAmount: 8550
          },
          payment: {
            method: 'razorpay',
            status: 'completed',
            paidAt: '2024-02-15T10:30:00Z'
          },
          status: 'confirmed',
          guestDetails: {
            primaryGuest: {
              name: 'John Doe',
              phone: '9876543210',
              email: 'user@example.com'
            }
          },
          createdAt: '2024-02-15T10:30:00Z',
          updatedAt: '2024-02-15T10:30:00Z'
        }
      ],
      pagination: { current: 1, pages: 1, total: 1 }
    }
  }),

  '/bookings/analytics/real-time': () => ({
    data: {
      todayBookings: 47,
      todayRevenue: 125000,
      averageBookingValue: 2659,
      currentOccupancy: 78,
      todayCheckIns: 23,
      timestamp: new Date().toISOString()
    }
  })
};

// Mock API function
const mockApiCall = async (url: string, method: string = 'GET', data?: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  const mockKey = url.split('?')[0]; // Remove query params
  const mockFn = mockResponses[mockKey as keyof typeof mockResponses];
  
  if (mockFn) {
    try {
      return mockFn(data);
    } catch (error) {
      throw new Error('Authentication required');
    }
  }
  
  // Default response for unmocked endpoints
  return { data: { message: 'Success', data: [] } };
};

// Enhanced Nagpur-specific API endpoints
export const nagpurAPI = {
  // Auth endpoints with better error handling
  register: async (data: any) => {
    try {
      // Use mock for development
      if (import.meta.env.DEV) {
        return await mockApiCall('/auth/register', 'POST', data);
      }
      return await api.post('/auth/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (data: any) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/auth/login', 'POST', data);
      }
      return await api.post('/auth/login', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  getProfile: async () => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/auth/me');
      }
      return await api.get('/auth/me');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
  addToFavorites: (hotelId: string) => api.post(`/auth/favorites/${hotelId}`),
  removeFromFavorites: (hotelId: string) => api.delete(`/auth/favorites/${hotelId}`),

  // Hotels endpoints with real-time features
  getHotels: async (params = {}) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/hotels');
      }
      return await api.get('/hotels', { params });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotels');
    }
  },

  getFeaturedHotels: async () => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/hotels/featured');
      }
      return await api.get('/hotels/featured');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured hotels');
    }
  },

  getHotelById: (id: string) => api.get(`/hotels/${id}`),
  getHotelsByArea: (area: string) => api.get(`/hotels/area/${area}`),
  createHotel: (data: any) => api.post('/hotels', data),
  updateHotel: (id: string, data: any) => api.put(`/hotels/${id}`, data),
  addReview: (id: string, data: any) => api.post(`/hotels/${id}/reviews`, data),

  // Real-time availability check
  checkRoomAvailability: async (hotelId: string, checkIn: string, checkOut: string, roomType: string) => {
    try {
      const response = await api.post(`/hotels/${hotelId}/check-availability`, {
        checkIn,
        checkOut,
        roomType
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
  },

  // Bookings endpoints
  createBooking: (data: any) => api.post('/bookings', data),
  verifyPayment: (data: any) => api.post('/bookings/verify-payment', data),
  
  getMyBookings: async (params = {}) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/bookings/my-bookings');
      }
      return await api.get('/bookings/my-bookings', { params });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  getBookingDetails: (id: string) => api.get(`/bookings/${id}`),
  cancelBooking: (id: string, data: any) => api.put(`/bookings/${id}/cancel`, data),
  
  getBookingAnalytics: async () => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/bookings/analytics/real-time');
      }
      return await api.get('/bookings/analytics/real-time');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  },

  // Real-time price tracking
  trackPriceChanges: (hotelId: string) => api.post(`/hotels/${hotelId}/track-price`),
  getPriceHistory: (hotelId: string, days: number = 30) => api.get(`/hotels/${hotelId}/price-history?days=${days}`),

  // Live occupancy data
  getLiveOccupancy: (hotelId?: string) => {
    const endpoint = hotelId ? `/hotels/${hotelId}/occupancy` : '/analytics/occupancy';
    return api.get(endpoint);
  },

  // Weather integration for Nagpur
  getNagpurWeather: async () => {
    try {
      // Mock weather data for Nagpur
      return {
        data: {
          temperature: 28 + Math.floor(Math.random() * 10),
          humidity: 60 + Math.floor(Math.random() * 20),
          condition: ['sunny', 'cloudy', 'partly-cloudy'][Math.floor(Math.random() * 3)],
          windSpeed: 10 + Math.floor(Math.random() * 15),
          visibility: 8 + Math.floor(Math.random() * 2),
          description: 'Perfect weather for exploring Nagpur!'
        }
      };
    } catch (error: any) {
      throw new Error('Failed to fetch weather data');
    }
  },

  // Admin endpoints
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, data: any) => api.put(`/admin/users/${id}/status`, data),
  getHotelSubmissions: () => api.get('/admin/hotels/pending'),
  approveHotel: (id: string) => api.put(`/admin/hotels/${id}/approve`),
  rejectHotel: (id: string, data: any) => api.put(`/admin/hotels/${id}/reject`, data),

  // Real-time notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/notifications/mark-all-read'),

  // Live chat support
  sendSupportMessage: (message: string) => api.post('/support/message', { message }),
  getSupportHistory: () => api.get('/support/history'),
};

export default api;