import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Phone, Clock } from 'lucide-react';
import { NAGPUR_AREAS, NAGPUR_COORDINATES, POPULAR_HOTEL_AREAS } from '../../data/nagpurData';

interface Hotel {
  id: string;
  name: string;
  location: {
    area: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rating: number;
  price: number;
  image: string;
}

interface NagpurMapProps {
  hotels: Hotel[];
  selectedArea?: string;
  onAreaSelect?: (area: string) => void;
  onHotelSelect?: (hotel: Hotel) => void;
}

const NagpurMap: React.FC<NagpurMapProps> = ({
  hotels,
  selectedArea,
  onAreaSelect,
  onHotelSelect
}) => {
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  };

  const getHotelsInArea = (area: string) => {
    return hotels.filter(hotel => hotel.location.area === area);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Nagpur Hotels Map</h3>
            <p className="text-primary-100">Explore hotels across different areas of Nagpur</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{hotels.length}</div>
            <div className="text-sm text-primary-100">Hotels Available</div>
          </div>
        </div>
      </div>

      {/* Interactive Map Area */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
        {/* Nagpur City Outline */}
        <div className="absolute inset-4 border-2 border-dashed border-primary-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">Nagpur City</div>
            <div className="text-sm text-gray-600">Maharashtra, India</div>
          </div>
        </div>

        {/* Area Markers */}
        {POPULAR_HOTEL_AREAS.map((area, index) => {
          const hotelsInArea = getHotelsInArea(area.name);
          const isSelected = selectedArea === area.name;
          
          return (
            <button
              key={area.name}
              onClick={() => onAreaSelect?.(area.name)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isSelected ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{
                left: `${20 + (index % 3) * 30}%`,
                top: `${25 + Math.floor(index / 3) * 25}%`
              }}
            >
              <div className={`relative ${
                isSelected 
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600' 
                  : 'bg-gradient-to-r from-primary-500 to-primary-600'
              } text-white rounded-full p-3 shadow-lg`}>
                <MapPin className="h-5 w-5" />
                {hotelsInArea.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {hotelsInArea.length}
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs font-medium text-gray-900 bg-white px-2 py-1 rounded shadow">
                {area.name}
              </div>
            </button>
          );
        })}

        {/* User Location */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg animate-pulse">
                <Navigation className="h-4 w-4" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                Your Location
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Area Information */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_HOTEL_AREAS.map((area) => {
            const hotelsInArea = getHotelsInArea(area.name);
            const isSelected = selectedArea === area.name;
            
            return (
              <button
                key={area.name}
                onClick={() => onAreaSelect?.(area.name)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{area.name}</h4>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-600">
                      {hotelsInArea.length} hotels
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">Avg Price: </span>
                    <span className="font-semibold text-primary-600">₹{area.avgPrice}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {area.highlights.slice(0, 2).map((highlight) => (
                      <span
                        key={highlight}
                        className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Area Hotels */}
      {selectedArea && (
        <div className="border-t border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Hotels in {selectedArea}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getHotelsInArea(selectedArea).slice(0, 4).map((hotel) => (
              <button
                key={hotel.id}
                onClick={() => onHotelSelect?.(hotel)}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <h5 className="font-medium text-gray-900">{hotel.name}</h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm font-medium text-primary-600">
                      ₹{hotel.price}/night
                    </span>
                  </div>
                  {userLocation && (
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        hotel.location.coordinates.latitude,
                        hotel.location.coordinates.longitude
                      ).toFixed(1)} km away
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-gray-600">Hotel Areas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Your Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
              <span className="text-gray-600">Selected Area</span>
            </div>
          </div>
          <div className="text-gray-500">
            Click on areas to explore hotels
          </div>
        </div>
      </div>
    </div>
  );
};

export default NagpurMap;