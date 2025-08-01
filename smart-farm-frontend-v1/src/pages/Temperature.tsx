import { useState } from 'react';
import { Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Temperature = () => {
  const [activeTab, setActiveTab] = useState('temperature history');

  const temperatureData = [
    { time: '00:00', temp: 18 },
    { time: '04:00', temp: 16 },
    { time: '08:00', temp: 20 },
    { time: '12:00', temp: 24 },
    { time: '16:00', temp: 28 },
    { time: '20:00', temp: 22 }
  ];

  const renderStatusCard = (title: string, value: string, subtitle: string) => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Thermometer className="text-gray-400" size={20} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );

  const renderTemperatureHistory = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-1">Temperature History</h3>
      <p className="text-sm text-gray-500 mb-4">Temperature data for the past 24 hours</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureData}>
            <XAxis dataKey="time" />
            <YAxis domain={[10, 30]} tickFormatter={(value) => `${value}°C`} />
            <Tooltip formatter={(value) => [`${value}°C`, 'Temperature']} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderSensorStatus = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Temperature Sensors</h3>
      <div className="space-y-4">
        {[
          { name: 'Temperature Sensor A', location: 'Greenhouse', value: '26°C', status: 'Active' },
          { name: 'Temperature Sensor B', location: 'Storage Area', value: '22°C', status: 'Active' },
          { name: 'Temperature Sensor C', location: 'Field Zone 1', value: '24°C', status: 'Active' },
          { name: 'Temperature Sensor D', location: 'Field Zone 2', value: '23°C', status: 'Active' }
        ].map((sensor, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{sensor.name}</h4>
              <p className="text-sm text-gray-500">{sensor.location}</p>
              <p className="text-sm font-medium text-gray-700">{sensor.value}</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {sensor.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemperatureZones = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Temperature Zones</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Greenhouse', temp: '26°C', optimal: '20-28°C', status: 'Optimal' },
          { name: 'Storage Area', temp: '22°C', optimal: '18-24°C', status: 'Optimal' },
          { name: 'Field Zone 1', temp: '24°C', optimal: '20-26°C', status: 'Optimal' },
          { name: 'Field Zone 2', temp: '23°C', optimal: '20-26°C', status: 'Optimal' }
        ].map((zone, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">{zone.name}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current</p>
                <p className="font-medium">{zone.temp}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Optimal Range</p>
                <p className="font-medium">{zone.optimal}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {zone.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Temperature Monitoring</h1>
        <p className="text-gray-600">Monitor temperature conditions across your farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStatusCard(
          'Current Temperature',
          '24°C',
          '+2° from yesterday'
        )}
        {renderStatusCard(
          'Daily High',
          '28°C',
          'Recorded at 2:30 PM'
        )}
        {renderStatusCard(
          'Daily Low',
          '16°C',
          'Recorded at 5:15 AM'
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Temperature History', 'Sensor Status', 'Temperature Zones'].map((tab) => (
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
          {activeTab === 'temperature history' && renderTemperatureHistory()}
          {activeTab === 'sensor status' && renderSensorStatus()}
          {activeTab === 'temperature zones' && renderTemperatureZones()}
        </div>
      </div>
    </div>
  );
};

export default Temperature;