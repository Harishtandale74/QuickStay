import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Play, Sparkles, TrendingUp, Users, MapPin } from 'lucide-react';
import SmartSearch from '../AI/SmartSearch';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const heroSlides = [
    {
      title: "Discover Your Perfect",
      highlight: "Stay Experience",
      subtitle: "AI-powered recommendations for unforgettable journeys",
      background: "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800",
      stats: { rating: "4.9", travelers: "1M+", hotels: "10K+" }
    },
    {
      title: "Luxury Meets",
      highlight: "Intelligence",
      subtitle: "Smart booking with real-time availability and instant confirmation",
      background: "bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600",
      stats: { rating: "4.8", travelers: "2M+", hotels: "15K+" }
    },
    {
      title: "Travel Smarter",
      highlight: "Book Faster",
      subtitle: "Personalized deals curated by AI for the modern traveler",
      background: "bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-600",
      stats: { rating: "4.9", travelers: "1.5M+", hotels: "12K+" }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className={`relative ${currentHero.background} text-white overflow-hidden transition-all duration-1000`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* AI Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">Powered by AI</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {currentHero.title}
                <span className="block bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent animate-pulse">
                  {currentHero.highlight}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-2xl leading-relaxed">
                {currentHero.subtitle}
              </p>
            </div>

            {/* Smart Search */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Where would you like to go?</h3>
                <p className="text-primary-100 text-sm">AI-powered search with instant recommendations</p>
              </div>
              <SmartSearch placeholder="Try 'Paris', 'Beach resort', or 'Romantic getaway'..." />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/hotels"
                className="group bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Explore Hotels</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 text-primary-100">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <span className="font-medium">{currentHero.stats.rating}/5 Rating</span>
              </div>
              <div className="h-6 w-px bg-primary-400"></div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="font-bold text-xl">{currentHero.stats.travelers}</span>
                <span>Happy Travelers</span>
              </div>
              <div className="h-6 w-px bg-primary-400"></div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span className="font-bold text-xl">{currentHero.stats.hotels}</span>
                <span>Hotels Worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Elements */}
          <div className="relative">
            {/* Floating Cards */}
            <div className="relative z-10 space-y-6">
              {/* Trending Destinations Card */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 animate-float">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-accent-400" />
                  <h3 className="font-semibold text-lg">Trending Now</h3>
                </div>
                <div className="space-y-3">
                  {['Santorini, Greece', 'Kyoto, Japan', 'Bali, Indonesia'].map((destination, index) => (
                    <div key={destination} className="flex items-center justify-between">
                      <span className="text-primary-100">{destination}</span>
                      <span className="text-accent-400 font-medium">+{25 + index * 5}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Booking Card */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 animate-float delay-500">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-lg">Live Bookings</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-primary-100">Sarah just booked Grand Resort</div>
                  <div className="text-primary-100">Mike reserved City Hotel</div>
                  <div className="text-primary-100">Emma found a great deal</div>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 animate-float delay-1000">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <h3 className="font-semibold text-lg">AI Insights</h3>
                </div>
                <div className="text-primary-100 text-sm">
                  "Based on your preferences, I recommend booking 2 weeks in advance for 23% savings"
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-3xl transform rotate-6"></div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-accent-400 w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            >
              ×
            </button>
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Demo video would play here</p>
                <p className="text-sm opacity-75 mt-2">Showcasing AI-powered hotel booking experience</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;