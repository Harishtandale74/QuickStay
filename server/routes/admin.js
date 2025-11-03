const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { authorizeRoles } = require('../middleware/auth');

// Middleware to ensure admin access
router.use(authorizeRoles(['admin']));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user status', error: error.message });
  }
});

// Get pending hotel submissions
router.get('/hotels/pending', async (req, res) => {
  try {
    const pendingHotels = await Hotel.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(pendingHotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending hotels', error: error.message });
  }
});

// Approve hotel
router.put('/hotels/:id/approve', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date(), approvedBy: req.user.id },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Emit notification to hotel owner
    req.io.to(`owner_${hotel.owner}`).emit('hotelApproved', {
      hotelId: hotel._id,
      hotelName: hotel.name,
      message: 'Your hotel has been approved!'
    });

    res.json({ message: 'Hotel approved successfully', hotel });
  } catch (error) {
    res.status(400).json({ message: 'Error approving hotel', error: error.message });
  }
});

// Reject hotel
router.put('/hotels/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected', 
        rejectionReason: reason,
        rejectedAt: new Date(), 
        rejectedBy: req.user.id 
      },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Emit notification to hotel owner
    req.io.to(`owner_${hotel.owner}`).emit('hotelRejected', {
      hotelId: hotel._id,
      hotelName: hotel.name,
      reason,
      message: 'Your hotel submission has been rejected'
    });

    res.json({ message: 'Hotel rejected', hotel });
  } catch (error) {
    res.status(400).json({ message: 'Error rejecting hotel', error: error.message });
  }
});

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalHotels, totalBookings, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments({ status: 'approved' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ])
    ]);

    res.json({
      totalUsers,
      totalHotels,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
