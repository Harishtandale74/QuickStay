# Real-Time Weather API Integration - Setup Guide

## Overview

The Nagpur Hotel Booking System now includes **real-time weather data integration** using OpenWeatherMap API. This provides live weather information for Nagpur to help users plan their trips better.

## Features Implemented

### ✅ Backend Weather API
- **Endpoint**: `GET /api/weather/current`
- **Public Access**: No authentication required
- **Caching**: 10-minute cache to optimize API calls
- **Fallback**: Automatically returns mock data if API is unavailable
- **Real-time Updates**: Socket.io broadcasts weather updates every 10 minutes

### ✅ Frontend Weather Widget
- **Location**: Home page and Explore page
- **Auto-refresh**: Updates every 10 minutes
- **Data Displayed**:
  - Current temperature and feels-like temperature
  - Humidity, wind speed, visibility, pressure
  - UV Index with safety recommendations
  - Sunrise and sunset times
  - 5-day weather forecast
  - Travel advice based on weather conditions
  - Season-specific information for Nagpur

### ✅ Hotel Data Access
- All hotel endpoints are **publicly accessible**
- No authentication required for fetching hotel data
- Users can browse hotels, view details, and check availability without login
- Authentication only required for bookings and reviews

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Free tier includes:
   - 1,000 API calls per day
   - 60 calls per minute
   - Current weather data
   - 5-day forecast

### 2. Configure Backend Environment

Add the API key to `/app/server/.env`:

```env
# OpenWeatherMap API (for real-time weather data)
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Restart Backend Server

```bash
sudo supervisorctl restart backend
```

### 4. Verify Integration

Test the weather API:

```bash
curl http://localhost:5000/api/weather/current
```

Expected response structure:
```json
{
  "location": {
    "city": "Nagpur",
    "state": "Maharashtra",
    "country": "India",
    "lat": 21.1458,
    "lon": 79.0882
  },
  "current": {
    "temperature": 28,
    "feelsLike": 31,
    "humidity": 65,
    "windSpeed": 12,
    "windDirection": "NE",
    "visibility": 10,
    "pressure": 1013,
    "uvIndex": 6,
    "condition": "Clear",
    "description": "Clear sky",
    "icon": "01d"
  },
  "sun": {
    "sunrise": 1234567890000,
    "sunset": 1234567890000
  },
  "forecast": [...],
  "timestamp": "2024-11-03T10:30:00.000Z",
  "mock": false
}
```

## How It Works

### Backend Architecture

```
┌─────────────────┐
│   Frontend      │
│  Weather Widget │
└────────┬────────┘
         │ GET /api/weather/current
         ▼
┌─────────────────┐
│  Express Server │
│  Weather Route  │
└────────┬────────┘
         │
         ├─── Check Cache (10 min TTL)
         │
         ├─── If cache valid: Return cached data
         │
         └─── If cache expired:
              │
              ▼
      ┌──────────────────┐
      │ OpenWeatherMap   │
      │   API Call       │
      └──────┬───────────┘
             │
             ├─── Success: Update cache & return
             │
             └─── Error: Return mock data
```

### Caching Strategy

- **Cache Duration**: 10 minutes
- **Benefits**:
  - Reduces API calls (saves quota)
  - Faster response times
  - Cost-effective
- **Cache Clear**: Automatic on data expiry or manual via `/api/weather/clear-cache`

### Real-Time Updates

Socket.io broadcasts weather updates:
```javascript
// Server emits every 10 minutes
socket.emit('weatherUpdate', weatherData);

