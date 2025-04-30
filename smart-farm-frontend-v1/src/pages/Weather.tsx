import { useState } from 'react';
import { Cloud, CloudRain, CloudDrizzle, Sun, Wind, Thermometer, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import DataCard from '../components/dashboard/DataCard';

const Weather = () => {
  const [activeTab, setActiveTab] = useState('current conditions');
  
  const precipitationData = [
    { time: '00:00', value: 0 },
    { time: '03:00', value: 0.2 },
    { time: '06:00', value: 0.5 },
    { time: '09:00', value: 0.3 },
    { time: '12:00', value: 0.1 },
    { time: '15:00', value: 0 },
    { time: '18:00', value: 0.2 },
    { time: '21:00', value: 0.4 }
  ];

  const temperaturePrediction = [
    { day: 'Mon', min: 18, max: 24 },
    { day: 'Tue', min: 17, max: 22 },
    { day: 'Wed', min: 16, max: 19 },
    { day: 'Thu', min: 15, max: 18 },
    { day: 'Fri', min: 17, max: 20 },
    { day: 'Sat', min: 18, max: 23 },
    { day: 'Sun', min: 19, max: 25 }
  ];

  const renderCurrentConditions = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">24°C</h2>
            <p className="text-gray-500">Sunny</p>
          </div>
          <Sun className="text-yellow-400" size={48} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DataCard
            title="Wind Speed"
            value="12 km/h"
            subtext="North-East"
            icon={<Wind size={20} />}
          />
          <DataCard
            title="Humidity"
            value="65%"
            subtext="Optimal"
            icon={<Droplets size={20} />}
          />
          <DataCard
            title="Feels Like"
            value="26°C"
            subtext="+2° from actual"
            icon={<Thermometer size={20} />}
          />
          <DataCard
            title="Precipitation"
            value="0 mm"
            subtext="Last 24h"
            icon={<CloudRain size={20} />}
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Today's Temperature</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { time: '00:00', temp: 19 },
                { time: '03:00', temp: 18 },
                { time: '06:00', temp: 17 },
                { time: '09:00', temp: 20 },
                { time: '12:00', temp: 24 },
                { time: '15:00', temp: 26 },
                { time: '18:00', temp: 23 },
                { time: '21:00', temp: 21 }
              ]}
            >
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="temp" stroke="#22c55e" fill="#dcfce7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-5 gap-4">
          {[
            { day: 'Today', temp: '24°', condition: 'Sunny', icon: <Sun className="text-yellow-400" size={32} /> },
            { day: 'Tomorrow', temp: '22°', condition: 'Partly Cloudy', icon: <Cloud className="text-gray-400" size={32} /> },
            { day: 'Wed', temp: '19°', condition: 'Rain', icon: <CloudRain className="text-blue-400" size={32} /> },
            { day: 'Thu', temp: '18°', condition: 'Showers', icon: <CloudDrizzle className="text-blue-400" size={32} /> },
            { day: 'Fri', temp: '20°', condition: 'Cloudy', icon: <Cloud className="text-gray-400" size={32} /> }
          ].map((day, index) => (
            <div key={index} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700 mb-2">{day.day}</span>
              {day.icon}
              <span className="text-xl font-semibold mt-2">{day.temp}</span>
              <span className="text-xs text-gray-500">{day.condition}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Precipitation Forecast</h2>
        <p className="text-sm text-gray-500 mb-4">Expected rainfall over the next 24 hours</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={precipitationData}>
              <XAxis dataKey="time" />
              <YAxis tickFormatter={(value) => `${value}mm`} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Temperature Predictions</h2>
        <p className="text-sm text-gray-500 mb-4">7-day temperature forecast with min/max ranges</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={temperaturePrediction}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="max" stroke="#22c55e" fill="#dcfce7" />
              <Area type="monotone" dataKey="min" stroke="#3b82f6" fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Weather Alerts</h2>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="flex items-start">
              <CloudRain className="text-yellow-500 mt-0.5 mr-3" size={20} />
              <div>
                <h3 className="font-medium text-yellow-800">Heavy Rain Warning</h3>
                <p className="text-sm text-yellow-700 mt-1">Expected heavy rainfall in the next 48 hours. Consider adjusting irrigation schedules.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start">
              <Wind className="text-blue-500 mt-0.5 mr-3" size={20} />
              <div>
                <h3 className="font-medium text-blue-800">Strong Winds Expected</h3>
                <p className="text-sm text-blue-700 mt-1">Wind speeds may reach up to 30km/h. Secure any loose equipment or covers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Weather Information</h1>
        <p className="text-gray-600">Current weather conditions and forecasts for your farm.</p>
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