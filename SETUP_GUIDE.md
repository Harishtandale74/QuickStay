# 🚀 Quick Setup Guide for Nagpur Hotel Booking System

## ⚡ Super Quick Start (Recommended)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit: http://localhost:5173

**That's it! The app runs with mock data in development mode.**

## 🎯 What You'll See

### ✅ Working Features (No Backend Required)
- ✅ **User Registration/Login** with validation
- ✅ **Hotel Search & Filtering** for Nagpur areas
- ✅ **Real-time Weather** for Nagpur
- ✅ **Interactive Maps** with hotel locations
- ✅ **Booking Flow** with mock payment
- ✅ **Dashboard** with analytics
- ✅ **AI Recommendations** and chat
- ✅ **Real-time Notifications** (simulated)

### 🔑 Test Accounts
Try these credentials:

**Admin Access:**
- Email: `admin@nagpurhotels.com`
- Password: `admin123`

**Hotel Owner:**
- Email: `owner@nagpurhotels.com`
- Password: `owner123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

**Or register a new account with:**
- Valid email format
- 10-digit Indian mobile (start with 6-9)
- Any password (6+ characters)

## 🏨 Explore Features

### 1. Search Hotels
- Browse hotels in different Nagpur areas
- Filter by price, amenities, ratings
- View real-time availability
- Check weather conditions

### 2. Book a Hotel
- Select dates and guests
- View pricing breakdown
- Complete mock payment
- Get booking confirmation

### 3. Dashboard Features
- View booking history
- Check real-time analytics (Admin/Owner)
- Manage profile and preferences
- Track favorite hotels

### 4. Real-time Features
- Live connection status in header
- Real-time weather updates
- Booking notifications
- Live data feed (Admin dashboard)

## 🔧 Advanced Setup (Optional)

### Full Backend Setup
If you want to run the complete system:

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Set up environment
cp .env.example .env
# Edit server/.env with your MongoDB URI

# 3. Start MongoDB and seed data
mongod
npm run seed

# 4. Start backend
npm run dev

# 5. In another terminal, start frontend
cd ..
npm run dev
```

### Environment Configuration
Create `.env` file in root:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=ws://localhost:5000
VITE_DEV_MODE=true
VITE_ENABLE_MOCK_DATA=true
```

## 🎯 Key Features to Test

### 1. Hotel Search & Booking
- Search for hotels in different Nagpur areas
- Use filters (price, amenities, ratings)
- Complete a booking flow
- View booking confirmation

### 2. Real-time Features
- Watch connection status in header
- See live weather updates
- Get booking notifications
- Monitor live data feed (admin)

### 3. User Roles
- **User**: Search, book, review hotels
- **Hotel Owner**: Add hotels, manage bookings
- **Admin**: Approve hotels, view analytics

### 4. Nagpur-Specific Features
- 18 areas of Nagpur covered
- Local weather integration
- Indian phone number validation
- INR currency support

## 🐛 Troubleshooting

### Common Issues & Solutions

**Registration not working?**
- Use valid email format (user@example.com)
- Phone: 10 digits starting with 6-9 (9876543210)
- Password: minimum 6 characters

**Page not loading?**
- Check if running on http://localhost:5173
- Try refreshing the browser
- Clear browser cache

**Features not working?**
- All features work with mock data
- No backend required for testing
- Check browser console for errors

## 🎉 Success!

You should now see:
- ✅ Beautiful, responsive UI
- ✅ Working hotel search and booking
- ✅ Real-time weather for Nagpur
- ✅ Interactive maps and features
- ✅ Complete user authentication
- ✅ Dashboard with analytics

## 📞 Need Help?

If you encounter any issues:
1. Check this guide again
2. Look at browser console for errors
3. Try refreshing the page
4. Restart the development server

**The system is designed to work perfectly in development mode with mock data - no complex setup required!**

---

**Happy Coding! 🚀**
</bozAction>