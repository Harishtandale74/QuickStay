const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { authorizeRoles } = require('../middleware/auth');

// Get booking analytics
router.get('/bookings', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};

    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
          avgBookingValue: { $avg: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Get hotel performance
router.get('/hotels/performance', authorizeRoles(['admin', 'hotelOwner']), async (req, res) => {
  try {
    const { hotelId } = req.query;
    const match = {};

    if (req.user.role === 'hotelOwner') {
      // Hotel owners can only see their own hotels
      const hotel = await Hotel.findOne({ owner: req.user.id });
      if (hotel) match.hotel = hotel._id;
    } else if (hotelId) {
      match.hotel = hotelId;
    }

    const performance = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$hotel',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          avgBookingValue: { $avg: '$pricing.totalAmount' },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotelInfo'
        }
      },
      { $unwind: '$hotelInfo' },
      {
        $project: {
          hotelName: '$hotelInfo.name',
          totalBookings: 1,
          totalRevenue: 1,
          avgBookingValue: 1,
          confirmedBookings: 1,
          cancelledBookings: 1,
          cancellationRate: {
            $multiply: [
              { $divide: ['$cancelledBookings', '$totalBookings'] },
              100
            ]
          }
        }
      }
    ]);

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance', error: error.message });
  }
});

module.exports = router;
