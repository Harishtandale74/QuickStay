const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  location: {
    address: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true,
      enum: [
        'Sitabuldi', 'Sadar', 'Dharampeth', 'Civil Lines', 'Ramdaspeth',
        'Mahal', 'Gandhibagh', 'Itwari', 'Kamptee Road', 'Wardha Road',
        'Amravati Road', 'Katol Road', 'Seminary Hills', 'Hingna Road',
        'Koradi Road', 'Manish Nagar', 'Pratap Nagar', 'Trimurti Nagar'
      ]
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: 21.0, // Nagpur latitude range
        max: 21.3
      },
      longitude: {
        type: Number,
        required: true,
        min: 78.8, // Nagpur longitude range
        max: 79.3
      }
    },
    nearbyLandmarks: [String]
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'AC', 'TV', 'Parking', 'Restaurant', 'Room Service',
      'Gym', 'Swimming Pool', 'Spa', 'Conference Hall', 'Laundry',
      'Airport Shuttle', 'Bar', 'Garden', 'Terrace', 'Elevator',
      'Power Backup', 'CCTV', '24/7 Reception', 'Housekeeping'
    ]
  }],
  roomTypes: [{
    type: {
      type: String,
      required: true,
      enum: ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential']
    },
    price: {
      type: Number,
      required: true,
      min: 500 // Minimum price in INR
    },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 1 }
    },
    amenities: [String],
    totalRooms: { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    images: [String]
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String
  },
  policies: {
    checkIn: { type: String, default: '14:00' },
    checkOut: { type: String, default: '11:00' },
    cancellation: String,
    petPolicy: String,
    smokingPolicy: { type: String, default: 'No Smoking' }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  totalBookings: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  lastBooking: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
hotelSchema.index({ 'location.area': 1 });
hotelSchema.index({ 'location.coordinates': '2dsphere' });
hotelSchema.index({ 'rating.average': -1 });
hotelSchema.index({ status: 1 });
hotelSchema.index({ featured: 1 });

// Update the updatedAt field before saving
hotelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
hotelSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Hotel', hotelSchema);