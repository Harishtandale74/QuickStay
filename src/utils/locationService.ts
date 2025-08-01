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
}

interface LocationError {
  code: number;
  message: string;
}

class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private lastKnownLocation: LocationResult | null = null;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current position with enhanced error handling
  async getCurrentPosition(options: LocationOptions = {}): Promise<LocationResult> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000, // 5 minutes
      ...options
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result: LocationResult = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.lastKnownLocation = result;
          resolve(result);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: this.getErrorMessage(error.code)
          };
          reject(locationError);
        },
        defaultOptions
      );
    });
  }

  // Watch position changes
  watchPosition(
    onSuccess: (location: LocationResult) => void,
    onError: (error: LocationError) => void,
    options: LocationOptions = {}
  ): number {
    if (!this.isSupported()) {
      onError({ code: 0, message: 'Geolocation not supported' });
      return -1;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute for watch
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const result: LocationResult = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        this.lastKnownLocation = result;
        onSuccess(result);
      },
      (error) => {
        const locationError: LocationError = {
          code: error.code,
          message: this.getErrorMessage(error.code)
        };
        onError(locationError);
      },
      defaultOptions
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
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

  // Get user-friendly error messages
  private getErrorMessage(code: number): string {
    switch (code) {
      case 1: // PERMISSION_DENIED
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case 2: // POSITION_UNAVAILABLE
        return 'Location information is unavailable. Please check your GPS or internet connection.';
      case 3: // TIMEOUT
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while getting your location.';
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Request permission explicitly (for better UX)
  async requestPermission(): Promise<PermissionState> {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
      } catch (error) {
        // Fallback for browsers that don't support permissions API
        return 'prompt';
      }
    }
    return 'prompt';
  }

  // Get location with fallback strategies
  async getLocationWithFallback(): Promise<LocationResult> {
    try {
      // Try high accuracy first
      return await this.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    } catch (error) {
      try {
        // Fallback to lower accuracy
        return await this.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 600000
        });
      } catch (fallbackError) {
        // Return last known location if available
        if (this.lastKnownLocation) {
          return this.lastKnownLocation;
        }
        throw fallbackError;
      }
    }
  }
}

export const locationService = LocationService.getInstance();
export type { LocationResult, LocationError, LocationOptions };