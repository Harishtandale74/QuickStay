import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Home/Hero';
import SearchSection from '../components/Home/SearchSection';
import FeaturedHotels from '../components/Home/FeaturedHotels';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import { fetchFeaturedHotels } from '../store/slices/hotelSlice';
import { RootState, AppDispatch } from '../store/store';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredHotels, loading } = useSelector((state: RootState) => state.hotels);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Memoized device detection for performance
  const updateDeviceType = useMemo(() => {
    return () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
  }, []);

  // Device detection with optimized event handling
  useEffect(() => {
    updateDeviceType();
    
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDeviceType, 150);
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [updateDeviceType]);

  // Optimized data loading
  useEffect(() => {
    const loadEssentialData = async () => {
      try {
        // Only fetch featured hotels for home page
        await dispatch(fetchFeaturedHotels());
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading home page data:', error);
        setIsLoaded(true); // Still show page even if data fails
      }
    };

    loadEssentialData();
  }, [dispatch]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Always show immediately */}
      <Hero deviceType={deviceType} />
      
      {/* Search Section - Critical for user interaction */}
      <SearchSection deviceType={deviceType} />
      
      {/* Featured Hotels - Load with skeleton if needed */}
      <FeaturedHotels deviceType={deviceType} />
      
      {/* Features Section - Static content, loads fast */}
      <Features deviceType={deviceType} />
      
      {/* Testimonials - Static content, loads fast */}
      <Testimonials deviceType={deviceType} />
    </div>
  );
};

export default Home;