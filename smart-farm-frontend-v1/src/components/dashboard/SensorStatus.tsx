import { Thermometer, CloudRain, Flame, Droplets, Wind } from 'lucide-react';

type SensorStatusItem = {
  id: string;
  icon: React.ReactNode;
  name: string;
  value: string | number;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
};

const SensorStatus = () => {
  const sensors: SensorStatusItem[] = [
    {
      id: 'rain-a',
      icon: <CloudRain size={20} className="text-blue-500" />,
      name: 'Rain Sensor A',
      value: 'No Rain',
      status: 'Active',
      lastUpdated: '2 min ago'
    },
    {
      id: 'fire-b',
      icon: <Flame size={20} className="text-red-500" />,
      name: 'Fire Detector B',
      value: 'No Fire',
      status: 'Active',
      lastUpdated: '1 min ago'
    },
    {
      id: 'soil-c',
      icon: <Droplets size={20} className="text-green-500" />,
      name: 'Soil Moisture C',
      value: '42%',
      status: 'Active',
      lastUpdated: '5 min ago'
    },
    {
      id: 'temp-d',
      icon: <Thermometer size={20} className="text-orange-500" />,
      name: 'Temperature D',
      value: '24°C',
      status: 'Active',
      lastUpdated: '3 min ago'
    },
    {
      id: 'humid-e',
      icon: <Droplets size={20} className="text-blue-400" />,
      name: 'Humidity E',
      value: '65%',
      status: 'Active',
      lastUpdated: '4 min ago'
    },
    {
      id: 'wind-f',
      icon: <Wind size={20} className="text-gray-500" />,
      name: 'Wind Sensor F',
      value: 'N/A',
      status: 'Inactive',
      lastUpdated: '1 hour ago'
    }
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Sensor Status</h2>
        <p className="text-sm text-gray-500">Current status of all farm sensors</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {sensor.icon}
                <span className="ml-2 text-sm font-medium text-gray-700">{sensor.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                sensor.status === 'Active' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {sensor.status}
              </span>
            </div>
            <div className="text-xl font-semibold mb-2">{sensor.value}</div>
            <div className="text-xs text-gray-500">Last updated: {sensor.lastUpdated}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorStatus;