import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Camera, 
  Utensils, 
  ShoppingBag, 
  Car,
  Info,
  AlertTriangle
} from 'lucide-react';
import { NAGPUR_LANDMARKS, TRAVEL_TIPS, EMERGENCY_CONTACTS } from '../../data/nagpurData';

const LocalGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attractions');

  const attractions = [
    {
      name: 'Deekshabhoomi',
      description: 'Sacred Buddhist monument and pilgrimage site',
      category: 'Religious',
      rating: 4.8,
      distance: '5 km from city center',
      timings: '6:00 AM - 8:00 PM',
      image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: 'Best visited during early morning or evening. Photography allowed.'
    },
    {
      name: 'Ambazari Lake',
      description: 'Largest lake in Nagpur, perfect for boating and picnics',
      category: 'Nature',
      rating: 4.5,
      distance: '8 km from city center',
      timings: '5:00 AM - 10:00 PM',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: 'Boating available. Great for sunset views. Food stalls nearby.'
    },
    {
      name: 'Sitabuldi Fort',
      description: 'Historic fort with panoramic city views',
      category: 'Historical',
      rating: 4.3,
      distance: '2 km from city center',
      timings: '9:00 AM - 6:00 PM',
      image: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: 'Climb to the top for city views. Carry water. Closed on Mondays.'
    },
    {
      name: 'Raman Science Centre',
      description: 'Interactive science museum for all ages',
      category: 'Educational',
      rating: 4.6,
      distance: '4 km from city center',
      timings: '10:00 AM - 6:00 PM',
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
      tips: 'Great for families. Planetarium shows available. Book tickets online.'
    }
  ];

  const restaurants = [
    {
      name: 'Saoji Bhojnalaya',
      cuisine: 'Traditional Saoji',
      specialty: 'Spicy mutton curry',
      rating: 4.7,
      priceRange: '₹200-400',
      location: 'Sitabuldi',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Haldiram\'s',
      cuisine: 'North Indian, Sweets',
      specialty: 'Chole Bhature, Sweets',
      rating: 4.4,
      priceRange: '₹150-300',
      location: 'Multiple locations',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Tarri Poha Center',
      cuisine: 'Local Street Food',
      specialty: 'Tarri Poha, Jalebi',
      rating: 4.5,
      priceRange: '₹50-150',
      location: 'Sadar',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const shopping = [
    {
      name: 'Sitabuldi Main Road',
      type: 'Street Shopping',
      specialty: 'Clothes, Electronics, Local Items',
      timing: '10:00 AM - 9:00 PM',
      location: 'Sitabuldi'
    },
    {
      name: 'Empress City Mall',
      type: 'Shopping Mall',
      specialty: 'Branded Stores, Food Court, Cinema',
      timing: '11:00 AM - 10:00 PM',
      location: 'Nagpur Central'
    },
    {
      name: 'Itwari Market',
      type: 'Traditional Market',
      specialty: 'Oranges, Local Produce, Handicrafts',
      timing: '8:00 AM - 8:00 PM',
      location: 'Itwari'
    }
  ];

  const transportation = [
    {
      mode: 'Auto Rickshaw',
      description: 'Most convenient for short distances',
      fare: '₹15-20 per km',
      tips: 'Use meter or negotiate fare beforehand'
    },
    {
      mode: 'City Bus',
      description: 'Economical for longer distances',
      fare: '₹8-25 per trip',
      tips: 'MSRTC buses connect all major areas'
    },
    {
      mode: 'Taxi/Cab',
      description: 'Comfortable for airport transfers',
      fare: '₹12-15 per km',
      tips: 'Ola, Uber available. Book in advance for airport'
    },
    {
      mode: 'Metro (Upcoming)',
      description: 'Under construction, will connect major areas',
      fare: 'TBD',
      tips: 'Expected to start operations soon'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <MapPin className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-semibold">Nagpur Local Guide</h3>
            <p className="text-orange-100">Your complete guide to the Orange City</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'attractions', label: 'Attractions', icon: <Camera className="h-4 w-4" /> },
            { id: 'food', label: 'Food & Dining', icon: <Utensils className="h-4 w-4" /> },
            { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="h-4 w-4" /> },
            { id: 'transport', label: 'Transport', icon: <Car className="h-4 w-4" /> },
            { id: 'tips', label: 'Travel Tips', icon: <Info className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Must-Visit Attractions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attractions.map((attraction) => (
                <div key={attraction.name} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{attraction.name}</h5>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{attraction.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{attraction.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{attraction.timings}</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-orange-50 rounded text-xs text-orange-700">
                      💡 {attraction.tips}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Local Food & Restaurants</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.name} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialty:</span>
                        <span className="font-medium">{restaurant.specialty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Range:</span>
                        <span className="font-medium">{restaurant.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{restaurant.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Shopping Destinations</h4>
            <div className="space-y-4">
              {shopping.map((place) => (
                <div key={place.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-900">{place.name}</h5>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-medium">
                      {place.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Specialty:</span>
                      <p className="font-medium">{place.specialty}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Timing:</span>
                      <p className="font-medium">{place.timing}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{place.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Getting Around Nagpur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transportation.map((transport) => (
                <div key={transport.mode} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h5 className="font-semibold text-gray-900 mb-2">{transport.mode}</h5>
                  <p className="text-gray-600 text-sm mb-3">{transport.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fare:</span>
                      <span className="font-medium">{transport.fare}</span>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                      💡 {transport.tips}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Travel Tips & Information</h4>
            
            {/* Travel Tips */}
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Essential Travel Tips
              </h5>
              <ul className="space-y-2">
                {TRAVEL_TIPS.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-green-700">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 rounded-lg p-4">
              <h5 className="font-semibold text-red-900 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Contacts
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(EMERGENCY_CONTACTS).map(([service, number]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm text-red-700 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <a
                      href={`tel:${number}`}
                      className="text-sm font-medium text-red-900 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Phone className="h-3 w-3" />
                      <span>{number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Language */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3">Useful Local Phrases</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Hello:</span>
                  <span className="ml-2 font-medium">Namaskar</span>
                </div>
                <div>
                  <span className="text-blue-700">Thank you:</span>
                  <span className="ml-2 font-medium">Dhanyawad</span>
                </div>
                <div>
                  <span className="text-blue-700">How much?:</span>
                  <span className="ml-2 font-medium">Kiti paisa?</span>
                </div>
                <div>
                  <span className="text-blue-700">Where is?:</span>
                  <span className="ml-2 font-medium">Kuthe aahe?</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalGuide;