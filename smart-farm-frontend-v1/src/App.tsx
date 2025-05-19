import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import WaterManagement from './pages/WaterManagement';
import PlantHealth from './pages/PlantHealth';
import DiseaseDetection from './pages/DiseaseDetection';
import Predictions from './pages/Predictions';
import History from './pages/History';
import Settings from './pages/Settings';
import RainSensors from './pages/RainSensors';
import FireDetection from './pages/FireDetection';
import Temperature from './pages/Temperature';
import WaterSensors from './pages/WaterSensors';
import Profitability from './pages/Profitability';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/water-management" element={<WaterManagement />} />
          <Route path="/plant-health" element={<PlantHealth />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rain-sensors" element={<RainSensors />} />
          <Route path="/fire-detection" element={<FireDetection />} />
          <Route path="/temperature" element={<Temperature />} />
          <Route path="/water-sensors" element={<WaterSensors />} />
          <Route path="/profitabilityDashboard" element={<Profitability />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;