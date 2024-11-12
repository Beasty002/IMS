import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph = ({ fetchData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={fetchData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="soldQty"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
          dot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="purchaseQty"
          stroke="#f26d6d"
          fill="#f26d6d"
          fillOpacity={0.3}
          dot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Graph;
