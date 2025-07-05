# Nagpur Hotels Backend

A comprehensive real-time hotel booking backend specifically designed for Nagpur, Maharashtra, India.

## Features

### 🏨 Hotel Management
- Complete hotel CRUD operations
- Nagpur-specific location areas
- Real-time room availability
- Image gallery management
- Amenities and room type management
- Review and rating system

### 📅 Booking System
- Real-time booking with availability checks
- Razorpay payment integration
- Booking confirmation and management
- Cancellation with refund policies
- Check-in/check-out reminders

### 👥 User Management
- Role-based authentication (User, Hotel Owner, Admin)
- Profile management
- Booking history
- Favorites system
- Loyalty points

### 🔄 Real-time Features
- Live booking updates
- Real-time availability
- Socket.IO integration
- Live chat support
- Push notifications

### 📊 Analytics & Reporting
- Real-time booking analytics
- Revenue tracking
- Occupancy rates
- Daily/weekly reports
- Performance metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Payment**: Razorpay
- **Email**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Scheduling**: Node-cron

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables in `.env`

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Hotels
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/featured` - Get featured hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (Hotel Owner)
- `PUT /api/hotels/:id` - Update hotel
- `POST /api/hotels/:id/reviews` - Add review

### Bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/verify-payment` - Verify payment
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

## Nagpur-Specific Features

### Location Areas
The system includes all major areas of Nagpur:
- Sitabuldi (Central Business District)
- Civil Lines (Government Area)
- Dharampeth (Residential)
- Sadar (Commercial)
- And 14 more areas

### Local Integration
- Indian mobile number validation
- GST calculation (12%)
- Razorpay payment gateway
- Indian address format
- Local landmarks integration

## Real-time Events

### Socket.IO Events
- `newBooking` - New booking created
- `bookingConfirmed` - Payment confirmed
- `availabilityUpdate` - Room availability changed
- `newReview` - New hotel review
- `supportMessage` - Customer support chat

## Scheduled Jobs

- **Hourly**: Check-in reminders
- **Every 30 minutes**: Room availability updates
- **Daily**: Analytics generation, expired booking cleanup
- **Weekly**: Performance reports to hotel owners

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Joi
- SQL injection prevention

## Database Schema

### Users
- Personal information
- Authentication details
- Booking history
- Preferences and favorites

### Hotels
- Complete hotel information
- Location with coordinates
- Room types and pricing
- Amenities and policies
- Reviews and ratings

### Bookings
- Booking details
- Payment information
- Guest details
- Status tracking

## Development

### Running in Development
```bash
npm run dev
```

### Seeding Data
```bash
npm run seed
```

### Environment Variables
See `.env.example` for required environment variables.

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SSL certificates
4. Configure reverse proxy (Nginx)
5. Set up monitoring and logging

## Support

For support and queries, contact the development team.