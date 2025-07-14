import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, TrendingUp, Activity } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

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
  const [recentBookings, setRecentBookings] = useState<LiveBooking[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalBookingsToday: 0,
    revenueToday: 0,
    averageBookingValue: 0,
    occupancyRate: 0,
    trendingDestination: '',
  });
  const socket = useSocket();

  useEffect(() => {
    // Mock initial data
    const mockBookings: LiveBooking[] = [
      {
        id: '1',
        hotelName: 'Grand Luxury Resort',
        guestName: 'John Doe',
        checkIn: '2024-02-20',
        checkOut: '2024-02-23',
        guests: 2,
        amount: 897,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        location: 'Malibu, CA',
        roomType: 'Ocean View Suite',
      },
      {
        id: '2',
        hotelName: 'City Center Hotel',
        guestName: 'Jane Smith',
        checkIn: '2024-02-25',
        checkOut: '2024-02-27',
        guests: 1,
        amount: 378,
        status: 'pending',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        location: 'New York, NY',
        roomType: 'Standard Room',
      },
      {
        id: '3',
        hotelName: 'Mountain View Lodge',
        guestName: 'Mike Johnson',
        checkIn: '2024-03-01',
        checkOut: '2024-03-04',
        guests: 4,
        amount: 1047,
        status: 'confirmed',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        location: 'Aspen, CO',
        roomType: 'Family Suite',
      },
    ];

    setRecentBookings(mockBookings);
    setLiveMetrics({
      totalBookingsToday: 47,
      revenueToday: 12450,
      averageBookingValue: 264,
      occupancyRate: 78,
      trendingDestination: 'Miami Beach',
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newBooking: LiveBooking = {
        id: Date.now().toString(),
        hotelName: ['Seaside Resort', 'Urban Hotel', 'Mountain Lodge', 'Beach Villa'][Math.floor(Math.random() * 4)],
        guestName: ['Alex Wilson', 'Sarah Brown', 'David Lee', 'Emma Davis'][Math.floor(Math.random() * 4)],
        checkIn: '2024-02-28',
        checkOut: '2024-03-02',
        guests: Math.floor(Math.random() * 4) + 1,
        amount: Math.floor(Math.random() * 800) + 200,
        status: Math.random() > 0.2 ? 'confirmed' : 'pending',
        timestamp: new Date().toISOString(),
        location: ['Miami, FL', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA'][Math.floor(Math.random() * 4)],
        roomType: ['Standard Room', 'Deluxe Suite', 'Ocean View', 'Mountain View'][Math.floor(Math.random() * 4)],
      };

      setRecentBookings(prev => [newBooking, ...prev.slice(0, 9)]);
      setLiveMetrics(prev => ({
        ...prev,
        totalBookingsToday: prev.totalBookingsToday + 1,
        revenueToday: prev.revenueToday + newBooking.amount,
        averageBookingValue: Math.round((prev.revenueToday + newBooking.amount) / (prev.totalBookingsToday + 1)),
      }));
    }, 15000); // New booking every 15 seconds

    // Socket.IO event listeners
    if (socket.socket) {
      socket.socket.on('newBooking', (booking: LiveBooking) => {
        setRecentBookings(prev => [booking, ...prev.slice(0, 9)]);
        setLiveMetrics(prev => ({
          ...prev,
          totalBookingsToday: prev.totalBookingsToday + 1,
          revenueToday: prev.revenueToday + booking.amount,
        }));
      });

      socket.socket.on('bookingStatusUpdate', (data: { bookingId: string; status: string }) => {
        setRecentBookings(prev =>
          prev.map(booking =>
            booking.id === data.bookingId
              ? { ...booking, status: data.status as LiveBooking['status'] }
              : booking
          )
        );
      });

      return () => {
        clearInterval(interval);
        socket.socket.off('newBooking');
        socket.socket.off('bookingStatusUpdate');
      };
    }

    return () => clearInterval(interval);
  }, [socket.socket]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-6 w-6 text-blue-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-blue-200 animate-pulse" />
              <span className="text-xs text-blue-200">Live</span>
            </div>
          </div>
          <div className="text-2xl font-bold">{liveMetrics.totalBookingsToday}</div>
          <div className="text-blue-200 text-sm">Bookings Today</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-6 w-6 text-green-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-green-200 animate-pulse" />
              <span className="text-xs text-green-200">Live</span>
            </div>
          </div>
          <div className="text-2xl font-bold">${liveMetrics.revenueToday.toLocaleString()}</div>
          <div className="text-green-200 text-sm">Revenue Today</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-purple-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-purple-200 animate-pulse" />
              <span className="text-xs text-purple-200">Live</span>
            </div>
          </div>
          <div className="text-2xl font-bold">{liveMetrics.occupancyRate}%</div>
          <div className="text-purple-200 text-sm">Occupancy Rate</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="h-6 w-6 text-orange-200" />
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-orange-200 animate-pulse" />
              <span className="text-xs text-orange-200">Live</span>
            </div>
          </div>
          <div className="text-lg font-bold">{liveMetrics.trendingDestination}</div>
          <div className="text-orange-200 text-sm">Trending Destination</div>
        </div>
      </div>

      {/* Live Booking Feed */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Live Booking Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time updates</span>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No recent bookings</p>
            </div>
          ) : (
            recentBookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 ${
                  index === 0 ? 'ring-2 ring-primary-200 bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-500' : 
                      booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <h4 className="font-medium text-gray-900">{booking.guestName}</h4>
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Hotel</p>
                    <p className="font-medium">{booking.hotelName}</p>
                    <p className="text-xs text-gray-500">{booking.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Room</p>
                    <p className="font-medium">{booking.roomType}</p>
                    <p className="text-xs text-gray-500">{booking.guests} guests</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Dates</p>
                    <p className="font-medium">{booking.checkIn}</p>
                    <p className="text-xs text-gray-500">to {booking.checkOut}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-primary-600">${booking.amount}</p>
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