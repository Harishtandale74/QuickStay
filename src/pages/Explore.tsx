import React from 'react';
import ExploreNagpur from '../components/Nagpur/ExploreNagpur';
import NagpurMap from '../components/Nagpur/NagpurMap';
import WeatherWidget from '../components/Nagpur/WeatherWidget';
import LocalGuide from '../components/Nagpur/LocalGuide';
import { MapPin, Compass, Sun, BookOpen, Smartphone, Tablet, Monitor } from 'lucide-react';

const Explore: React.FC = () => {
  // Detect device type for responsive layout
  const getDeviceLayout = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const deviceLayout = getDeviceLayout();

  // Mock hotels data for map
  const mockHotels = [
    {
      id: '1',
      name: 'The Pride Hotel Nagpur',
      location: {
        area: 'Sitabuldi',
        coordinates: { latitude: 21.1458, longitude: 79.0882 }
      },
      rating: 4.5,
      price: 3200,
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Radisson Blu Hotel',
      location: {
        area: 'Wardha Road',
        coordinates: { latitude: 21.1200, longitude: 79.0500 }
      },
      rating: 4.7,
      price: 4500,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Compass className="h-8 w-8 md:h-12 md:w-12" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Explore Nagpur</h1>
            </div>
            <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto px-4">
              Discover the Orange City's best attractions, authentic cuisine, and hidden gems with our comprehensive local guide
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">18+</div>
              <div className="text-sm md:text-base text-gray-600">Areas Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">50+</div>
              <div className="text-sm md:text-base text-gray-600">Attractions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">100+</div>
              <div className="text-sm md:text-base text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm md:text-base text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className={`grid gap-6 md:gap-8 ${
          deviceLayout === 'mobile' 
            ? 'grid-cols-1' 
            : deviceLayout === 'tablet'
            ? 'grid-cols-1 lg:grid-cols-3'
            : 'grid-cols-1 xl:grid-cols-4'
        }`}>
          {/* Main Explore Section */}
          <div className={deviceLayout === 'desktop' ? 'xl:col-span-3' : deviceLayout === 'tablet' ? 'lg:col-span-2' : ''}>
            <ExploreNagpur />
          </div>

          {/* Sidebar */}
          <div className={`space-y-6 md:space-y-8 ${deviceLayout === 'mobile' ? 'order-first' : ''}`}>
            {/* Weather Widget */}
            <div>
              <div className="flex items-center space-x-2 mb-3 md:mb-4">
                <Sun className="h-5 w-5 text-orange-600" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Current Weather</h3>
              </div>
              <WeatherWidget />
            </div>

            {/* Local Guide - Hidden on mobile to reduce clutter */}
            {deviceLayout !== 'mobile' && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Travel Guide</h3>
                </div>
                <LocalGuide />
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="mt-8 md:mt-12">
          <div className="flex items-center space-x-2 mb-4 md:mb-6">
            <MapPin className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Interactive Nagpur Map</h2>
          </div>
          <NagpurMap 
            hotels={mockHotels}
            onAreaSelect={(area) => console.log('Selected area:', area)}
            onHotelSelect={(hotel) => console.log('Selected hotel:', hotel)}
            height={deviceLayout === 'mobile' ? 'h-80' : 'h-96'}
          />
        </div>
      </div>
    </div>
  );
};

export default Explore;