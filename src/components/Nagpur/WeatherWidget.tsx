import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { NAGPUR_WEATHER } from '../../data/nagpurData';
import { nagpurAPI } from '../../utils/api';
import useSocket from '../../hooks/useSocket';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  description: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    visibility: 8,
    condition: 'sunny',
    description: 'Pleasant weather for travel'
  });

  const [currentSeason, setCurrentSeason] = useState<'summer' | 'monsoon' | 'winter'>('winter');
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

    // Fetch real weather data
    const fetchWeather = async () => {
      try {
        const response = await nagpurAPI.getNagpurWeather();
        const data = response.data;
        
        setWeather({
          temperature: data.temperature,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          visibility: data.visibility,
          condition: data.condition,
          description: data.description
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        // Fallback to simulated data
        const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        setWeather({
          temperature: Math.floor(Math.random() * 15) + 20,
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          visibility: Math.floor(Math.random() * 5) + 5,
          condition: randomCondition,
          description: getWeatherDescription(randomCondition)
        });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [subscribeToWeatherUpdates]);

  const getWeatherDescription = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return 'Perfect weather for sightseeing';
      case 'cloudy':
        return 'Comfortable weather for outdoor activities';
      case 'rainy':
        return 'Great weather to enjoy indoor hotel amenities';
      default:
        return 'Pleasant weather for travel';
    }
  };

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'summer':
        return 'from-orange-400 to-red-500';
      case 'monsoon':
        return 'from-blue-400 to-green-500';
      case 'winter':
        return 'from-blue-400 to-purple-500';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getSeasonColor(currentSeason)} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">Nagpur Weather</h3>
            <p className="text-white/80">Current conditions</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {weather.temperature}°C
            </div>
            <div className="text-gray-600 capitalize">{weather.condition}</div>
            <div className="text-sm text-gray-500 mt-1">{weather.description}</div>
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
              <span className="text-sm font-medium">{weather.windSpeed} km/h</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Visibility</span>
              </div>
              <span className="text-sm font-medium">{weather.visibility} km</span>
            </div>
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
              <div className="text-sm font-medium text-primary-900">Travel Tip</div>
              <div className="text-sm text-primary-700">
                {currentSeason === 'winter' 
                  ? 'Perfect weather for exploring Nagpur! Pack light woolens for evenings.'
                  : currentSeason === 'summer'
                  ? 'Stay hydrated and book hotels with good AC. Early morning sightseeing recommended.'
                  : 'Monsoon season - enjoy the greenery! Book hotels with covered parking.'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()} IST
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;