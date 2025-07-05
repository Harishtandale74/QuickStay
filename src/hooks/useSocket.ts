import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token,
          userId: user.id,
        },
      });

      socketRef.current.on('connect', () => {
        console.log('🔌 Connected to Nagpur Hotels server');
        toast.success('Connected to real-time updates');
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Disconnected from server');
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
      };
    }
  }, [isAuthenticated, user]);

  // Helper functions for emitting events
  const emitEvent = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
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

  return {
    socket: socketRef.current,
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
  };
};

export default useSocket;