const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ // Indian mobile number format
  },
  role: {
    type: String,
    enum: ['user', 'hotelOwner', 'admin'],
    default: 'user'
  },
  profile: {
    avatar: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: {
      street: String,
      area: String,
      city: { type: String, default: 'Nagpur' },
      state: { type: String, default: 'Maharashtra' },
      pincode: String
    },
    preferences: {
      roomType: [String],
      amenities: [String],
      priceRange: {
        min: Number,
        max: Number
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    }
  },
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    identity: {
      verified: { type: Boolean, default: false },
      documentType: String,
      documentNumber: String,
      verifiedAt: Date
    }
  },
  bookingHistory: [{
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    amount: Number,
    date: Date,
    rating: Number
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      type: { type: String, enum: ['credit', 'debit'] },
      amount: Number,
      description: String,
      date: { type: Date, default: Date.now }
    }]
  },
  loyaltyPoints: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'suspended', 'blocked'],
    default: 'active'
  },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Add loyalty points
userSchema.methods.addLoyaltyPoints = function(points) {
  this.loyaltyPoints += points;
  return this.save();
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);