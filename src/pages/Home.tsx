import React from 'react';
import Hero from '../components/Home/Hero';
import SearchSection from '../components/Home/SearchSection';
import FeaturedHotels from '../components/Home/FeaturedHotels';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import AIRecommendations from '../components/AI/AIRecommendations';
import ChatBot from '../components/AI/ChatBot';

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <SearchSection />
      <FeaturedHotels />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AIRecommendations />
      </div>
      <Features />
      <Testimonials />
      <ChatBot />
    </div>
  );
};

export default Home;