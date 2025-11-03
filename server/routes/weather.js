const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory cache for weather data
let weatherCache = {
  data: null,
  timestamp: null,
  ttl: 10 * 60 * 1000 // Cache for 10 minutes
};

// Nagpur coordinates
const NAGPUR_COORDS = {
  lat: 21.1458,
  lon: 79.0882,
  city: 'Nagpur'
};

// Get current weather for Nagpur
router.get('/current', async (req, res) => {
  try {
    // Check cache first
    const now = Date.now();
    if (weatherCache.data && weatherCache.timestamp && (now - weatherCache.timestamp) < weatherCache.ttl) {
      return res.json({
        ...weatherCache.data,
        cached: true,
        cacheAge: Math.floor((now - weatherCache.timestamp) / 1000)
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // If no API key, return mock data with warning
    if (!apiKey || apiKey === 'your-openweather-api-key') {
      return res.json({
        location: {
          city: 'Nagpur',
          state: 'Maharashtra',
          country: 'India',
          lat: NAGPUR_COORDS.lat,
          lon: NAGPUR_COORDS.lon
        },
        current: {
          temperature: 28,
          feelsLike: 31,
          humidity: 65,
          windSpeed: 12,
          windDirection: 'NE',
          visibility: 10,
          pressure: 1013,
          uvIndex: 6,
          condition: 'Clear',
          description: 'Clear sky',
          icon: '01d'
        },
        sun: {
          sunrise: new Date().setHours(6, 30, 0, 0),
          sunset: new Date().setHours(18, 45, 0, 0)
        },
        forecast: generateMockForecast(),
        timestamp: new Date().toISOString(),
        mock: true,
        message: 'Using mock data. Please add OPENWEATHER_API_KEY to enable real weather data.'
      });
    }

    // Fetch real weather data from OpenWeatherMap
    const [currentWeather, forecast] = await Promise.all([
      // Current weather
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: NAGPUR_COORDS.lat,
          lon: NAGPUR_COORDS.lon,
          appid: apiKey,
          units: 'metric'
        }
      }),
      // 5-day forecast
      axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          lat: NAGPUR_COORDS.lat,
          lon: NAGPUR_COORDS.lon,
          appid: apiKey,
          units: 'metric'
        }
      })
    ]);

    const current = currentWeather.data;
    const forecastData = forecast.data;

    // Process forecast to get daily summaries
    const dailyForecast = processDailyForecast(forecastData.list);

    const weatherData = {
      location: {
        city: current.name,
        state: 'Maharashtra',
        country: current.sys.country,
        lat: current.coord.lat,
        lon: current.coord.lon
      },
      current: {
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: getWindDirection(current.wind.deg),
        visibility: Math.round(current.visibility / 1000), // Convert to km
        pressure: current.main.pressure,
        uvIndex: 0, // UV index requires separate API call in free tier
        condition: current.weather[0].main,
        description: current.weather[0].description,
        icon: current.weather[0].icon
      },
      sun: {
        sunrise: current.sys.sunrise * 1000,
        sunset: current.sys.sunset * 1000
      },
      forecast: dailyForecast,
      timestamp: new Date().toISOString(),
      mock: false
    };

    // Update cache
    weatherCache = {
      data: weatherData,
      timestamp: now
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    
    // Return fallback mock data on error
    res.json({
      location: {
        city: 'Nagpur',
        state: 'Maharashtra',
        country: 'India',
        lat: NAGPUR_COORDS.lat,
        lon: NAGPUR_COORDS.lon
      },
      current: {
        temperature: 28,
        feelsLike: 31,
        humidity: 65,
        windSpeed: 12,
        windDirection: 'NE',
        visibility: 10,
        pressure: 1013,
        uvIndex: 6,
        condition: 'Clear',
        description: 'Clear sky',
        icon: '01d'
      },
      sun: {
        sunrise: new Date().setHours(6, 30, 0, 0),
        sunset: new Date().setHours(18, 45, 0, 0)
      },
      forecast: generateMockForecast(),
      timestamp: new Date().toISOString(),
      mock: true,
      error: 'Failed to fetch real weather data. Using fallback.'
    });
  }
});

// Helper function to convert wind degrees to direction
function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Helper function to process forecast data into daily summaries
function processDailyForecast(forecastList) {
  const dailyData = {};
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        day: days[date.getDay()],
        temps: [],
        conditions: [],
        humidity: [],
        windSpeed: [],
        icon: item.weather[0].icon
      };
    }
    
    dailyData[dateKey].temps.push(item.main.temp);
    dailyData[dateKey].conditions.push(item.weather[0].main);
    dailyData[dateKey].humidity.push(item.main.humidity);
    dailyData[dateKey].windSpeed.push(item.wind.speed * 3.6);
  });
  
  // Convert to array and calculate averages
  return Object.values(dailyData).slice(0, 5).map((day, index) => {
    const high = Math.round(Math.max(...day.temps));
    const low = Math.round(Math.min(...day.temps));
    const avgHumidity = Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length);
    const avgWind = Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length);
    const mostCommonCondition = day.conditions.sort((a, b) =>
      day.conditions.filter(v => v === a).length - day.conditions.filter(v => v === b).length
    ).pop();
    
    const today = new Date();
    const forecastDate = new Date(day.date);
    let dayLabel;
    
    if (forecastDate.toDateString() === today.toDateString()) {
      dayLabel = 'Today';
    } else if (forecastDate.toDateString() === new Date(today.getTime() + 86400000).toDateString()) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = day.day;
    }
    
    return {
      day: dayLabel,
      high,
      low,
      condition: mostCommonCondition,
      icon: getWeatherEmoji(mostCommonCondition),
      humidity: avgHumidity,
      windSpeed: avgWind
    };
  });
}

// Helper function to generate mock forecast
function generateMockForecast() {
  return [
    { day: 'Today', high: 32, low: 22, condition: 'Sunny', icon: '☀️', humidity: 65, windSpeed: 12 },
    { day: 'Tomorrow', high: 30, low: 20, condition: 'Partly Cloudy', icon: '⛅', humidity: 70, windSpeed: 10 },
    { day: 'Wed', high: 28, low: 18, condition: 'Cloudy', icon: '☁️', humidity: 75, windSpeed: 8 },
    { day: 'Thu', high: 26, low: 16, condition: 'Light Rain', icon: '🌦️', humidity: 85, windSpeed: 15 },
    { day: 'Fri', high: 29, low: 19, condition: 'Sunny', icon: '☀️', humidity: 60, windSpeed: 10 }
  ];
}

// Helper function to get weather emoji
function getWeatherEmoji(condition) {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return emojiMap[condition] || '⛅';
}

// Clear weather cache (useful for testing)
router.post('/clear-cache', (req, res) => {
  weatherCache = {
    data: null,
    timestamp: null,
    ttl: 10 * 60 * 1000
  };
  res.json({ message: 'Weather cache cleared successfully' });
});

module.exports = router;
