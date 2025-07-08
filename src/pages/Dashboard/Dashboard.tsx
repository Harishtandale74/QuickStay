import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Hotel, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Star,
  MapPin,
  Users,
  Clock,
  Activity
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { fetchMyBookings, fetchBookingAnalytics } from '../../store/slices/bookingSlice';
import LiveBookingUpdates from '../../components/RealTime/LiveBookingUpdates';
import LiveDataFeed from '../../components/RealTime/LiveDataFeed';
import useSocket from '../../hooks/useSocket';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, analytics, loading } = useSelector((state: RootState) => state.bookings);
  const [activeTab, setActiveTab] = useState('overview');
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBookings({ limit: 5 }));
      if (user.role === 'admin' || user.role === 'hotelOwner') {
        dispatch(fetchBookingAnalytics());
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Track dashboard visit
    if (socket && user) {
      socket.trackUserActivity('visited_dashboard');
    }
  }, [socket, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getQuickStats = () => {
    if (user?.role === 'admin') {
      return [
        {
          title: 'Total Bookings Today',
          value: analytics?.todayBookings || 0,
          icon: <Calendar className="h-6 w-6" />,
          color: 'bg-blue-500',
          change: '+12%'
        },
        {
          title: 'Revenue Today',
          value: `₹${(analytics?.todayRevenue || 0).toLocaleString()}`,
          icon: <DollarSign className="h-6 w-6" />,
          color: 'bg-green-500',
          change: '+8%'
        },
        {
          title: 'Current Occupancy',
          value: `${analytics?.currentOccupancy || 0}%`,
          icon: <TrendingUp className="h-6 w-6" />,
          color: 'bg-purple-500',
          change: '+5%'
        },
        {
          title: 'Check-ins Today',
          value: analytics?.todayCheckIns || 0,
          icon: <Users className="h-6 w-6" />,
          color: 'bg-orange-500',
          change: '+3%'
        }
      ];
    } else if (user?.role === 'hotelOwner') {
      return [
        {
          title: 'My Hotels',
          value: 3, // This would come from API
          icon: <Hotel className="h-6 w-6" />,
          color: 'bg-blue-500',
          change: 'Active'
        },
        {
          title: 'Total Bookings',
          value: 156,
          icon: <Calendar className="h-6 w-6" />,
          color: 'bg-green-500',
          change: '+15%'
        },
        {
          title: 'Revenue This Month',
          value: '₹2,45,000',
          icon: <DollarSign className="h-6 w-6" />,
          color: 'bg-purple-500',
          change: '+22%'
        },
        {
          title: 'Average Rating',
          value: '4.8',
          icon: <Star className="h-6 w-6" />,
          color: 'bg-yellow-500',
          change: '+0.2'
        }
      ];
    } else {
      return [
        {
          title: 'Total Bookings',
          value: bookings.length,
          icon: <Calendar className="h-6 w-6" />,
          color: 'bg-blue-500',
          change: 'All time'
        },
        {
          title: 'Upcoming Trips',
          value: bookings.filter(b => new Date(b.checkIn) > new Date()).length,
          icon: <Clock className="h-6 w-6" />,
          color: 'bg-green-500',
          change: 'This month'
        },
        {
          title: 'Loyalty Points',
          value: user?.loyaltyPoints || 0,
          icon: <Star className="h-6 w-6" />,
          color: 'bg-purple-500',
          change: 'Earned'
        },
        {
          title: 'Favorite Hotels',
          value: user?.favorites?.length || 0,
          icon: <Hotel className="h-6 w-6" />,
          color: 'bg-orange-500',
          change: 'Saved'
        }
      ];
    }
  };

  const quickStats = getQuickStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Welcome to your Nagpur Hotels dashboard</span>
              </p>
            </div>
            
            {user?.role === 'hotelOwner' && (
              <Link
                to="/dashboard/add-hotel"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Hotel</span>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
                { id: 'bookings', label: 'My Bookings', icon: <Calendar className="h-4 w-4" /> },
                ...(user?.role === 'admin' || user?.role === 'hotelOwner' 
                  ? [{ id: 'analytics', label: 'Live Analytics', icon: <TrendingUp className="h-4 w-4" /> }]
                  : []
                ),
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
                
                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
                        ))}
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-3">
                        {bookings.slice(0, 3).map((booking) => (
                          <div key={booking._id} className="bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{booking.hotel.name}</h4>
                                <p className="text-sm text-gray-600">{booking.hotel.location.area}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'checked-in'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No bookings yet</p>
                        <Link
                          to="/hotels"
                          className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block"
                        >
                          Browse Hotels
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        to="/hotels"
                        className="block w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-colors text-center"
                      >
                        Book a Hotel
                      </Link>
                      
                      {user?.role === 'hotelOwner' && (
                        <Link
                          to="/dashboard/add-hotel"
                          className="block w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors text-center"
                        >
                          Add New Hotel
                        </Link>
                      )}
                      
                      <Link
                        to="/profile"
                        className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-colors text-center"
                      >
                        Update Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Nagpur Weather & Info */}
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nagpur Today</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Weather:</span>
                      <span className="ml-2 font-medium">28°C, Sunny</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Best for:</span>
                      <span className="ml-2 font-medium">Sightseeing</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Popular area:</span>
                      <span className="ml-2 font-medium">Sitabuldi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
                  <Link
                    to="/hotels"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Book New Hotel
                  </Link>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                    ))}
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.hotel.name}</h3>
                            <p className="text-gray-600">{booking.hotel.location.area}, Nagpur</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'checked-in'
                              ? 'bg-blue-100 text-blue-800'
                              : booking.status === 'checked-out'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Booking ID</p>
                            <p className="font-medium">{booking.bookingId}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-in</p>
                            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-out</p>
                            <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium text-orange-600">₹{booking.pricing.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-3">
                          <Link
                            to={`/bookings/${booking.bookingId}`}
                            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                          >
                            View Details
                          </Link>
                          {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                            <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start exploring amazing hotels in Nagpur</p>
                    <Link
                      to="/hotels"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Browse Hotels
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (user?.role === 'admin' || user?.role === 'hotelOwner') && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Live Analytics</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <LiveBookingUpdates />
                  <LiveDataFeed />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;