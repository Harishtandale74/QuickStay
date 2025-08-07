import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Sparkles, TrendingUp, Star, Zap } from 'lucide-react';
import SmartSearch from '../AI/SmartSearch';

const SearchSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [activeField, setActiveField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      q: searchQuery,
      checkin: checkIn,
      checkout: checkOut,
      guests: guests,
    });
    navigate(`/hotels?${searchParams.toString()}`);
  };

  const quickSearches = [
    { icon: <TrendingUp className="h-4 w-4" />, label: "Trending: Santorini", query: "Santorini" },
    { icon: <Star className="h-4 w-4" />, label: "Luxury Resorts", query: "luxury resort" },
    { icon: <MapPin className="h-4 w-4" />, label: "Beach Hotels", query: "beach hotel" },
    { icon: <Zap className="h-4 w-4" />, label: "Last Minute Deals", query: "deals" },
  ];

  const aiSuggestions = [
    "Based on your history: Mountain retreats",
    "Trending now: Eco-friendly hotels",
    "Perfect for you: Boutique hotels in Paris",
    "AI recommends: Spa resorts this weekend"
  ];

  return (
    <section className="bg-white py-16 -mt-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">AI-Enhanced Search</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h2>
              <p className="text-gray-600">Powered by AI for personalized recommendations</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Smart Search Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Where would you like to go?
                </label>
                <div className="relative">
                  <SmartSearch 
                    onSearch={(query) => setSearchQuery(query)}
                    placeholder="Try 'Paris', 'Beach resort', or 'Romantic getaway'..."
                  />
                </div>
              </div>

              {/* Date and Guest Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Check-in */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Check-in
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      onFocus={() => setActiveField('checkin')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        activeField === 'checkin' ? 'border-primary-500 shadow-lg' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Check-out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      onFocus={() => setActiveField('checkout')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        activeField === 'checkout' ? 'border-primary-500 shadow-lg' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      onFocus={() => setActiveField('guests')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-all duration-200 ${
                        activeField === 'guests' ? 'border-primary-500 shadow-lg' : 'border-gray-300'
                      }`}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Search Hotels</span>
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Search Options */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Search</h3>
            <p className="text-gray-600">Popular searches powered by AI insights</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(item.query);
                  navigate(`/hotels?q=${encodeURIComponent(item.query)}`);
                }}
                className="group bg-white hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 border border-gray-200 hover:border-primary-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-primary-600 group-hover:text-primary-700 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-primary-900 transition-colors">
                    {item.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
              <p className="text-sm text-gray-600">Personalized recommendations just for you</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-white/50 hover:bg-white/90 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  const query = suggestion.split(': ')[1] || suggestion;
                  setSearchQuery(query);
                  navigate(`/hotels?q=${encodeURIComponent(query)}`);
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;