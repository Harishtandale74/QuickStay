const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nagpur-hotels');

const nagpurAreas = [
  'Sitabuldi', 'Sadar', 'Dharampeth', 'Civil Lines', 'Ramdaspeth',
  'Mahal', 'Gandhibagh', 'Itwari', 'Kamptee Road', 'Wardha Road',
  'Amravati Road', 'Katol Road', 'Seminary Hills', 'Hingna Road',
  'Koradi Road', 'Manish Nagar', 'Pratap Nagar', 'Trimurti Nagar'
];

const hotelNames = [
  'The Pride Hotel', 'Radisson Blu Hotel', 'Hotel Centre Point',
  'Tuli Imperial', 'Hotel Hardeo', 'The Nagpur Ashok',
  'Hotel Skylark', 'Regenta Central Herald', 'Hotel Airport Centre Point',
  'Le Meridien Nagpur', 'Marriott Nagpur', 'Hyatt Regency Nagpur',
  'ITC Grand Central', 'Taj Gateway Hotel', 'Fortune Park Centre Point',
  'Hotel Rahul Palace', 'Hotel Midland', 'Hotel Rajkamal',
  'Hotel Panchavati', 'Hotel Abhishek'
];

const amenities = [
  'WiFi', 'AC', 'TV', 'Parking', 'Restaurant', 'Room Service',
  'Gym', 'Swimming Pool', 'Spa', 'Conference Hall', 'Laundry',
  'Airport Shuttle', 'Bar', 'Garden', 'Terrace', 'Elevator',
  'Power Backup', 'CCTV', '24/7 Reception', 'Housekeeping'
];

const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Booking.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@nagpurhotels.com',
      password: adminPassword,
      phone: '9876543210',
      role: 'admin',
      verification: {
        email: true,
        phone: true
      }
    });
    await admin.save();

    // Create hotel owners
    const hotelOwners = [];
    for (let i = 0; i < 10; i++) {
      const ownerPassword = await bcrypt.hash('owner123', 12);
      const owner = new User({
        name: `Hotel Owner ${i + 1}`,
        email: `owner${i + 1}@nagpurhotels.com`,
        password: ownerPassword,
        phone: `987654321${i}`,
        role: 'hotelOwner',
        verification: {
          email: true,
          phone: true
        }
      });
      await owner.save();
      hotelOwners.push(owner);
    }

    // Create regular users
    const users = [];
    for (let i = 0; i < 20; i++) {
      const userPassword = await bcrypt.hash('user123', 12);
      const user = new User({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: userPassword,
        phone: `876543210${i}`,
        role: 'user',
        verification: {
          email: true,
          phone: true
        }
      });
      await user.save();
      users.push(user);
    }

    console.log('👥 Created users');

    // Create hotels
    const hotels = [];
    for (let i = 0; i < hotelNames.length; i++) {
      const area = nagpurAreas[Math.floor(Math.random() * nagpurAreas.length)];
      const owner = hotelOwners[Math.floor(Math.random() * hotelOwners.length)];
      
      // Generate coordinates within Nagpur bounds
      const latitude = 21.0 + Math.random() * 0.3;
      const longitude = 78.8 + Math.random() * 0.5;

      const hotelAmenities = amenities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 10) + 5);

      const hotelRoomTypes = roomTypes.slice(0, Math.floor(Math.random() * 3) + 2).map(type => ({
        type,
        price: Math.floor(Math.random() * 5000) + 1000,
        capacity: {
          adults: type === 'Presidential' ? 4 : type === 'Suite' ? 3 : 2,
          children: 2
        },
        amenities: hotelAmenities.slice(0, 5),
        totalRooms: Math.floor(Math.random() * 20) + 10,
        availableRooms: Math.floor(Math.random() * 15) + 5,
        images: [
          'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
          'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg'
        ]
      }));

      const hotel = new Hotel({
        name: hotelNames[i],
        description: `Experience luxury and comfort at ${hotelNames[i]}, located in the heart of ${area}, Nagpur. Our hotel offers world-class amenities and exceptional service to make your stay memorable.`,
        shortDescription: `Luxury hotel in ${area} with modern amenities and excellent service.`,
        location: {
          address: `${Math.floor(Math.random() * 100) + 1}, ${area} Road, ${area}, Nagpur, Maharashtra 440001`,
          area,
          coordinates: {
            latitude,
            longitude
          },
          nearbyLandmarks: [
            'Nagpur Railway Station',
            'Dr. Babasaheb Ambedkar International Airport',
            'Deekshabhoomi',
            'Sitabuldi Fort'
          ].slice(0, Math.floor(Math.random() * 3) + 1)
        },
        images: [
          {
            url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
            caption: 'Hotel Exterior',
            isPrimary: true
          },
          {
            url: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
            caption: 'Lobby Area'
          },
          {
            url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
            caption: 'Guest Room'
          }
        ],
        amenities: hotelAmenities,
        roomTypes: hotelRoomTypes,
        rating: {
          average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
          count: Math.floor(Math.random() * 500) + 50
        },
        owner: owner._id,
        contact: {
          phone: `0712${Math.floor(Math.random() * 900000) + 100000}`,
          email: `info@${hotelNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
          website: `https://www.${hotelNames[i].toLowerCase().replace(/\s+/g, '')}.com`
        },
        policies: {
          checkIn: '14:00',
          checkOut: '11:00',
          cancellation: 'Free cancellation up to 24 hours before check-in',
          petPolicy: 'Pets allowed with additional charges',
          smokingPolicy: 'No Smoking'
        },
        status: Math.random() > 0.1 ? 'approved' : 'pending', // 90% approved
        featured: Math.random() > 0.7, // 30% featured
        verified: true,
        totalBookings: Math.floor(Math.random() * 1000),
        revenue: Math.floor(Math.random() * 500000) + 100000
      });

      // Add some reviews
      const reviewCount = Math.floor(Math.random() * 20) + 5;
      for (let j = 0; j < reviewCount; j++) {
        const reviewer = users[Math.floor(Math.random() * users.length)];
        hotel.reviews.push({
          user: reviewer._id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          comment: [
            'Excellent service and comfortable rooms!',
            'Great location and friendly staff.',
            'Clean rooms and good amenities.',
            'Would definitely stay here again.',
            'Perfect for business travelers.',
            'Family-friendly hotel with great facilities.'
          ][Math.floor(Math.random() * 6)],
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          helpful: Math.floor(Math.random() * 20)
        });
      }

      hotel.calculateAverageRating();
      await hotel.save();
      hotels.push(hotel);
    }

    console.log('🏨 Created hotels');

    // Create bookings
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const hotel = hotels[Math.floor(Math.random() * hotels.length)];
      const roomType = hotel.roomTypes[Math.floor(Math.random() * hotel.roomTypes.length)];
      
      const checkIn = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000); // Next 90 days
      const checkOut = new Date(checkIn.getTime() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000); // 1-7 nights
      
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalRoomCost = roomType.price * nights;
      const taxes = Math.round(totalRoomCost * 0.12);
      const serviceFee = Math.round(totalRoomCost * 0.02);
      const totalAmount = totalRoomCost + taxes + serviceFee;

      const booking = new Booking({
        user: user._id,
        hotel: hotel._id,
        roomType: roomType.type,
        checkIn,
        checkOut,
        guests: {
          adults: Math.floor(Math.random() * 3) + 1,
          children: Math.floor(Math.random() * 2)
        },
        nights,
        pricing: {
          roomPrice: roomType.price,
          totalRoomCost,
          taxes,
          serviceFee,
          totalAmount
        },
        payment: {
          method: ['razorpay', 'upi', 'card'][Math.floor(Math.random() * 3)],
          transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
          status: Math.random() > 0.1 ? 'completed' : 'pending',
          paidAt: new Date()
        },
        status: ['confirmed', 'checked-in', 'checked-out'][Math.floor(Math.random() * 3)],
        guestDetails: {
          primaryGuest: {
            name: user.name,
            phone: user.phone,
            email: user.email,
            idType: 'aadhar',
            idNumber: `${Math.floor(Math.random() * 900000000000) + 100000000000}`
          },
          specialRequests: Math.random() > 0.7 ? 'Early check-in requested' : '',
          arrivalTime: '15:00'
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
      });

      await booking.save();
    }

    console.log('📅 Created bookings');
    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@nagpurhotels.com / admin123');
    console.log('Hotel Owner: owner1@nagpurhotels.com / owner123');
    console.log('User: user1@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();