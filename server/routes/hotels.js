const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateHotel } = require('../middleware/validation');

// Get all hotels in Nagpur with filters
router.get('/', async (req, res) => {
  try {
    const {
      area,
      minPrice,
      maxPrice,
      amenities,
      roomType,
      rating,
      sortBy = 'rating',
      page = 1,
      limit = 12,
      checkIn,
      checkOut,
      guests = 2
    } = req.query;

    // Build filter object
    const filter = { status: 'approved' };

    if (area) {
      filter['location.area'] = { $in: area.split(',') };
    }

    if (minPrice || maxPrice) {
      filter['roomTypes.price'] = {};
      if (minPrice) filter['roomTypes.price'].$gte = parseInt(minPrice);
      if (maxPrice) filter['roomTypes.price'].$lte = parseInt(maxPrice);
    }

    if (amenities) {
      filter.amenities = { $in: amenities.split(',') };
    }

    if (roomType) {
      filter['roomTypes.type'] = roomType;
    }

    if (rating) {
      filter['rating.average'] = { $gte: parseFloat(rating) };
    }

    // Check availability if dates provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Find hotels with conflicting bookings
      const conflictingBookings = await Booking.find({
        $or: [
          {
            checkIn: { $lt: checkOutDate },
            checkOut: { $gt: checkInDate }
          }
        ],
        status: { $in: ['confirmed', 'checked-in'] }
      }).distinct('hotel');

      // For now, we'll show all hotels but mark availability
      // In production, you'd want more sophisticated room availability logic
    }

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case 'price-low':
        sortOption = { 'roomTypes.price': 1 };
        break;
      case 'price-high':
        sortOption = { 'roomTypes.price': -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { featured: -1, 'rating.average': -1 };
    }

    const hotels = await Hotel.find(filter)
      .populate('owner', 'name email phone')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Hotel.countDocuments(filter);

    // Add real-time availability status
    const hotelsWithAvailability = hotels.map(hotel => ({
      ...hotel,
      isAvailable: true, // Simplified - in production, check actual room availability
      lowestPrice: Math.min(...hotel.roomTypes.map(room => room.price)),
      highestPrice: Math.max(...hotel.roomTypes.map(room => room.price))
    }));

    res.json({
      hotels: hotelsWithAvailability,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        areas: await Hotel.distinct('location.area', { status: 'approved' }),
        amenities: await Hotel.distinct('amenities', { status: 'approved' }),
        priceRange: {
          min: await Hotel.aggregate([
            { $match: { status: 'approved' } },
            { $unwind: '$roomTypes' },
            { $group: { _id: null, min: { $min: '$roomTypes.price' } } }
          ]).then(result => result[0]?.min || 500),
          max: await Hotel.aggregate([
            { $match: { status: 'approved' } },
            { $unwind: '$roomTypes' },
            { $group: { _id: null, max: { $max: '$roomTypes.price' } } }
          ]).then(result => result[0]?.max || 10000)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels', error: error.message });
  }
});

// Get featured hotels
router.get('/featured', async (req, res) => {
  try {
    const featuredHotels = await Hotel.find({ 
      status: 'approved', 
      featured: true 
    })
    .populate('owner', 'name')
    .sort({ 'rating.average': -1 })
    .limit(8)
    .lean();

    res.json(featuredHotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured hotels', error: error.message });
  }
});

// Get hotel by ID with real-time data
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews.user',
        select: 'name profile.avatar'
      });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Get real-time availability for next 30 days
    const today = new Date();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const bookings = await Booking.find({
      hotel: hotel._id,
      checkIn: { $lte: next30Days },
      checkOut: { $gte: today },
      status: { $in: ['confirmed', 'checked-in'] }
    });

    // Calculate room availability by type
    const roomAvailability = hotel.roomTypes.map(roomType => {
      const bookedRooms = bookings.filter(booking => 
        booking.roomType === roomType.type
      ).length;
      
      return {
        ...roomType.toObject(),
        availableRooms: Math.max(0, roomType.totalRooms - bookedRooms),
        occupancyRate: Math.round((bookedRooms / roomType.totalRooms) * 100)
      };
    });

    // Get nearby hotels
    const nearbyHotels = await Hotel.find({
      _id: { $ne: hotel._id },
      'location.area': hotel.location.area,
      status: 'approved'
    })
    .select('name location.address roomTypes rating images')
    .limit(4);

    res.json({
      ...hotel.toObject(),
      roomTypes: roomAvailability,
      nearbyHotels,
      realTimeData: {
        totalBookingsToday: await Booking.countDocuments({
          hotel: hotel._id,
          createdAt: {
            $gte: new Date(today.setHours(0, 0, 0, 0)),
            $lt: new Date(today.setHours(23, 59, 59, 999))
          }
        }),
        averageOccupancy: Math.round(
          roomAvailability.reduce((acc, room) => acc + room.occupancyRate, 0) / 
          roomAvailability.length
        )
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotel details', error: error.message });
  }
});

// Create new hotel (Hotel owners only)
router.post('/', authenticateToken, authorizeRoles(['hotelOwner', 'admin']), validateHotel, async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      owner: req.user.id
    };

    const hotel = new Hotel(hotelData);
    await hotel.save();

    // Emit real-time notification to admins
    req.io.to('admins').emit('newHotelSubmission', {
      hotel: {
        id: hotel._id,
        name: hotel.name,
        owner: req.user.name,
        location: hotel.location,
        submittedAt: hotel.createdAt
      }
    });

    res.status(201).json({
      message: 'Hotel submitted for approval',
      hotel: {
        id: hotel._id,
        name: hotel.name,
        status: hotel.status
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating hotel', error: error.message });
  }
});

// Update hotel (Owner or admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check ownership or admin role
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this hotel' });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    // Emit real-time update
    req.io.emit('hotelUpdated', {
      hotelId: updatedHotel._id,
      updates: req.body
    });

    res.json(updatedHotel);
  } catch (error) {
    res.status(400).json({ message: 'Error updating hotel', error: error.message });
  }
});

// Add review
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check if user has booked this hotel
    const hasBooking = await Booking.findOne({
      user: req.user.id,
      hotel: req.params.id,
      status: 'checked-out'
    });

    if (!hasBooking) {
      return res.status(400).json({ message: 'You can only review hotels you have stayed at' });
    }

    // Check if user already reviewed
    const existingReview = hotel.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }

    hotel.reviews.push({
      user: req.user.id,
      rating,
      comment,
      date: new Date()
    });

    hotel.calculateAverageRating();
    await hotel.save();

    // Emit real-time notification
    req.io.to(`hotel_${hotel._id}`).emit('newReview', {
      hotelId: hotel._id,
      review: {
        user: req.user.name,
        rating,
        comment,
        date: new Date()
      },
      newAverage: hotel.rating.average
    });

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error adding review', error: error.message });
  }
});

// Get hotels by area
router.get('/area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const hotels = await Hotel.find({
      'location.area': area,
      status: 'approved'
    })
    .select('name location roomTypes rating images')
    .sort({ 'rating.average': -1 });

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels by area', error: error.message });
  }
});

module.exports = router;