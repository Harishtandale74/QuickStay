import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Home/Hero';
import SearchSection from '../components/Home/SearchSection';
import FeaturedHotels from '../components/Home/FeaturedHotels';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import { fetchFeaturedHotels } from '../store/slices/hotelSlice';
import { RootState, AppDispatch } from '../store/store';
import useSocket from '../hooks/useSocket';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredHotels, loading } = useSelector((state: RootState) => state.hotels);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize socket connection
  const socket = useSocket();

  useEffect(() => {
    // Fetch only essential data for home page
    const loadEssentialData = async () => {
      try {
        // Only fetch featured hotels (limit to 4 for performance)
        await dispatch(fetchFeaturedHotels());
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading home page data:', error);
        setIsLoaded(true); // Still show page even if data fails
      }
    };

    loadEssentialData();
  }, [dispatch]);

  useEffect(() => {
    // Track page visit only after component is loaded
    if (socket && isAuthenticated && isLoaded) {
      socket.trackUserActivity('visited_home_page');
    }
  }, [socket, isAuthenticated, isLoaded]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Always show immediately */}
      <Hero />
      
      {/* Search Section - Critical for user interaction */}
      <SearchSection />
      
      {/* Featured Hotels - Load with skeleton if needed */}
      <FeaturedHotels />
      
      {/* Features Section - Static content, loads fast */}
      <Features />
      
      {/* Testimonials - Static content, loads fast */}
      <Testimonials />
    </div>
  );
};

export default Home;