// Client listens
socket.on('weatherUpdate', (data) => {
  updateWeatherWidget(data);
});
```

## API Endpoints

### Get Current Weather
```
GET /api/weather/current
```

**Public** - No authentication required

**Response**: Complete weather data including current conditions and forecast

**Cache**: Yes (10 minutes)

### Clear Weather Cache
```
POST /api/weather/clear-cache
```

**Public** - Useful for testing

**Response**: `{ message: 'Weather cache cleared successfully' }`

## Hotel Data Access

All hotel endpoints are publicly accessible:

### Get All Hotels
```
GET /api/hotels
Query params: area, minPrice, maxPrice, amenities, roomType, rating, sortBy, page, limit
```

### Get Featured Hotels
```
GET /api/hotels/featured
```

### Get Hotel Details
```
GET /api/hotels/:id
```

### Get Hotels by Area
```
GET /api/hotels/area/:area
```

**Note**: Creating hotels, adding reviews, and booking require authentication.

## Frontend Integration

The `WeatherWidget` component automatically:
1. Fetches weather data on mount
2. Auto-refreshes every 10 minutes
3. Displays mock data indicator if API key not configured
4. Shows appropriate error messages
5. Provides travel advice based on conditions

```typescript
// Weather widget usage
import WeatherWidget from './components/Nagpur/WeatherWidget';

<WeatherWidget />
```

## Troubleshooting

### Issue: Getting Mock Data

**Symptoms**: Weather widget shows "Using mock data" message

**Solutions**:
1. Check if `OPENWEATHER_API_KEY` is set in `/app/server/.env`
2. Verify API key is valid (test at openweathermap.org)
3. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
4. Restart backend: `sudo supervisorctl restart backend`

### Issue: Weather Not Updating

**Solutions**:
1. Check if backend is running: `sudo supervisorctl status backend`
2. Clear weather cache: `curl -X POST http://localhost:5000/api/weather/clear-cache`
3. Check frontend console for errors
4. Verify socket connection is working

### Issue: API Rate Limit Exceeded

**Symptoms**: Weather API returns 429 error

**Solutions**:
1. Free tier allows 1,000 calls/day
2. With 10-minute caching, max ~144 calls/day per server
3. Upgrade to paid plan if needed
4. Increase cache duration in `/app/server/routes/weather.js`

## Best Practices

### Production Deployment

1. **Environment Variables**: Never commit API keys to git
2. **HTTPS**: Use HTTPS in production for API calls
3. **Error Handling**: App gracefully falls back to mock data
4. **Monitoring**: Set up alerts for API failures
5. **Caching**: Consider Redis for distributed cache

### Optimization

1. **Cache Duration**: Adjust based on user traffic
2. **Socket Broadcast**: Limit frequency for high traffic
3. **API Calls**: Monitor usage in OpenWeather dashboard
4. **Compression**: Enable gzip for API responses

## Testing

### Manual Testing

```bash
# Test weather API
curl http://localhost:5000/api/weather/current

# Test hotel access (no auth required)
curl http://localhost:5000/api/hotels

# Test featured hotels
curl http://localhost:5000/api/hotels/featured

# Clear weather cache
curl -X POST http://localhost:5000/api/weather/clear-cache
```

### Frontend Testing

1. Open browser to http://localhost:3000
2. Navigate to Home page
3. Scroll to Weather Widget
4. Verify data is loading
5. Check for mock data indicator
6. Test auto-refresh (wait 10 minutes or modify code)

## Cost Estimation

### OpenWeatherMap Free Tier

- **Limit**: 1,000 calls/day
- **Current Usage** (with 10-min cache):
  - Per user session: 6 calls/hour
  - Per server: ~144 calls/day
  - Supports: ~400 concurrent users/day
- **Cost**: $0

### If Scaling Needed

- **Startup Plan**: $40/month - 100,000 calls/day
- **Developer Plan**: $120/month - 1M calls/day

## Support

For issues or questions:
- Check backend logs: `/var/log/supervisor/backend.err.log`
- Check frontend logs: `/var/log/supervisor/frontend.err.log`
- MongoDB logs: `/var/log/mongodb.err.log`

## Next Steps

1. ✅ Set up OpenWeatherMap API key
2. ✅ Restart backend server
3. ✅ Verify weather data is loading
4. Test hotel booking flow
5. Consider adding more weather-based features:
   - Price optimization based on weather
   - Weather alerts for guests
   - Seasonal pricing suggestions

---

**Last Updated**: November 3, 2024
**Integration Status**: ✅ Complete
**Weather API**: OpenWeatherMap
**Hotel Access**: Public (no authentication required)
