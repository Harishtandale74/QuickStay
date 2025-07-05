import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, MapPin, Star, SlidersHorizontal, Grid, List } from 'lucide-react';
import HotelCard from '../components/Hotels/HotelCard';
import FilterSidebar from '../components/Hotels/FilterSidebar';
import NagpurMap from '../components/Nagpur/NagpurMap';
import { fetchHotels, setFilters, clearFilters } from '../store/slices/hotelSlice';
import { RootState, AppDispatch } from '../store/store';
import { NAGPUR_AREAS } from '../data/nagpurData';
import useSocket from '../hooks/useSocket';

const Hotels: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, loading, error, filters, pagination, availableFilters } = useSelector((state: RootState) => state.hotels);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();

  useEffect(() => {
    // Get search parameters from URL
    const searchQuery = searchParams.get('q') || '';
    const checkIn = searchParams.get('checkin') || '';
    const checkOut = searchParams.get('checkout') || '';
    const guests = parseInt(searchParams.get('guests') || '2');
    const area = searchParams.get('area') || '';

    // Set initial filters
    const initialFilters = {
      ...(searchQuery && { search: searchQuery }),
      ...(checkIn && { checkIn }),
      ...(checkOut && { checkOut }),
      ...(guests && { guests }),
      ...(area && { area: [area] }),
    };

    dispatch(setFilters(initialFilters));
    
    // Fetch hotels with filters
    dispatch(fetchHotels({
      ...initialFilters,
      sortBy,
      page: 1,
      limit: 12
    }));

    // Track search activity
    if (socket && isAuthenticated) {
      socket.searchHotels({
        query: searchQuery,
        area,
        checkIn,
        checkOut,
        guests
      });
    }
  }, [searchParams, sortBy, dispatch, socket, isAuthenticated]);

  const handleFiltersChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchHotels({
      ...newFilters,
      sortBy,
      page: 1,
      limit: 12
    }));
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    dispatch(fetchHotels({
      ...filters,
      sortBy: newSortBy,
      page: 1,
      limit: 12
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchHotels({
      ...filters,
      sortBy,
      page,
      limit: 12
    }));
  };

  const handleAreaSelect = (area: string) => {
    const newFilters = { ...filters, area: [area] };
    handleFiltersChange(newFilters);
  };

  const handleHotelSelect = (hotel: any) => {
    // Navigate to hotel details or show more info
    window.open(`/hotels/${hotel.id}`, '_blank');
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchHotels({
      sortBy: 'recommended',
      page: 1,
      limit: 12
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading hotels</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-orange-500" />
                <span>
                  {searchParams.get('q') 
                    ? `Hotels in "${searchParams.get('q')}"` 
                    : 'Hotels in Nagpur'
                  }
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Searching...' : `${hotels.length} properties found`}
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
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showMap 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4 inline mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.area?.length || filters.amenities?.length || filters.rating) && (
            <div className="mt-4 flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.area?.map(area => (
                <span key={area} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                  {area}
                </span>
              ))}
              {filters.amenities?.map(amenity => (
                <span key={amenity} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                  {amenity}
                </span>
              ))}
              {filters.rating && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                  {filters.rating}+ stars
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map View */}
        {showMap && (
          <div className="mb-8">
            <NagpurMap
              hotels={hotels.map(hotel => ({
                id: hotel._id,
                name: hotel.name,
                location: hotel.location,
                rating: hotel.rating.average,
                price: hotel.lowestPrice || hotel.roomTypes?.[0]?.price || 0,
                image: hotel.images?.[0]?.url || ''
              }))}
              selectedArea={filters.area?.[0]}
              onAreaSelect={handleAreaSelect}
              onHotelSelect={handleHotelSelect}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar 
              filters={{
                priceRange: [filters.minPrice || 0, filters.maxPrice || 10000],
                amenities: filters.amenities || [],
                rating: filters.rating || 0,
                location: filters.area?.[0] || '',
              }}
              onFiltersChange={(newFilters) => {
                handleFiltersChange({
                  minPrice: newFilters.priceRange[0],
                  maxPrice: newFilters.priceRange[1],
                  amenities: newFilters.amenities,
                  rating: newFilters.rating,
                  area: newFilters.location ? [newFilters.location] : undefined,
                });
              }}
            />
          </div>

          {/* Hotels Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl h-80"></div>
                  </div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {hotels.map((hotel) => (
                    <HotelCard 
                      key={hotel._id} 
                      hotel={{
                        id: hotel._id,
                        name: hotel.name,
                        location: `${hotel.location.area}, Nagpur`,
                        price: hotel.lowestPrice || hotel.roomTypes?.[0]?.price || 0,
                        originalPrice: hotel.highestPrice || undefined,
                        rating: hotel.rating.average,
                        reviewCount: hotel.rating.count,
                        image: hotel.images?.[0]?.url || '',
                        amenities: hotel.amenities.slice(0, 6),
                        description: hotel.description,
                        isAvailable: hotel.isAvailable || true,
                      }} 
                      viewMode={viewMode} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 border rounded-lg ${
                            pagination.current === i + 1
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={!pagination.hasNext}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;