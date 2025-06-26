import React from 'react';
import { Star, Wifi, Car, Coffee, Dumbbell, Waves, Utensils } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    priceRange: [number, number];
    amenities: string[];
    rating: number;
    location: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange }) => {
  const amenitiesList = [
    { name: 'Wifi', icon: <Wifi className="h-4 w-4" /> },
    { name: 'Parking', icon: <Car className="h-4 w-4" /> },
    { name: 'Restaurant', icon: <Utensils className="h-4 w-4" /> },
    { name: 'Gym', icon: <Dumbbell className="h-4 w-4" /> },
    { name: 'Pool', icon: <Waves className="h-4 w-4" /> },
    { name: 'Spa', icon: <Coffee className="h-4 w-4" /> },
  ];

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating: rating === filters.rating ? 0 : rating });
  };

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 1000],
      amenities: [],
      rating: 0,
      location: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Min"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 1000)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Max"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
                <span className="text-sm text-gray-600">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
        <div className="space-y-2">
          {amenitiesList.map((amenity) => (
            <label key={amenity.name} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity.name)}
                onChange={() => handleAmenityToggle(amenity.name)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2">
                {amenity.icon}
                <span className="text-sm text-gray-700">{amenity.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Location</h4>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter city or area"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;