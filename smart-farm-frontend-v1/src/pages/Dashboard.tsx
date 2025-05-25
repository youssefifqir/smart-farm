import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Flame, CloudRain, Bell, Brush } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataCard from '../components/dashboard/DataCard';
import WeatherForecast from '../components/dashboard/WeatherForecast';
import WaterConsumption from '../components/dashboard/WaterConsumption';
import SensorStatus from '../components/dashboard/SensorStatus';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ConnectionStatus from '../components/ConnectionStatus';
import useWebSocket from '../hooks/useWebSocket'; 

type Alert = {
  id: string;
  type: 'danger' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  time: string;
  location: string;
  icon: React.ReactNode;
  status: string;
  priority: string;
  timestamp: Date;
};

const Dashboard = () => {
  // Use HTTP URL instead of WS URL for SockJS
  const { isConnected, sensorData, connectionStatus, error, reconnect } = useWebSocket('http://localhost:8036/ws');
  const [previousData, setPreviousData] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'fire-risk-001',
      type: 'danger',
      category: 'fire',
      title: 'Fire risk detected',
      description: 'High temperature detected in Sector B. Risk level: Moderate.',
      time: '14:30',
      location: 'Sector B',
      icon: <Flame className="text-red-500" />,
      status: 'active',
      priority: 'high',
      timestamp: new Date()
    },
    {
      id: 'rain-002',
      type: 'info',
      category: 'weather',
      title: 'Rain detected',
      description: 'Rain detected in Sector A. Irrigation system paused.',
      time: '12:15',
      location: 'Sector A',
      icon: <CloudRain className="text-blue-500" />,
      status: 'acknowledged',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'disease-003',
      type: 'warning',
      category: 'disease',
      title: 'Disease risk',
      description: 'Potential fungal disease risk on tomato plants due to high humidity.',
      time: '09:45',
      location: 'Main greenhouse',
      icon: <Brush className="text-amber-500" />,
      status: 'active',
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 'temp-004',
      type: 'warning',
      category: 'weather',
      title: 'Temperature alert',
      description: 'Abnormally high temperature detected by the sensor in Sector C.',
      time: '08:20',
      location: 'Sector C',
      icon: <Thermometer className="text-orange-500" />,
      status: 'resolved',
      priority: 'low',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ]);

  const activeAlertsCount = alerts.filter(alert => alert.type === 'danger' || alert.type === 'warning').length;

  // Update previous data for trend calculation
  useEffect(() => {
    if (sensorData && JSON.stringify(sensorData) !== JSON.stringify(previousData)) {
      setPreviousData(sensorData);
    }
  }, [sensorData, previousData]);

  const handleViewAllNotifications = () => {
    setIsNotificationOpen(false);
    navigate('/notifications');
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-amber-500 bg-amber-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Helper functions for trends
  const getTemperatureChange = () => {
    if (!sensorData || !previousData) return null;
    const diff = sensorData.temperature - previousData.temperature;
    if (Math.abs(diff) < 0.1) return null;
    return diff > 0 ? `+${diff.toFixed(1)}°` : `${diff.toFixed(1)}°`;
  };

  const getHumidityChange = () => {
    if (!sensorData || !previousData) return null;
    const diff = sensorData.humidity - previousData.humidity;
    if (Math.abs(diff) < 1) return null;
    return diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
  };

  const getTemperatureTrend = () => {
    if (!sensorData || !previousData) return 'neutral';
    const diff = sensorData.temperature - previousData.temperature;
    return diff > 0.1 ? 'up' : diff < -0.1 ? 'down' : 'neutral';
  };

  const getHumidityTrend = () => {
    if (!sensorData || !previousData) return 'neutral';
    const diff = sensorData.humidity - previousData.humidity;
    return diff > 1 ? 'up' : diff < -1 ? 'down' : 'neutral';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Smart Farm monitoring system.</p>
      </div>
      
      {/* Integrated notification button */}
      <div className="relative">
        <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
        <Bell size={24} />
        {activeAlertsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {activeAlertsCount > 9 ? '9+' : activeAlertsCount}
          </span>
        )}
        </button>

        {isNotificationOpen && (
        <div className="relative">
          {/* Overlay to close when clicking outside */}
          <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsNotificationOpen(false)}
          />
          
          {/* Notifications dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <span className="text-sm text-gray-500">
              {alerts.length} new alert{alerts.length !== 1 ? 's' : ''}
            </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 border-l-4 ${getAlertBgColor(alert.type)} hover:bg-gray-50 cursor-pointer transition-colors`}
                onClick={handleViewAllNotifications}
              >
                <div className="flex items-start space-x-3">
                <div className="mt-0.5">{alert.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                  {alert.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {alert.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                  {alert.time}
                  </p>
                </div>
                </div>
              </div>
              ))}
            </div>
            ) : (
            <div className="p-6 text-center">
              <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
            onClick={handleViewAllNotifications}
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
            View all notifications
            </button>
          </div>
          </div>
        </div>
        )}
      </div>
      </div>
      
      <ConnectionStatus 
      status={connectionStatus} 
      isConnected={isConnected} 
      onReconnect={reconnect}
      error={error}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard 
        title="Temperature" 
        value={sensorData ? `${sensorData.temperature.toFixed(1)}°C` : "24°C"} 
        change={getTemperatureChange() || "+2°"} 
        subtext="from last reading" 
        trend={getTemperatureTrend()}
        icon={<Thermometer size={20} />}
        type="temperature"
      />
      <DataCard 
        title="Humidity" 
        value={sensorData ? `${sensorData.humidity.toFixed(0)}%` : "65%"} 
        change={getHumidityChange() || "-5%"} 
        subtext="from last reading" 
        trend={getHumidityTrend()}
        icon={<Droplets size={20} />}
        type="humidity"
      />
      <DataCard 
        title="Fire Detection" 
        value={sensorData ? (sensorData.isFire ? "🔥 FIRE ALERT" : "✅ Safe") : "Safe"} 
        subtext={sensorData ? (sensorData.isFire ? "Immediate attention required!" : "No fire detected") : "Monitoring..."} 
        icon={<Flame size={20} />}
        type="fire"
      />
      <DataCard 
        title="Rain Status" 
        value={sensorData ? (sensorData.isRaining ? "🌧 Raining" : "☀ Clear") : "Dry"} 
        subtext={sensorData ? (sensorData.isRaining ? "Wet conditions detected" : "Clear weather") : "Monitoring..."} 
        icon={<CloudRain size={20} />}
        type="rain"
      />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeatherForecast />
      <WaterConsumption />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SensorStatus />
      <AlertsPanel />
      </div>
    </div>
  
  );
};

export default Dashboard;