import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  Hotel, 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Clock,
  Bell,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  Brain,
  Sparkles,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LiveBookingUpdates from '../../components/RealTime/LiveBookingUpdates';
import AIRecommendations from '../../components/AI/AIRecommendations';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    occupancyRate: 0,
    revenueGrowth: 0,
    bookingGrowth: 0,
    newCustomers: 0,
    aiScore: 0,
    predictedRevenue: 0,
  });

  // Mock data - in real app, fetch from API
  const mockHotels = [
    {
      id: '1',
      name: 'Grand Luxury Resort',
      location: 'Malibu, California',
      price: 299,
      rating: 4.9,
      reviewCount: 1234,
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400',
      rooms: 150,
      occupancy: 85,
      status: 'active',
      revenue: 45000,
      bookingsThisMonth: 156,
      averageStay: 3.2,
      repeatCustomers: 68,
      aiOptimizationScore: 92,
    },
    {
      id: '2',
      name: 'City Center Hotel',
      location: 'New York, NY',
      price: 189,
      rating: 4.7,
      reviewCount: 892,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400',
      rooms: 85,
      occupancy: 92,
      status: 'active',
      revenue: 28000,
      bookingsThisMonth: 98,
      averageStay: 2.1,
      repeatCustomers: 45,
      aiOptimizationScore: 88,
    },
  ];

  const mockBookings = [
    {
      id: '1',
      hotelName: 'Grand Luxury Resort',
      guestName: 'John Doe',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      guests: 2,
      amount: 897,
      status: 'confirmed',
      roomType: 'Ocean View Suite',
      source: 'Direct',
      aiPredictedSatisfaction: 94,
    },
    {
      id: '2',
      hotelName: 'City Center Hotel',
      guestName: 'Jane Smith',
      checkIn: '2024-02-20',
      checkOut: '2024-02-22',
      guests: 1,
      amount: 378,
      status: 'pending',
      roomType: 'Standard Room',
      source: 'Booking.com',
      aiPredictedSatisfaction: 87,
    },
  ];

  const mockUserBookings = [
    {
      id: '1',
      hotelName: 'Grand Luxury Resort',
      location: 'Malibu, California',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      status: 'upcoming',
      amount: 897,
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=300',
      roomType: 'Ocean View Suite',
      confirmationCode: 'QS123456',
      aiRecommendedUpgrades: ['Spa Package', 'Late Checkout'],
    },
    {
      id: '2',
      hotelName: 'City Center Hotel',
      location: 'New York, NY',
      checkIn: '2024-01-10',
      checkOut: '2024-01-12',
      status: 'completed',
      amount: 378,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=300',
      roomType: 'Standard Room',
      confirmationCode: 'QS789012',
      aiRecommendedUpgrades: [],
    },
  ];

  const mockAiInsights = [
    {
      id: '1',
      type: 'revenue',
      title: 'Revenue Optimization',
      insight: 'Increase prices by 8% on weekends to maximize revenue',
      impact: '+$2,400/month',
      confidence: 89,
      action: 'Apply Dynamic Pricing',
    },
    {
      id: '2',
      type: 'occupancy',
      title: 'Occupancy Boost',
      insight: 'Offer 15% discount for 3+ night stays to increase occupancy',
      impact: '+12% occupancy',
      confidence: 92,
      action: 'Create Package Deal',
    },
    {
      id: '3',
      type: 'satisfaction',
      title: 'Guest Satisfaction',
      insight: 'Add complimentary breakfast to increase guest satisfaction',
      impact: '+0.3 rating points',
      confidence: 85,
      action: 'Update Amenities',
    },
  ];

  useEffect(() => {
    // Simulate API calls
    setHotels(mockHotels);
    setBookings(user?.role === 'user' ? mockUserBookings : mockBookings);
    setAiInsights(mockAiInsights);
    setStats({
      totalHotels: mockHotels.length,
      totalBookings: mockBookings.length,
      totalRevenue: mockBookings.reduce((sum, booking) => sum + booking.amount, 0),
      averageRating: mockHotels.reduce((sum, hotel) => sum + hotel.rating, 0) / mockHotels.length,
      occupancyRate: mockHotels.reduce((sum, hotel) => sum + hotel.occupancy, 0) / mockHotels.length,
      revenueGrowth: 12.5,
      bookingGrowth: 8.3,
      newCustomers: 24,
      aiScore: 90,
      predictedRevenue: 85000,
    });
  }, [user?.role]);

  const handleDeleteHotel = (hotelId: string) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      setHotels(hotels.filter(hotel => hotel.id !== hotelId));
      toast.success('Hotel deleted successfully');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedMessage = () => {
    if (user?.role === 'user') {
      return "Your AI travel assistant has new recommendations!";
    } else if (user?.role === 'hotelOwner') {
      return "AI insights are ready to boost your revenue!";
    } else {
      return "Platform intelligence at your fingertips!";
    }
  };

  // User Dashboard
  if (user?.role === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* AI-Enhanced Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {getGreeting()}, {user?.name}! 👋
                    </h1>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xl text-gray-600">{getPersonalizedMessage()}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">AI Travel Score</div>
                  <div className="text-3xl font-bold text-purple-600">{stats.aiScore}%</div>
                  <div className="text-sm text-gray-500">Optimized Profile</div>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Trips</p>
                      <p className="text-2xl font-bold">{mockUserBookings.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-blue-200" />
                    <span className="text-xs text-blue-200">AI optimized</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Spent</p>
                      <p className="text-2xl font-bold">${mockUserBookings.reduce((sum, b) => sum + b.amount, 0)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-200" />
                    <span className="text-xs text-green-200">Saved $245 with AI</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Favorite City</p>
                      <p className="text-lg font-bold">New York</p>
                    </div>
                    <MapPin className="h-8 w-8 text-purple-200" />
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <Brain className="h-3 w-3 text-purple-200" />
                    <span className="text-xs text-purple-200">AI detected</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Loyalty Points</p>
                      <p className="text-2xl font-bold">2,450</p>
                    </div>
                    <Award className="h-8 w-8 text-orange-200" />
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-orange-200" />
                    <span className="text-xs text-orange-200">Earn faster with AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Bookings with AI Enhancements */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-purple-900">AI Enhanced</span>
                    </div>
                  </div>
                  <Link
                    to="/hotels"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Book Now</span>
                  </Link>
                </div>

                {mockUserBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">Let our AI find the perfect hotel for you!</p>
                    <Link
                      to="/hotels"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Browse Hotels
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockUserBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <img
                            src={booking.image}
                            alt={booking.hotelName}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{booking.hotelName}</h3>
                                <p className="text-gray-600">{booking.location}</p>
                                <p className="text-sm text-gray-500">{booking.roomType}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'upcoming'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <p className="text-gray-600">Check-in</p>
                                <p className="font-medium">{booking.checkIn}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Check-out</p>
                                <p className="font-medium">{booking.checkOut}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Confirmation</p>
                                <p className="font-medium">{booking.confirmationCode}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Total</p>
                                <p className="font-medium text-primary-600">${booking.amount}</p>
                              </div>
                            </div>

                            {/* AI Recommendations */}
                            {booking.aiRecommendedUpgrades.length > 0 && (
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mt-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Sparkles className="h-4 w-4 text-purple-600" />
                                  <span className="text-sm font-medium text-purple-900">AI Recommendations</span>
                                </div>
                                <div className="flex space-x-2">
                                  {booking.aiRecommendedUpgrades.map((upgrade, idx) => (
                                    <span key={idx} className="bg-white px-2 py-1 rounded text-xs text-purple-700">
                                      {upgrade}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI-Enhanced Sidebar */}
            <div className="space-y-6">
              {/* AI Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Best Time to Book</span>
                    </div>
                    <p className="text-sm text-blue-700">Book 2 weeks ahead for 23% savings</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Trending Destination</span>
                    </div>
                    <p className="text-sm text-green-700">Santorini is 40% off this month</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/hotels"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book a Hotel</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Update Profile</span>
                  </Link>
                </div>
              </div>

              {/* Travel Insights */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average trip duration</span>
                    <span className="font-semibold">2.5 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Preferred room type</span>
                    <span className="font-semibold">Suite</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI savings this year</span>
                    <span className="font-semibold text-green-600">$245</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations Section */}
          <div className="mt-8">
            <AIRecommendations />
          </div>
        </div>
      </div>
    );
  }

  // Hotel Owner Dashboard with AI
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI-Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {getGreeting()}, {user?.name}! 🏨
                  </h1>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-xl text-gray-600">{getPersonalizedMessage()}</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="text-center">
                  <div className="text-sm text-gray-600">AI Optimization Score</div>
                  <div className="text-2xl font-bold text-purple-600">{stats.aiScore}%</div>
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Enhanced Stats Cards with AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Hotel className="h-8 w-8 text-blue-200" />
                  <div className="flex items-center space-x-1 text-blue-200">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm">+5%</span>
                  </div>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Total Hotels</p>
                  <p className="text-3xl font-bold">{stats.totalHotels}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Sparkles className="h-3 w-3 text-blue-200" />
                    <span className="text-xs text-blue-200">AI optimized</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-green-200" />
                  <div className="flex items-center space-x-1 text-green-200">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm">+{stats.revenueGrowth}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Brain className="h-3 w-3 text-green-200" />
                    <span className="text-xs text-green-200">AI predicted: ${stats.predictedRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-purple-200" />
                  <div className="flex items-center space-x-1 text-purple-200">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm">+{stats.bookingGrowth}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-purple-200" />
                    <span className="text-xs text-purple-200">AI trend analysis</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 text-orange-200" />
                  <div className="flex items-center space-x-1 text-orange-200">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm">+2%</span>
                  </div>
                </div>
                <div>
                  <p className="text-orange-100 text-sm">Occupancy Rate</p>
                  <p className="text-3xl font-bold">{stats.occupancyRate.toFixed(0)}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Zap className="h-3 w-3 text-orange-200" />
                    <span className="text-xs text-orange-200">AI optimized pricing</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-pink-200" />
                  <div className="flex items-center space-x-1 text-pink-200">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">AI</span>
                  </div>
                </div>
                <div>
                  <p className="text-pink-100 text-sm">AI Insights</p>
                  <p className="text-3xl font-bold">{mockAiInsights.length}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-pink-200" />
                    <span className="text-xs text-pink-200">Ready to apply</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
                { id: 'ai-insights', label: 'AI Insights', icon: <Brain className="h-4 w-4" /> },
                { id: 'hotels', label: 'My Hotels', icon: <Hotel className="h-4 w-4" /> },
                { id: 'bookings', label: 'Bookings', icon: <Calendar className="h-4 w-4" /> },
                { id: 'live', label: 'Live Updates', icon: <Activity className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
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
            {activeTab === 'ai-insights' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">AI Business Insights</h2>
                      <p className="text-gray-600">Powered by machine learning and market analysis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Overall AI Score</div>
                    <div className="text-2xl font-bold text-purple-600">{stats.aiScore}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockAiInsights.map((insight) => (
                    <div key={insight.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            insight.type === 'revenue' ? 'bg-green-100 text-green-600' :
                            insight.type === 'occupancy' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {insight.type === 'revenue' ? <DollarSign className="h-5 w-5" /> :
                             insight.type === 'occupancy' ? <TrendingUp className="h-5 w-5" /> :
                             <Star className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="text-sm text-gray-600">Confidence:</div>
                              <div className="flex items-center space-x-1">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                    style={{ width: `${insight.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{insight.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{insight.insight}</p>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Projected Impact:</span>
                          <span className="font-semibold text-green-600">{insight.impact}</span>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                        {insight.action}
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI Performance Metrics */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-gray-600">Prediction Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+18%</div>
                      <div className="text-sm text-gray-600">Revenue Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">-23%</div>
                      <div className="text-sm text-gray-600">Operational Costs</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Performance Overview with AI */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-purple-600">AI Enhanced</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Revenue Growth</span>
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">+{stats.revenueGrowth}%</div>
                          <div className="text-sm text-gray-500">vs last month</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">AI Optimization</span>
                            <Brain className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{stats.aiScore}%</div>
                          <div className="text-sm text-gray-500">efficiency score</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Top Performing Hotels</h4>
                        <div className="space-y-3">
                          {mockHotels.map((hotel, index) => (
                            <div key={hotel.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <span className="text-primary-600 font-semibold text-sm">#{index + 1}</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{hotel.name}</div>
                                  <div className="text-sm text-gray-500">{hotel.occupancy}% occupancy • AI Score: {hotel.aiOptimizationScore}%</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">${hotel.revenue.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">revenue</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI-Enhanced Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Link
                          to="/dashboard/add-hotel"
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add New Hotel</span>
                        </Link>
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>AI Optimization</span>
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>View Analytics</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                      <div className="space-y-3">
                        <div className="bg-white/70 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Zap className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">Dynamic Pricing</span>
                          </div>
                          <p className="text-xs text-gray-600">Increase weekend rates by 8%</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Occupancy Boost</span>
                          </div>
                          <p className="text-xs text-gray-600">Offer 3-night packages</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'live' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Real-Time Updates</h2>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>
                <LiveBookingUpdates />
              </div>
            )}

            {/* Other existing tabs remain the same but with AI enhancements */}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">My Hotels</h2>
                  <Link
                    to="/dashboard/add-hotel"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Hotel</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockHotels.map((hotel) => (
                    <div key={hotel.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              hotel.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {hotel.status}
                            </span>
                            <div className="mt-1 flex items-center space-x-1">
                              <Sparkles className="h-3 w-3 text-purple-500" />
                              <span className="text-xs text-purple-600">{hotel.aiOptimizationScore}% AI</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium">${hotel.price}/night</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rating</p>
                            <p className="font-medium">{hotel.rating} ⭐</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rooms</p>
                            <p className="font-medium">{hotel.rooms}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Occupancy</p>
                            <p className="font-medium">{hotel.occupancy}%</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/hotels/${hotel.id}`}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Link>
                          <Link
                            to={`/dashboard/edit-hotel/${hotel.id}`}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>All Status</option>
                      <option>Confirmed</option>
                      <option>Pending</option>
                      <option>Cancelled</option>
                    </select>
                    <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hotel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AI Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                              <div className="text-sm text-gray-500">{booking.guests} guests</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.hotelName}</div>
                            <div className="text-sm text-gray-500">{booking.roomType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.checkIn} - {booking.checkOut}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                            ${booking.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-purple-600">
                                {booking.aiPredictedSatisfaction}%
                              </div>
                              <Sparkles className="h-3 w-3 text-purple-500" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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