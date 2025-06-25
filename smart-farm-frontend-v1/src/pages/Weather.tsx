import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudDrizzle, Sun, Wind, Thermometer, Droplets, AlertTriangle, CloudSnow, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import DataCard from '../components/dashboard/DataCard';
import useWebSocket, { WeatherData } from '../hooks/useWebSocket';
import { WS_BASE_URL } from '../services/api';

const Weather = () => {
  const [activeTab, setActiveTab] = useState('current conditions');
  const { weatherData, connectionStatus, error } = useWebSocket(WS_BASE_URL);

  // Enhanced weather icon function with more detailed conditions
  const getWeatherIcon = (precipitation: number, temp: number, size: number = 32) => {
    const iconProps = { size, className: "transition-colors duration-200" };
    
    // Heavy rain conditions
    if (precipitation > 10) {
      return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    }
    
    // Moderate rain
    if (precipitation > 5) {
      return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    }
    
    // Light rain/drizzle
    if (precipitation > 1) {
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-blue-400`} />;
    }
    
    // Very light precipitation
    if (precipitation > 0.1) {
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
    
    // Snow conditions (if temperature is low)
    if (temp < 2 && precipitation > 0) {
      return <CloudSnow {...iconProps} className={`${iconProps.className} text-blue-300`} />;
    }
    
    // Clear sunny conditions
    if (temp > 28) {
      return <Sun {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    }
    
    // Warm sunny conditions
    if (temp > 22) {
      return <Sun {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
    }
    
    // Mild conditions
    if (temp > 15) {
      return <Sun {...iconProps} className={`${iconProps.className} text-orange-400`} />;
    }
    
    // Cool/cloudy conditions
    if (temp > 10) {
      return <Cloud {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
    
    // Cold conditions
    return <Cloud {...iconProps} className={`${iconProps.className} text-gray-500`} />;
  };

  // Enhanced weather condition text with more descriptive labels
  const getWeatherCondition = (precipitation: number, temp: number) => {
    if (precipitation > 10) return 'Heavy Rain';
    if (precipitation > 5) return 'Moderate Rain';
    if (precipitation > 1) return 'Light Rain';
    if (precipitation > 0.1) return 'Drizzle';
    if (temp < 2 && precipitation > 0) return 'Snow';
    if (temp > 35) return 'Very Hot';
    if (temp > 28) return 'Hot & Sunny';
    if (temp > 22) return 'Sunny';
    if (temp > 15) return 'Mild';
    if (temp > 10) return 'Cool';
    if (temp > 5) return 'Cold';
    return 'Very Cold';
  };

  // Helper function to get background color based on weather
  const getWeatherBgColor = (precipitation: number, temp: number) => {
    if (precipitation > 5) return 'bg-blue-50';
    if (precipitation > 0) return 'bg-blue-25';
    if (temp > 28) return 'bg-yellow-50';
    if (temp > 22) return 'bg-orange-50';
    if (temp < 10) return 'bg-gray-50';
    return 'bg-white';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Process weather data for charts
  const processedWeatherData = weatherData ? {
    daily: weatherData.daily.time.map((time, index) => ({
      day: formatDate(time),
      date: time,
      tempMax: weatherData.daily.temperature2mMax[index],
      tempMin: weatherData.daily.temperature2mMin[index],
      precipitation: weatherData.daily.precipitationSum[index]
    }))
  } : null;

  const renderCurrentConditions = () => {
    if (!weatherData || !processedWeatherData) {
      return (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading weather data...</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      );
    }

    const todayData = processedWeatherData.daily[0];
    const currentTemp = Math.round((todayData.tempMax + todayData.tempMin) / 2);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{currentTemp}°C</h2>
              <p className="text-gray-500">{getWeatherCondition(todayData.precipitation, currentTemp)}</p>
              <p className="text-sm text-gray-400">
                H: {Math.round(todayData.tempMax)}° L: {Math.round(todayData.tempMin)}°
              </p>
            </div>
            {getWeatherIcon(todayData.precipitation, currentTemp, 48)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DataCard
              title="Max Temperature"
              value={`${Math.round(todayData.tempMax)}°C`}
              subtext="Today"
              icon={<Thermometer size={20} />}
            />
            <DataCard
              title="Min Temperature"
              value={`${Math.round(todayData.tempMin)}°C`}
              subtext="Today"
              icon={<Thermometer size={20} />}
            />
            <DataCard
              title="Precipitation"
              value={`${todayData.precipitation} mm`}
              subtext="Expected today"
              icon={<CloudRain size={20} />}
            />
            <DataCard
              title="Location"
              value={`${weatherData.latitude.toFixed(2)}°, ${weatherData.longitude.toFixed(2)}°`}
              subtext={weatherData.timezone}
              icon={<Wind size={20} />}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">7-Day Temperature Range</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedWeatherData.daily.slice(0, 7)}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${Math.round(value as number)}°C`, 
                    name === 'tempMax' ? 'Max Temp' : 'Min Temp'
                  ]}
                />
                <Area type="monotone" dataKey="tempMax" stroke="#22c55e" fill="#dcfce7" />
                <Area type="monotone" dataKey="tempMin" stroke="#3b82f6" fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderForecast = () => {
    if (!weatherData || !processedWeatherData) {
      return (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading forecast data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">7-Day Forecast</h2>
          <div className="space-y-3">
            {processedWeatherData.daily.slice(0, 7).map((day, index) => {
              const avgTemp = Math.round((day.tempMax + day.tempMin) / 2);
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                    getWeatherBgColor(day.precipitation, avgTemp)
                  } hover:border-gray-200`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700 w-20">{day.day}</span>
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(day.precipitation, avgTemp, 28)}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                          {getWeatherCondition(day.precipitation, avgTemp)}
                        </span>
                        {day.precipitation > 0 && (
                          <span className="text-xs text-blue-600 flex items-center">
                            <Droplets size={12} className="mr-1" />
                            {day.precipitation.toFixed(1)}mm
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        {Math.round(day.tempMax)}°
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(day.tempMin)}°
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Precipitation Forecast</h2>
          <p className="text-sm text-gray-500 mb-4">Expected rainfall over the next 7 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedWeatherData.daily.slice(0, 7)}>
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${value}mm`} />
                <Tooltip formatter={(value) => [`${value}mm`, 'Precipitation']} />
                <Line type="monotone" dataKey="precipitation" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderPredictions = () => {
    if (!weatherData || !processedWeatherData) {
      return (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading prediction data...</p>
          </div>
        </div>
      );
    }

    // Generate alerts based on weather data
    const alerts = [];
    const totalPrecipitation = processedWeatherData.daily.slice(0, 3).reduce((sum, day) => sum + day.precipitation, 0);
    const maxTemp = Math.max(...processedWeatherData.daily.slice(0, 3).map(day => day.tempMax));
    const minTemp = Math.min(...processedWeatherData.daily.slice(0, 3).map(day => day.tempMin));

    if (totalPrecipitation > 20) {
      alerts.push({
        type: 'heavy-rain',
        title: 'Heavy Rain Warning',
        message: `Expected ${totalPrecipitation.toFixed(1)}mm of rainfall in the next 3 days. Consider adjusting irrigation schedules.`,
        icon: <CloudRain className="text-blue-500" size={20} />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        textColor: 'text-blue-800'
      });
    }

    if (maxTemp > 35) {
      alerts.push({
        type: 'high-temp',
        title: 'High Temperature Alert',
        message: `Temperatures may reach ${Math.round(maxTemp)}°C. Ensure adequate water supply for crops.`,
        icon: <Thermometer className="text-red-500" size={20} />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        textColor: 'text-red-800'
      });
    }

    if (minTemp < 5) {
      alerts.push({
        type: 'low-temp',
        title: 'Low Temperature Warning',
        message: `Temperatures may drop to ${Math.round(minTemp)}°C. Consider frost protection measures.`,
        icon: <AlertTriangle className="text-orange-500" size={20} />,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-100',
        textColor: 'text-orange-800'
      });
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Temperature Predictions</h2>
          <p className="text-sm text-gray-500 mb-4">7-day temperature forecast with min/max ranges</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedWeatherData.daily}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${Math.round(value as number)}°C`, 
                  name === 'tempMax' ? 'Max Temperature' : 'Min Temperature'
                ]} />
                <Area type="monotone" dataKey="tempMax" stroke="#22c55e" fill="#dcfce7" />
                <Area type="monotone" dataKey="tempMin" stroke="#3b82f6" fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Weather Alerts</h2>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 ${alert.bgColor} border ${alert.borderColor} rounded-lg`}>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3">{alert.icon}</div>
                    <div>
                      <h3 className={`font-medium ${alert.textColor}`}>{alert.title}</h3>
                      <p className={`text-sm mt-1 ${alert.textColor.replace('800', '700')}`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-start">
                <Sun className="text-green-500 mt-0.5 mr-3" size={20} />
                <div>
                  <h3 className="font-medium text-green-800">Weather Conditions Normal</h3>
                  <p className="text-sm text-green-700 mt-1">
                    No weather warnings for the upcoming period. Conditions are favorable for farming activities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab.toLowerCase()) {
      case 'current conditions':
        return renderCurrentConditions();
      case 'forecast':
        return renderForecast();
      case 'predictions':
        return renderPredictions();
      default:
        return renderCurrentConditions();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Weather Information</h1>
          <p className="text-gray-600">Real-time weather conditions and forecasts for your farm.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-500 capitalize">{connectionStatus}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Current Conditions', 'Forecast', 'Predictions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.toLowerCase()
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Weather;