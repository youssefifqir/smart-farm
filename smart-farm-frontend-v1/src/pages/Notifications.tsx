import { useState } from 'react';
import { AlertTriangle, CloudRain, Brush, Bell, X, Clock, CheckCircle, Flame, Thermometer } from 'lucide-react';

type Alert = {
  id: string;
  type: 'danger' | 'warning' | 'info';
  category: 'fire' | 'weather' | 'disease' | 'sensor' | 'water';
  title: string;
  description: string;
  time: string;
  location: string;
  icon: React.ReactNode;
  status: 'active' | 'resolved' | 'acknowledged';
  priority: 'high' | 'medium' | 'low';
};

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'fire-risk',
      type: 'danger',
      category: 'fire',
      title: 'Fire risk detected',
      description: 'High temperature detected in Sector B. Risk level: Moderate.',
      time: '14:30',
      location: 'Sector B',
      icon: <Flame className="text-red-500" />,
      status: 'active',
      priority: 'high'
    },
    {
      id: 'rain-detected',
      type: 'info',
      category: 'weather',
      title: 'Rain detected',
      description: 'Rain detected in Sector A. Irrigation system paused.',
      time: '12:15',
      location: 'Sector A',
      icon: <CloudRain className="text-blue-500" />,
      status: 'acknowledged',
      priority: 'medium'
    },
    {
      id: 'disease-risk',
      type: 'warning',
      category: 'disease',
      title: 'Disease risk',
      description: 'Potential fungal disease risk on tomato plants due to high humidity.',
      time: '09:45',
      location: 'Main greenhouse',
      icon: <Brush className="text-amber-500" />,
      status: 'active',
      priority: 'medium'
    },
    {
      id: 'temperature-alert',
      type: 'warning',
      category: 'sensor',
      title: 'Temperature alert',
      description: 'Abnormally high temperature detected by the sensor in Sector C.',
      time: '08:20',
      location: 'Sector C',
      icon: <Thermometer className="text-orange-500" />,
      status: 'resolved',
      priority: 'low'
    },
    {
      id: 'water-level',
      type: 'warning',
      category: 'water',
      title: 'Low water level',
      description: 'The main tank shows a water level below 20%.',
      time: '07:30',
      location: 'Main tank',
      icon: <AlertTriangle className="text-yellow-500" />,
      status: 'active',
      priority: 'high'
    }
  ]);

  const handleStatusChange = (alertId: string, newStatus: 'acknowledged' | 'resolved') => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));
  };

  const getFilteredAlerts = () => {
    if (filter === 'all') return alerts;
    if (filter === 'active') return alerts.filter(alert => alert.status === 'active');
    return alerts.filter(alert => alert.category === filter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-red-100 bg-red-50';
      case 'warning': return 'border-amber-100 bg-amber-50';
      case 'info': return 'border-blue-100 bg-blue-50';
      default: return 'border-gray-100 bg-gray-50';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Bell className="mr-3 text-blue-600" size={28} />
            Notifications & Alerts
          </h1>
          <p className="text-gray-600">Manage all your system alerts and notifications.</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium">
          {activeAlerts} active alert{activeAlerts !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: alerts.length },
            { key: 'active', label: 'Active', count: alerts.filter(a => a.status === 'active').length },
            { key: 'fire', label: 'Fire', count: alerts.filter(a => a.category === 'fire').length },
            { key: 'weather', label: 'Weather', count: alerts.filter(a => a.category === 'weather').length },
            { key: 'disease', label: 'Diseases', count: alerts.filter(a => a.category === 'disease').length },
            { key: 'sensor', label: 'Sensors', count: alerts.filter(a => a.category === 'sensor').length },
            { key: 'water', label: 'Water', count: alerts.filter(a => a.category === 'water').length }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-3">
        {getFilteredAlerts().map((alert) => (
          <div 
            key={alert.id}
            className={`
              border rounded-lg border-l-4 ${getPriorityColor(alert.priority)} ${getTypeColor(alert.type)}
              p-4 hover:shadow-md transition-shadow
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-0.5">{alert.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status === 'active' ? 'Active' : 
                         alert.status === 'acknowledged' ? 'Acknowledged' : 'Resolved'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{alert.description}</p>
                  <p className="text-xs text-gray-500 mb-3">📍 {alert.location}</p>
                  
                  {alert.status === 'active' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(alert.id, 'acknowledged')}
                        className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        Mark as seen
                      </button>
                      <button
                        onClick={() => handleStatusChange(alert.id, 'resolved')}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredAlerts().length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'No alerts available.' : 'No alerts in this category.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;