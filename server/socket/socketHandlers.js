const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected`);

    // Join user to their personal room
    socket.join(`user_${socket.user.id}`);

    // Join admin users to admin room
    if (socket.user.role === 'admin') {
      socket.join('admins');
    }

    // Join hotel owners to their hotel rooms
    if (socket.user.role === 'hotelOwner') {
      // In production, fetch user's hotels and join those rooms
      socket.join(`owner_${socket.user.id}`);
    }

    // Handle real-time hotel search
    socket.on('searchHotels', async (searchData) => {
      try {
        const { area, checkIn, checkOut, guests } = searchData;
        
        // Emit search activity to analytics
        io.to('admins').emit('searchActivity', {
          user: socket.user.name,
          area,
          timestamp: new Date()
        });

        // You can implement real-time search results here
        socket.emit('searchResults', {
          message: 'Search completed',
          timestamp: new Date()
        });
      } catch (error) {
        socket.emit('error', { message: 'Search failed' });
      }
    });

    // Handle booking status updates
    socket.on('joinBookingRoom', (bookingId) => {
      socket.join(`booking_${bookingId}`);
    });

    // Handle hotel room joining for real-time updates
    socket.on('joinHotelRoom', (hotelId) => {
      socket.join(`hotel_${hotelId}`);
    });

    // Handle live chat for customer support
    socket.on('joinSupportChat', () => {
      socket.join('support');
      
      // Notify support team
      io.to('admins').emit('newSupportRequest', {
        user: {
          id: socket.user.id,
          name: socket.user.name,
          email: socket.user.email
        },
        timestamp: new Date()
      });
    });

    socket.on('supportMessage', (data) => {
      const { message, isSupport } = data;
      
      if (isSupport && socket.user.role === 'admin') {
        // Support agent sending message to user
        io.to(`user_${data.userId}`).emit('supportMessage', {
          message,
          from: 'support',
          agent: socket.user.name,
          timestamp: new Date()
        });
      } else {
        // User sending message to support
        io.to('admins').emit('supportMessage', {
          message,
          from: socket.user.name,
          userId: socket.user.id,
          timestamp: new Date()
        });
      }
    });

    // Handle real-time availability checks
    socket.on('checkAvailability', async (data) => {
      try {
        const { hotelId, roomType, checkIn, checkOut } = data;
        
        // Simulate availability check
        const isAvailable = Math.random() > 0.3; // 70% chance available
        
        socket.emit('availabilityResult', {
          hotelId,
          roomType,
          isAvailable,
          timestamp: new Date()
        });

        // Emit to hotel owner
        io.to(`hotel_${hotelId}`).emit('availabilityCheck', {
          user: socket.user.name,
          roomType,
          checkIn,
          checkOut,
          timestamp: new Date()
        });
      } catch (error) {
        socket.emit('error', { message: 'Availability check failed' });
      }
    });

    // Handle price alerts
    socket.on('setPriceAlert', (data) => {
      const { hotelId, maxPrice } = data;
      
      // Store price alert (in production, save to database)
      socket.join(`price_alert_${hotelId}`);
      
      socket.emit('priceAlertSet', {
        hotelId,
        maxPrice,
        message: 'Price alert activated'
      });
    });

    // Handle location sharing for nearby hotels
    socket.on('shareLocation', (location) => {
      const { latitude, longitude } = location;
      
      // Emit nearby hotels based on location
      socket.emit('nearbyHotels', {
        message: 'Nearby hotels updated based on your location',
        location: { latitude, longitude }
      });
    });

    // Handle booking reminders
    socket.on('setBookingReminder', (data) => {
      const { bookingId, reminderTime } = data;
      
      // In production, schedule reminder
      socket.emit('reminderSet', {
        bookingId,
        reminderTime,
        message: 'Booking reminder set successfully'
      });
    });

    // Handle real-time reviews
    socket.on('submitReview', async (data) => {
      try {
        const { hotelId, rating, comment } = data;
        
        // Emit to hotel room
        io.to(`hotel_${hotelId}`).emit('newReview', {
          user: socket.user.name,
          rating,
          comment,
          timestamp: new Date()
        });

        // Emit to hotel owner
        const Hotel = require('../models/Hotel');
        const hotel = await Hotel.findById(hotelId);
        if (hotel) {
          io.to(`owner_${hotel.owner}`).emit('hotelReviewReceived', {
            hotelName: hotel.name,
            reviewer: socket.user.name,
            rating,
            comment,
            timestamp: new Date()
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Review submission failed' });
      }
    });

    // Handle emergency notifications
    socket.on('emergencyAlert', (data) => {
      if (socket.user.role === 'admin') {
        io.emit('emergencyAlert', {
          message: data.message,
          type: data.type,
          timestamp: new Date()
        });
      }
    });

    // Handle user activity tracking
    socket.on('userActivity', (activity) => {
      // Track user activity for analytics
      io.to('admins').emit('userActivity', {
        user: socket.user.name,
        activity,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected`);
      
      // Emit user offline status
      io.to('admins').emit('userOffline', {
        user: socket.user.name,
        timestamp: new Date()
      });
    });
  });

  // Periodic real-time updates
  setInterval(() => {
    // Emit real-time statistics every 30 seconds
    io.to('admins').emit('realTimeStats', {
      connectedUsers: io.engine.clientsCount,
      timestamp: new Date(),
      serverStatus: 'healthy'
    });
  }, 30000);

  // Emit daily booking summary at midnight
  const cron = require('node-cron');
  cron.schedule('0 0 * * *', async () => {
    try {
      const Booking = require('../models/Booking');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dailyStats = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow },
            'payment.status': 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' },
            averageBookingValue: { $avg: '$pricing.totalAmount' }
          }
        }
      ]);

      io.to('admins').emit('dailySummary', {
        date: today.toISOString().split('T')[0],
        stats: dailyStats[0] || { totalBookings: 0, totalRevenue: 0, averageBookingValue: 0 }
      });
    } catch (error) {
      console.error('Error generating daily summary:', error);
    }
  });
};