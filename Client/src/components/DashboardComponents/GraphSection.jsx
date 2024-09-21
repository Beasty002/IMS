import React from "react";
import Sales from "../../assets/EllipseNode.svg";
import Purchase from "../../assets/LegendNode.svg";
import Graph from "../../assets/Chart&Axis.svg";

const GraphSection = () => (
  <div className="graph">
    <div className="graph-head">
      <h2>Sales and Purchase</h2>
      <select name="timeline">
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>
    </div>
    <div className="data-represent">
      <span className="single-represent">
        <img src={Sales} alt="sales" />
        <p>Sales</p>
      </span>
      <span className="single-represent">
        <img src={Purchase} alt="purchase" />
        <p>Purchases</p>
      </span>
    </div>
    <div className="graph-data">
      <img src={Graph} alt="graph" />
    </div>
  </div>
);

export default GraphSection;
