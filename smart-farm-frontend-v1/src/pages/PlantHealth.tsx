import { useState } from 'react';
import { AlertTriangle, CheckCircle, Leaf, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Disease = {
  crop: string;
  disease: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  symptoms: string;
  recommendation: string;
};

type Detection = {
  disease: string;
  location: string;
  status: 'Moderate' | 'Resolved';
};

const PlantHealth = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const diseases: Disease[] = [
    {
      crop: 'Tomatoes',
      disease: 'Powdery Mildew',
      riskLevel: 'Moderate',
      symptoms: 'White powdery spots on leaves and stems',
      recommendation: 'Apply fungicide and reduce humidity'
    },
    {
      crop: 'Cucumbers',
      disease: 'Leaf Spot',
      riskLevel: 'Low',
      symptoms: 'Brown spots on leaves',
      recommendation: 'Monitor closely, treatment applied recently'
    },
    {
      crop: 'Peppers',
      disease: 'Blossom End Rot',
      riskLevel: 'High',
      symptoms: 'Dark, sunken areas at the blossom end of fruit',
      recommendation: 'Adjust calcium levels and watering schedule'
    }
  ];

  const recentDetections: Detection[] = [
    {
      disease: 'Powdery Mildew',
      location: 'Detected on tomato plants in Zone C',
      status: 'Moderate'
    },
    {
      disease: 'Leaf Spot',
      location: 'Treatment successful on cucumber plants',
      status: 'Resolved'
    }
  ];

  const healthData = [
    { time: '00:00', health: 95 },
    { time: '04:00', health: 92 },
    { time: '08:00', health: 88 },
    { time: '12:00', health: 90 },
    { time: '16:00', health: 93 },
    { time: '20:00', health: 91 }
  ];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Plant Health Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Active Issues</h2>
          <div className="space-y-4">
            {recentDetections.map((detection, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-100">
                {detection.status === 'Moderate' ? (
                  <AlertTriangle className="text-yellow-500 mt-0.5" size={20} />
                ) : (
                  <CheckCircle className="text-green-500 mt-0.5" size={20} />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{detection.disease}</h3>
                  <p className="text-sm text-gray-500">{detection.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Health Metrics</h2>
          <div className="space-y-4">
            {[
              { name: 'Overall Health', value: '92%', trend: 'stable' },
              { name: 'Growth Rate', value: 'Normal', trend: 'up' },
              { name: 'Nutrient Levels', value: 'Optimal', trend: 'stable' }
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <Activity className="text-gray-400 mr-3" size={20} />
                  <span className="font-medium text-gray-700">{metric.name}</span>
                </div>
                <span className="text-green-600 font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiseasePredictions = () => (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Disease</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {diseases.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.crop}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.disease}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeColor(item.riskLevel)}`}>
                    {item.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.symptoms}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCropStatus = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          name: 'Tomatoes',
          health: '85%',
          status: 'Good',
          issues: 'Minor pest damage',
          lastInspected: '2 hours ago'
        },
        {
          name: 'Cucumbers',
          health: '92%',
          status: 'Excellent',
          issues: 'None',
          lastInspected: '1 hour ago'
        },
        {
          name: 'Peppers',
          health: '78%',
          status: 'Fair',
          issues: 'Nutrient deficiency',
          lastInspected: '3 hours ago'
        }
      ].map((crop, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
            <Leaf className="text-green-500" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Health Score</span>
              <span className="font-medium text-gray-900">{crop.health}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-gray-900">{crop.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issues</span>
              <span className="font-medium text-gray-900">{crop.issues}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Inspected</span>
              <span className="font-medium text-gray-900">{crop.lastInspected}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'disease predictions':
        return renderDiseasePredictions();
      case 'crop status':
        return renderCropStatus();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Plant Health</h1>
        <p className="text-gray-600">Monitor plant health and disease predictions.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {['Overview', 'Disease Predictions', 'Crop Status'].map((tab) => (
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

export default PlantHealth;