import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Droplets } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type RainSensor = {
  name: string;
  location: string;
  isActive: boolean;
};

const RainSensors = () => {
  const [activeTab, setActiveTab] = useState('rainfall history');
  const [rainSensors, setRainSensors] = useState<RainSensor[]>([]);

  const rainfallData = [
    { date: '03/01', amount: 12 },
    { date: '03/05', amount: 8 },
    { date: '03/10', amount: 15 },
    { date: '03/15', amount: 0 },
    { date: '03/20', amount: 5 },
    { date: '03/25', amount: 20 },
    { date: '03/30', amount: 4 }
  ];

  const fetchSensors = async () => {
    try {
      const res = await fetch('http://localhost:8036/api/v1/sensors/');
      const data = await res.json();
      setRainSensors((data as RainSensor[]).filter((s: RainSensor) => s.name === 'rain'));
    } catch (err) {
      console.error('Erreur chargement capteurs pluie :', err);
    }
  };

  const toggleSensor = async (sensorName: string, status: boolean) => {
    try {
      await fetch(`http://localhost:8036/api/v1/sensors/status?name=${sensorName}&status=${status}`, {
        method: 'PUT',
      });
      fetchSensors();
    } catch (err) {
      console.error('Erreur mise à jour capteur pluie :', err);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  interface StatusCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
  }

  const renderStatusCard = (
    title: StatusCardProps['title'],
    value: StatusCardProps['value'],
    subtitle: StatusCardProps['subtitle'],
    icon: StatusCardProps['icon']
  ): JSX.Element => (
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
      <h3 className="text-lg font-semibold mb-4">Rain Sensors</h3>
      <div className="space-y-4">
        {rainSensors.map((sensor, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium capitalize">{sensor.name}</h4>
              <p className="text-sm text-gray-500">{sensor.location}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${sensor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {sensor.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleSensor(sensor.name, !sensor.isActive)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${sensor.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
              >
                {sensor.isActive ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Rain Sensors</h1>
        <p className="text-gray-600">Monitor rainfall and control rain sensors in real time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStatusCard('Rain Status', 'No Rain', 'Last rainfall: 2 days ago', <Cloud size={20} />)}
        {renderStatusCard('Rainfall Today', '0 mm', 'Monthly total: 24 mm', <CloudRain size={20} />)}
        {renderStatusCard('Soil Moisture', '42%', 'Optimal range: 40-60%', <Droplets size={20} />)}
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
