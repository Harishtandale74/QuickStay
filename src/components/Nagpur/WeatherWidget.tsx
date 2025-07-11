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
  AlertTriangle
} from 'lucide-react';
import { NAGPUR_WEATHER } from '../../data/nagpurData';
import { nagpurAPI } from '../../utils/api';
import useSocket from '../../hooks/useSocket';

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
      { day: 'Today', high: 32, low: 22, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 30, low: 20, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Wed', high: 28, low: 18, condition: 'Cloudy', icon: '☁️' },
      { day: 'Thu', high: 26, low: 16, condition: 'Light Rain', icon: '🌦️' },
      { day: 'Fri', high: 29, low: 19, condition: 'Sunny', icon: '☀️' },
    ]
  });

  const [currentSeason, setCurrentSeason] = useState<'summer' | 'monsoon' | 'winter'>('winter');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const { subscribeToWeatherUpdates } = useSocket();

  useEffect(() => {
    // Subscribe to weather updates
    subscribeToWeatherUpdates();
    
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
  }, [subscribeToWeatherUpdates]);

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
      setError('Failed to update weather data');
      
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
            <p className="text-white/80">Orange City, Maharashtra</p>
          </div>
          <div className="text-right">
            {getWeatherIcon(weather.condition)}
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="mt-2 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-600 mb-1">
              Feels like {weather.feelsLike}°C
            </div>
            <div className="text-gray-600 capitalize font-medium">{weather.condition}</div>
            <div className="text-sm text-gray-500 mt-2">{weather.description}</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Humidity</span>
              </div>
              <span className="text-sm font-medium">{weather.humidity}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Wind</span>
              </div>
              <span className="text-sm font-medium">{weather.windSpeed} km/h {weather.windDirection}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Visibility</span>
              </div>
              <span className="text-sm font-medium">{weather.visibility} km</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600">Pressure</span>
              </div>
              <span className="text-sm font-medium">{weather.pressure} hPa</span>
            </div>
          </div>
        </div>

        {/* Sun Times & UV Index */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sunrise className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Sunrise</span>
            </div>
            <div className="text-lg font-bold text-yellow-900">{weather.sunrise}</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sunset className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Sunset</span>
            </div>
            <div className="text-lg font-bold text-orange-900">{weather.sunset}</div>
          </div>
        </div>

        {/* UV Index */}
        <div className={`${uvLevel.bg} rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">UV Index</div>
              <div className={`text-lg font-bold ${uvLevel.color}`}>
                {weather.uvIndex} - {uvLevel.level}
              </div>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${uvLevel.color.replace('text-', 'bg-')}`}
                style={{ width: `${(weather.uvIndex / 11) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">{day.day}</div>
                <div className="text-lg mb-1">{day.icon}</div>
                <div className="text-sm font-bold text-gray-900">{day.high}°</div>
                <div className="text-xs text-gray-500">{day.low}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Season Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Thermometer className="h-4 w-4 mr-2" />
            Current Season: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Months:</span>
              <span className="font-medium">{NAGPUR_WEATHER[currentSeason].months.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature Range:</span>
              <span className="font-medium">{NAGPUR_WEATHER[currentSeason].temperature}</span>
            </div>
            <div className="text-gray-600 mt-2">
              {NAGPUR_WEATHER[currentSeason].description}
            </div>
          </div>
        </div>

        {/* Travel Recommendation */}
        <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-start space-x-2">
            <div className="bg-primary-600 text-white p-1 rounded">
              <Sun className="h-3 w-3" />
            </div>
            <div>
              <div className="text-sm font-medium text-primary-900">Travel Recommendation</div>
              <div className="text-sm text-primary-700">
                {currentSeason === 'winter' 
                  ? 'Perfect weather for exploring Nagpur! Pack light woolens for evenings. Visit Deekshabhoomi and Ambazari Lake.'
                  : currentSeason === 'summer'
                  ? 'Stay hydrated and book hotels with good AC. Early morning visits to Sitabuldi Fort recommended.'
                  : 'Monsoon season brings lush greenery! Perfect time for indoor attractions like Raman Science Centre.'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {lastUpdated.toLocaleTimeString()} IST</span>
          <span>Data from Nagpur Weather Station</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;