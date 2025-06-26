import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Wifi, Car, Coffee, Dumbbell, SlidersHorizontal } from 'lucide-react';
import HotelCard from '../components/Hotels/HotelCard';
import FilterSidebar from '../components/Hotels/FilterSidebar';

const Hotels: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mockHotels = [
    {
      id: '1',
      name: 'Grand Luxury Resort',
      location: 'Malibu, California',
      price: 299,
      originalPrice: 374,
      rating: 4.9,
      reviewCount: 1234,
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      amenities: ['Wifi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
      description: 'Luxury beachfront resort with world-class amenities and stunning ocean views.',
      discount: 20,
      isAvailable: true,
      rooms: 150,
    },
    {
      id: '2',
      name: 'Boutique City Hotel',
      location: 'New York, NY',
      price: 189,
      rating: 4.7,
      reviewCount: 892,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      amenities: ['Wifi', 'Gym', 'Restaurant', 'Bar', 'Business Center'],
      description: 'Modern boutique hotel in the heart of Manhattan with contemporary design.',
      isAvailable: true,
      rooms: 85,
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
      images: [
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      amenities: ['Wifi', 'Fireplace', 'Ski Access', 'Spa', 'Restaurant'],
      description: 'Cozy mountain lodge with breathtaking views and ski-in/ski-out access.',
      discount: 15,
      isAvailable: true,
      rooms: 45,
    },
    {
      id: '4',
      name: 'Seaside Paradise Resort',
      location: 'Miami Beach, Florida',
      price: 259,
      rating: 4.6,
      reviewCount: 1456,
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      amenities: ['Wifi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa'],
      description: 'Tropical paradise with direct beach access and luxury amenities.',
      isAvailable: true,
      rooms: 200,
    },
  ];

  const [filteredHotels, setFilteredHotels] = useState(mockHotels);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    amenities: [] as string[],
    rating: 0,
    location: '',
  });

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const checkin = searchParams.get('checkin') || '';
    const checkout = searchParams.get('checkout') || '';
    const guests = searchParams.get('guests') || '';

    let filtered = mockHotels;

    if (query) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(query.toLowerCase()) ||
        hotel.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter(hotel =>
        hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1]
      );
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.amenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(hotel => hotel.rating >= filters.rating);
    }

    if (filters.location) {
      filtered = filtered.filter(hotel =>
        hotel.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort hotels
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep original order for 'recommended'
        break;
    }

    setFilteredHotels(filtered);
  }, [searchParams, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchParams.get('q') ? `Hotels in "${searchParams.get('q')}"` : 'All Hotels'}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredHotels.length} properties found
                {searchParams.get('checkin') && searchParams.get('checkout') && (
                  <span> • {searchParams.get('checkin')} - {searchParams.get('checkout')}</span>
                )}
                {searchParams.get('guests') && (
                  <span> • {searchParams.get('guests')} guests</span>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Hotels Grid */}
          <div className="flex-1">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;