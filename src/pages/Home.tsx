import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight,
  Hotel,
  Thermometer,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Phone,
  Mail,
  Navigation,
  Sun,
  Cloud,
  CloudRain
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { fetchFeaturedHotels } from '../store/slices/hotelSlice';
import { NAGPUR_AREAS, POPULAR_HOTEL_AREAS } from '../data/nagpurData';
import { nagpurAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { featuredHotels, loading } = useSelector((state: RootState) => state.hotels);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [searchData, setSearchData] = useState({
    area: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: 'sunny' as 'sunny' | 'cloudy' | 'rainy',
    description: 'Perfect weather for exploring Nagpur!'
  });
  const [stats, setStats] = useState({
    totalHotels: 89,
    happyGuests: '50K+',
    areas: 18,
    avgRating: 4.8
  });

  useEffect(() => {
    // Fetch featured hotels
    dispatch(fetchFeaturedHotels());
    
    // Fetch weather data
    fetchWeatherData();
    
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setSearchData(prev => ({
      ...prev,
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0]
    }));
  }, [dispatch]);

  const fetchWeatherData = async () => {
    try {
      const response = await nagpurAPI.getNagpurWeather();
      setWeather(response.data);
    } catch (error) {
      console.log('Using fallback weather data');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchData.area) {
      toast.error('Please select an area in Nagpur');
      return;
    }
    
    const searchParams = new URLSearchParams({
      area: searchData.area,
      checkin: searchData.checkIn,
      checkout: searchData.checkOut,
      guests: searchData.guests.toString(),
    });
    
    navigate(`/hotels?${searchParams.toString()}`);
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <MapPin className="h-4 w-4 text-orange-200" />
              <span className="text-sm font-medium">Nagpur, Maharashtra</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover Hotels in the
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Orange City
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Book the best hotels in Nagpur with instant confirmation, local expertise, and authentic Orange City experience
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalHotels}</div>
                <div className="text-orange-200 text-sm">Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.happyGuests}</div>
                <div className="text-orange-200 text-sm">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.areas}</div>
                <div className="text-orange-200 text-sm">Areas Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.avgRating}★</div>
                <div className="text-orange-200 text-sm">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-16 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay in Nagpur</h2>
              <p className="text-gray-600">Search hotels across all major areas of the Orange City</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* Area Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Area in Nagpur
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={searchData.area}
                    onChange={(e) => setSearchData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Choose an area in Nagpur</option>
                    {NAGPUR_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date and Guest Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={searchData.guests}
                      onChange={(e) => setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Nagpur Hotels</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Areas in Nagpur</h2>
            <p className="text-xl text-gray-600">Explore hotels in Nagpur's most sought-after locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POPULAR_HOTEL_AREAS.slice(0, 6).map((area, index) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/hotels?area=${area.name}`)}
              >
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{area.name}</h3>
                    <p className="text-orange-100 text-sm">{area.hotels} hotels available</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                    ₹{area.avgPrice.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{area.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {area.highlights.slice(0, 3).map(highlight => (
                      <span
                        key={highlight}
                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Best for: {area.bestFor[0]}
                    </div>
                    <ArrowRight className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels in Nagpur</h2>
            <p className="text-xl text-gray-600">Handpicked accommodations for the best Orange City experience</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-80"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHotels.slice(0, 6).map((hotel) => (
                <div
                  key={hotel._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={hotel.images?.[0]?.url || 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    {hotel.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{hotel.rating.average}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center text-gray-600 space-x-1 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.location.area}, Nagpur</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map(amenity => (
                        <span
                          key={amenity}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          ₹{hotel.roomTypes?.[0]?.price?.toLocaleString() || '2,500'}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/hotels"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>View All Nagpur Hotels</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Weather & Local Info */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Weather Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Nagpur Weather</h3>
                  <p className="text-gray-600">Current conditions in the Orange City</p>
                </div>
                {getWeatherIcon()}
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {weather.temperature}°C
                </div>
                <p className="text-gray-600 capitalize">{weather.condition}</p>
                <p className="text-sm text-gray-500 mt-2">{weather.description}</p>
              </div>

              <Link
                to="/explore"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors text-center block"
              >
                View Full Weather & Travel Guide
              </Link>
            </div>

            {/* Why Choose Nagpur */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Why Visit Nagpur?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Geographical Center of India</h4>
                    <p className="text-gray-600 text-sm">Located at the exact center of India with excellent connectivity</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Famous Orange City</h4>
                    <p className="text-gray-600 text-sm">World-renowned for its sweet oranges and citrus culture</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Rich Cultural Heritage</h4>
                    <p className="text-gray-600 text-sm">Buddhist monuments, historical forts, and vibrant traditions</p>
                  </div>
                </div>
              </div>

              <Link
                to="/explore"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors text-center block mt-6"
              >
                Explore Nagpur Attractions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">Experience the best of Nagpur hospitality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Secure Booking',
                description: 'Bank-level security for all transactions with instant confirmation',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: 'Instant Confirmation',
                description: 'Get immediate booking confirmation for all Nagpur hotels',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: <Phone className="h-8 w-8" />,
                title: '24/7 Local Support',
                description: 'Round-the-clock support in Hindi, English, and Marathi',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: 'Best Price Guarantee',
                description: 'Lowest prices guaranteed for all Nagpur accommodations',
                color: 'bg-orange-100 text-orange-600'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Nagpur Guests Say</h2>
            <p className="text-xl text-gray-600">Real experiences from travelers who explored the Orange City</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Sharma',
                location: 'Mumbai',
                rating: 5,
                comment: 'Amazing experience in Nagpur! The hotel booking was seamless and the local recommendations were spot-on. Loved the authentic Saoji cuisine!',
                avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150'
              },
              {
                name: 'Priya Deshmukh',
                location: 'Pune',
                rating: 5,
                comment: 'Perfect platform for Nagpur hotels. The weather updates helped us plan our Deekshabhoomi visit perfectly. Highly recommended for Orange City travel!',
                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
              },
              {
                name: 'Amit Joshi',
                location: 'Delhi',
                rating: 5,
                comment: 'Excellent service! Booked a hotel in Sitabuldi area and everything was perfect. The local area guide was incredibly helpful for exploring Nagpur.',
                avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Nagpur?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the Orange City's hospitality through our platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hotels"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Book Your Nagpur Stay
            </Link>
            <Link
              to="/explore"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Explore the Orange City
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5 text-orange-200" />
              <span className="text-orange-100">+91-712-NAGPUR</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-5 w-5 text-orange-200" />
              <span className="text-orange-100">support@nagpurhotels.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 text-orange-200" />
              <span className="text-orange-100">Nagpur, Maharashtra</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;