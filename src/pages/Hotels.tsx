import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, MapPin, Star, SlidersHorizontal, Grid, List } from 'lucide-react';
import HotelCard from '../components/Hotels/HotelCard';
import FilterSidebar from '../components/Hotels/FilterSidebar';
import NagpurMap from '../components/Nagpur/NagpurMap';
import { fetchHotels, setFilters, clearFilters } from '../store/slices/hotelSlice';
import { RootState, AppDispatch } from '../store/store';

const Hotels: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, loading, error, filters, pagination } = useSelector((state: RootState) => state.hotels);

  // Memoize search params to prevent unnecessary re-renders
  const searchQuery = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const checkIn = useMemo(() => searchParams.get('checkin') || '', [searchParams]);
  const checkOut = useMemo(() => searchParams.get('checkout') || '', [searchParams]);
  const guests = useMemo(() => parseInt(searchParams.get('guests') || '2'), [searchParams]);
  const area = useMemo(() => searchParams.get('area') || '', [searchParams]);

  // Memoize initial filters to prevent recreation
  const initialFilters = useMemo(() => ({
    ...(searchQuery && { search: searchQuery }),
    ...(checkIn && { checkIn }),
    ...(checkOut && { checkOut }),
    ...(guests && { guests }),
    ...(area && { area: [area] }),
  }), [searchQuery, checkIn, checkOut, guests, area]);

  // Initialize filters only once
  useEffect(() => {
    if (!isInitialized) {
      dispatch(setFilters(initialFilters));
      setIsInitialized(true);
    }
  }, [dispatch, initialFilters, isInitialized]);

  // Fetch hotels when filters or sortBy change (debounced)
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      dispatch(fetchHotels({
        ...filters,
        sortBy,
        page: 1,
        limit: 12
      }));
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [filters, sortBy, dispatch, isInitialized]);

  // Memoized handlers to prevent recreation
  const handleFiltersChange = useCallback((newFilters: any) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    dispatch(fetchHotels({
      ...filters,
      sortBy,
      page,
      limit: 12
    }));
  }, [dispatch, filters, sortBy]);

  const handleAreaSelect = useCallback((selectedArea: string) => {
    const newFilters = { ...filters, area: [selectedArea] };
    handleFiltersChange(newFilters);
  }, [filters, handleFiltersChange]);

  const handleHotelSelect = useCallback((hotel: any) => {
    window.open(`/hotels/${hotel.id}`, '_blank');
  }, []);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
    setSortBy('recommended');
  }, [dispatch]);

  // Memoized hotel data for map
  const mapHotels = useMemo(() => 
    hotels.map(hotel => ({
      id: hotel._id,
      name: hotel.name,
      location: hotel.location,
      rating: hotel.rating.average,
      price: hotel.lowestPrice || hotel.roomTypes?.[0]?.price || 0,
      image: hotel.images?.[0]?.url || ''
    })), [hotels]
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">Error loading hotels</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span>
                  {searchQuery 
                    ? `Hotels in "${searchQuery}"` 
                    : 'Hotels in Nagpur'
                  }
                </span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                {loading ? 'Searching...' : `${hotels.length} properties found`}
                {checkIn && checkOut && (
                  <span className="hidden sm:inline"> • {checkIn} - {checkOut}</span>
                )}
                {guests && (
                  <span> • {guests} guests</span>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex items-center justify-between sm:justify-start space-x-2">
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                    showMap 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="h-4 w-4 inline mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{showMap ? 'Hide Map' : 'Show Map'}</span>
                  <span className="sm:hidden">Map</span>
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.area?.length || filters.amenities?.length || filters.rating) && (
            <div className="mt-4 flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.area?.map(areaFilter => (
                <span key={areaFilter} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs md:text-sm">
                  {areaFilter}
                </span>
              ))}
              {filters.amenities?.map(amenity => (
                <span key={amenity} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs md:text-sm">
                  {amenity}
                </span>
              ))}
              {filters.rating && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs md:text-sm">
                  {filters.rating}+ stars
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs md:text-sm text-red-600 hover:text-red-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Map View */}
        {showMap && (
          <div className="mb-6 md:mb-8">
            <NagpurMap
              hotels={mapHotels}
              selectedArea={filters.area?.[0]}
              onAreaSelect={handleAreaSelect}
              onHotelSelect={handleHotelSelect}
              height="h-64 md:h-80 lg:h-96"
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
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
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl h-64 md:h-80"></div>
                  </div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Search className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-orange-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm md:text-base"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 md:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
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
                  <div className="mt-6 md:mt-8 flex justify-center">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </button>
                      
                      {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-2 md:px-3 py-2 border rounded-lg text-sm md:text-base ${
                              pagination.current === pageNum
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={!pagination.hasNext}
                        className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
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