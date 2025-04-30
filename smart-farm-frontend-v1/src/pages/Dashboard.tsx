import { Thermometer, Droplets, Waves, Droplet as WaterDroplet } from 'lucide-react';
import DataCard from '../components/dashboard/DataCard';
import WeatherForecast from '../components/dashboard/WeatherForecast';
import WaterConsumption from '../components/dashboard/WaterConsumption';
import SensorStatus from '../components/dashboard/SensorStatus';
import AlertsPanel from '../components/dashboard/AlertsPanel';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Smart Farm monitoring system.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard 
          title="Temperature" 
          value="24°C" 
          change="+2°" 
          subtext="from yesterday" 
          trend="up"
          icon={<Thermometer size={20} />} 
        />
        <DataCard 
          title="Humidity" 
          value="65%" 
          change="-5%" 
          subtext="from yesterday" 
          trend="down"
          icon={<Droplets size={20} />} 
        />
        <DataCard 
          title="Soil Moisture" 
          value="42%" 
          subtext="Optimal range: 40-60%" 
          icon={<Waves size={20} />} 
        />
        <DataCard 
          title="Water Usage" 
          value="128L" 
          change="-12%" 
          subtext="from last week" 
          trend="down"
          icon={<WaterDroplet size={20} />} 
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