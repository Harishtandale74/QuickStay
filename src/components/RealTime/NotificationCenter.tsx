import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, User, Hotel } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = useSocket();

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Received',
      message: 'John Doe booked Grand Luxury Resort for 3 nights',
      timestamp: '2024-02-15T10:30:00Z',
      read: false,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Confirmed',
      message: 'Payment of $897 received for booking #12345',
      timestamp: '2024-02-15T09:15:00Z',
      read: false,
    },
    {
      id: '3',
      type: 'review',
      title: 'New Review',
      message: 'Sarah Johnson left a 5-star review for your hotel',
      timestamp: '2024-02-14T18:45:00Z',
      read: true,
    },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);

    // Socket.IO event listeners
    if (socket) {
      socket.on('newBooking', (data) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'booking',
          title: 'New Booking Received',
          message: `${data.guestName} booked ${data.hotelName}`,
          timestamp: new Date().toISOString(),
          read: false,
          data,
        };
        setNotifications(prev => [notification, ...prev]);
        toast.success('New booking received!');
      });

      socket.on('paymentConfirmed', (data) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'payment',
          title: 'Payment Confirmed',
          message: `Payment of $${data.amount} received`,
          timestamp: new Date().toISOString(),
          read: false,
          data,
        };
        setNotifications(prev => [notification, ...prev]);
        toast.success('Payment confirmed!');
      });

      socket.on('newReview', (data) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'review',
          title: 'New Review',
          message: `${data.userName} left a ${data.rating}-star review`,
          timestamp: new Date().toISOString(),
          read: false,
          data,
        };
        setNotifications(prev => [notification, ...prev]);
        toast.success('New review received!');
      });

      return () => {
        socket.off('newBooking');
        socket.off('paymentConfirmed');
        socket.off('newReview');
      };
    }
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Hotel className="h-5 w-5 text-blue-600" />;
      case 'payment':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'review':
        return <User className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;