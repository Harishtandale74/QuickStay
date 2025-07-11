import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Star, 
  Camera, 
  Utensils, 
  ShoppingBag, 
  Car,
  Info,
  AlertTriangle,
  Phone,
  Navigation,
  Calendar,
  Users,
  Heart,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { NAGPUR_LANDMARKS, TRAVEL_TIPS, EMERGENCY_CONTACTS } from '../../data/nagpurData';

interface Attraction {
  id: string;
  name: string;
  description: string;
  category: 'Religious' | 'Historical' | 'Nature' | 'Educational' | 'Entertainment' | 'Shopping';
  rating: number;
  reviewCount: number;
  distance: string;
  timings: string;
  entryFee: string;
  image: string;
  tips: string[];
  coordinates: { lat: number; lng: number };
  highlights: string[];
  bestTime: string;
  duration: string;
  accessibility: string;
  nearbyHotels: string[];
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  location: string;
  image: string;
  timings: string;
  contact: string;
  mustTry: string[];
  ambiance: string;
  features: string[];
}

interface ShoppingPlace {
  id: string;
  name: string;
  type: 'Mall' | 'Market' | 'Street' | 'Specialty';
  specialty: string;
  timing: string;
  location: string;
  description: string;
  highlights: string[];
  priceRange: string;
  parking: boolean;
  image: string;
}

