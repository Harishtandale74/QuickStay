import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapPin, Navigation, Star, Phone, Clock, Loader, AlertTriangle, Maximize2, Minimize2, Crosshair, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { NAGPUR_AREAS, NAGPUR_COORDINATES, POPULAR_HOTEL_AREAS } from '../../data/nagpurData';
import { locationService } from '../../utils/locationService';
import toast from 'react-hot-toast';

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

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
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
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD59LOdOLD5wniYAvrStoek-4eqLsFra8I';

  // Device detection
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType, { passive: true });
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Responsive zoom levels
  const getResponsiveZoom = useCallback(() => {
    switch (deviceType) {
      case 'mobile': return 11;
      case 'tablet': return 12;
      default: return 13;
    }
  }, [deviceType]);

  // Get user's current location with enhanced error handling
  const getCurrentLocation = useCallback(async (): Promise<UserLocation> => {
    try {
      const location = await locationService.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
      
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      };
    } catch (error) {
      throw error;
    }
  }, []);

  // Load Google Maps API with proper error handling
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      setMapLoaded(true);
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
      delete window.initMap;
    };
  }, []);

  // Initialize map with responsive settings
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !mapLoaded) return;

    try {
      const mapOptions = {
        center: { 
          lat: NAGPUR_COORDINATES.center.latitude, 
          lng: NAGPUR_COORDINATES.center.longitude 
        },
        zoom: getResponsiveZoom(),
        mapTypeId: mapType,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: deviceType !== 'mobile',
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: deviceType === 'mobile' ? 'greedy' : 'cooperative',
        restriction: {
          latLngBounds: {
            north: NAGPUR_COORDINATES.bounds.north,
            south: NAGPUR_COORDINATES.bounds.south,
            east: NAGPUR_COORDINATES.bounds.east,
            west: NAGPUR_COORDINATES.bounds.west,
          },
          strictBounds: false,
        }
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setIsLoading(false);

      // Add click listener for areas
      newMap.addListener('click', (event: any) => {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();
        
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
  }, [mapType, mapLoaded, getResponsiveZoom, onAreaSelect, deviceType]);

  // Update map type
  useEffect(() => {
    if (map && window.google) {
      map.setMapTypeId(mapType);
    }
  }, [map, mapType]);

  // Add markers for hotels and areas
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];

    // Responsive marker sizing
    const markerSize = deviceType === 'mobile' ? 30 : deviceType === 'tablet' ? 35 : 40;
    
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
            <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#f97316" stroke="#fff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🏨</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(markerSize, markerSize),
          anchor: new window.google.maps.Point(markerSize/2, markerSize/2)
        },
        animation: window.google.maps.Animation.DROP
      });

      // Responsive info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: ${deviceType === 'mobile' ? '200px' : '280px'}; font-family: 'Inter', sans-serif;">
            <img src="${hotel.image}" alt="${hotel.name}" style="width: 100%; height: ${deviceType === 'mobile' ? '100px' : '140px'}; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: ${deviceType === 'mobile' ? '14px' : '16px'}; font-weight: bold; color: #1f2937;">${hotel.name}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: ${deviceType === 'mobile' ? '12px' : '14px'};">${hotel.location.area}, Nagpur</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: #fbbf24;">⭐</span>
                <span style="font-weight: 600; color: #1f2937; font-size: ${deviceType === 'mobile' ? '12px' : '14px'};">${hotel.rating}</span>
              </div>
              <div style="font-weight: bold; color: #f97316; font-size: ${deviceType === 'mobile' ? '14px' : '16px'};">₹${hotel.price}/night</div>
            </div>
            <button onclick="window.selectHotel('${hotel.id}')" style="
              width: 100%; 
              margin-top: 8px; 
              padding: ${deviceType === 'mobile' ? '6px 12px' : '8px 16px'}; 
              background: linear-gradient(to right, #f97316, #dc2626); 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-weight: 600; 
              cursor: pointer;
              font-size: ${deviceType === 'mobile' ? '12px' : '14px'};
              transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              View Details
            </button>
          </div>
        `,
        maxWidth: deviceType === 'mobile' ? 220 : 300
      });

      marker.addListener('click', () => {
        newMarkers.forEach(m => m.infoWindow?.close());
        infoWindow.open(map, marker);
      });

      marker.infoWindow = infoWindow;
      newMarkers.push(marker);
    });

    // Add area markers
    const areaMarkerSize = deviceType === 'mobile' ? 40 : deviceType === 'tablet' ? 45 : 50;
    
    POPULAR_HOTEL_AREAS.forEach((area) => {
      const hotelsInArea = hotels.filter(h => h.location.area === area.name);
      if (hotelsInArea.length === 0) return;

      const areaLat = NAGPUR_COORDINATES.center.latitude + (Math.random() - 0.5) * 0.1;
      const areaLng = NAGPUR_COORDINATES.center.longitude + (Math.random() - 0.5) * 0.1;

      const areaMarker = new window.google.maps.Marker({
        position: { lat: areaLat, lng: areaLng },
        map: map,
        title: `${area.name} - ${hotelsInArea.length} hotels`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="${areaMarkerSize}" height="${areaMarkerSize}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="22" fill="${selectedArea === area.name ? '#dc2626' : '#3b82f6'}" stroke="#fff" stroke-width="3"/>
              <text x="25" y="20" text-anchor="middle" fill="white" font-size="${deviceType === 'mobile' ? '8' : '10'}" font-weight="bold">${hotelsInArea.length}</text>
              <text x="25" y="32" text-anchor="middle" fill="white" font-size="${deviceType === 'mobile' ? '6' : '8'}">hotels</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(areaMarkerSize, areaMarkerSize),
          anchor: new window.google.maps.Point(areaMarkerSize/2, areaMarkerSize/2)
        }
      });

      areaMarker.addListener('click', () => {
        if (onAreaSelect) {
          onAreaSelect(area.name);
        }
        map.setCenter({ lat: areaLat, lng: areaLng });
        map.setZoom(deviceType === 'mobile' ? 13 : 14);
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

  }, [map, hotels, selectedArea, onAreaSelect, onHotelSelect, deviceType]);

  // Get user location with proper error handling
  const handleGetLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      if (map && window.google) {
        // Add user location marker
        const userMarker = new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
          title: `Your Location (±${Math.round(location.accuracy)}m)`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="12" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
                <circle cx="15" cy="15" r="6" fill="#fff"/>
                <circle cx="15" cy="15" r="3" fill="#3b82f6"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15)
          },
          animation: window.google.maps.Animation.BOUNCE
        });

        // Add accuracy circle
        const accuracyCircle = new window.google.maps.Circle({
          strokeColor: '#3b82f6',
          strokeOpacity: 0.3,
          strokeWeight: 1,
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          map: map,
          center: { lat: location.latitude, lng: location.longitude },
          radius: location.accuracy
        });

        setTimeout(() => {
          userMarker.setAnimation(null);
        }, 2000);

        // Center map on user location
        map.setCenter({ lat: location.latitude, lng: location.longitude });
        map.setZoom(15);
      }

      toast.success(`Location found with ${Math.round(location.accuracy)}m accuracy`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLocating(false);
    }
  }, [map, getCurrentLocation]);

  const findNearestArea = useCallback((lat: number, lng: number) => {
    let nearestArea = null;
    let minDistance = Infinity;

    POPULAR_HOTEL_AREAS.forEach(area => {
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
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const centerOnNagpur = useCallback(() => {
    if (map) {
      map.setCenter({ 
        lat: NAGPUR_COORDINATES.center.latitude, 
        lng: NAGPUR_COORDINATES.center.longitude 
      });
      map.setZoom(getResponsiveZoom());
    }
  }, [map, getResponsiveZoom]);

  const zoomIn = useCallback(() => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  }, [map]);

  const zoomOut = useCallback(() => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  }, [map]);

  // Memoized responsive configuration
  const responsiveConfig = useMemo(() => ({
    headerPadding: deviceType === 'mobile' ? 'p-4' : 'p-4 md:p-6',
    titleSize: deviceType === 'mobile' ? 'text-lg' : 'text-lg md:text-xl',
    subtitleSize: deviceType === 'mobile' ? 'text-sm' : 'text-sm md:text-base',
    controlPadding: deviceType === 'mobile' ? 'px-2 md:px-3 py-1.5 md:py-2' : 'px-3 py-2',
    controlText: deviceType === 'mobile' ? 'text-xs md:text-sm' : 'text-sm',
    mapHeight: isFullscreen ? 'h-full' : deviceType === 'mobile' ? 'h-80' : height
  }), [deviceType, isFullscreen, height]);

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Map Header - Responsive */}
      <div className={`bg-gradient-to-r from-orange-500 to-red-600 text-white ${responsiveConfig.headerPadding}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`${responsiveConfig.titleSize} font-semibold mb-1 md:mb-2`}>Interactive Nagpur Map</h3>
            <p className={`text-orange-100 ${responsiveConfig.subtitleSize}`}>Explore hotels across different areas of Nagpur</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="text-right">
              <div className="text-xl md:text-2xl font-bold">{hotels.length}</div>
              <div className="text-xs md:text-sm text-orange-100">Hotels</div>
            </div>
            {showControls && (
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 md:h-5 md:w-5" /> : <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Controls - Responsive */}
      {showControls && (
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value as any)}
                className={`${responsiveConfig.controlPadding} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${responsiveConfig.controlText}`}
                aria-label="Map type"
              >
                <option value="roadmap">Road Map</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
              
              <button
                onClick={centerOnNagpur}
                className={`flex items-center space-x-1 md:space-x-2 ${responsiveConfig.controlPadding} bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors ${responsiveConfig.controlText} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                aria-label="Center map on Nagpur"
              >
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Center on Nagpur</span>
                <span className="sm:hidden">Center</span>
              </button>
              
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className={`flex items-center space-x-1 md:space-x-2 ${responsiveConfig.controlPadding} bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 ${responsiveConfig.controlText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Get my location"
              >
                {isLocating ? (
                  <Loader className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                ) : (
                  <Crosshair className="h-3 w-3 md:h-4 md:w-4" />
                )}
                <span className="hidden sm:inline">My Location</span>
                <span className="sm:hidden">GPS</span>
              </button>
            </div>
            
            <div className={`${responsiveConfig.controlText} text-gray-600`}>
              <span className="hidden md:inline">Click on markers for details • Drag to explore</span>
              <span className="md:hidden">Tap markers for details</span>
            </div>
          </div>
          
          {locationError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {locationError}
            </div>
          )}
        </div>
      )}

      {/* Map Container - Responsive */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader className="h-6 w-6 md:h-8 md:w-8 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-sm md:text-base">Loading interactive map...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className={`w-full ${responsiveConfig.mapHeight} bg-gray-100`}
          style={{ minHeight: isFullscreen ? '100%' : deviceType === 'mobile' ? '300px' : '400px' }}
        />

        {/* Custom Map Controls - Mobile Optimized */}
        {map && !isLoading && (
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={zoomIn}
              className="p-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
              className="p-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle map type"
            >
              <Layers className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Area Information - Responsive Grid */}
      {!isFullscreen && (
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {POPULAR_HOTEL_AREAS.map((area) => {
              const hotelsInArea = hotels.filter(h => h.location.area === area.name);
              const isSelected = selectedArea === area.name;
              
              return (
                <button
                  key={area.name}
                  onClick={() => onAreaSelect?.(area.name)}
                  className={`text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                  aria-label={`Select ${area.name} area`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">{area.name}</h4>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                      <span className="text-xs md:text-sm font-medium text-orange-600">
                        {hotelsInArea.length}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">{area.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs md:text-sm">
                      <span className="text-gray-600">Avg: </span>
                      <span className="font-semibold text-orange-600">₹{area.avgPrice}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {area.highlights.slice(0, deviceType === 'mobile' ? 1 : 2).map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-orange-100 text-orange-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs font-medium"
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

      {/* Map Legend - Responsive */}
      <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 text-xs md:text-sm">
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Hotels</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Areas</span>
            </div>
            {userLocation && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full border-2 border-white"></div>
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