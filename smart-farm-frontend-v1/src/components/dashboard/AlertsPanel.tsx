import { AlertTriangle, CloudRain, Brush as Virus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Alert = {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
  time: string;
};

const AlertsPanel = () => {
  const navigate = useNavigate();

  const alerts: Alert[] = [
    {
      id: 'fire-risk',
      type: 'danger',
      title: 'Fire risk',
      description: 'High temperature detected in Sector B.',
      icon: <AlertTriangle className="text-red-500" />,
      time: '14:30'
    },
    {
      id: 'rain-detected',
      type: 'info',
      title: 'Rain detected',
      description: 'Irrigation system paused.',
      icon: <CloudRain className="text-blue-500" />,
      time: '12:15'
    },
    {
      id: 'disease-risk',
      type: 'warning',
      title: 'Disease risk',
      description: 'Fungal risk detected on tomato plants.',
      icon: <Virus className="text-amber-500" />,
      time: '09:45'
    }
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Alerts</h2>
        <p className="text-sm text-gray-500">Recent system alerts</p>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`
              p-4 rounded-lg border
              ${alert.type === 'danger' 
                ? 'border-red-100 bg-red-50' 
                : alert.type === 'warning'
                  ? 'border-amber-100 bg-amber-50'
                  : 'border-blue-100 bg-blue-50'
              }
            `}
          >
            <div className="flex items-start">
              <div className="mt-0.5 mr-3">{alert.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{alert.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/notifications')}
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default AlertsPanel;