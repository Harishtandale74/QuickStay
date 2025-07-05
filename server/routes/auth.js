const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUser } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register
router.post('/register', validateUser, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or phone already exists' 
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password, // Will be hashed by pre-save middleware
      phone,
      role,
      profile: {
        address: {
          city: 'Nagpur',
          state: 'Maharashtra'
        }
      }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is suspended' });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites', 'name location images rating')
      .populate('bookingHistory.hotel', 'name location');

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user data', 
      error: error.message 
    });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'profile.avatar', 'profile.dateOfBirth', 
      'profile.gender', 'profile.address', 'profile.preferences'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Profile update failed', 
      error: error.message 
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ 
      message: 'Password change failed', 
      error: error.message 
    });
  }
});

// Add to favorites
router.post('/favorites/:hotelId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.favorites.includes(req.params.hotelId)) {
      return res.status(400).json({ message: 'Hotel already in favorites' });
    }

    user.favorites.push(req.params.hotelId);
    await user.save();

    res.json({ message: 'Hotel added to favorites' });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error adding to favorites', 
      error: error.message 
    });
  }
});

// Remove from favorites
router.delete('/favorites/:hotelId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.hotelId
    );
    await user.save();

    res.json({ message: 'Hotel removed from favorites' });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error removing from favorites', 
      error: error.message 
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;