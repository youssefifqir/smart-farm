import { useState, ReactNode } from 'react';
import { Cloud, CloudRain, CloudDrizzle, Sun } from 'lucide-react';

type Weather = {
  day: string;
  temp: string;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Showers' | 'Partly Cloudy';
  icon: ReactNode;
};

const WeatherForecast = () => {
  const [forecast] = useState<Weather[]>([
    { 
      day: 'Today',
      temp: '24°', 
      condition: 'Sunny',
      icon: <Sun className="text-yellow-400" size={32} />
    },
    { 
      day: 'Tomorrow',
      temp: '22°', 
      condition: 'Partly Cloudy',
      icon: <Cloud className="text-gray-400" size={32} />
    },
    { 
      day: 'Wed',
      temp: '19°', 
      condition: 'Rain',
      icon: <CloudRain className="text-blue-400" size={32} />
    },
    { 
      day: 'Thu',
      temp: '18°', 
      condition: 'Showers',
      icon: <CloudDrizzle className="text-blue-400" size={32} />
    },
    { 
      day: 'Fri',
      temp: '20°', 
      condition: 'Cloudy',
      icon: <Cloud className="text-gray-400" size={32} />
    }
  ]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Weather Forecast</h2>
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 mb-2">{item.day}</span>
            <div className="mb-2">{item.icon}</div>
            <span className="text-xl font-semibold mb-1">{item.temp}</span>
            <span className="text-xs text-gray-500">{item.condition}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;