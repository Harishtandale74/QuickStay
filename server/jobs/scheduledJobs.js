const cron = require('node-cron');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send check-in reminders (runs every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingBookings = await Booking.find({
      checkIn: { $gte: tomorrow, $lt: dayAfterTomorrow },
      status: 'confirmed'
    })
    .populate('user', 'name email')
    .populate('hotel', 'name location contact');

    for (const booking of upcomingBookings) {
      // Check if reminder already sent
      const reminderSent = booking.notifications.some(
        notif => notif.type === 'check_in_reminder'
      );

      if (!reminderSent) {
        // Send email reminder
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: booking.user.email,
          subject: `Check-in Reminder - ${booking.hotel.name}`,
          html: `
            <h2>Check-in Reminder</h2>
            <p>Dear ${booking.user.name},</p>
            <p>This is a reminder that you have a booking at <strong>${booking.hotel.name}</strong> tomorrow.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
              <li>Booking ID: ${booking.bookingId}</li>
              <li>Check-in: ${booking.checkIn.toDateString()}</li>
              <li>Check-out: ${booking.checkOut.toDateString()}</li>
              <li>Room Type: ${booking.roomType}</li>
            </ul>
            <p>Hotel Contact: ${booking.hotel.contact.phone}</p>
            <p>Have a great stay!</p>
          `
        };

        await transporter.sendMail(mailOptions);

        // Update notification record
        booking.notifications.push({
          type: 'check_in_reminder',
          sentAt: new Date(),
          method: 'email'
        });
        await booking.save();
      }
    }

    console.log(`✅ Sent ${upcomingBookings.length} check-in reminders`);
  } catch (error) {
    console.error('❌ Error sending check-in reminders:', error);
  }
});

// Update room availability (runs every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
  try {
    const hotels = await Hotel.find({ status: 'approved' });
    
    for (const hotel of hotels) {
      for (const roomType of hotel.roomTypes) {
        // Count current bookings for this room type
        const currentBookings = await Booking.countDocuments({
          hotel: hotel._id,
          roomType: roomType.type,
          checkIn: { $lte: new Date() },
          checkOut: { $gt: new Date() },
          status: { $in: ['confirmed', 'checked-in'] }
        });

        // Update available rooms
        roomType.availableRooms = Math.max(0, roomType.totalRooms - currentBookings);
      }
      
      await hotel.save();
    }

    console.log('✅ Updated room availability for all hotels');
  } catch (error) {
    console.error('❌ Error updating room availability:', error);
  }
});

// Generate daily analytics (runs at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    const dailyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: today },
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

    // Store analytics in database or send to admin
    console.log('📊 Daily Analytics:', dailyStats[0] || { totalBookings: 0, totalRevenue: 0 });
  } catch (error) {
    console.error('❌ Error generating daily analytics:', error);
  }
});

// Clean up expired bookings (runs daily at 2 AM)
cron.schedule('0 2 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Mark no-shows
    const noShowBookings = await Booking.updateMany(
      {
        checkIn: { $lt: yesterday },
        status: 'confirmed'
      },
      {
        status: 'no-show'
      }
    );

    console.log(`✅ Marked ${noShowBookings.modifiedCount} bookings as no-show`);
  } catch (error) {
    console.error('❌ Error cleaning up expired bookings:', error);
  }
});

// Send weekly reports to hotel owners (runs every Sunday at 9 AM)
cron.schedule('0 9 * * 0', async () => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const hotelOwners = await User.find({ role: 'hotelOwner' });

    for (const owner of hotelOwners) {
      const hotels = await Hotel.find({ owner: owner._id });
      
      if (hotels.length === 0) continue;

      const hotelIds = hotels.map(h => h._id);
      
      const weeklyStats = await Booking.aggregate([
        {
          $match: {
            hotel: { $in: hotelIds },
            createdAt: { $gte: lastWeek },
            'payment.status': 'completed'
          }
        },
        {
          $group: {
            _id: '$hotel',
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        {
          $lookup: {
            from: 'hotels',
            localField: '_id',
            foreignField: '_id',
            as: 'hotel'
          }
        }
      ]);

      if (weeklyStats.length > 0) {
        // Send weekly report email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: owner.email,
          subject: 'Weekly Performance Report - Nagpur Hotels',
          html: `
            <h2>Weekly Performance Report</h2>
            <p>Dear ${owner.name},</p>
            <p>Here's your weekly performance summary:</p>
            ${weeklyStats.map(stat => `
              <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd;">
                <h3>${stat.hotel[0].name}</h3>
                <p>Bookings: ${stat.bookings}</p>
                <p>Revenue: ₹${stat.revenue.toLocaleString()}</p>
              </div>
            `).join('')}
            <p>Keep up the great work!</p>
          `
        };

        await transporter.sendMail(mailOptions);
      }
    }

    console.log('✅ Sent weekly reports to hotel owners');
  } catch (error) {
    console.error('❌ Error sending weekly reports:', error);
  }
});

console.log('⏰ Scheduled jobs initialized');