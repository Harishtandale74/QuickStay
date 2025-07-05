import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Nagpur-specific API endpoints
export const nagpurAPI = {
  // Hotels
  getHotels: (params = {}) => api.get('/hotels', { params }),
  getFeaturedHotels: () => api.get('/hotels/featured'),
  getHotelById: (id: string) => api.get(`/hotels/${id}`),
  getHotelsByArea: (area: string) => api.get(`/hotels/area/${area}`),
  createHotel: (data: any) => api.post('/hotels', data),
  updateHotel: (id: string, data: any) => api.put(`/hotels/${id}`, data),
  addReview: (id: string, data: any) => api.post(`/hotels/${id}/reviews`, data),

  // Bookings
  createBooking: (data: any) => api.post('/bookings', data),
  verifyPayment: (data: any) => api.post('/bookings/verify-payment', data),
  getMyBookings: (params = {}) => api.get('/bookings/my-bookings', { params }),
  getBookingDetails: (id: string) => api.get(`/bookings/${id}`),
  cancelBooking: (id: string, data: any) => api.put(`/bookings/${id}/cancel`, data),
  getBookingAnalytics: () => api.get('/bookings/analytics/real-time'),

  // Auth
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
  addToFavorites: (hotelId: string) => api.post(`/auth/favorites/${hotelId}`),
  removeFromFavorites: (hotelId: string) => api.delete(`/auth/favorites/${hotelId}`),

  // Admin
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, data: any) => api.put(`/admin/users/${id}/status`, data),
  getHotelSubmissions: () => api.get('/admin/hotels/pending'),
  approveHotel: (id: string) => api.put(`/admin/hotels/${id}/approve`),
  rejectHotel: (id: string, data: any) => api.put(`/admin/hotels/${id}/reject`, data),
};

export default api;