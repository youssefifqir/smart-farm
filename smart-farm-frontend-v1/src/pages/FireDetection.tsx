import { useState } from 'react';
import { Flame, AlertTriangle, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FireDetection = () => {
  const [activeTab, setActiveTab] = useState('fire risk');

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

  const renderFireRisk = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-100 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="text-red-500 mt-0.5 mr-3" size={20} />
          <div>
            <h3 className="font-medium text-red-800">Fire Risk Alert</h3>
            <p className="text-sm text-red-700 mt-1">
              High temperature detected in Sector B. Fire risk level: Moderate. Take precautionary measures.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Temperature Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { time: '00:00', temp: 22 },
                { time: '04:00', temp: 20 },
                { time: '08:00', temp: 23 },
                { time: '12:00', temp: 26 },
                { time: '16:00', temp: 24 },
                { time: '20:00', temp: 23 }
              ]}
            >
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSensorStatus = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Fire Sensor Status</h3>
      <div className="space-y-4">
        {[
          { name: 'Fire Sensor A', location: 'Main Field', status: 'Active', reading: 'No fire detected' },
          { name: 'Fire Sensor B', location: 'Greenhouse', status: 'Active', reading: 'No fire detected' },
          { name: 'Fire Sensor C', location: 'Storage Barn', status: 'Active', reading: 'No fire detected' },
          { name: 'Fire Sensor D', location: 'Equipment Shed', status: 'Active', reading: 'No fire detected' }
        ].map((sensor, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{sensor.name}</h4>
              <p className="text-sm text-gray-500">{sensor.location}</p>
              <p className="text-sm text-gray-500">{sensor.reading}</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {sensor.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlertHistory = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Alert History</h3>
      <div className="space-y-4">
        {[
          {
            date: '2024-03-15 14:30',
            message: 'High temperature alert in Sector B',
            level: 'Warning'
          },
          {
            date: '2024-03-14 09:15',
            message: 'Fire risk level increased to moderate',
            level: 'Warning'
          },
          {
            date: '2024-03-13 16:45',
            message: 'All sensors operating normally',
            level: 'Info'
          }
        ].map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm text-gray-500">{alert.date}</p>
              <p className="font-medium">{alert.message}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                alert.level === 'Warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {alert.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Fire Detection</h1>
        <p className="text-gray-600">Monitor fire risks and detection systems across your farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStatusCard(
          'Fire Status',
          'No Fire',
          'All areas clear',
          <Flame size={20} />
        )}
        {renderStatusCard(
          'Risk Level',
          'Moderate',
          'Due to high temperatures',
          <AlertTriangle size={20} />
        )}
        {renderStatusCard(
          'Temperature',
          '24°C',
          '+2° from yesterday',
          <Thermometer size={20} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Fire Risk', 'Sensor Status', 'Alert History'].map((tab) => (
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
          {activeTab === 'fire risk' && renderFireRisk()}
          {activeTab === 'sensor status' && renderSensorStatus()}
          {activeTab === 'alert history' && renderAlertHistory()}
        </div>
      </div>
    </div>
  );
};

export default FireDetection;