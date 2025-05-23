import { useState } from 'react';
import { Thermometer, Droplets, Waves, Droplet as WaterDroplet, Bell, AlertTriangle, CloudRain, Brush, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataCard from '../components/dashboard/DataCard';
import WeatherForecast from '../components/dashboard/WeatherForecast';
import WaterConsumption from '../components/dashboard/WaterConsumption';
import SensorStatus from '../components/dashboard/SensorStatus';
import AlertsPanel from '../components/dashboard/AlertsPanel';

type Alert = {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
};

const Dashboard = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Alertes récentes (limite à 5 pour le dropdown)
  const recentAlerts: Alert[] = [
    {
      id: 'fire-risk',
      type: 'danger',
      title: 'Risque d\'incendie',
      description: 'Température élevée détectée dans le Secteur B',
      time: '14:30',
      icon: <Flame className="text-red-500" size={16} />
    },
    {
      id: 'rain-detected',
      type: 'info',
      title: 'Pluie détectée',
      description: 'Système d\'irrigation mis en pause',
      time: '12:15',
      icon: <CloudRain className="text-blue-500" size={16} />
    },
    {
      id: 'disease-risk',
      type: 'warning',
      title: 'Risque de maladie',
      description: 'Risque fongique sur les plants de tomates',
      time: '09:45',
      icon: <Brush className="text-amber-500" size={16} />
    }
  ];

  const activeAlertsCount = recentAlerts.filter(alert => alert.type === 'danger' || alert.type === 'warning').length;

  const handleViewAllNotifications = () => {
    setIsNotificationOpen(false);
    navigate('/notifications');
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-amber-500 bg-amber-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bienvenue dans votre système de surveillance Smart Farm.</p>
        </div>
        
        {/* Bouton de notification intégré */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={24} />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeAlertsCount > 9 ? '9+' : activeAlertsCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <>
              {/* Overlay pour fermer en cliquant à côté */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsNotificationOpen(false)}
              />
              
              {/* Dropdown des notifications */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <span className="text-sm text-gray-500">
                      {recentAlerts.length} nouvelle{recentAlerts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {recentAlerts.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {recentAlerts.map((alert) => (
                        <div 
                          key={alert.id}
                          className={`p-4 border-l-4 ${getAlertBgColor(alert.type)} hover:bg-gray-50 cursor-pointer transition-colors`}
                          onClick={() => handleViewAllNotifications()}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">{alert.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {alert.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {alert.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {alert.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Aucune notification</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={handleViewAllNotifications}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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