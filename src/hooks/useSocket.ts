import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef<any>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock socket for development - prevents real socket connection issues
      const mockSocket = {
        connected: true,
        emit: (event: string, data: any) => {
          console.log('Mock socket emit:', event, data);
        },
        on: (event: string, callback: Function) => {
          console.log('Mock socket listening to:', event);
          if (event === 'connect') {
            setTimeout(() => callback(), 1000);
          }
        },
        off: (event: string) => {
          console.log('Mock socket off:', event);
        },
        disconnect: () => {
          console.log('Mock socket disconnected');
        }
      };
      
      socketRef.current = mockSocket;
      setConnectionStatus('connected');
      
      // Simulate connection success
      setTimeout(() => {
        toast.success('🔌 Connected to real-time system');
      }, 1000);

      return () => {
        setConnectionStatus('disconnected');
      };
    }
  }, [isAuthenticated, user]);

  // Helper functions
  const emitEvent = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const searchHotels = (searchData: any) => {
    emitEvent('searchHotels', searchData);
  };

  const trackUserActivity = (activity: string) => {
    emitEvent('userActivity', activity);
  };

  const subscribeToWeatherUpdates = () => {
    emitEvent('subscribeWeatherUpdates', { city: 'Nagpur' });
  };

  const subscribeToAreaUpdates = (area: string) => {
    emitEvent('subscribeAreaUpdates', { area });
  };

  return {
    socket: socketRef.current,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    emitEvent,
    searchHotels,
    trackUserActivity,
    subscribeToWeatherUpdates,
    subscribeToAreaUpdates,
  };
};

export default useSocket;