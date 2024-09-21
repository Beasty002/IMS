import React from "react";

const StockData = ({ label, value, imgSrc }) => (
  <div className="sub-stock">
    <div className="stock-data">
      <span>{value}</span>
      <p>{label}</p>
    </div>
    <img src={imgSrc} alt={label} />
  </div>
);

export default StockData;
