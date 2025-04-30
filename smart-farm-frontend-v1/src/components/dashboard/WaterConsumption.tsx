import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WaterConsumption = () => {
  const data = [
    { name: 'Mon', value: 95 },
    { name: 'Tue', value: 85 },
    { name: 'Wed', value: 100 },
    { name: 'Thu', value: 75 },
    { name: 'Fri', value: 90 },
    { name: 'Sat', value: 100 },
    { name: 'Sun', value: 90 }
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Water Consumption</h2>
        <p className="text-sm text-gray-500">Last 7 days of water usage</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              domain={[0, 120]} 
              ticks={[0, 40, 80, 120]} 
              tickFormatter={(value) => `${value}L`}
            />
            <Tooltip 
              formatter={(value) => [`${value}L`, 'Usage']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}
              itemStyle={{
                color: '#22c55e',
                fontWeight: 500
              }}
            />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterConsumption;