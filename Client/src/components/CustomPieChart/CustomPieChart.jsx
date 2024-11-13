import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Function to generate the number of random color as the fetchedPIrChart object
const generateColors = (num) => {
  const colors = [];
  for (let i = 0; i < num; i++) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return colors;
};

// dunnow wtf it did
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomPieChart = ({ pieChartData }) => {

  // kati ota data xa check hanne 
  const COLORS = generateColors(pieChartData.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} id="pieChart">
      <ResponsiveContainer width="100%" >
        <RechartsPieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={190}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {pieChartData.map((entry, index) => (
          <div key={`legend-${index}`} style={{ display: "flex", alignItems: "center", margin: "5px 10px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: "8px",
                borderRadius: "50%",
              }}
            ></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomPieChart;
