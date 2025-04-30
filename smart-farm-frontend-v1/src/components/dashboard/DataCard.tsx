import { ReactNode } from 'react';

type DataCardProps = {
  title: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
};

const DataCard = ({ title, value, subtext, icon, change, trend }: DataCardProps) => {
  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    return trend === 'up' 
      ? 'text-red-500' 
      : trend === 'down' 
        ? 'text-green-500' 
        : 'text-gray-500';
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold">{value}</span>
      </div>
      <div className="flex items-center mt-2">
        {change && (
          <span className={`text-xs ${getTrendColor()} mr-1`}>
            {change}
          </span>
        )}
        {subtext && (
          <span className="text-xs text-gray-500">{subtext}</span>
        )}
      </div>
    </div>
  );
};

export default DataCard;