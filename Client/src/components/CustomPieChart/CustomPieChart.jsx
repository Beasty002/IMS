import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 33 },
  { name: 'Group B', value: 25 },
  { name: 'Group C', value: 25 },
  { name: 'Group D', value: 17 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomPieChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <RechartsPieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={200}
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </RechartsPieChart>
  </ResponsiveContainer>
);

export default CustomPieChart;