const ExploreNagpur: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attractions');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const attractions: Attraction[] = [
    {
      id: '1',
      name: 'Deekshabhoomi',
      description: 'Sacred Buddhist monument where Dr. B.R. Ambedkar converted to Buddhism',
      category: 'Religious',
      rating: 4.8,
      reviewCount: 2456,
      distance: '5 km from city center',
      timings: '6:00 AM - 8:00 PM',
      entryFee: 'Free',
      image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: ['Best visited during early morning or evening', 'Photography allowed', 'Dress modestly'],
      coordinates: { lat: 21.1138, lng: 79.0861 },
      highlights: ['Sacred Buddhist site', 'Historical significance', 'Peaceful environment'],
      bestTime: 'Early morning or evening',
      duration: '2-3 hours',
      accessibility: 'Wheelchair accessible',
      nearbyHotels: ['Hotel Centre Point', 'The Nagpur Ashok']
    },
    {
      id: '2',
      name: 'Ambazari Lake',
      description: 'Largest lake in Nagpur, perfect for boating and picnics',
      category: 'Nature',
      rating: 4.5,
      reviewCount: 1834,
      distance: '8 km from city center',
      timings: '5:00 AM - 10:00 PM',
      entryFee: '₹10 per person',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: ['Boating available', 'Great for sunset views', 'Food stalls nearby'],
      coordinates: { lat: 21.1307, lng: 79.0270 },
      highlights: ['Boating facilities', 'Sunset views', 'Family picnic spot'],
      bestTime: 'Evening for sunset',
      duration: '3-4 hours',
      accessibility: 'Partially accessible',
      nearbyHotels: ['Radisson Blu', 'Hotel Hardeo']
    },
    {
      id: '3',
      name: 'Sitabuldi Fort',
      description: 'Historic fort with panoramic city views and rich history',
      category: 'Historical',
      rating: 4.3,
      reviewCount: 987,
      distance: '2 km from city center',
      timings: '9:00 AM - 6:00 PM',
      entryFee: '₹25 per person',
      image: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: ['Climb to the top for city views', 'Carry water', 'Closed on Mondays'],
      coordinates: { lat: 21.1498, lng: 79.0806 },
      highlights: ['Panoramic city views', 'Historical architecture', 'Photography spot'],
      bestTime: 'Morning or late afternoon',
      duration: '2-3 hours',
      accessibility: 'Not wheelchair accessible',
      nearbyHotels: ['The Pride Hotel', 'Hotel Skylark']
    },
    {
      id: '4',
      name: 'Raman Science Centre',
      description: 'Interactive science museum with planetarium shows',
      category: 'Educational',
      rating: 4.6,
      reviewCount: 1567,
      distance: '4 km from city center',
      timings: '10:00 AM - 6:00 PM',
      entryFee: '₹50 adults, ₹30 children',
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: ['Great for families', 'Planetarium shows available', 'Book tickets online'],
      coordinates: { lat: 21.1307, lng: 79.0270 },
      highlights: ['Interactive exhibits', 'Planetarium', 'Educational programs'],
      bestTime: 'Morning to avoid crowds',
      duration: '4-5 hours',
      accessibility: 'Fully accessible',
      nearbyHotels: ['Hotel Midland', 'Tuli Imperial']
    },
    {
      id: '5',
      name: 'Maharaj Bagh Zoo',
      description: 'One of the oldest zoos in India with diverse wildlife',
      category: 'Entertainment',
      rating: 4.2,
      reviewCount: 2134,
      distance: '3 km from city center',
      timings: '9:00 AM - 5:30 PM',
      entryFee: '₹40 adults, ₹20 children',
      image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: ['Carry water and snacks', 'Best visited in winter', 'Photography allowed'],
      coordinates: { lat: 21.1458, lng: 79.0882 },
      highlights: ['Diverse wildlife', 'Tiger safari', 'Children\'s park'],
      bestTime: 'Winter months',
      duration: '3-4 hours',
      accessibility: 'Partially accessible',
      nearbyHotels: ['Hotel Centre Point', 'Regenta Central Herald']
    },
    {
      id: '6',
      name: 'Futala Lake',
      description: 'Beautiful lake with musical fountain and food courts',
      category: 'Nature',
      rating: 4.4,
      reviewCount: 1456,
      distance: '6 km from city center',
      timings: '24 hours',
      entryFee: 'Free',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: ['Musical fountain in evening', 'Food court available', 'Jogging track'],
      coordinates: { lat: 21.1307, lng: 79.0270 },
      highlights: ['Musical fountain', 'Food courts', 'Evening walks'],
      bestTime: 'Evening',
      duration: '2-3 hours',
      accessibility: 'Fully accessible',
      nearbyHotels: ['Le Meridien', 'Hotel Airport Centre Point']
    }
  ];

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Saoji Bhojnalaya',
      cuisine: 'Traditional Saoji',
      specialty: 'Spicy mutton curry and traditional Saoji dishes',
      rating: 4.7,
      reviewCount: 3456,
      priceRange: '₹200-400 per person',
      location: 'Sitabuldi',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      timings: '11:00 AM - 11:00 PM',
      contact: '+91-712-2345678',
      mustTry: ['Saoji Mutton', 'Bhakri', 'Solkadhi'],
      ambiance: 'Traditional and authentic',
      features: ['Authentic cuisine', 'Family-friendly', 'Air-conditioned']
    },
    {
      id: '2',
      name: 'Haldiram\'s',
      cuisine: 'North Indian, Sweets',
      specialty: 'Chole Bhature, Sweets, and North Indian dishes',
      rating: 4.4,
      reviewCount: 2890,
      priceRange: '₹150-300 per person',
      location: 'Multiple locations',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      timings: '8:00 AM - 11:00 PM',
      contact: '+91-712-3456789',
      mustTry: ['Chole Bhature', 'Raj Kachori', 'Gulab Jamun'],
      ambiance: 'Family restaurant',
      features: ['Multiple outlets', 'Takeaway available', 'Sweets counter']
    },
    {
      id: '3',
      name: 'Tarri Poha Center',
      cuisine: 'Local Street Food',
      specialty: 'Famous Nagpur breakfast - Tarri Poha',
      rating: 4.5,
      reviewCount: 1567,
      priceRange: '₹50-150 per person',
      location: 'Sadar',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      timings: '7:00 AM - 11:00 AM',
      contact: '+91-712-4567890',
      mustTry: ['Tarri Poha', 'Jalebi', 'Samosa'],
      ambiance: 'Street food style',
      features: ['Authentic breakfast', 'Budget-friendly', 'Quick service']
    }
  ];

  const shoppingPlaces: ShoppingPlace[] = [
    {
      id: '1',
      name: 'Sitabuldi Main Road',
      type: 'Street',
      specialty: 'Clothes, Electronics, Local Items',
      timing: '10:00 AM - 9:00 PM',
      location: 'Sitabuldi',
      description: 'Bustling street market with everything from clothes to electronics',
      highlights: ['Bargaining allowed', 'Local items', 'Street food'],
      priceRange: 'Budget to Mid-range',
      parking: false,
      image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Empress City Mall',
      type: 'Mall',
      specialty: 'Branded Stores, Food Court, Cinema',
      timing: '11:00 AM - 10:00 PM',
      location: 'Nagpur Central',
      description: 'Modern shopping mall with branded stores and entertainment',
      highlights: ['Air-conditioned', 'Food court', 'Cinema'],
      priceRange: 'Mid to High-range',
      parking: true,
      image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Itwari Market',
      type: 'Market',
      specialty: 'Oranges, Local Produce, Handicrafts',
      timing: '8:00 AM - 8:00 PM',
      location: 'Itwari',
      description: 'Traditional market famous for Nagpur oranges and local products',
      highlights: ['Fresh oranges', 'Local handicrafts', 'Traditional items'],
      priceRange: 'Budget-friendly',
      parking: false,
      image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredAttractions = attractions.filter(attraction => {
    const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const shareAttraction = (attraction: Attraction) => {
    if (navigator.share) {
      navigator.share({
        title: attraction.name,
        text: attraction.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`Check out ${attraction.name} in Nagpur!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <MapPin className="h-8 w-8" />
          <div>
            <h3 className="text-2xl font-bold">Explore Nagpur</h3>
            <p className="text-orange-100">Discover the Orange City's best attractions, food & culture</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search attractions, restaurants, or places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Religious">Religious</option>
              <option value="Historical">Historical</option>
              <option value="Nature">Nature</option>
              <option value="Educational">Educational</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'attractions', label: 'Attractions', icon: <Camera className="h-4 w-4" />, count: filteredAttractions.length },
            { id: 'food', label: 'Food & Dining', icon: <Utensils className="h-4 w-4" />, count: restaurants.length },
            { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="h-4 w-4" />, count: shoppingPlaces.length },
            { id: 'transport', label: 'Transport', icon: <Car className="h-4 w-4" />, count: 4 },
            { id: 'tips', label: 'Travel Tips', icon: <Info className="h-4 w-4" />, count: TRAVEL_TIPS.length },
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
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-900">
                Top Attractions in Nagpur ({filteredAttractions.length})
              </h4>
              <div className="text-sm text-gray-600">
                Showing {filteredAttractions.length} of {attractions.length} attractions
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAttractions.map((attraction) => (
                <div key={attraction.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {attraction.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(attraction.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favorites.includes(attraction.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => shareAttraction(attraction)}
                        className="p-2 bg-white/80 text-gray-600 hover:bg-white rounded-full transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{attraction.rating}</span>
                      <span className="text-xs text-gray-600">({attraction.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{attraction.name}</h5>
                    <p className="text-gray-600 mb-4">{attraction.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-600">{attraction.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600">{attraction.timings}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">{attraction.entryFee}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">{attraction.duration}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">Highlights:</div>
                      <div className="flex flex-wrap gap-2">
                        {attraction.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-blue-900 mb-1">💡 Pro Tips:</div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {attraction.tips.slice(0, 2).map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Best time:</span> {attraction.bestTime}
                      </div>
                      <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium text-sm">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900">Best Food & Restaurants in Nagpur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-gray-900">{restaurant.name}</h5>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <p className="text-sm text-gray-700 mb-3">{restaurant.specialty}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Range:</span>
                        <span className="font-medium">{restaurant.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{restaurant.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timings:</span>
                        <span className="font-medium">{restaurant.timings}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">Must Try:</div>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.mustTry.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:${restaurant.contact}`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Call</span>
                      </a>
                      <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium text-sm">
                        <Navigation className="h-4 w-4" />
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900">Shopping Destinations in Nagpur</h4>
            <div className="space-y-4">
              {shoppingPlaces.map((place) => (
                <div key={place.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xl font-bold text-gray-900">{place.name}</h5>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {place.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{place.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Specialty:</span>
                          <p className="font-medium">{place.specialty}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Timing:</span>
                          <p className="font-medium">{place.timing}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <p className="font-medium">{place.location}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {place.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">
                            <span className="font-medium">Price:</span> {place.priceRange}
                          </span>
                          {place.parking && (
                            <span className="flex items-center space-x-1 text-green-600">
                              <Car className="h-4 w-4" />
                              <span>Parking Available</span>
                            </span>
                          )}
                        </div>
                        <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium text-sm">
                          <ExternalLink className="h-4 w-4" />
                          <span>More Info</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900">Getting Around Nagpur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  mode: 'Auto Rickshaw',
                  description: 'Most convenient for short distances within the city',
                  fare: '₹15-20 per km',
                  tips: 'Use meter or negotiate fare beforehand. Available 24/7.',
                  icon: '🛺',
                  pros: ['Door-to-door service', 'Easily available', 'Good for short trips'],
                  cons: ['Can be expensive for long distances', 'No AC']
                },
                {
                  mode: 'City Bus (MSRTC)',
                  description: 'Economical option for longer distances',
                  fare: '₹8-25 per trip',
                  tips: 'MSRTC buses connect all major areas. Buy tickets from conductor.',
                  icon: '🚌',
                  pros: ['Very economical', 'Connects all areas', 'Frequent service'],
                  cons: ['Can be crowded', 'Limited AC buses']
                },
                {
                  mode: 'Taxi/Cab (Ola/Uber)',
                  description: 'Comfortable option with AC and GPS tracking',
                  fare: '₹12-15 per km',
                  tips: 'Book through app for transparent pricing. Available for airport transfers.',
                  icon: '🚗',
                  pros: ['AC comfort', 'GPS tracking', 'Cashless payment'],
                  cons: ['More expensive', 'Surge pricing during peak hours']
                },
                {
                  mode: 'Metro (Upcoming)',
                  description: 'Modern rapid transit system under construction',
                  fare: 'TBD (Expected ₹10-40)',
                  tips: 'Phase 1 expected to start operations soon. Will connect major areas.',
                  icon: '🚇',
                  pros: ['Fast and efficient', 'Environment friendly', 'Fixed timings'],
                  cons: ['Limited coverage initially', 'Still under construction']
                }
              ].map((transport, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{transport.icon}</span>
                    <div>
                      <h5 className="text-lg font-bold text-gray-900">{transport.mode}</h5>
                      <p className="text-gray-600 text-sm">{transport.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Fare:</span>
                      <span className="font-bold text-green-600">{transport.fare}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-green-700 mb-2">Pros:</div>
                      <ul className="text-sm text-green-600 space-y-1">
                        {transport.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <span>✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-700 mb-2">Cons:</div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {transport.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <span>✗</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">💡 Tip:</div>
                    <div className="text-sm text-blue-700">{transport.tips}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900">Essential Travel Tips & Information</h4>
            
            {/* Travel Tips */}
            <div className="bg-green-50 rounded-xl p-6">
              <h5 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Essential Travel Tips for Nagpur
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRAVEL_TIPS.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-green-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 rounded-xl p-6">
              <h5 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Contacts
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(EMERGENCY_CONTACTS).map(([service, number]) => (
                  <div key={service} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-red-700 font-medium capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <a
                      href={`tel:${number}`}
                      className="text-red-900 hover:text-red-700 font-bold flex items-center space-x-1 bg-red-100 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Language */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h5 className="text-lg font-bold text-blue-900 mb-4">Useful Local Phrases (Marathi)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { english: 'Hello', marathi: 'Namaskar', pronunciation: 'nah-mas-kar' },
                  { english: 'Thank you', marathi: 'Dhanyawad', pronunciation: 'dhan-ya-waad' },
                  { english: 'How much?', marathi: 'Kiti paisa?', pronunciation: 'ki-ti pai-sa' },
                  { english: 'Where is?', marathi: 'Kuthe aahe?', pronunciation: 'ku-the aa-he' },
                  { english: 'Please help', marathi: 'Krupaya madad kara', pronunciation: 'kru-pa-ya ma-dad ka-ra' },
                  { english: 'I don\'t understand', marathi: 'Mala samajat nahi', pronunciation: 'ma-la sa-ma-jat na-hi' }
                ].map((phrase, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg">
                    <div className="font-medium text-blue-900">{phrase.english}</div>
                    <div className="text-blue-700 font-bold">{phrase.marathi}</div>
                    <div className="text-blue-600 text-sm italic">({phrase.pronunciation})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Time to Visit */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <h5 className="text-lg font-bold text-yellow-900 mb-4">Best Time to Visit Nagpur</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    season: 'Winter (Oct-Feb)',
                    weather: '10°C - 30°C',
                    description: 'Perfect weather for sightseeing and outdoor activities',
                    recommendation: 'Highly Recommended',
                    color: 'bg-green-100 text-green-700'
                  },
                  {
                    season: 'Summer (Mar-Jun)',
                    weather: '25°C - 45°C',
                    description: 'Hot and dry. Early morning and evening activities recommended',
                    recommendation: 'Moderate',
                    color: 'bg-orange-100 text-orange-700'
                  },
                  {
                    season: 'Monsoon (Jul-Sep)',
                    weather: '22°C - 35°C',
                    description: 'Pleasant weather but heavy rains. Good for indoor attractions',
                    recommendation: 'Good for Nature Lovers',
                    color: 'bg-blue-100 text-blue-700'
                  }
                ].map((season, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-yellow-400">
                    <div className="font-bold text-yellow-900 mb-2">{season.season}</div>
                    <div className="text-yellow-700 mb-2">{season.weather}</div>
                    <div className="text-yellow-600 text-sm mb-3">{season.description}</div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${season.color}`}>
                      {season.recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreNagpur;