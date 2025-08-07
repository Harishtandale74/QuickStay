import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, MapPin, Clock, Zap, Loader } from 'lucide-react';
import useSocket from '../../hooks/useSocket';

interface LiveData {
  timestamp: string;
  activeBookings: number;
  onlineUsers: number;
  popularArea: string;
  averagePrice: number;
  occupancyRate: number;
  weatherTemp: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'search' | 'review' | 'weather';
  message: string;
  timestamp: string;
  area?: string;
}

const LiveDataFeed: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData>({
    timestamp: new Date().toISOString(),
    activeBookings: 23,
    onlineUsers: 156,
    popularArea: 'Sitabuldi',
    averagePrice: 3200,
    occupancyRate: 78,
    weatherTemp: 28,
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'booking',
      message: 'New booking at The Pride Hotel',
      timestamp: new Date().toISOString(),
      area: 'Sitabuldi'
    },
    {
      id: '2',
      type: 'search',
      message: 'User searching hotels in Civil Lines',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      area: 'Civil Lines'
    }
  ]);

  const { isConnected } = useSocket();

  useEffect(() => {
    // Simulate live data updates with proper cleanup
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        timestamp: new Date().toISOString(),
        activeBookings: Math.floor(Math.random() * 30) + 20,
        onlineUsers: Math.floor(Math.random() * 100) + 100,
        popularArea: ['Sitabuldi', 'Civil Lines', 'Dharampeth', 'Wardha Road'][Math.floor(Math.random() * 4)],
        averagePrice: Math.floor(Math.random() * 1000) + 2500,
        occupancyRate: Math.floor(Math.random() * 20) + 70,
        weatherTemp: Math.floor(Math.random() * 10) + 25,
      }));

      // Add new activity
      const activities = [
        { type: 'booking' as const, message: 'New booking received', area: 'Sitabuldi' },
        { type: 'search' as const, message: 'Hotel search performed', area: 'Civil Lines' },
        { type: 'review' as const, message: '5-star review added', area: 'Dharampeth' },
        { type: 'weather' as const, message: 'Weather updated', area: 'Nagpur' },
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      setRecentActivities(prev => [
        {
          id: Date.now().toString(),
          ...randomActivity,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 9)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'booking': return <Zap className={`${iconClass} text-green-500`} />;
      case 'search': return <MapPin className={`${iconClass} text-blue-500`} />;
      case 'review': return <Users className={`${iconClass} text-purple-500`} />;
      case 'weather': return <Activity className={`${iconClass} text-orange-500`} />;
      default: return <Activity className={`${iconClass} text-gray-500`} />;
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
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Live Data Feed</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-xs md:text-sm text-gray-600">{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {/* Live Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-1 md:mb-2">
            <Activity className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
            <span className="text-xs md:text-sm font-medium text-blue-900">Active</span>
          </div>
          <div className="text-lg md:text-2xl font-bold text-blue-900">{liveData.activeBookings}</div>
          <div className="text-xs text-blue-700">Bookings</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 md:p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-1 md:mb-2">
            <Users className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
            <span className="text-xs md:text-sm font-medium text-green-900">Online</span>
          </div>
          <div className="text-lg md:text-2xl font-bold text-green-900">{liveData.onlineUsers}</div>
          <div className="text-xs text-green-700">Users</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 md:p-4 rounded-lg col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-2 mb-1 md:mb-2">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
            <span className="text-xs md:text-sm font-medium text-purple-900">Occupancy</span>
          </div>
          <div className="text-lg md:text-2xl font-bold text-purple-900">{liveData.occupancyRate}%</div>
          <div className="text-xs text-purple-700">Current</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h4 className="text-sm md:text-base font-medium text-gray-900 mb-3 md:mb-4">Recent Activities</h4>
        <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-64 overflow-y-auto">
          {recentActivities.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <Loader className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm md:text-base">Loading activities...</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-900 truncate">{activity.message}</p>
                  {activity.area && (
                    <p className="text-xs text-gray-600">{activity.area}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Updated: {formatTime(liveData.timestamp)}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Auto-refresh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataFeed;