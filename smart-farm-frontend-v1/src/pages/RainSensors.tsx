import { useState } from 'react';
import { Cloud, CloudRain, Droplets } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RainSensors = () => {
  const [activeTab, setActiveTab] = useState('rainfall history');

  const rainfallData = [
    { date: '03/01', amount: 12 },
    { date: '03/05', amount: 8 },
    { date: '03/10', amount: 15 },
    { date: '03/15', amount: 0 },
    { date: '03/20', amount: 5 },
    { date: '03/25', amount: 20 },
    { date: '03/30', amount: 4 }
  ];

  const renderStatusCard = (title: string, value: string, subtitle: string, icon: React.ReactNode) => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );

  const renderRainfallHistory = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-1">Rainfall History</h3>
      <p className="text-sm text-gray-500 mb-4">Rainfall data for the past 30 days</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rainfallData}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `${value}mm`} />
            <Tooltip />
            <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#dbeafe" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderSensorStatus = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Sensor Status</h3>
      <div className="space-y-4">
        {[
          { name: 'Rain Sensor A', location: 'Main Field', status: 'Active' },
          { name: 'Rain Sensor B', location: 'Greenhouse', status: 'Active' },
          { name: 'Rain Sensor C', location: 'Storage Area', status: 'Active' }
        ].map((sensor, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{sensor.name}</h4>
              <p className="text-sm text-gray-500">{sensor.location}</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {sensor.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Rain Sensors</h1>
        <p className="text-gray-600">Monitor rainfall and precipitation data across your farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStatusCard(
          'Rain Status',
          'No Rain',
          'Last rainfall: 2 days ago',
          <Cloud size={20} />
        )}
        {renderStatusCard(
          'Rainfall Today',
          '0 mm',
          'Monthly total: 24 mm',
          <CloudRain size={20} />
        )}
        {renderStatusCard(
          'Soil Moisture',
          '42%',
          'Optimal range: 40-60%',
          <Droplets size={20} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Rainfall History', 'Sensor Status'].map((tab) => (
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
          {activeTab === 'rainfall history' ? renderRainfallHistory() : renderSensorStatus()}
        </div>
      </div>
    </div>
  );
};

export default RainSensors;