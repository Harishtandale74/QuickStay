import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, TrendingUp, Activity, Loader } from 'lucide-react';
import useSocket from '../../hooks/useSocket';

interface LiveBooking {
  id: string;
  hotelName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  timestamp: string;
  location: string;
  roomType: string;
}

interface LiveMetrics {
  totalBookingsToday: number;
  revenueToday: number;
  averageBookingValue: number;
  occupancyRate: number;
  trendingDestination: string;
}

const LiveBookingUpdates: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState<LiveBooking[]>([
    {
      id: '1',
      hotelName: 'The Pride Hotel Nagpur',
      guestName: 'John Doe',
      checkIn: '2024-02-20',
      checkOut: '2024-02-23',
      guests: 2,
      amount: 8550,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      location: 'Sitabuldi, Nagpur',
      roomType: 'Standard Room',
    },
    {
      id: '2',
      hotelName: 'Radisson Blu Hotel',
      guestName: 'Jane Smith',
      checkIn: '2024-02-25',
      checkOut: '2024-02-27',
      guests: 1,
      amount: 7200,
      status: 'pending',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      location: 'Wardha Road, Nagpur',
      roomType: 'Deluxe Room',
    }
  ]);
  
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalBookingsToday: 47,
    revenueToday: 125000,
    averageBookingValue: 2659,
    occupancyRate: 78,
    trendingDestination: 'Sitabuldi',
  });

  const { isConnected } = useSocket();

  useEffect(() => {
    // Simulate live updates with proper cleanup
    const interval = setInterval(() => {
      // Update metrics
      setLiveMetrics(prev => ({
        ...prev,
        totalBookingsToday: prev.totalBookingsToday + Math.floor(Math.random() * 2),
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 5000),
        occupancyRate: Math.max(60, Math.min(95, prev.occupancyRate + Math.floor(Math.random() * 6) - 3)),
      }));

      // Add new booking occasionally
      if (Math.random() > 0.7) {
        const newBooking: LiveBooking = {
          id: Date.now().toString(),
          hotelName: ['Hotel Centre Point', 'Le Meridien', 'Tuli Imperial'][Math.floor(Math.random() * 3)],
          guestName: ['Alex Wilson', 'Sarah Brown', 'David Lee'][Math.floor(Math.random() * 3)],
          checkIn: '2024-02-28',
          checkOut: '2024-03-02',
          guests: Math.floor(Math.random() * 4) + 1,
          amount: Math.floor(Math.random() * 5000) + 3000,
          status: Math.random() > 0.2 ? 'confirmed' : 'pending',
          timestamp: new Date().toISOString(),
          location: ['Sitabuldi', 'Civil Lines', 'Dharampeth'][Math.floor(Math.random() * 3)] + ', Nagpur',
          roomType: ['Standard', 'Deluxe', 'Suite'][Math.floor(Math.random() * 3)] + ' Room',
        };

        setRecentBookings(prev => [newBooking, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Live Metrics - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 md:p-4 text-white">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-blue-200 animate-pulse" />
              <span className="text-xs text-blue-200">Live</span>
            </div>
          </div>
          <div className="text-lg md:text-2xl font-bold">{liveMetrics.totalBookingsToday}</div>
          <div className="text-blue-200 text-xs md:text-sm">Today</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 md:p-4 text-white">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-green-200 animate-pulse" />
              <span className="text-xs text-green-200">Live</span>
            </div>
          </div>
          <div className="text-lg md:text-2xl font-bold">₹{(liveMetrics.revenueToday / 1000).toFixed(0)}K</div>
          <div className="text-green-200 text-xs md:text-sm">Revenue</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 md:p-4 text-white">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-purple-200 animate-pulse" />
              <span className="text-xs text-purple-200">Live</span>
            </div>
          </div>
          <div className="text-lg md:text-2xl font-bold">{liveMetrics.occupancyRate}%</div>
          <div className="text-purple-200 text-xs md:text-sm">Occupancy</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 md:p-4 text-white">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-orange-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-orange-200 animate-pulse" />
              <span className="text-xs text-orange-200">Live</span>
            </div>
          </div>
          <div className="text-sm md:text-lg font-bold">{liveMetrics.trendingDestination}</div>
          <div className="text-orange-200 text-xs md:text-sm">Trending</div>
        </div>
      </div>

      {/* Live Booking Feed */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Recent Bookings</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm text-gray-600">Real-time</span>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 max-h-64 md:max-h-80 overflow-y-auto">
          {recentBookings.length === 0 ? (
            <div className="text-center py-6 md:py-8">
              <Loader className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-2 animate-spin" />
              <p className="text-gray-600 text-sm md:text-base">Loading bookings...</p>
            </div>
          ) : (
            recentBookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`border border-gray-200 rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-all duration-300 ${
                  index === 0 ? 'ring-1 ring-primary-200 bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-500' : 
                      booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">{booking.guestName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(booking.timestamp)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <p className="text-gray-600">Hotel</p>
                    <p className="font-medium truncate">{booking.hotelName}</p>
                    <p className="text-xs text-gray-500 truncate">{booking.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Room</p>
                    <p className="font-medium">{booking.roomType}</p>
                    <p className="text-xs text-gray-500">{booking.guests} guests</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Dates</p>
                    <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">to {new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-primary-600">₹{booking.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">total</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveBookingUpdates;