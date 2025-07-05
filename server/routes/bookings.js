const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create booking
router.post('/', authenticateToken, validateBooking, async (req, res) => {
  try {
    const {
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      specialRequests
    } = req.body;

    // Validate hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Find room type
    const selectedRoom = hotel.roomTypes.find(room => room.type === roomType);
    if (!selectedRoom) {
      return res.status(400).json({ message: 'Room type not available' });
    }

    // Check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const conflictingBookings = await Booking.countDocuments({
      hotel: hotelId,
      roomType,
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ],
      status: { $in: ['confirmed', 'checked-in'] }
    });

    if (conflictingBookings >= selectedRoom.totalRooms) {
      return res.status(400).json({ message: 'No rooms available for selected dates' });
    }

    // Calculate pricing
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const roomPrice = selectedRoom.price;
    const totalRoomCost = roomPrice * nights;
    const taxes = Math.round(totalRoomCost * 0.12); // 12% GST
    const serviceFee = Math.round(totalRoomCost * 0.02); // 2% service fee
    const totalAmount = totalRoomCost + taxes + serviceFee;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      notes: {
        hotelId,
        userId: req.user.id,
        roomType
      }
    });

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      hotel: hotelId,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      nights,
      pricing: {
        roomPrice,
        totalRoomCost,
        taxes,
        serviceFee,
        totalAmount
      },
      payment: {
        method: 'razorpay',
        razorpayOrderId: razorpayOrder.id,
        status: 'pending'
      },
      guestDetails: {
        primaryGuest: guestDetails,
        specialRequests
      }
    });

    await booking.save();

    // Emit real-time notification
    req.io.emit('newBooking', {
      bookingId: booking.bookingId,
      hotel: hotel.name,
      user: req.user.name,
      amount: totalAmount,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });

    res.status(201).json({
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: 'INR'
      },
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

// Verify payment and confirm booking
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const {
      bookingId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    } = req.body;

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update booking
    const booking = await Booking.findById(bookingId)
      .populate('hotel', 'name location contact')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.payment.razorpayPaymentId = razorpayPaymentId;
    booking.payment.status = 'completed';
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    // Update hotel stats
    await Hotel.findByIdAndUpdate(booking.hotel._id, {
      $inc: { 
        totalBookings: 1,
        revenue: booking.pricing.totalAmount
      },
      lastBooking: new Date()
    });

    // Add to user booking history
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        'bookingHistory': {
          booking: booking._id,
          hotel: booking.hotel._id,
          amount: booking.pricing.totalAmount,
          date: new Date()
        }
      },
      $inc: { loyaltyPoints: Math.floor(booking.pricing.totalAmount / 100) }
    });

    // Emit real-time notifications
    req.io.emit('bookingConfirmed', {
      bookingId: booking.bookingId,
      hotel: booking.hotel.name,
      user: booking.user.name,
      amount: booking.pricing.totalAmount
    });

    // Send to hotel owner
    req.io.to(`hotel_${booking.hotel._id}`).emit('newBookingReceived', {
      booking: {
        id: booking.bookingId,
        guest: booking.guestDetails.primaryGuest.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        roomType: booking.roomType,
        amount: booking.pricing.totalAmount
      }
    });

    res.json({
      message: 'Payment verified and booking confirmed',
      booking: {
        id: booking.bookingId,
        status: booking.status,
        hotel: booking.hotel.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error verifying payment', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('hotel', 'name location images contact')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get booking details
router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [
        { _id: req.params.bookingId },
        { bookingId: req.params.bookingId }
      ]
    })
    .populate('hotel', 'name location images contact policies')
    .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is hotel owner/admin
    const hotel = await Hotel.findById(booking.hotel._id);
    const isOwner = booking.user._id.toString() === req.user.id;
    const isHotelOwner = hotel.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isHotelOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error: error.message });
  }
});

// Cancel booking
router.put('/:bookingId/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findOne({
      $or: [
        { _id: req.params.bookingId },
        { bookingId: req.params.bookingId }
      ]
    }).populate('hotel', 'name policies');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    // Check cancellation policy (24 hours before check-in)
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);

    let refundAmount = 0;
    if (hoursUntilCheckIn > 24) {
      refundAmount = booking.pricing.totalAmount * 0.9; // 90% refund
    } else if (hoursUntilCheckIn > 6) {
      refundAmount = booking.pricing.totalAmount * 0.5; // 50% refund
    }
    // No refund if less than 6 hours

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: req.user.id,
      reason,
      refundAmount
    };

    if (refundAmount > 0) {
      booking.payment.refundAmount = refundAmount;
      // In production, initiate actual refund process
    }

    await booking.save();

    // Emit real-time notification
    req.io.emit('bookingCancelled', {
      bookingId: booking.bookingId,
      hotel: booking.hotel.name,
      refundAmount
    });

    res.json({
      message: 'Booking cancelled successfully',
      refundAmount,
      refundStatus: refundAmount > 0 ? 'processing' : 'no_refund'
    });
  } catch (error) {
    res.status(400).json({ message: 'Error cancelling booking', error: error.message });
  }
});

// Get real-time booking analytics
router.get('/analytics/real-time', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const analytics = await Promise.all([
      // Today's bookings
      Booking.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
        status: 'confirmed'
      }),
      
      // Today's revenue
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow },
            'payment.status': 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.totalAmount' }
          }
        }
      ]),
      
      // Current occupancy
      Booking.countDocuments({
        checkIn: { $lte: new Date() },
        checkOut: { $gt: new Date() },
        status: { $in: ['confirmed', 'checked-in'] }
      }),
      
      // Upcoming check-ins today
      Booking.countDocuments({
        checkIn: { $gte: today, $lt: tomorrow },
        status: 'confirmed'
      })
    ]);

    res.json({
      todayBookings: analytics[0],
      todayRevenue: analytics[1][0]?.totalRevenue || 0,
      currentOccupancy: analytics[2],
      todayCheckIns: analytics[3],
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;