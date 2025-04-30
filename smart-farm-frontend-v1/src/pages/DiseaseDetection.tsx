import { useState } from 'react';
import { Upload, FileText, History, AlertTriangle, CheckCircle } from 'lucide-react';

const DiseaseDetection = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle the dropped files here
  };

  const renderUpload = () => (
    <div>
      <h2 className="text-lg font-semibold mb-2">Upload Plant Image</h2>
      <p className="text-sm text-gray-500 mb-6">
        Upload an image of your plant to detect diseases and get treatment recommendations.
      </p>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload
            className={`w-12 h-12 mb-4 ${
              dragActive ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <p className="text-xl font-medium text-gray-700 mb-2">
            Drag & drop plant image
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Upload an image of your plant to detect diseases and get treatment
            recommendations. Supported formats: JPEG, PNG, WebP.
          </p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Select Image
          </button>
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Predictions</h2>
        <div className="space-y-4">
          {[
            {
              image: 'tomato_leaf.jpg',
              prediction: 'Late Blight',
              confidence: '95%',
              status: 'high',
              date: '2024-03-15'
            },
            {
              image: 'cucumber_plant.jpg',
              prediction: 'Healthy',
              confidence: '98%',
              status: 'healthy',
              date: '2024-03-14'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    {item.prediction}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'healthy' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.confidence}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Analyzed on {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Detection History</h2>
        <div className="space-y-4">
          {[
            {
              date: '2024-03-15 14:30',
              plant: 'Tomato Plant',
              disease: 'Late Blight',
              status: 'Active',
              severity: 'High'
            },
            {
              date: '2024-03-14 09:15',
              plant: 'Cucumber',
              disease: 'None Detected',
              status: 'Resolved',
              severity: 'None'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                {item.status === 'Active' ? (
                  <AlertTriangle className="text-red-500" size={20} />
                ) : (
                  <CheckCircle className="text-green-500" size={20} />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{item.plant}</h3>
                  <p className="text-sm text-gray-500">{item.disease}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{item.date}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'Active'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return renderUpload();
      case 'predictions':
        return renderPredictions();
      case 'history':
        return renderHistory();
      default:
        return renderUpload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Plant Disease Detection</h1>
        <p className="text-gray-600">Upload plant images to detect diseases and get treatment recommendations.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {[
              { name: 'Image Upload', icon: <Upload size={18} />, id: 'upload' },
              { name: 'AI Predictions', icon: <FileText size={18} />, id: 'predictions' },
              { name: 'Detection History', icon: <History size={18} />, id: 'history' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-4 text-sm font-medium border-b-2 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
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

export default DiseaseDetection;