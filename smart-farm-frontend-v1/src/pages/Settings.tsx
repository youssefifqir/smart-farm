import { useState } from 'react';
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
  Droplet
} from 'lucide-react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (value: boolean) => void }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
        enabled ? 'bg-green-500' : 'bg-gray-200'
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
        {/* Sensors Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Monitor className="mr-2 text-gray-400" />
            <h2 className="text-lg font-semibold">Sensors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
              <CloudRain className="mr-3 text-blue-500" />
              <span>Rain Sensors</span>
            </div>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
              <Flame className="mr-3 text-red-500" />
              <span>Fire Detection</span>
            </div>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
              <Thermometer className="mr-3 text-orange-500" />
              <span>Temperature</span>
            </div>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50">
              <Droplet className="mr-3 text-blue-400" />
              <span>Water Sensors</span>
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
              <Toggle enabled={alertNotifications} setEnabled={setAlertNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <span>Email notifications</span>
              <Toggle enabled={emailNotifications} setEnabled={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS notifications</span>
              <Toggle enabled={smsNotifications} setEnabled={setSmsNotifications} />
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
              <Toggle enabled={twoFactor} setEnabled={setTwoFactor} />
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
              <Toggle enabled={darkMode} setEnabled={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-refresh data (1 min)</span>
              <Toggle enabled={autoRefresh} setEnabled={setAutoRefresh} />
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