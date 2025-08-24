import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Brain, Star, MapPin, TrendingUp, Sparkles, Target, Clock, Heart } from 'lucide-react';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';

interface AIRecommendation {
  id: string;
  type: 'hotel' | 'destination' | 'deal' | 'experience';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
}

const AIRecommendations: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Simulate AI recommendation generation
    const generateRecommendations = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'hotel',
          title: 'Perfect Match: Seaside Resort',
          description: 'Based on your love for ocean views and spa treatments',
          confidence: 94,
          reasoning: 'You\'ve booked 3 beachfront hotels with spa amenities in the last year',
          priority: 'high',
          data: {
            name: 'Azure Bay Resort',
            location: 'Santorini, Greece',
            price: 289,
            rating: 4.8,
            image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
            savings: 45,
          }
        },
        {
          id: '2',
          type: 'destination',
          title: 'Trending Destination: Kyoto',
          description: 'Cultural experiences are trending among travelers like you',
          confidence: 87,
          reasoning: 'Similar users who visited museums and cultural sites loved Kyoto',
          priority: 'high',
          data: {
            destination: 'Kyoto, Japan',
            bestTime: 'March - May',
            avgPrice: 195,
            culturalSites: 12,
            image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&w=400',
          }
        },
        {
          id: '3',
          type: 'deal',
          title: 'Limited Time: 40% Off Mountain Retreats',
          description: 'Flash sale on your preferred mountain destinations',
          confidence: 91,
          reasoning: 'You\'ve shown interest in mountain lodges and winter activities',
          priority: 'medium',
          data: {
            discount: 40,
            validUntil: '2024-03-15',
            locations: ['Aspen', 'Whistler', 'Chamonix'],
            avgSavings: 180,
          }
        },
        {
          id: '4',
          type: 'experience',
          title: 'Culinary Adventure Awaits',
          description: 'Michelin-starred dining experiences in your next destination',
          confidence: 82,
          reasoning: 'Your booking history shows preference for hotels with fine dining',
          priority: 'medium',
          data: {
            experience: 'Michelin Star Food Tour',
            location: 'Paris, France',
            duration: '3 days',
            price: 450,
            restaurants: 5,
          }
        }
      ];

      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    if (user) {
      generateRecommendations();
    }
  }, [user]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <MapPin className="h-5 w-5" />;
      case 'destination': return <TrendingUp className="h-5 w-5" />;
      case 'deal': return <Target className="h-5 w-5" />;
      case 'experience': return <Heart className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'bg-blue-100 text-blue-600';
      case 'destination': return 'bg-green-100 text-green-600';
      case 'deal': return 'bg-orange-100 text-orange-600';
      case 'experience': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedCategory);

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
        <p className="text-gray-600 mb-4">Sign in to get personalized travel recommendations powered by AI</p>
        <Link
          to="/login"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Sign In for AI Recommendations
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-gray-600">Personalized suggestions just for you</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Sparkles className="h-4 w-4" />
          <span>Powered by AI</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'hotel', 'destination', 'deal', 'experience'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:border-primary-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(recommendation.type)}`}>
                    {getTypeIcon(recommendation.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                    <p className="text-gray-600 text-sm">{recommendation.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {recommendation.confidence}% match
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${recommendation.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">AI Insight</span>
                </div>
                <p className="text-sm text-gray-700">{recommendation.reasoning}</p>
              </div>

              {/* Recommendation-specific content */}
              {recommendation.type === 'hotel' && (
                <div className="flex items-center space-x-4">
                  <img
                    src={recommendation.data.image}
                    alt={recommendation.data.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{recommendation.data.name}</h5>
                    <p className="text-gray-600 text-sm">{recommendation.data.location}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{recommendation.data.rating}</span>
                      </div>
                      <div className="text-primary-600 font-semibold">
                        ${recommendation.data.price}/night
                      </div>
                      {recommendation.data.savings && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Save ${recommendation.data.savings}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/hotels/${recommendation.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Hotel
                  </Link>
                </div>
              )}

              {recommendation.type === 'destination' && (
                <div className="flex items-center space-x-4">
                  <img
                    src={recommendation.data.image}
                    alt={recommendation.data.destination}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{recommendation.data.destination}</h5>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Best Time:</span>
                        <span className="ml-1 font-medium">{recommendation.data.bestTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Price:</span>
                        <span className="ml-1 font-medium">${recommendation.data.avgPrice}/night</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/hotels?q=${encodeURIComponent(recommendation.data.destination)}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Explore
                  </Link>
                </div>
              )}

              {recommendation.type === 'deal' && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {recommendation.data.discount}% OFF
                      </div>
                      <div className="text-sm text-gray-600">
                        Valid until {recommendation.data.validUntil}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        Locations: {recommendation.data.locations.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        Save up to ${recommendation.data.avgSavings}
                      </div>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-2">
                        Claim Deal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;