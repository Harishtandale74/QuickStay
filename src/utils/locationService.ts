interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface LocationError {
  code: number;
  message: string;
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN';
}

class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private lastKnownLocation: LocationResult | null = null;
  private isWatching: boolean = false;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator && 'permissions' in navigator;
  }

  // Check current permission status
  async getPermissionStatus(): Promise<PermissionState> {
    if (!this.isSupported()) {
      throw new Error('Geolocation not supported');
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      return 'prompt';
    }
  }

  // Request permission explicitly
  async requestPermission(): Promise<PermissionState> {
    const status = await this.getPermissionStatus();
    
    if (status === 'granted') {
      return 'granted';
    }
    
    if (status === 'denied') {
      throw new LocationError({
        code: 1,
        message: 'Location access denied. Please enable location permissions in your browser settings.',
        type: 'PERMISSION_DENIED'
      });
    }

    // For 'prompt' status, we need to trigger a location request
    try {
      await this.getCurrentPosition({ timeout: 5000 });
      return 'granted';
    } catch (error) {
      if (error instanceof LocationError && error.type === 'PERMISSION_DENIED') {
        return 'denied';
      }
      throw error;
    }
  }

  // Get current position with enhanced error handling
  async getCurrentPosition(options: LocationOptions = {}): Promise<LocationResult> {
    if (!this.isSupported()) {
      throw new LocationError({
        code: 0,
        message: 'Geolocation is not supported by this browser',
        type: 'UNKNOWN'
      });
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000, // 5 minutes
      ...options
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const result: LocationResult = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          // Try to get address information
          try {
            const addressInfo = await this.reverseGeocode(result.latitude, result.longitude);
            Object.assign(result, addressInfo);
          } catch (error) {
            console.warn('Failed to get address information:', error);
          }
          
          this.lastKnownLocation = result;
          resolve(result);
        },
        (error) => {
          const locationError = this.createLocationError(error);
          reject(locationError);
        },
        defaultOptions
      );
    });
  }

  // Get location with multiple fallback strategies
  async getLocationWithFallback(): Promise<LocationResult> {
    try {
      // Strategy 1: High accuracy
      return await this.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    } catch (error) {
      console.warn('High accuracy location failed, trying fallback:', error);
      
      try {
        // Strategy 2: Lower accuracy, longer timeout
        return await this.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 600000
        });
      } catch (fallbackError) {
        console.warn('Fallback location failed:', fallbackError);
        
        // Strategy 3: Return last known location if available
        if (this.lastKnownLocation) {
          console.info('Using last known location');
          return this.lastKnownLocation;
        }
        
        // Strategy 4: Return Nagpur center as fallback
        console.info('Using Nagpur center as fallback location');
        return {
          latitude: 21.1458,
          longitude: 79.0882,
          accuracy: 10000, // Large accuracy to indicate it's a fallback
          timestamp: Date.now(),
          city: 'Nagpur',
          state: 'Maharashtra',
          country: 'India',
          address: 'Nagpur, Maharashtra, India'
        };
      }
    }
  }

  // Watch position changes with enhanced error handling
  watchPosition(
    onSuccess: (location: LocationResult) => void,
    onError: (error: LocationError) => void,
    options: LocationOptions = {}
  ): number {
    if (!this.isSupported()) {
      onError(new LocationError({
        code: 0,
        message: 'Geolocation not supported',
        type: 'UNKNOWN'
      }));
      return -1;
    }

    if (this.isWatching) {
      this.clearWatch();
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute for watch
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const result: LocationResult = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        // Try to get address information
        try {
          const addressInfo = await this.reverseGeocode(result.latitude, result.longitude);
          Object.assign(result, addressInfo);
        } catch (error) {
          console.warn('Failed to get address information:', error);
        }
        
        this.lastKnownLocation = result;
        onSuccess(result);
      },
      (error) => {
        const locationError = this.createLocationError(error);
        onError(locationError);
      },
      defaultOptions
    );

    this.isWatching = true;
    return this.watchId;
  }

  // Stop watching position
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  // Get last known location
  getLastKnownLocation(): LocationResult | null {
    return this.lastKnownLocation;
  }

  // Calculate distance between two points (in kilometers)
  calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Check if location is within Nagpur bounds
  isInNagpur(latitude: number, longitude: number): boolean {
    const nagpurBounds = {
      north: 21.3,
      south: 21.0,
      east: 79.3,
      west: 78.8
    };

    return (
      latitude >= nagpurBounds.south &&
      latitude <= nagpurBounds.north &&
      longitude >= nagpurBounds.west &&
      longitude <= nagpurBounds.east
    );
  }

  // Find nearest Nagpur area based on coordinates
  findNearestNagpurArea(latitude: number, longitude: number): string {
    const areas = [
      { name: 'Sitabuldi', lat: 21.1458, lng: 79.0882 },
      { name: 'Civil Lines', lat: 21.1500, lng: 79.0800 },
      { name: 'Dharampeth', lat: 21.1400, lng: 79.0900 },
      { name: 'Sadar', lat: 21.1450, lng: 79.0850 },
      { name: 'Wardha Road', lat: 21.1200, lng: 79.0500 },
    ];

    let nearestArea = 'Sitabuldi';
    let minDistance = Infinity;

    areas.forEach(area => {
      const distance = this.calculateDistance(latitude, longitude, area.lat, area.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestArea = area.name;
      }
    });

    return nearestArea;
  }

  // Reverse geocoding to get address from coordinates
  private async reverseGeocode(latitude: number, longitude: number): Promise<Partial<LocationResult>> {
    try {
      // Using a free geocoding service (you can replace with Google's if needed)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      return {
        address: data.display_name || `${data.locality}, ${data.principalSubdivision}`,
        city: data.city || data.locality,
        state: data.principalSubdivision,
        country: data.countryName
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      
      // Fallback: If in Nagpur bounds, return Nagpur info
      if (this.isInNagpur(latitude, longitude)) {
        const area = this.findNearestNagpurArea(latitude, longitude);
        return {
          address: `${area}, Nagpur, Maharashtra, India`,
          city: 'Nagpur',
          state: 'Maharashtra',
          country: 'India'
        };
      }
      
      return {};
    }
  }

  // Create standardized location error
  private createLocationError(error: GeolocationPositionError): LocationError {
    let type: LocationError['type'];
    let message: string;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        type = 'PERMISSION_DENIED';
        message = 'Location access denied. Please enable location permissions in your browser settings and refresh the page.';
        break;
      case error.POSITION_UNAVAILABLE:
        type = 'POSITION_UNAVAILABLE';
        message = 'Location information is unavailable. Please check your GPS signal or internet connection.';
        break;
      case error.TIMEOUT:
        type = 'TIMEOUT';
        message = 'Location request timed out. Please try again or check your connection.';
        break;
      default:
        type = 'UNKNOWN';
        message = 'An unknown error occurred while getting your location. Please try again.';
    }

    return new LocationError({
      code: error.code,
      message,
      type
    });
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get location accuracy description
  getAccuracyDescription(accuracy: number): string {
    if (accuracy <= 5) return 'Very High (±5m)';
    if (accuracy <= 20) return 'High (±20m)';
    if (accuracy <= 100) return 'Medium (±100m)';
    if (accuracy <= 1000) return 'Low (±1km)';
    return 'Very Low (±10km+)';
  }

  // Check if location is recent
  isLocationRecent(timestamp: number, maxAgeMinutes: number = 5): boolean {
    const now = Date.now();
    const ageMinutes = (now - timestamp) / (1000 * 60);
    return ageMinutes <= maxAgeMinutes;
  }
}

// Custom error class for location errors
class LocationError extends Error {
  code: number;
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN';

  constructor({ code, message, type }: { code: number; message: string; type: LocationError['type'] }) {
    super(message);
    this.name = 'LocationError';
    this.code = code;
    this.type = type;
  }
}

export const locationService = LocationService.getInstance();
export type { LocationResult, LocationError, LocationOptions };