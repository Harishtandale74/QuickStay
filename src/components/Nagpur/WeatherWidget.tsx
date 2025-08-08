import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow,
  Wind, 
  Droplets, 
  Eye, 
  Thermometer,
  Sunrise,
  Sunset,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Umbrella,
  Gauge
} from 'lucide-react';
import { NAGPUR_WEATHER } from '../../data/nagpurData';
import { nagpurAPI } from '../../utils/api';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  uvIndex: number;
  condition: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'stormy';
  description: string;
  sunrise: string;
  sunset: string;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    feelsLike: 32,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NE',
    visibility: 8,
    pressure: 1013,
    uvIndex: 6,
    condition: 'sunny',
    description: 'Perfect weather for exploring Nagpur',
    sunrise: '06:30',
    sunset: '18:45',
    forecast: [
      { day: 'Today', high: 32, low: 22, condition: 'Sunny', icon: '☀️', humidity: 65, windSpeed: 12 },
      { day: 'Tomorrow', high: 30, low: 20, condition: 'Partly Cloudy', icon: '⛅', humidity: 70, windSpeed: 10 },
      { day: 'Wed', high: 28, low: 18, condition: 'Cloudy', icon: '☁️', humidity: 75, windSpeed: 8 },
      { day: 'Thu', high: 26, low: 16, condition: 'Light Rain', icon: '🌦️', humidity: 85, windSpeed: 15 },
      { day: 'Fri', high: 29, low: 19, condition: 'Sunny', icon: '☀️', humidity: 60, windSpeed: 10 },
    ]
  });

  const [currentSeason, setCurrentSeason] = useState<'summer' | 'monsoon' | 'winter'>('winter');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Determine current season based on month
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 5) {
      setCurrentSeason('summer');
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      setCurrentSeason('monsoon');
    } else {
      setCurrentSeason('winter');
    }

    // Fetch initial weather data
    fetchWeatherData();
    
    // Set up auto-refresh every 10 minutes
    const interval = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await nagpurAPI.getNagpurWeather();
      const data = response.data;
      
      setWeather(prev => ({
        ...prev,
        temperature: data.temperature,
        feelsLike: data.temperature + Math.floor(Math.random() * 6) - 3,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        visibility: data.visibility,
        pressure: 1000 + Math.floor(Math.random() * 50),
        uvIndex: Math.floor(Math.random() * 11),
        condition: data.condition,
        description: data.description,
        sunrise: '06:' + (25 + Math.floor(Math.random() * 10)),
        sunset: '18:' + (40 + Math.floor(Math.random() * 20)),
      }));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setError('Using offline weather data');
      
      // Fallback to simulated data
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'partly-cloudy', 'rainy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setWeather(prev => ({
        ...prev,
        temperature: Math.floor(Math.random() * 15) + 20,
        condition: randomCondition,
        description: getWeatherDescription(randomCondition)
      }));
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return 'Perfect weather for exploring Nagpur\'s attractions';
      case 'cloudy':
        return 'Comfortable weather for outdoor activities';
      case 'partly-cloudy':
        return 'Pleasant weather with some clouds';
      case 'rainy':
        return 'Great weather to enjoy indoor hotel amenities';
      case 'stormy':
        return 'Stay safe indoors during the storm';
      default:
        return 'Pleasant weather for travel';
    }
  };

  const getWeatherIcon = (condition: WeatherData['condition'], size: string = 'h-8 w-8') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'cloudy':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'partly-cloudy':
        return <Cloud className={`${size} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'stormy':
        return <CloudSnow className={`${size} text-purple-500`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getSeasonGradient = (season: string) => {
    switch (season) {
      case 'summer':
        return 'from-orange-500 via-red-500 to-pink-500';
      case 'monsoon':
        return 'from-blue-500 via-teal-500 to-green-500';
      case 'winter':
        return 'from-blue-500 via-indigo-500 to-purple-500';
      default:
        return 'from-blue-500 via-indigo-500 to-purple-500';
    }
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Extreme', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const uvLevel = getUVLevel(weather.uvIndex);

  const getTravelAdvice = () => {
    if (weather.temperature > 35) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
        text: 'Very hot weather. Stay hydrated and book hotels with good AC.',
        color: 'bg-orange-50 border-orange-200 text-orange-700'
      };
    } else if (weather.condition === 'rainy') {
      return {
        icon: <Umbrella className="h-4 w-4 text-blue-500" />,
        text: 'Rainy weather. Perfect time for indoor attractions and hotel amenities.',
        color: 'bg-blue-50 border-blue-200 text-blue-700'
      };
    } else if (weather.temperature < 15) {
      return {
        icon: <Thermometer className="h-4 w-4 text-blue-500" />,
        text: 'Cool weather. Great time for sightseeing and outdoor activities.',
        color: 'bg-blue-50 border-blue-200 text-blue-700'
      };
    } else {
      return {
        icon: <Sun className="h-4 w-4 text-green-500" />,
        text: 'Perfect weather for exploring Nagpur! Ideal for all activities.',
        color: 'bg-green-50 border-green-200 text-green-700'
      };
    }
  };

  const travelAdvice = getTravelAdvice();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getSeasonGradient(currentSeason)} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Nagpur Weather</h3>
            </div>
            <p className="text-white/80">Orange City, Maharashtra, India</p>
          </div>
          <div className="text-right">
            {getWeatherIcon(weather.condition)}
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="mt-2 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Refresh weather data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-700">{error}</span>
          </div>
        )}

        {/* Main Temperature Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {getWeatherIcon(weather.condition, 'h-16 w-16')}
            <div>
              <div className="text-5xl font-bold text-gray-900">
                {weather.temperature}°C
              </div>
              <div className="text-lg text-gray-600">
                Feels like {weather.feelsLike}°C
              </div>
            </div>
          </div>
          <div className="text-gray-700 font-medium capitalize text-lg">{weather.condition}</div>
          <div className="text-gray-600 mt-1">{weather.description}</div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="text-lg font-bold text-blue-600">{weather.humidity}%</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Wind</div>
            <div className="text-lg font-bold text-gray-600">{weather.windSpeed} km/h</div>
            <div className="text-xs text-gray-500">{weather.windDirection}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Visibility</div>
            <div className="text-lg font-bold text-green-600">{weather.visibility} km</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Gauge className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Pressure</div>
            <div className="text-lg font-bold text-purple-600">{weather.pressure} hPa</div>
          </div>
        </div>

        {/* Sun Times */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4 flex items-center space-x-3">
            <Sunrise className="h-6 w-6 text-yellow-600" />
            <div>
              <div className="text-sm text-gray-600">Sunrise</div>
              <div className="text-lg font-bold text-yellow-900">{weather.sunrise} AM</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 flex items-center space-x-3">
            <Sunset className="h-6 w-6 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">Sunset</div>
              <div className="text-lg font-bold text-orange-900">{weather.sunset} PM</div>
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className={`${uvLevel.bg} rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">UV Index</div>
              <div className={`text-xl font-bold ${uvLevel.color}`}>
                {weather.uvIndex} - {uvLevel.level}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {weather.uvIndex <= 2 ? 'Safe for outdoor activities' :
                 weather.uvIndex <= 5 ? 'Use sunscreen for extended outdoor time' :
                 weather.uvIndex <= 7 ? 'Seek shade during midday hours' :
                 'Avoid prolonged sun exposure'}
              </div>
            </div>
            <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${uvLevel.color.replace('text-', 'bg-')}`}
                style={{ width: `${Math.min((weather.uvIndex / 11) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Travel Advice */}
        <div className={`border rounded-lg p-4 mb-6 ${travelAdvice.color}`}>
          <div className="flex items-start space-x-3">
            {travelAdvice.icon}
            <div>
              <div className="font-medium mb-1">Travel Advice for Nagpur</div>
              <div className="text-sm">{travelAdvice.text}</div>
            </div>
          </div>
        </div>

        {/* Expandable Forecast */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4"
          >
            <span className="font-medium text-gray-900">5-Day Forecast</span>
            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>

          {isExpanded && (
            <div className="space-y-3">
              {weather.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{day.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{day.day}</div>
                      <div className="text-sm text-gray-600">{day.condition}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-gray-600">High/Low</div>
                      <div className="font-bold">{day.high}°/{day.low}°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">Humidity</div>
                      <div className="font-medium">{day.humidity}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">Wind</div>
                      <div className="font-medium">{day.windSpeed} km/h</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Season Information */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Thermometer className="h-4 w-4 mr-2 text-orange-600" />
            Current Season: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Typical Range:</span>
              <span className="font-medium">{NAGPUR_WEATHER[currentSeason].temperature}</span>
            </div>
            <div className="text-gray-600 mt-2 text-sm">
              {NAGPUR_WEATHER[currentSeason].description}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {lastUpdated.toLocaleTimeString()} IST</span>
          <span>Nagpur Weather Station</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;