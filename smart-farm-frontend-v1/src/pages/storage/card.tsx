import React from 'react';

type CardProps = {
  title: string;
  value: number;
  color: 'green' | 'brown';
};

const Card: React.FC<CardProps> = ({ title, value, color }) => {
  const colorMap: Record<'green' | 'brown', string> = {
    green: '#22c55e',   // correspond à bg-green-500
    brown: '#D2691E',   // chocolat
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold" style={{ color: colorMap[color] }}>
        {value.toLocaleString()} MAD
      </p>
    </div>
  );
};

export default Card;
