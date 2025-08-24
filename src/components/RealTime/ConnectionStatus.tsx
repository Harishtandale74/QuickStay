import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import useSocket from '../../hooks/useSocket';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus, isConnected } = useSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Connected',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Connecting...',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500'
        };
      default:
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Offline',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}></div>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default ConnectionStatus;