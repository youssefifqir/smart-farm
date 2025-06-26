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
import StorageManagement from './pages/storage/StorageManagement';
import ProductManagement from './pages/storage/ProductManagement';
import CategoryManagement from './pages/storage/CategoryManagement';
import FournissManagement from './pages/storage/FournissManagement';
import ClientsManagement from './pages/storage/ClientsManagement';
import PurchaseManagement from './pages/storage/PurchaseManagement';
import SaleManagement from './pages/storage/SaleManagement';
import EmployeManagement from './pages/storage/EmployeManagement';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/storage-management" element={<StorageManagement />}>
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="suppliers" element={<FournissManagement />} />
            <Route path="clients" element={<ClientsManagement />} />
            <Route path="Purchase" element={<PurchaseManagement />} />
            <Route path="Sale" element={<SaleManagement/>} />
            <Route path="Employee" element={<EmployeManagement />} />
          </Route>

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;