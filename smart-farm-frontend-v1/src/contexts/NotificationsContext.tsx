import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Brush, Flame, Thermometer } from 'lucide-react';

export type Alert = {
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
  timestamp: Date;
};

type NotificationsContextType = {
  alerts: Alert[];
  activeAlertsCount: number;
  unreadAlertsCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  updateAlertStatus: (alertId: string, status: 'acknowledged' | 'resolved') => void;
  markAllAsRead: () => void;
  getRecentAlerts: (limit?: number) => Alert[];
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'fire-risk-001',
      type: 'danger',
      category: 'fire',
      title: 'Risque d\'incendie détecté',
      description: 'Température élevée détectée dans le Secteur B. Niveau de risque: Modéré.',
      time: '14:30',
      location: 'Secteur B',
      icon: <Flame className="text-red-500" />,
      status: 'active',
      priority: 'high',
      timestamp: new Date()
    },
    {
      id: 'rain-002',
      type: 'info',
      category: 'weather',
      title: 'Pluie détectée',
      description: 'Pluie détectée dans le Secteur A. Système d\'irrigation mis en pause.',
      time: '12:15',
      location: 'Secteur A',
      icon: <CloudRain className="text-blue-500" />,
      status: 'acknowledged',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h ago
    },
    {
      id: 'disease-003',
      type: 'warning',
      category: 'disease',
      title: 'Risque de maladie',
      description: 'Risque potentiel de maladie fongique sur les plants de tomates en raison de l\'humidité élevée.',
      time: '09:45',
      location: 'Serre principale',
      icon: <Brush className="text-amber-500" />,
      status: 'active',
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5h ago
    },
    {
      id: 'temp-004',
      type: 'warning',
      category: 'sensor',
      title: 'Alerte température',
      description: 'Température anormalement élevée détectée par le capteur du Secteur C.',
      time: '08:20',
      location: 'Secteur C',
      icon: <Thermometer className="text-orange-500" />,
      status: 'resolved',
      priority: 'low',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6h ago
    },
    {
      id: 'water-005',
      type: 'warning',
      category: 'water',
      title: 'Niveau d\'eau bas',
      description: 'Le réservoir principal affiche un niveau d\'eau inférieur à 20%.',
      time: '07:30',
      location: 'Réservoir principal',
      icon: <AlertTriangle className="text-yellow-500" />,
      status: 'active',
      priority: 'high',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000) // 7h ago
    }
  ]);

  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;
  const unreadAlertsCount = alerts.filter(alert => alert.status === 'active').length;

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const updateAlertStatus = (alertId: string, status: 'acknowledged' | 'resolved') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => 
      alert.status === 'active' ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const getRecentAlerts = (limit: number = 5) => {
    return alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  };

  // Simuler l'arrivée de nouvelles alertes (optionnel, pour démo)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuler de nouvelles alertes aléatoirement (rare)
      if (Math.random() < 0.1) { // 10% de chance toutes les 30 secondes
        const alertTypes = [
          {
            type: 'warning' as const,
            category: 'sensor' as const,
            title: 'Capteur en panne',
            description: 'Le capteur de température du secteur D ne répond plus.',
            location: 'Secteur D',
            priority: 'medium' as const,
            icon: <Thermometer className="text-orange-500" />
          },
          {
            type: 'info' as const,
            category: 'weather' as const,
            title: 'Changement météo',
            description: 'Les conditions météorologiques ont changé.',
            location: 'Ensemble de la ferme',
            priority: 'low' as const,
            icon: <CloudRain className="text-blue-500" />
          }
        ];
        
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        addAlert({
          ...randomAlert,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          status: 'active'
        });
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider value={{
      alerts,
      activeAlertsCount,
      unreadAlertsCount,
      addAlert,
      updateAlertStatus,
      markAllAsRead,
      getRecentAlerts
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};