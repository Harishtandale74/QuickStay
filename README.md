# 🏨 Nagpur Hotel Booking System

A comprehensive real-time hotel booking platform specifically designed for Nagpur, Maharashtra, India. Features AI-powered recommendations, real-time updates, and seamless booking experience.

## 🌟 Features

### ✨ Core Features
- **Real-time hotel booking** with instant confirmation
- **AI-powered recommendations** based on user preferences
- **Live availability tracking** across all hotels
- **Weather integration** for Nagpur
- **Interactive maps** with hotel locations
- **Multi-role support** (Users, Hotel Owners, Admins)

### 🔄 Real-time Features
- **Live booking updates** and notifications
- **Real-time price tracking** and alerts
- **Socket.io integration** for instant updates
- **Live occupancy monitoring**
- **Weather updates** for travel planning
- **Connection status** indicators

### 🏙️ Nagpur-Specific Features
- **18 major areas** of Nagpur covered
- **Local landmarks** integration
- **Weather data** for the Orange City
- **Indian payment methods** (Razorpay)
- **Local phone number** validation
- **INR currency** support

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Socket.io Client** for real-time features
- **Lucide React** for icons
- **React Hook Form** with Zod validation

### Backend (Included)
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.io** for real-time communication
- **JWT** authentication
- **Razorpay** payment integration
- **Nodemailer** for emails
- **Node-cron** for scheduled tasks

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud)
- **Git**

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd nagpur-hotel-booking

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create environment files:

```bash
# Frontend environment
cp .env.example .env

# Backend environment
cp server/.env.example server/.env
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=ws://localhost:5000
VITE_DEV_MODE=true
VITE_ENABLE_MOCK_DATA=true
```

**Backend (server/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/nagpur-hotels
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Start MongoDB (if using local)
mongod

# Seed the database with sample data
cd server
npm run seed
cd ..
```

### 4. Start the Application

**Option 1: Development Mode (Recommended)**
```bash
# Start frontend only (uses mock data)
npm run dev
```

**Option 2: Full Stack**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Socket.io**: ws://localhost:5000

## 🔑 Demo Credentials

### Admin Access
- **Email**: admin@nagpurhotels.com
- **Password**: admin123

### Hotel Owner
- **Email**: owner1@nagpurhotels.com
- **Password**: owner123

### Regular User
- **Email**: user1@example.com
- **Password**: user123

## 📱 How to Use

### For Travelers (Users)
1. **Register/Login** with your email
2. **Search hotels** by area, dates, or preferences
3. **View real-time availability** and prices
4. **Book instantly** with secure payment
5. **Track bookings** in your dashboard
6. **Leave reviews** after your stay

### For Hotel Owners
1. **Register as Hotel Owner**
2. **Add your hotel** with details and images
3. **Manage bookings** and availability
4. **View analytics** and revenue reports
5. **Respond to reviews** and queries

### For Admins
1. **Login with admin credentials**
2. **Approve/reject** hotel submissions
3. **Monitor platform** activity
4. **View real-time analytics**
5. **Manage users** and content

## 🔧 Development Features

### Mock Data System
- **Realistic hotel data** for Nagpur
- **Simulated bookings** and reviews
- **Weather simulation** for testing
- **Real-time event simulation**

### Development Tools
- **Hot reload** for instant updates
- **TypeScript** for type safety
- **ESLint** for code quality
- **Error boundaries** for stability

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Hotels
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/featured` - Get featured hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (Owner only)
- `GET /api/hotels/area/:area` - Get hotels by area

### Bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/verify-payment` - Verify payment
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Real-time Events
- `newBooking` - New booking created
- `bookingConfirmed` - Payment confirmed
- `priceChanged` - Hotel price updated
- `weatherUpdate` - Weather data updated

## 🏗️ Project Structure

```
nagpur-hotel-booking/
├── src/
│   ├── components/          # React components
│   │   ├── AI/             # AI-powered features
│   │   ├── Home/           # Homepage components
│   │   ├── Hotels/         # Hotel-related components
│   │   ├── Layout/         # Layout components
│   │   ├── Nagpur/         # Nagpur-specific components
│   │   ├── RealTime/       # Real-time features
│   │   └── Payment/        # Payment components
│   ├── pages/              # Page components
│   ├── store/              # Redux store and slices
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   └── data/               # Static data and constants
├── server/                 # Backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── jobs/               # Scheduled jobs
│   └── socket/             # Socket.io handlers
└── public/                 # Static assets
```

## 🔧 Troubleshooting

### Common Issues

**1. Registration Failed**
- Check if email format is valid
- Ensure phone number is 10 digits starting with 6-9
- Verify network connection

**2. Socket Connection Issues**
- Check if backend is running on port 5000
- Verify VITE_SOCKET_URL in .env file
- Try refreshing the page

**3. Database Connection**
- Ensure MongoDB is running
- Check MONGODB_URI in server/.env
- Run `npm run seed` to populate data

**4. Payment Issues**
- Add Razorpay keys in environment
- Test with demo credentials
- Check network connectivity

### Development Mode
The app works perfectly in development mode with mock data:
- No backend required for basic functionality
- Real-time features simulated
- All user flows work with mock responses

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd server
# Set environment variables
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and queries:
- **Email**: support@nagpurhotels.com
- **Phone**: +91-712-XXXXXX
- **Location**: Nagpur, Maharashtra, India

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for Nagpur - The Orange City** 🍊