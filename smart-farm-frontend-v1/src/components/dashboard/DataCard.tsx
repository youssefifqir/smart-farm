import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type DataCardProps = {
  title: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  type?: 'temperature' | 'humidity' | 'fire' | 'rain';
  isAlert?: boolean;
};

const DataCard = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  change, 
  trend, 
  type = 'default',
  isAlert = false 
}: DataCardProps) => {
  
  // Extract numeric value from string
  const extractNumericValue = (valueStr: string): number => {
    const match = valueStr.match(/(-?\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };



  // Get fire detection colors
  const getFireColors = (valueStr: string) => {
    const isFiring = valueStr.toLowerCase().includes('fire') || 
                     valueStr.toLowerCase().includes('detected') ||
                     valueStr.toLowerCase().includes('alert') ||
                     valueStr.toLowerCase().includes('danger') ||
                     valueStr.includes('🔥') ||
                     (extractNumericValue(valueStr) === 1 && (valueStr.includes('1') || valueStr.toLowerCase().includes('yes')));
    
    if (isFiring) {
      return {
        bg: 'bg-gradient-to-br from-red-400 to-red-500 border-2 border-red-600',
        iconBg: 'bg-red-500 text-white',
        titleColor: 'text-white',
        valueColor: 'text-white font-extrabold',
        subtextColor: 'text-red-100',
        animation: 'animate-pulse'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300',
        iconBg: 'bg-green-200 text-green-700',
        titleColor: 'text-green-800',
        valueColor: 'text-green-900 font-bold',
        subtextColor: 'text-green-600',
        animation: ''
      };
    }
  };



  // Color schemes based on sensor type and alert status
  const getCardColors = () => {
    if (isAlert) {
      return {
        bg: 'bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400',
        iconBg: 'bg-red-200 text-red-700',
        titleColor: 'text-red-900',
        valueColor: 'text-red-900 font-extrabold',
        subtextColor: 'text-red-700 font-semibold',
        animation: 'animate-pulse'
      };
    }

    const numericValue = extractNumericValue(value);

    switch (type) {
      case 'temperature':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200',
          iconBg: 'bg-orange-100 text-orange-600',
          titleColor: 'text-orange-800',
          valueColor: 'text-orange-900',
          subtextColor: 'text-orange-600',
          animation: ''
        };
      case 'humidity':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200',
          iconBg: 'bg-blue-100 text-blue-600',
          titleColor: 'text-blue-800',
          valueColor: 'text-blue-900',
          subtextColor: 'text-blue-600',
          animation: ''
        };
      case 'fire':
        return getFireColors(value);
      case 'rain':
        // Check if it's raining based on value content
        const isRaining = value.toLowerCase().includes('rain') || value.includes('🌧️');
        if (isRaining) {
          return {
            bg: 'bg-gradient-to-br from-sky-100 to-blue-100 border-2 border-sky-300',
            iconBg: 'bg-sky-200 text-sky-700',
            titleColor: 'text-sky-800',
            valueColor: 'text-sky-900',
            subtextColor: 'text-sky-600',
            animation: ''
          };
        } else {
          return {
            bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200',
            iconBg: 'bg-yellow-100 text-yellow-600',
            titleColor: 'text-yellow-800',
            valueColor: 'text-yellow-900',
            subtextColor: 'text-yellow-600',
            animation: ''
          };
        }
      default:
        return {
          bg: 'bg-white border border-gray-100',
          iconBg: 'text-gray-400',
          titleColor: 'text-gray-500',
          valueColor: 'text-gray-900',
          subtextColor: 'text-gray-500',
          animation: ''
        };
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    return trend === 'up' 
      ? 'text-green-500' 
      : trend === 'down' 
        ? 'text-red-500' 
        : 'text-gray-500';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} className="text-green-500" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-500" />;
      default:
        return <Minus size={14} className="text-gray-400" />;
    }
  };

  const colors = getCardColors();

  return (
    <div className={`p-5 rounded-xl shadow-sm transition-all hover:shadow-lg ${colors.bg} ${colors.animation || ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-sm font-medium ${colors.titleColor}`}>{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className={`text-2xl font-semibold ${colors.valueColor}`}>{value}</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center">
          {subtext && (
            <span className={`text-xs ${colors.subtextColor}`}>{subtext}</span>
          )}
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;