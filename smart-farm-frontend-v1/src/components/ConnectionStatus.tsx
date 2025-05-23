import React from 'react';
import { Wifi, WifiOff, AlertCircle, Loader } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  isConnected: boolean;
  onReconnect: () => void;
  error?: string | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  isConnected, 
  onReconnect,
  error 
}) => {
  // Determine the icon and color based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="text-green-500" size={20} />;
      case 'connecting':
        return <Loader className="text-yellow-500 animate-spin" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'disconnected':
      default:
        return <WifiOff className="text-red-500" size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'disconnected':
      default:
        return 'text-red-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      case 'disconnected':
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            WebSocket: 
            <span className={`ml-1 ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </span>
        </div>
        
        {(status === 'disconnected' || status === 'error') && (
          <button 
            onClick={onReconnect}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reconnect
          </button>
        )}
      </div>
      
      {/* Show error message if there's an error */}
      {error && status === 'error' && (
        <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;