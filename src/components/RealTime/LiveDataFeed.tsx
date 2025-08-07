import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, MapPin, Clock, Zap } from 'lucide-react';
import useSocket from '../../hooks/useSocket';
import { nagpurAPI } from '../../utils/api';

interface LiveData {
  timestamp: string;
  activeBookings: number;
  onlineUsers: number;
  popularArea: string;
  averagePrice: number;
  occupancyRate: number;
  weatherTemp: number;
}

const LiveDataFeed: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData>({
    timestamp: new Date().toISOString(),
    activeBookings: 0,
    onlineUsers: 0,
    popularArea: 'Sitabuldi',
    averagePrice: 0,
    occupancyRate: 0,
    weatherTemp: 28,
  });
  
  const [recentActivities, setRecentActivities] = useState<Array<{
    id: string;
    type: 'booking' | 'search' | 'review' | 'weather';
    message: string;
    timestamp: string;
    area?: string;
  }>>([]);

  const { isConnected, subscribeToAreaUpdates, subscribeToWeatherUpdates } = useSocket();

  useEffect(() => {
    // Subscribe to real-time updates
    if (isConnected) {
      subscribeToAreaUpdates('all');
      subscribeToWeatherUpdates();
    }

    // Simulate live data updates
    const interval = setInterval(async () => {
      try {
        // Fetch weather data
        const weatherData = await nagpurAPI.getNagpurWeather();
        
        // Update live data with realistic values
        setLiveData(prev => ({
          ...prev,
          timestamp: new Date().toISOString(),
          activeBookings: Math.floor(Math.random() * 50) + 20,
          onlineUsers: Math.floor(Math.random() * 200) + 100,
          popularArea: ['Sitabuldi', 'Civil Lines', 'Dharampeth', 'Wardha Road'][Math.floor(Math.random() * 4)],
          averagePrice: Math.floor(Math.random() * 2000) + 2500,
          occupancyRate: Math.floor(Math.random() * 30) + 60,
          weatherTemp: weatherData.data.temperature,
        }));

        // Add random activity
        const activities = [
          { type: 'booking' as const, message: 'New booking at The Pride Hotel', area: 'Sitabuldi' },
          { type: 'search' as const, message: 'User searching hotels in Civil Lines', area: 'Civil Lines' },
          { type: 'review' as const, message: '5-star review added for Radisson Blu', area: 'Wardha Road' },
          { type: 'weather' as const, message: `Weather updated: ${weatherData.data.temperature}°C`, area: 'Nagpur' },
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        setRecentActivities(prev => [
          {
            id: Date.now().toString(),
            ...randomActivity,
            timestamp: new Date().toISOString(),
          },
          ...prev.slice(0, 9) // Keep only last 10 activities
        ]);

      } catch (error) {
        console.error('Error updating live data:', error);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isConnected, subscribeToAreaUpdates, subscribeToWeatherUpdates]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Zap className="h-4 w-4 text-green-500" />;
      case 'search': return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'review': return <Users className="h-4 w-4 text-purple-500" />;
      case 'weather': return <Activity className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Live Data Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Active Bookings</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{liveData.activeBookings}</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Online Users</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{liveData.onlineUsers}</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Occupancy</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{liveData.occupancyRate}%</div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Popular Area</span>
          </div>
          <div className="text-lg font-bold text-orange-900">{liveData.popularArea}</div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Avg Price</span>
          </div>
          <div className="text-lg font-bold text-indigo-900">₹{liveData.averagePrice.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Weather</span>
          </div>
          <div className="text-lg font-bold text-yellow-900">{liveData.weatherTemp}°C</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Recent Activities</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentActivities.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for live activities...</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  {activity.area && (
                    <p className="text-xs text-gray-600">{activity.area}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {formatTime(liveData.timestamp)}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Auto-refresh every 3s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataFeed;