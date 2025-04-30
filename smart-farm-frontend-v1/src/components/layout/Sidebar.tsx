import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cloud, Droplets, Leaf, AlertCircle, Settings, CloudRain, Flame, Thermometer, Droplet as WaterDroplet } from 'lucide-react';
import { ReactNode } from 'react';

type SidebarProps = {
  isOpen: boolean;
};

type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  isOpen: boolean;
};

const NavItem = ({ to, icon, label, isOpen }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-gray-700 transition-colors duration-200 rounded-lg
        ${isActive ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}
      `}
    >
      <div className="flex items-center">
        <span className="text-lg">{icon}</span>
        {isOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
      </div>
    </NavLink>
  );
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-10 flex flex-col bg-white border-r shadow-sm transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'} md:translate-x-0 -translate-x-full
        ${isOpen ? 'md:translate-x-0' : 'md:translate-x-0'}
      `}
    >
      <div className={`flex items-center p-4 ${!isOpen && 'justify-center'}`}>
        <div className="bg-green-500 text-white p-1.5 rounded">
          <Leaf size={20} />
        </div>
        {isOpen && <span className="ml-2 text-lg font-bold text-gray-800">Smart Farm</span>}
      </div>
      
      <div className="flex-1 px-3">
        <div className="pt-3">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/weather" icon={<Cloud size={20} />} label="Weather" isOpen={isOpen} />
          <NavItem to="/water-management" icon={<Droplets size={20} />} label="Water Management" isOpen={isOpen} />
          <NavItem to="/plant-health" icon={<Leaf size={20} />} label="Plant Health" isOpen={isOpen} />
          <NavItem to="/disease-detection" icon={<AlertCircle size={20} />} label="Disease Detection" isOpen={isOpen} />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
        </div>
        
        <div className="pt-5">
          {isOpen && <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Sensors</div>}
          <NavItem to="/rain-sensors" icon={<CloudRain size={20} />} label="Rain Sensors" isOpen={isOpen} />
          <NavItem to="/fire-detection" icon={<Flame size={20} />} label="Fire Detection" isOpen={isOpen} />
          <NavItem to="/temperature" icon={<Thermometer size={20} />} label="Temperature" isOpen={isOpen} />
          <NavItem to="/water-sensors" icon={<WaterDroplet size={20} />} label="Water Sensors" isOpen={isOpen} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;