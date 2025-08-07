import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
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
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Enhanced mock data for better testing
const generateMockHotels = (count: number = 12) => {
  const areas = ['Sitabuldi', 'Civil Lines', 'Dharampeth', 'Wardha Road', 'Seminary Hills', 'Sadar'];
  const hotelNames = [
    'The Pride Hotel Nagpur', 'Radisson Blu Hotel', 'Hotel Centre Point', 'Tuli Imperial',
    'Le Meridien Nagpur', 'Hotel Hardeo', 'Regenta Central Herald', 'Hotel Skylark',
    'The Nagpur Ashok', 'Hotel Airport Centre Point', 'Hotel Midland', 'WelcomHotel Rama International'
  ];
  
  return Array.from({ length: count }, (_, index) => ({
    _id: (index + 1).toString(),
    name: hotelNames[index % hotelNames.length],
    description: `Premium hotel in ${areas[index % areas.length]} with world-class amenities and exceptional service.`,
    location: {
      address: `${areas[index % areas.length]}, Nagpur`,
      area: areas[index % areas.length],
      coordinates: {
        latitude: 21.1458 + (Math.random() - 0.5) * 0.1,
        longitude: 79.0882 + (Math.random() - 0.5) * 0.1
      },
      nearbyLandmarks: ['Sitabuldi Fort', 'Central Mall', 'Airport']
    },
    images: [
      { 
        url: `https://images.pexels.com/photos/${261102 + index}/pexels-photo-${261102 + index}.jpeg?auto=compress&cs=tinysrgb&w=800`, 
        isPrimary: true 
      }
    ],
    amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa'].slice(0, 4 + (index % 3)),
    roomTypes: [
      {
        type: 'Standard',
        price: 2000 + (index * 300),
        capacity: { adults: 2, children: 1 },
        amenities: ['WiFi', 'AC', 'TV'],
        totalRooms: 20 + (index * 5),
        availableRooms: 10 + (index * 2),
        images: []
      }
    ],
    rating: { 
      average: 4.0 + (Math.random() * 1), 
      count: 100 + (index * 50) 
    },
    reviews: [],
    owner: { _id: '1', name: 'Hotel Owner', email: 'owner@hotel.com', phone: '9876543210' },
    contact: { phone: '0712-2345678', email: 'info@hotel.com' },
    policies: {
      checkIn: '14:00',
      checkOut: '11:00',
      cancellation: 'Free cancellation up to 24 hours',
      smokingPolicy: 'No Smoking'
    },
    status: 'approved' as const,
    featured: index < 4,
    verified: true,
    totalBookings: 50 + (index * 20),
    revenue: 100000 + (index * 50000),
    isAvailable: true,
    lowestPrice: 2000 + (index * 300),
    highestPrice: 4000 + (index * 500)
  }));
};

// Mock API responses with proper error handling
const mockApiCall = async (url: string, method: string = 'GET', data?: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  
  try {
    switch (url) {
      case '/auth/register':
        return {
          data: {
            message: 'Registration successful',
            user: {
              id: Date.now().toString(),
              name: data.name,
              email: data.email,
              phone: data.phone,
              role: data.role,
              profile: {
                address: { city: 'Nagpur', state: 'Maharashtra' }
              },
              favorites: [],
              loyaltyPoints: 0,
              verification: { email: false, phone: false }
            },
            token: `mock_token_${Date.now()}`
          }
        };
        
      case '/auth/login':
        return {
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
                address: { city: 'Nagpur', state: 'Maharashtra' }
              },
              favorites: [],
              loyaltyPoints: 150,
              verification: { email: true, phone: true }
            },
            token: `mock_token_${Date.now()}`
          }
        };

      case '/auth/me':
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
              address: { city: 'Nagpur', state: 'Maharashtra' }
            },
            favorites: [],
            loyaltyPoints: 150,
            verification: { email: true, phone: true }
          }
        };

      case '/hotels':
        const mockHotels = generateMockHotels(12);
        return {
          data: {
            hotels: mockHotels,
            pagination: {
              current: 1,
              pages: 2,
              total: mockHotels.length,
              hasNext: true,
              hasPrev: false
            },
            filters: {
              areas: ['Sitabuldi', 'Civil Lines', 'Dharampeth', 'Wardha Road'],
              amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa'],
              priceRange: { min: 1000, max: 10000 }
            }
          }
        };

      case '/hotels/featured':
        const featuredHotels = generateMockHotels(4);
        return { data: featuredHotels };

      case '/bookings/my-bookings':
        return {
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
        };

      default:
        return { data: { message: 'Success', data: [] } };
    }
  } catch (error) {
    throw new Error('Mock API error');
  }
};

// Enhanced API with proper error handling
export const nagpurAPI = {
  // Auth endpoints
  register: async (data: any) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/auth/register', 'POST', data);
      }
      return await api.post('/auth/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  login: async (data: any) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/auth/login', 'POST', data);
      }
      return await api.post('/auth/login', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  getProfile: async () => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/auth/me');
      }
      return await api.get('/auth/me');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  },

  // Hotels endpoints
  getHotels: async (params = {}) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/hotels');
      }
      return await api.get('/hotels', { params });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch hotels');
    }
  },

  getFeaturedHotels: async () => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/hotels/featured');
      }
      return await api.get('/hotels/featured');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch featured hotels');
    }
  },

  getHotelById: (id: string) => api.get(`/hotels/${id}`),
  
  getMyBookings: async (params = {}) => {
    try {
      if (import.meta.env.DEV) {
        return await mockApiCall('/bookings/my-bookings');
      }
      return await api.get('/bookings/my-bookings', { params });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    }
  },

  // Weather API
  getNagpurWeather: async () => {
    try {
      return {
        data: {
          temperature: 25 + Math.floor(Math.random() * 15),
          humidity: 50 + Math.floor(Math.random() * 30),
          condition: ['sunny', 'cloudy', 'partly-cloudy'][Math.floor(Math.random() * 3)],
          windSpeed: 5 + Math.floor(Math.random() * 20),
          visibility: 8 + Math.floor(Math.random() * 2),
          description: 'Perfect weather for exploring Nagpur!'
        }
      };
    } catch (error: any) {
      throw new Error('Failed to fetch weather data');
    }
  },
};

export default api;