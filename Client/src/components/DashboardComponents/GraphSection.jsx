import React, { useEffect, useState } from "react";

import Graph from "../Graph/Graph";

const GraphSection = () => {
  const [fetchData, setFetchData] = useState([]);

  const getSelectedSales = async (reportType) => {
    console.log(reportType);
    try {
      const response = await fetch(
        `http://localhost:3000/api/get${reportType}Sales`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      console.log(data);
      setFetchData(data.graphData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSelectedSales("Daily");
  }, []);

  return (
    <div className="graph">
      <div className="graph-head">
        <h2 className="dash-title">Sales & Purchase</h2>
        <select
          onChange={(e) => getSelectedSales(e.target.value)}
          name="timeline"
        >
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="graph-data">
        <Graph fetchData={fetchData} />
      </div>
    </div>
  );
};

export default GraphSection;
