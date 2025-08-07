const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 }
  },
  nights: {
    type: Number,
    required: true
  },
  pricing: {
    roomPrice: { type: Number, required: true },
    totalRoomCost: { type: Number, required: true },
    taxes: { type: Number, required: true },
    serviceFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet'],
      required: true
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refundAmount: { type: Number, default: 0 },
    refundedAt: Date
  },
  status: {
    type: String,
    enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
    default: 'confirmed'
  },
  guestDetails: {
    primaryGuest: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      idType: { type: String, enum: ['aadhar', 'pan', 'passport', 'driving_license'] },
      idNumber: String
    },
    specialRequests: String,
    arrivalTime: String
  },
  cancellation: {
    cancelledAt: Date,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    refundAmount: Number
  },
  notifications: [{
    type: { type: String, enum: ['booking_confirmed', 'payment_received', 'check_in_reminder', 'check_out_reminder'] },
    sentAt: Date,
    method: { type: String, enum: ['email', 'sms', 'push'] }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique booking ID
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `NGP${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Calculate nights
bookingSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ hotel: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);