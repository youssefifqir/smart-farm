import { useEffect, useState } from 'react';
import { Waves, Droplet, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WaterSensors = () => {
  const [activeTab, setActiveTab] = useState('water levels');
  const [waterEnabled, setWaterEnabled] = useState(false);

  type Sensor = {
    name: string;
    isActive: boolean;
    // add other properties if needed
  };

  useEffect(() => {
    fetch('http://localhost:8036/api/v1/sensors/')
      .then((res) => res.json())
      .then((sensors: Sensor[]) => {
        const sensor = sensors.find((s: Sensor) => s.name === 'water');
        if (sensor) setWaterEnabled(sensor.isActive);
      });
  }, []);

  const toggleSensor = async (enabled: boolean) => {
    try {
      const res = await fetch(
        `http://localhost:8036/api/v1/sensors/status?name=water&status=${enabled}`,
        { method: 'PUT' }
      );
      if (!res.ok) throw new Error();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du capteur water', err);
    }
  };

  const handleToggle = () => {
    const newVal = !waterEnabled;
    setWaterEnabled(newVal);
    toggleSensor(newVal);
  };

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

  const waterLevelData = [
    { time: '00:00', level: 0},
    { time: '04:00', level: 72 },
    { time: '08:00', level: 75 },
    { time: '12:00', level: 73 },
    { time: '16:00', level: 71 },
    { time: '20:00', level: 70 }
  ];

  const renderWaterLevels = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-1">Water Level History</h3>
      <p className="text-sm text-gray-500 mb-4">Water reservoir levels over the past 7 days</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={waterLevelData}>
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [`${value}%`, 'Level']} />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#3b82f6"
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
      <h3 className="text-lg font-semibold mb-4">Water Sensors</h3>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h4 className="font-medium">water</h4>
          <p className="text-sm text-gray-500">Zone D</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${waterEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'}`}>
            {waterEnabled ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={handleToggle}
            className={`px-3 py-1 text-xs rounded-md ${waterEnabled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-800'}`}
          >
            {waterEnabled ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderWaterQuality = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Water Quality Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'pH Level', value: '6.8', range: '6.5-7.5', status: 'Optimal' },
          { name: 'TDS', value: '120ppm', range: '100-150ppm', status: 'Good' },
          { name: 'Temperature', value: '18°C', range: '15-20°C', status: 'Optimal' },
          { name: 'Dissolved Oxygen', value: '8mg/L', range: '7-9mg/L', status: 'Good' }
        ].map((metric, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">{metric.name}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current</p>
                <p className="font-medium">{metric.value}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Optimal Range</p>
                <p className="font-medium">{metric.range}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {metric.status}
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
        <h1 className="text-2xl font-bold text-gray-800">Water Sensors</h1>
        <p className="text-gray-600">Monitor water levels and quality across your farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStatusCard(
          'Water Level',
          '75%',
          'Reservoir capacity',
          <Waves size={20} />
        )}
        {renderStatusCard(
          'Water Quality',
          'Good',
          'pH: 6.8, TDS: 120ppm',
          <Droplet size={20} />
        )}
        {renderStatusCard(
          'Flow Rate',
          '4.2 L/min',
          'Normal operation',
          <Activity size={20} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Water Levels', 'Sensor Status', 'Water Quality'].map((tab) => (
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
          {activeTab === 'water levels' && renderWaterLevels()}
          {activeTab === 'sensor status' && renderSensorStatus()}
          {activeTab === 'water quality' && renderWaterQuality()}
        </div>
      </div>
    </div>
  );
};

export default WaterSensors;
