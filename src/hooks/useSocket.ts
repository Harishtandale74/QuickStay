import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import toast from 'react-hot-toast';

// Real-time event types
interface RealTimeEvents {
  newBooking: (data: any) => void;
  bookingConfirmed: (data: any) => void;
  bookingCancelled: (data: any) => void;
  hotelUpdated: (data: any) => void;
  priceChanged: (data: any) => void;
  availabilityChanged: (data: any) => void;
  weatherUpdate: (data: any) => void;
  systemAlert: (data: any) => void;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      
      // Use mock socket in development
      if (import.meta.env.DEV) {
        // Mock socket for development
        const mockSocket = {
          connected: true,
          emit: (event: string, data: any) => {
            console.log('Mock socket emit:', event, data);
          },
          on: (event: string, callback: Function) => {
            console.log('Mock socket listening to:', event);
            // Simulate some events for development
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
        
        socketRef.current = mockSocket as any;
        setConnectionStatus('connected');
        
        // Simulate real-time events in development
        setTimeout(() => {
          toast.success('🔌 Connected to Nagpur Hotels real-time system');
        }, 1000);
        
        return;
      }
      
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000', {
        auth: {
          token,
          userId: user.id,
        },
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      setConnectionStatus('connecting');

      socketRef.current.on('connect', () => {
        console.log('🔌 Connected to Nagpur Hotels server');
        setConnectionStatus('connected');
        toast.success('Connected to real-time updates');
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Disconnected from server');
        setConnectionStatus('disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionStatus('disconnected');
        toast.error('Connection failed. Using offline mode.');
      });

      // Real-time booking notifications
      socketRef.current.on('newBooking', (data) => {
        toast.success(`New booking: ${data.hotel} - ₹${data.amount}`);
      });

      socketRef.current.on('bookingConfirmed', (data) => {
        toast.success(`Booking confirmed: ${data.bookingId}`);
      });

      socketRef.current.on('bookingCancelled', (data) => {
        toast.info(`Booking cancelled: ${data.bookingId}`);
      });

      // Hotel updates
      socketRef.current.on('hotelUpdated', (data) => {
        console.log('Hotel updated:', data);
      });

      socketRef.current.on('newReview', (data) => {
        toast.info(`New review for ${data.hotelId}`);
      });

      // Price and availability updates
      socketRef.current.on('priceChanged', (data) => {
        toast.info(`Price update: ${data.hotelName} - Now ₹${data.newPrice}`);
      });

      socketRef.current.on('availabilityChanged', (data) => {
        console.log('Availability changed:', data);
      });

      // Weather updates for Nagpur
      socketRef.current.on('weatherUpdate', (data) => {
        console.log('Weather update for Nagpur:', data);
      });

      // System alerts
      socketRef.current.on('systemAlert', (data) => {
        toast.info(data.message, { duration: 6000 });
      });

      // Availability updates
      socketRef.current.on('availabilityResult', (data) => {
        console.log('Availability check result:', data);
      });

      // Price alerts
      socketRef.current.on('priceAlert', (data) => {
        toast.success(`Price drop alert: ${data.hotelName} - Now ₹${data.newPrice}`);
      });

      // Support messages
      socketRef.current.on('supportMessage', (data) => {
        if (data.from === 'support') {
          toast.info(`Support: ${data.message}`);
        }
      });

      // Emergency alerts
      socketRef.current.on('emergencyAlert', (data) => {
        toast.error(`Emergency Alert: ${data.message}`, {
          duration: 10000,
        });
      });

      // Real-time stats for admins
      if (user.role === 'admin') {
        socketRef.current.on('realTimeStats', (data) => {
          console.log('Real-time stats:', data);
        });

        socketRef.current.on('newHotelSubmission', (data) => {
          toast.info(`New hotel submission: ${data.hotel.name}`);
        });

        socketRef.current.on('userActivity', (data) => {
          console.log('User activity:', data);
        });
      }

      // Hotel owner notifications
      if (user.role === 'hotelOwner') {
        socketRef.current.on('newBookingReceived', (data) => {
          toast.success(`New booking received: ${data.booking.guest}`);
        });

        socketRef.current.on('hotelReviewReceived', (data) => {
          toast.info(`New review for ${data.hotelName}: ${data.rating}⭐`);
        });
      }

      return () => {
        socketRef.current?.disconnect();
        setConnectionStatus('disconnected');
      };
    }
  }, [isAuthenticated, user]);

  // Helper functions for emitting events
  const emitEvent = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.log('Socket not connected, queuing event:', event, data);
    }
  };

  const joinRoom = (room: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinRoom', room);
    }
  };

  const leaveRoom = (room: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leaveRoom', room);
    }
  };

  // Nagpur-specific socket functions
  const searchHotels = (searchData: any) => {
    emitEvent('searchHotels', searchData);
  };

  const checkAvailability = (data: any) => {
    emitEvent('checkAvailability', data);
  };

  const setPriceAlert = (hotelId: string, maxPrice: number) => {
    emitEvent('setPriceAlert', { hotelId, maxPrice });
  };

  const shareLocation = (location: { latitude: number; longitude: number }) => {
    emitEvent('shareLocation', location);
  };

  const joinHotelRoom = (hotelId: string) => {
    emitEvent('joinHotelRoom', hotelId);
  };

  const joinBookingRoom = (bookingId: string) => {
    emitEvent('joinBookingRoom', bookingId);
  };

  const sendSupportMessage = (message: string) => {
    emitEvent('supportMessage', { message, isSupport: false });
  };

  const trackUserActivity = (activity: string) => {
    emitEvent('userActivity', activity);
  };

  // Real-time data subscriptions
  const subscribeToHotelUpdates = (hotelId: string) => {
    emitEvent('subscribeHotelUpdates', { hotelId });
  };

  const subscribeToAreaUpdates = (area: string) => {
    emitEvent('subscribeAreaUpdates', { area });
  };

  const subscribeToWeatherUpdates = () => {
    emitEvent('subscribeWeatherUpdates', { city: 'Nagpur' });
  };
  return {
    socket: socketRef.current,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    emitEvent,
    joinRoom,
    leaveRoom,
    searchHotels,
    checkAvailability,
    setPriceAlert,
    shareLocation,
    joinHotelRoom,
    joinBookingRoom,
    sendSupportMessage,
    trackUserActivity,
    subscribeToHotelUpdates,
    subscribeToAreaUpdates,
    subscribeToWeatherUpdates,
  };
};

export default useSocket;