import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Flame, CloudRain } from 'lucide-react';
import DataCard from '../components/dashboard/DataCard';
import WeatherForecast from '../components/dashboard/WeatherForecast';
import WaterConsumption from '../components/dashboard/WaterConsumption';
import SensorStatus from '../components/dashboard/SensorStatus';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ConnectionStatus from '../components/ConnectionStatus';
import useWebSocket from '../hooks/useWebSocket'; 

const Dashboard = () => {
  // Use HTTP URL instead of WS URL for SockJS
  const { isConnected, sensorData, connectionStatus, error, reconnect } = useWebSocket('http://localhost:8036/ws');
  const [previousData, setPreviousData] = useState(null);

  // Update previous data for trend calculation
  useEffect(() => {
    if (sensorData && JSON.stringify(sensorData) !== JSON.stringify(previousData)) {
      setPreviousData(sensorData);
    }
  }, [sensorData, previousData]);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Smart Farm monitoring system.</p>
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
          className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-lg transition-all duration-300"
          iconClassName="text-orange-600 bg-orange-100"
          titleClassName="text-orange-800"
          valueClassName="text-orange-900"
          subtextClassName="text-orange-600"
        />
        <DataCard 
          title="Humidity" 
          value={sensorData ? `${sensorData.humidity.toFixed(0)}%` : "65%"} 
          change={getHumidityChange() || "-5%"} 
          subtext="from last reading" 
          trend={getHumidityTrend()}
          icon={<Droplets size={20} />}
          type="humidity"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-all duration-300"
          iconClassName="text-blue-600 bg-blue-100"
          titleClassName="text-blue-800"
          valueClassName="text-blue-900"
          subtextClassName="text-blue-600"
        />
        <DataCard 
          title="Fire Detection" 
          value={sensorData ? (sensorData.isFire ? "🔥 FIRE ALERT" : "✅ Safe") : "Safe"} 
          subtext={sensorData ? (sensorData.isFire ? "Immediate attention required!" : "No fire detected") : "Monitoring..."} 
          icon={<Flame size={20} />}
          type="fire"
          className={sensorData?.isFire 
            ? "bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 hover:shadow-lg transition-all duration-300 animate-pulse" 
            : "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg transition-all duration-300"
          }
          iconClassName={sensorData?.isFire ? "text-red-700 bg-red-200" : "text-green-600 bg-green-100"}
          titleClassName={sensorData?.isFire ? "text-red-900" : "text-green-800"}
          valueClassName={sensorData?.isFire ? "text-red-900 font-extrabold" : "text-green-900"}
          subtextClassName={sensorData?.isFire ? "text-red-700 font-semibold" : "text-green-600"}
        />
        <DataCard 
          title="Rain Status" 
          value={sensorData ? (sensorData.isRaining ? "🌧️ Raining" : "☀️ Clear") : "Dry"} 
          subtext={sensorData ? (sensorData.isRaining ? "Wet conditions detected" : "Clear weather") : "Monitoring..."} 
          icon={<CloudRain size={20} />}
          type="rain"
          className={sensorData?.isRaining 
            ? "bg-gradient-to-br from-sky-100 to-blue-100 border-2 border-sky-300 hover:shadow-lg transition-all duration-300" 
            : "bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:shadow-lg transition-all duration-300"
          }
          iconClassName={sensorData?.isRaining ? "text-sky-700 bg-sky-200" : "text-yellow-600 bg-yellow-100"}
          titleClassName={sensorData?.isRaining ? "text-sky-800" : "text-yellow-800"}
          valueClassName={sensorData?.isRaining ? "text-sky-900" : "text-yellow-900"}
          subtextClassName={sensorData?.isRaining ? "text-sky-600" : "text-yellow-600"}
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