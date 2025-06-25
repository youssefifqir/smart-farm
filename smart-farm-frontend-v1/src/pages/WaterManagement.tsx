// ✅ WaterManagement.tsx avec formulaire modal de programmation
import { useState } from 'react';
import { Droplet, Timer, Gauge, TrendingDown, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import DataCard from '../components/dashboard/DataCard';

const WaterManagement = () => {
  const [activeTab, setActiveTab] = useState('usage history');
  const [showModal, setShowModal] = useState(false); // ✅ Nouveau : état pour afficher le modal
  const [form, setForm] = useState({ zone: '', time: '', duration: '' }); // ✅ Nouveau : état du formulaire

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

  // ✅ Nouveau : gestion du formulaire avec typage React
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8080/api/v1/irrigation/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zone: form.zone,
        time: form.time,
        duration: parseInt(form.duration)
      })
    });
    if (response.ok) {
      alert('✅ Arrosage programmé avec succès !');
      setShowModal(false);
      setForm({ zone: '', time: '', duration: '' });
    } else {
      alert('❌ Échec de la programmation');
    }
  } catch (error) {
    alert('⛔ Erreur de connexion au serveur');
    console.error(error);
  }
};

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

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Programmer un arrosage
      </button>

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Timer className="text-gray-400 mr-2" size={16} />
                <span className="text-sm font-medium text-gray-600">{item.duration}</span>
              </div>
              <p className="text-sm font-semibold text-green-600">✅ Actif</p>
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
        <DataCard title="Total Usage Today" value="128L" change="-12%" subtext="from yesterday" trend="down" icon={<Droplet size={20} />} />
        <DataCard title="Water Pressure" value="4.2 bar" subtext="Optimal range: 3.5-4.5 bar" icon={<Gauge size={20} />} />
        <DataCard title="Next Irrigation" value="2h 15m" subtext="Zone A scheduled next" icon={<Timer size={20} />} />
        <DataCard title="Water Savings" value="15%" subtext="Compared to last month" trend="down" icon={<TrendingDown size={20} />} />
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

        <div className="p-6">{renderContent()}</div>
      </div>

      {/* ✅ Modal de programmation d'arrosage */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-gray-600 text-lg font-bold mb-4">Programmer un arrosage</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-gray-600">
              <div>
                <label className="block mb-1 text-xs font-bold">Zone</label>
                <select
                  name="zone"
                  value={form.zone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-xs font-bold"
                  required
                >
                  <option value="">-- Choisir une zone --</option>
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="Zone C">Zone C</option>
                  <option value="Zone D">Zone D</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold">Heure</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold">Durée (en minutes)</label>
                <input
                  name="duration"
                  type="number"
                  placeholder="Durée"
                  className="w-full p-2 border rounded text-xs font-bold"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterManagement;
