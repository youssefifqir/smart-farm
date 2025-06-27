import { useEffect, useState } from 'react';
import {
  Monitor,
  Bell,
  User,
  Lock,
  Settings as SettingsIcon,
  Database,
  HelpCircle,
  CloudRain,
  Flame,
  Thermometer,
  Droplet,
} from 'lucide-react';

const Settings = () => {
  const [rainEnabled, setRainEnabled] = useState(false);
  const [fireEnabled, setFireEnabled] = useState(false);
  const [temperatureEnabled, setTemperatureEnabled] = useState(false);
  const [waterEnabled, setWaterEnabled] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 🔁 Charger état initial depuis la base (backend)
  useEffect(() => {
    type Sensor = {
      name: string;
      isActive: boolean;
      // add other properties if needed
    };

    fetch('http://localhost:8036/api/v1/sensors/')
      .then((res) => res.json())
      .then((sensors: Sensor[]) => {
        sensors.forEach((sensor: Sensor) => {
          switch (sensor.name) {
            case 'rain':
              setRainEnabled(sensor.isActive);
              break;
            case 'fire':
              setFireEnabled(sensor.isActive);
              break;
            case 'temperature':
              setTemperatureEnabled(sensor.isActive);
              break;
            case 'water':
              setWaterEnabled(sensor.isActive);
              break;
            default:
              break;
          }
        });
      });
  }, []);

  // ✅ Met à jour le capteur côté backend
  const toggleSensor = async (sensorName: string, enabled: boolean) => {
    try {
      const res = await fetch(
        `http://localhost:8036/api/v1/sensors/status?name=${sensorName}&status=${enabled}`,
        {
          method: 'PUT',
        }
      );
      if (!res.ok) throw new Error(`Erreur pour ${sensorName}`);
    } catch (err) {
      console.error('Erreur de mise à jour capteur :', err);
    }
  };

  // ✅ Toggle component
  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
        enabled ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure your Smart Farm system preferences.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">

        {/* ✅ Sensors Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Monitor className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Sensors</h2>
          </div>
          <div className="space-y-4">
            {/* Rain Sensor */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <CloudRain className="mr-3 text-blue-500" />
                <span>Rain Sensor</span>
              </div>
              <Toggle
                enabled={rainEnabled}
                onToggle={() => {
                  const newVal = !rainEnabled;
                  setRainEnabled(newVal);
                  toggleSensor('rain', newVal);
                }}
              />
            </div>

            {/* Fire Sensor */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Flame className="mr-3 text-red-500" />
                <span>Fire Detection</span>
              </div>
              <Toggle
                enabled={fireEnabled}
                onToggle={() => {
                  const newVal = !fireEnabled;
                  setFireEnabled(newVal);
                  toggleSensor('fire', newVal);
                }}
              />
            </div>

            {/* Temperature Sensor */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Thermometer className="mr-3 text-orange-500" />
                <span>Temperature</span>
              </div>
              <Toggle
                enabled={temperatureEnabled}
                onToggle={() => {
                  const newVal = !temperatureEnabled;
                  setTemperatureEnabled(newVal);
                  toggleSensor('temperature', newVal);
                }}
              />
            </div>

            {/* Water Sensor */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Droplet className="mr-3 text-blue-400" />
                <span>Water Sensor</span>
              </div>
              <Toggle
                enabled={waterEnabled}
                onToggle={() => {
                  const newVal = !waterEnabled;
                  setWaterEnabled(newVal);
                  toggleSensor('water', newVal);
                }}
              />
            </div>
          </div>
        </div>
        {/* Notifications Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Bell className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Alert notifications</span>
              <Toggle enabled={alertNotifications} onToggle={() => setAlertNotifications((prev) => !prev)} />
            </div>
            <div className="flex items-center justify-between">
              <span>Email notifications</span>
              <Toggle enabled={emailNotifications} onToggle={() => setEmailNotifications((prev) => !prev)} />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS notifications</span>
              <Toggle enabled={smsNotifications} onToggle={() => setSmsNotifications((prev) => !prev)} />
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <User className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Account Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultValue="Farm Admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultValue="admin@smartfarm.com"
              />
            </div>
          </div>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Save Changes
          </button>
        </div>

        {/* Security Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Lock className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              Change Password
            </button>
            <div className="flex items-center justify-between">
              <span>Two-factor authentication</span>
              <Toggle enabled={twoFactor} onToggle={() => setTwoFactor((prev) => !prev)} />
            </div>
          </div>
        </div>

        {/* System Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">System</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark mode</span>
              <Toggle enabled={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-refresh data (1 min)</span>
              <Toggle enabled={autoRefresh} onToggle={() => setAutoRefresh((prev) => !prev)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Units</label>
              <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <option>Metric (°C, mm, km/h)</option>
                <option>Imperial (°F, in, mph)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Database className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Data Management</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period</label>
              <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <option>1 year</option>
                <option>2 years</option>
                <option>3 years</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <HelpCircle className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Help & Support</h2>
          </div>
          <p className="text-gray-600 mb-4">Need assistance with your Smart Farm system?</p>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              Contact Support
            </button>
            <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;