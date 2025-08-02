import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';

interface FeaturedHotelsProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

const FeaturedHotels: React.FC<FeaturedHotelsProps> = ({ deviceType }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredHotel, setHoveredHotel] = useState<string | null>(null);

  const featuredHotels = [
    {
      id: '1',
      name: 'Grand Luxury Resort',
      location: 'Malibu, California',
      price: 299,
      originalPrice: 374,
      rating: 4.9,
      reviewCount: 1234,
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['Wifi', 'Pool', 'Spa', 'Restaurant'],
      discount: 20,
      category: 'luxury',
      aiScore: 95,
      trending: true,
      badges: ['AI Recommended', 'Eco-Friendly'],
      quickFacts: ['Ocean View', 'Private Beach', 'Michelin Restaurant']
    },
    {
      id: '2',
      name: 'Boutique City Hotel',
      location: 'New York, NY',
      price: 189,
      rating: 4.7,
      reviewCount: 892,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['Wifi', 'Gym', 'Restaurant', 'Bar'],
      category: 'business',
      aiScore: 88,
      badges: ['Business Friendly', 'Central Location'],
      quickFacts: ['Times Square', 'Rooftop Bar', 'Meeting Rooms']
    },
    {
      id: '3',
      name: 'Mountain View Lodge',
      location: 'Aspen, Colorado',
      price: 349,
      originalPrice: 411,
      rating: 4.8,
      reviewCount: 567,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['Wifi', 'Fireplace', 'Ski Access', 'Spa'],
      discount: 15,
      category: 'adventure',
      aiScore: 92,
      popular: true,
      badges: ['Ski-in/Ski-out', 'Mountain Views'],
      quickFacts: ['Ski Resort', 'Alpine Spa', 'Gourmet Dining']
    },
    {
      id: '4',
      name: 'Seaside Paradise Resort',
      location: 'Miami Beach, Florida',
      price: 259,
      rating: 4.6,
      reviewCount: 1456,
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['Wifi', 'Pool', 'Beach Access', 'Restaurant'],
      category: 'beach',
      aiScore: 90,
      badges: ['Beachfront', 'Family Friendly'],
      quickFacts: ['Private Beach', 'Water Sports', 'Kids Club']
    },
  ];

  const filters = [
    { id: 'all', label: 'All Hotels', icon: <Star className="h-4 w-4" /> },
    { id: 'luxury', label: 'Luxury', icon: <Award className="h-4 w-4" /> },
    { id: 'business', label: 'Business', icon: <Coffee className="h-4 w-4" /> },
    { id: 'beach', label: 'Beach', icon: <MapPin className="h-4 w-4" /> },
    { id: 'adventure', label: 'Adventure', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  const filteredHotels = activeFilter === 'all' 
    ? featuredHotels 
    : featuredHotels.filter(hotel => hotel.category === activeFilter).slice(0, deviceType === 'mobile' ? 2 : 4);

  // Responsive configurations
  const getResponsiveConfig = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          padding: 'py-12',
          titleSize: 'text-2xl md:text-3xl',
          gridCols: 'grid-cols-1',
          showFilters: false,
          maxHotels: 2
        };
      case 'tablet':
        return {
          padding: 'py-14',
          titleSize: 'text-3xl',
          gridCols: 'grid-cols-1 md:grid-cols-2',
          showFilters: true,
          maxHotels: 4
        };
      default:
        return {
          padding: 'py-16',
          titleSize: 'text-3xl md:text-4xl',
          gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          showFilters: true,
          maxHotels: 4
        };
    }
  };

  const config = getResponsiveConfig();
  const displayHotels = filteredHotels.slice(0, config.maxHotels);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'gym':
        return <Dumbbell className="h-4 w-4" />;
      case 'restaurant':
      case 'bar':
        return <Coffee className="h-4 w-4" />;
      case 'pool':
      case 'spa':
        return <Car className="h-4 w-4" />;
      default:
        return <Coffee className="h-4 w-4" />;
    }
  };

  return (
    <section className={`${config.padding} bg-gradient-to-br from-gray-50 to-primary-50/30`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">AI Curated Selection</span>
          </div>
          <h2 className={`${config.titleSize} font-bold text-gray-900`}>
            Featured Hotels & Resorts
          </h2>
          <p className={`${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} text-gray-600 max-w-2xl mx-auto`}>
            Handpicked by our AI based on guest reviews, amenities, and your preferences
          </p>
        </div>

        {/* Filters */}
        {config.showFilters && (
        <div className={`flex flex-wrap justify-center gap-3 ${deviceType === 'mobile' ? 'mb-8' : 'mb-12'}`}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 ${deviceType === 'mobile' ? 'px-4 py-2' : 'px-6 py-3'} rounded-xl font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
        )}

        {/* Hotels Grid */}
        <div className={`${config.gridCols} gap-6 md:gap-8`}>
          {displayHotels.map((hotel, index) => (
            <div
              key={hotel.id}
              className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ${deviceType !== 'mobile' ? 'transform hover:-translate-y-2' : ''} animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredHotel(hotel.id)}
              onMouseLeave={() => setHoveredHotel(null)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className={`w-full ${deviceType === 'mobile' ? 'h-48' : 'h-64'} object-cover ${deviceType !== 'mobile' ? 'group-hover:scale-110' : ''} transition-transform duration-700`}
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {hotel.discount && (
                    <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {hotel.discount}% OFF
                    </div>
                  )}
                  {hotel.trending && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Trending</span>
                    </div>
                  )}
                  {hotel.popular && (
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center space-x-1 shadow-lg">
                  <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                  <span className="text-sm font-semibold">{hotel.rating}</span>
                </div>

                {/* AI Score */}
                <div className={`absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white ${deviceType === 'mobile' ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg flex items-center space-x-1 shadow-lg`}>
                  <Sparkles className="h-3 w-3" />
                  <span className={`${deviceType === 'mobile' ? 'text-xs' : 'text-xs'} font-medium`}>{hotel.aiScore}%</span>
                </div>

                {/* Hover Overlay */}
                {hoveredHotel === hotel.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300">
                    <div className="text-white space-y-1">
                      {hotel.quickFacts.map((fact, idx) => (
                        <div key={idx} className="text-sm flex items-center space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Hotel Info */}
                  <div>
                    <h3 className={`${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors`}>
                      {hotel.name}
                    </h3>
                    <div className="flex items-center text-gray-600 space-x-1 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.badges.slice(0, deviceType === 'mobile' ? 1 : 2).map((badge, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, deviceType === 'mobile' ? 3 : 4).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-1 bg-gray-100 hover:bg-primary-50 px-2 py-1 rounded-md text-xs text-gray-600 hover:text-primary-700 transition-colors"
                      >
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-gray-400 text-gray-400" />
                      <span>{hotel.rating} ({hotel.reviewCount} reviews)</span>
                    </div>
                    <div className="text-right">
                      {hotel.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${hotel.originalPrice}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-primary-600">
                        ${hotel.price}
                      </div>
                      <div className={`${deviceType === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-600`}>per night</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/hotels/${hotel.id}`}
                    className={`w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white ${deviceType === 'mobile' ? 'py-2.5' : 'py-3'} rounded-xl font-semibold transition-all duration-300 text-center block ${deviceType !== 'mobile' ? 'transform hover:scale-105' : ''} shadow-lg hover:shadow-xl`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/hotels"
            className={`group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white ${deviceType === 'mobile' ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl ${deviceType !== 'mobile' ? 'transform hover:scale-105' : ''}`}
          >
            <span>Explore All Hotels</span>
            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;