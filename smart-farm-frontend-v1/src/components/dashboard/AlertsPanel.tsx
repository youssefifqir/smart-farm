import { AlertTriangle, CloudRain, Brush as Virus } from 'lucide-react';

type Alert = {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
};

const AlertsPanel = () => {
  const alerts: Alert[] = [
    {
      id: 'fire-risk',
      type: 'danger',
      title: 'Fire Risk Alert',
      description: 'High temperature detected in Sector B. Fire risk level: Moderate.',
      icon: <AlertTriangle className="text-red-500" />
    },
    {
      id: 'rain-detected',
      type: 'info',
      title: 'Rain Detected',
      description: 'Rain detected in Sector A. Irrigation system paused.',
      icon: <CloudRain className="text-blue-500" />
    },
    {
      id: 'disease-risk',
      type: 'warning',
      title: 'Disease Risk',
      description: 'Potential fungal disease risk in tomato plants due to high humidity.',
      icon: <Virus className="text-amber-500" />
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;