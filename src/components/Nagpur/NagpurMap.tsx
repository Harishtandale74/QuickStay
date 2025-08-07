import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, Phone, Clock, Loader, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
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
  height?: string;
  showControls?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const NagpurMap: React.FC<NagpurMapProps> = ({
  hotels,
  selectedArea,
  onAreaSelect,
  onHotelSelect,
  height = 'h-96',
  showControls = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  const GOOGLE_MAPS_API_KEY = 'AIzaSyD59LOdOLD5wniYAvrStoek-4eqLsFra8I';

  // Load Google Maps API
  useEffect(() => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeMap();
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your internet connection.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const mapOptions = {
        center: { 
          lat: NAGPUR_COORDINATES.center.latitude, 
          lng: NAGPUR_COORDINATES.center.longitude 
        },
        zoom: 12,
        mapTypeId: mapType,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'cooperative'
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setIsLoading(false);

      // Add click listener for areas
      newMap.addListener('click', (event: any) => {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();
        
        // Find nearest area
        const nearestArea = findNearestArea(clickedLat, clickedLng);
        if (nearestArea && onAreaSelect) {
          onAreaSelect(nearestArea);
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map. Please refresh the page.');
      setIsLoading(false);
    }
  };

  // Update map type
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType);
    }
  }, [map, mapType]);

  // Add markers for hotels
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];

    // Add hotel markers
    hotels.forEach((hotel) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: hotel.location.coordinates.latitude,
          lng: hotel.location.coordinates.longitude
        },
        map: map,
        title: hotel.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#f97316" stroke="#fff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🏨</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        },
        animation: window.google.maps.Animation.DROP
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <img src="${hotel.image}" alt="${hotel.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${hotel.name}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${hotel.location.area}, Nagpur</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: #fbbf24;">⭐</span>
                <span style="font-weight: 600; color: #1f2937;">${hotel.rating}</span>
              </div>
              <div style="font-weight: bold; color: #f97316; font-size: 16px;">₹${hotel.price}/night</div>
            </div>
            <button onclick="window.selectHotel('${hotel.id}')" style="
              width: 100%; 
              margin-top: 8px; 
              padding: 8px 16px; 
              background: linear-gradient(to right, #f97316, #dc2626); 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-weight: 600; 
              cursor: pointer;
              transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              View Details
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close other info windows
        newMarkers.forEach(m => m.infoWindow?.close());
        infoWindow.open(map, marker);
      });

      marker.infoWindow = infoWindow;
      newMarkers.push(marker);
    });

    // Add area markers
    POPULAR_HOTEL_AREAS.forEach((area, index) => {
      const hotelsInArea = hotels.filter(h => h.location.area === area.name);
      if (hotelsInArea.length === 0) return;

      // Calculate area center (simplified)
      const areaLat = NAGPUR_COORDINATES.center.latitude + (Math.random() - 0.5) * 0.1;
      const areaLng = NAGPUR_COORDINATES.center.longitude + (Math.random() - 0.5) * 0.1;

      const areaMarker = new window.google.maps.Marker({
        position: { lat: areaLat, lng: areaLng },
        map: map,
        title: `${area.name} - ${hotelsInArea.length} hotels`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="22" fill="${selectedArea === area.name ? '#dc2626' : '#3b82f6'}" stroke="#fff" stroke-width="3"/>
              <text x="25" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${hotelsInArea.length}</text>
              <text x="25" y="32" text-anchor="middle" fill="white" font-size="8">hotels</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(50, 50),
          anchor: new window.google.maps.Point(25, 25)
        }
      });

      areaMarker.addListener('click', () => {
        if (onAreaSelect) {
          onAreaSelect(area.name);
        }
        map.setCenter({ lat: areaLat, lng: areaLng });
        map.setZoom(14);
      });

      newMarkers.push(areaMarker);
    });

    setMarkers(newMarkers);

    // Global function for hotel selection
    (window as any).selectHotel = (hotelId: string) => {
      const hotel = hotels.find(h => h.id === hotelId);
      if (hotel && onHotelSelect) {
        onHotelSelect(hotel);
      }
    };

  }, [map, hotels, selectedArea, onAreaSelect, onHotelSelect]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);

          if (map && window.google) {
            const userMarker = new window.google.maps.Marker({
              position: { lat: location.latitude, lng: location.longitude },
              map: map,
              title: 'Your Location',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="12" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
                    <circle cx="15" cy="15" r="6" fill="#fff"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 15)
              },
              animation: window.google.maps.Animation.BOUNCE
            });

            setTimeout(() => {
              userMarker.setAnimation(null);
            }, 2000);
          }
        },
        (error) => {
          console.log('Location access denied or failed');
        }
      );
    }
  }, [map]);

  const findNearestArea = (lat: number, lng: number) => {
    let nearestArea = null;
    let minDistance = Infinity;

    POPULAR_HOTEL_AREAS.forEach(area => {
      // Simplified distance calculation
      const distance = Math.sqrt(
        Math.pow(lat - NAGPUR_COORDINATES.center.latitude, 2) + 
        Math.pow(lng - NAGPUR_COORDINATES.center.longitude, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestArea = area.name;
      }
    });

    return nearestArea;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerOnNagpur = () => {
    if (map) {
      map.setCenter({ 
        lat: NAGPUR_COORDINATES.center.latitude, 
        lng: NAGPUR_COORDINATES.center.longitude 
      });
      map.setZoom(12);
    }
  };

  const centerOnUserLocation = () => {
    if (map && userLocation) {
      map.setCenter({ 
        lat: userLocation.latitude, 
        lng: userLocation.longitude 
      });
      map.setZoom(15);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Map Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Interactive Nagpur Map</h3>
            <p className="text-orange-100">Explore hotels across different areas of Nagpur</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold">{hotels.length}</div>
              <div className="text-sm text-orange-100">Hotels Available</div>
            </div>
            {showControls && (
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      {showControls && (
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="roadmap">Road Map</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
              
              <button
                onClick={centerOnNagpur}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
              >
                <MapPin className="h-4 w-4" />
                <span>Center on Nagpur</span>
              </button>
              
              {userLocation && (
                <button
                  onClick={centerOnUserLocation}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <Navigation className="h-4 w-4" />
                  <span>My Location</span>
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              Click on markers for details • Drag to explore
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading interactive map...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className={`w-full ${isFullscreen ? 'h-full' : height} bg-gray-100`}
          style={{ minHeight: isFullscreen ? '100%' : '400px' }}
        />
      </div>

      {/* Area Information */}
      {!isFullscreen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_HOTEL_AREAS.map((area) => {
              const hotelsInArea = hotels.filter(h => h.location.area === area.name);
              const isSelected = selectedArea === area.name;
              
              return (
                <button
                  key={area.name}
                  onClick={() => onAreaSelect?.(area.name)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{area.name}</h4>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">
                        {hotelsInArea.length} hotels
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Avg Price: </span>
                      <span className="font-semibold text-orange-600">₹{area.avgPrice}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {area.highlights.slice(0, 2).map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
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
      )}

      {/* Map Legend */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Hotels</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Areas</span>
            </div>
            {userLocation && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
                <span className="text-gray-600">Your Location</span>
              </div>
            )}
          </div>
          <div className="text-gray-500">
            Powered by Google Maps
          </div>
        </div>
      </div>
    </div>
  );
};

export default NagpurMap;