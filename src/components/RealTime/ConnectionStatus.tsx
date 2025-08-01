import React from 'react';
import { Wifi, WifiOff, AlertCircle, Smartphone, Tablet, Monitor } from 'lucide-react';
import useSocket from '../../hooks/useSocket';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus, isConnected } = useSocket();

  // Detect device type
  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 640) return { icon: <Smartphone className="h-3 w-3" />, type: 'Mobile' };
    if (width < 1024) return { icon: <Tablet className="h-3 w-3" />, type: 'Tablet' };
    return { icon: <Monitor className="h-3 w-3" />, type: 'Desktop' };
  };

  const device = getDeviceType();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3 md:h-4 md:w-4" />,
          text: 'Live',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />,
          text: 'Connecting',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500'
        };
      default:
        return {
          icon: <WifiOff className="h-3 w-3 md:h-4 md:w-4" />,
          text: 'Offline',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${config.dotColor} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}></div>
      {config.icon}
      <span className="hidden sm:inline">{config.text}</span>
      <div className="hidden md:flex items-center space-x-1 ml-1">
        {device.icon}
        <span className="text-xs">{device.type}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;