const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'profile'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user's favorite hotels
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
});

// Add hotel to favorites
router.post('/favorites/:hotelId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.favorites.includes(req.params.hotelId)) {
      return res.status(400).json({ message: 'Hotel already in favorites' });
    }

    user.favorites.push(req.params.hotelId);
    await user.save();

    res.json({ message: 'Hotel added to favorites' });
  } catch (error) {
    res.status(400).json({ message: 'Error adding favorite', error: error.message });
  }
});

// Remove hotel from favorites
router.delete('/favorites/:hotelId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.hotelId);
    await user.save();

    res.json({ message: 'Hotel removed from favorites' });
  } catch (error) {
    res.status(400).json({ message: 'Error removing favorite', error: error.message });
  }
});

module.exports = router;
