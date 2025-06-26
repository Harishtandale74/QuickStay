import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Heart } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  description: string;
  discount?: number;
  isAvailable: boolean;
}

interface HotelCardProps {
  hotel: Hotel;
  viewMode: 'grid' | 'list';
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, viewMode }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'gym':
        return <Dumbbell className="h-4 w-4" />;
      case 'restaurant':
      case 'bar':
        return <Coffee className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      default:
        return <Coffee className="h-4 w-4" />;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-80 h-64 md:h-auto">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            {hotel.discount && (
              <div className="absolute top-4 left-4 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {hotel.discount}% OFF
              </div>
            )}
            <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-gray-600 space-x-1 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
                </div>
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
                <div className="text-sm text-gray-600">per night</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {hotel.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 6).map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600"
                >
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {hotel.isAvailable ? (
                  <span className="text-green-600 font-medium">Available</span>
                ) : (
                  <span className="text-red-600 font-medium">Fully Booked</span>
                )}
              </div>
              <Link
                to={`/hotels/${hotel.id}`}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-64 object-cover"
        />
        {hotel.discount && (
          <div className="absolute top-4 left-4 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {hotel.discount}% OFF
          </div>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
          <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
          <span className="text-sm font-semibold">{hotel.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {hotel.name}
            </h3>
            <div className="flex items-center text-gray-600 space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600"
              >
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>

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
              <div className="text-sm text-gray-600">per night</div>
            </div>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;