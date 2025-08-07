import React from 'react';
import ExploreNagpur from '../components/Nagpur/ExploreNagpur';
import NagpurMap from '../components/Nagpur/NagpurMap';
import WeatherWidget from '../components/Nagpur/WeatherWidget';
import LocalGuide from '../components/Nagpur/LocalGuide';
import { MapPin, Compass, Sun, BookOpen } from 'lucide-react';

const Explore: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Compass className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Explore Nagpur</h1>
            </div>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Discover the Orange City's best attractions, authentic cuisine, and hidden gems with our comprehensive local guide
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">18+</div>
              <div className="text-gray-600">Areas Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">50+</div>
              <div className="text-gray-600">Attractions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">100+</div>
              <div className="text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600">Travel Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Explore Section */}
          <div className="xl:col-span-3">
            <ExploreNagpur />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weather Widget */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sun className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
              </div>
              <WeatherWidget />
            </div>

            {/* Local Guide */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Travel Guide</h3>
              </div>
              <LocalGuide />
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Interactive Nagpur Map</h2>
          </div>
          <NagpurMap 
            hotels={[]} // Will be populated with actual hotel data
            onAreaSelect={(area) => console.log('Selected area:', area)}
            onHotelSelect={(hotel) => console.log('Selected hotel:', hotel)}
          />
        </div>
      </div>
    </div>
  );
};

export default Explore;