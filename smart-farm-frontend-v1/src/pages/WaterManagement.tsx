import { useState } from 'react';
import { Droplet, Timer, Gauge, TrendingDown, Calendar, History } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import DataCard from '../components/dashboard/DataCard';

const WaterManagement = () => {
  const [activeTab, setActiveTab] = useState('usage history');

  const zoneData = [
    { name: 'Zone A - Vegetables', value: 45, color: '#22c55e' },
    { name: 'Zone B - Fruit Trees', value: 30, color: '#3b82f6' },
    { name: 'Zone C - Greenhouse', value: 15, color: '#f97316' },
    { name: 'Zone D - Herbs', value: 10, color: '#a855f7' }
  ];

  const usageHistory = [
    { day: 'Mon', usage: 95 },
    { day: 'Tue', usage: 85 },
    { day: 'Wed', usage: 100 },
    { day: 'Thu', usage: 75 },
    { day: 'Fri', usage: 90 },
    { day: 'Sat', usage: 100 },
    { day: 'Sun', usage: 90 }
  ];

  const scheduleData = [
    { time: '06:00', zone: 'Zone A', duration: '30 min' },
    { time: '07:00', zone: 'Zone B', duration: '45 min' },
    { time: '08:30', zone: 'Zone C', duration: '20 min' },
    { time: '09:00', zone: 'Zone D', duration: '15 min' }
  ];

  const renderUsageHistory = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Weekly Water Usage</h2>
        <p className="text-sm text-gray-500 mb-4">Water consumption over the past week</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageHistory}>
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `${value}L`} />
              <Tooltip />
              <Area type="monotone" dataKey="usage" stroke="#22c55e" fill="#dcfce7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderZones = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={zoneData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {zoneData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {zoneData.map((zone, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: zone.color }} />
              <span className="font-medium">{zone.name}</span>
            </div>
            <span className="text-gray-600">{zone.value}L</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Irrigation Schedule</h2>
      <div className="space-y-4">
        {scheduleData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
            <div className="flex items-center">
              <Calendar className="text-gray-400 mr-3" size={20} />
              <div>
                <h3 className="font-medium text-gray-900">{item.zone}</h3>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Timer className="text-gray-400 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-600">{item.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'usage history':
        return renderUsageHistory();
      case 'zones':
        return renderZones();
      case 'schedule':
        return renderSchedule();
      default:
        return renderUsageHistory();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Water Management</h1>
        <p className="text-gray-600">Monitor and control your farm's water usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Total Usage Today"
          value="128L"
          change="-12%"
          subtext="from yesterday"
          trend="down"
          icon={<Droplet size={20} />}
        />
        <DataCard
          title="Water Pressure"
          value="4.2 bar"
          subtext="Optimal range: 3.5-4.5 bar"
          icon={<Gauge size={20} />}
        />
        <DataCard
          title="Next Irrigation"
          value="2h 15m"
          subtext="Zone A scheduled next"
          icon={<Timer size={20} />}
        />
        <DataCard
          title="Water Savings"
          value="15%"
          subtext="Compared to last month"
          trend="down"
          icon={<TrendingDown size={20} />}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Usage History', 'Zones', 'Schedule'].map((tab) => (
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WaterManagement;