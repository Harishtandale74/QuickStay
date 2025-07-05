import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Home/Hero';
import SearchSection from '../components/Home/SearchSection';
import FeaturedHotels from '../components/Home/FeaturedHotels';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import AIRecommendations from '../components/AI/AIRecommendations';
import ChatBot from '../components/AI/ChatBot';
import NagpurMap from '../components/Nagpur/NagpurMap';
import WeatherWidget from '../components/Nagpur/WeatherWidget';
import LocalGuide from '../components/Nagpur/LocalGuide';
import { fetchFeaturedHotels } from '../store/slices/hotelSlice';
import { RootState, AppDispatch } from '../store/store';
import useSocket from '../hooks/useSocket';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredHotels, loading } = useSelector((state: RootState) => state.hotels);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Initialize socket connection
  const socket = useSocket();

  useEffect(() => {
    // Fetch featured hotels on component mount
    dispatch(fetchFeaturedHotels());
  }, [dispatch]);

  useEffect(() => {
    // Track page visit
    if (socket && isAuthenticated) {
      socket.trackUserActivity('visited_home_page');
    }
  }, [socket, isAuthenticated]);

  return (
    <div className="animate-fade-in">
      <Hero />
      <SearchSection />
      
      {/* Nagpur-specific sections */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Nagpur
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the Orange City with our comprehensive guide and real-time information
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NagpurMap 
                hotels={featuredHotels.map(hotel => ({
                  id: hotel._id,
                  name: hotel.name,
                  location: hotel.location,
                  rating: hotel.rating.average,
                  price: hotel.roomTypes?.[0]?.price || 0,
                  image: hotel.images?.[0]?.url || ''
                }))}
              />
            </div>
            <div className="space-y-6">
              <WeatherWidget />
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured Hotels</span>
                    <span className="font-semibold text-orange-600">{featuredHotels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Areas Covered</span>
                    <span className="font-semibold text-orange-600">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold text-orange-600">4.7⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedHotels />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIRecommendations />
          </div>
          <div>
            <LocalGuide />
          </div>
        </div>
      </div>
      
      <Features />
      <Testimonials />
      <ChatBot />
    </div>
  );
};

export default Home;