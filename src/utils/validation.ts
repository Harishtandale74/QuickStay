import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'hotelOwner']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const hotelSchema = z.object({
  name: z.string().min(2, 'Hotel name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    area: z.string().min(1, 'Area is required'),
    coordinates: z.object({
      latitude: z.number().min(21.0).max(21.3, 'Latitude must be within Nagpur bounds'),
      longitude: z.number().min(78.8).max(79.3, 'Longitude must be within Nagpur bounds'),
    }),
    nearbyLandmarks: z.array(z.string()).optional(),
  }),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    caption: z.string().optional(),
    isPrimary: z.boolean().optional(),
  })).min(1, 'At least one image is required'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  roomTypes: z.array(z.object({
    type: z.enum(['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential']),
    price: z.number().min(500, 'Price must be at least ₹500'),
    capacity: z.object({
      adults: z.number().min(1),
      children: z.number().min(0),
    }),
    amenities: z.array(z.string()),
    totalRooms: z.number().min(1),
    availableRooms: z.number().min(0),
    images: z.array(z.string()).optional(),
  })).min(1, 'At least one room type is required'),
  contact: z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    email: z.string().email('Invalid email address'),
    website: z.string().url().optional(),
  }),
  policies: z.object({
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    cancellation: z.string().optional(),
    petPolicy: z.string().optional(),
    smokingPolicy: z.string().optional(),
  }).optional(),
});

export const bookingSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  roomType: z.enum(['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential']),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.object({
    adults: z.number().min(1, 'At least 1 adult is required'),
    children: z.number().min(0),
  }),
  guestDetails: z.object({
    name: z.string().min(2, 'Guest name is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    email: z.string().email('Invalid email address'),
    idType: z.enum(['aadhar', 'pan', 'passport', 'driving_license']).optional(),
    idNumber: z.string().optional(),
  }),
  specialRequests: z.string().max(500, 'Special requests must be under 500 characters').optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type HotelFormData = z.infer<typeof hotelSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;