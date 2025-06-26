import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, Sparkles, Clock, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestion {
  id: string;
  type: 'destination' | 'hotel' | 'experience';
  title: string;
  subtitle: string;
  confidence: number;
  trending?: boolean;
  popular?: boolean;
}

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ 
  onSearch, 
  placeholder = "Where would you like to go?",
  showSuggestions = true 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock AI-powered suggestions
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      type: 'destination',
      title: 'Paris, France',
      subtitle: 'City of Light • 2,847 hotels',
      confidence: 95,
      trending: true,
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Grand Luxury Resort',
      subtitle: 'Malibu, California • 4.9★ • $299/night',
      confidence: 92,
      popular: true,
    },
    {
      id: '3',
      type: 'destination',
      title: 'Tokyo, Japan',
      subtitle: 'Modern metropolis • 1,234 hotels',
      confidence: 88,
      trending: true,
    },
    {
      id: '4',
      type: 'experience',
      title: 'Romantic Getaway',
      subtitle: 'Couples retreats • 156 options',
      confidence: 85,
    },
    {
      id: '5',
      type: 'destination',
      title: 'Santorini, Greece',
      subtitle: 'Island paradise • 567 hotels',
      confidence: 90,
      popular: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      // Simulate AI search delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setLoading(false);
        setShowDropdown(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/hotels?q=${encodeURIComponent(query)}`);
      }
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowDropdown(false);
    
    if (suggestion.type === 'hotel') {
      navigate(`/hotels/${suggestion.id}`);
    } else {
      navigate(`/hotels?q=${encodeURIComponent(suggestion.title)}`);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="h-4 w-4" />;
      case 'hotel': return <Star className="h-4 w-4" />;
      case 'experience': return <Sparkles className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowDropdown(true)}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowDropdown(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* AI-Powered Suggestions Dropdown */}
      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* AI Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">AI-Powered Suggestions</span>
            </div>
          </div>

          {loading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      suggestion.type === 'destination' ? 'bg-blue-100 text-blue-600' :
                      suggestion.type === 'hotel' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{suggestion.title}</span>
                        {suggestion.trending && (
                          <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            <TrendingUp className="h-3 w-3" />
                            <span>Trending</span>
                          </span>
                        )}
                        {suggestion.popular && (
                          <span className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Star className="h-3 w-3" />
                            <span>Popular</span>
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{suggestion.subtitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {suggestion.confidence}% match
                      </div>
                      <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-1 rounded-full"
                          style={{ width: `${suggestion.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No suggestions found</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Press ↑↓ to navigate, Enter to select</span>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;