import React from "react";
import "./Dashboard.css";
import PieChart from "../../assets/MainChart.svg";
import Legends from "../../assets/Legends.svg";
import Vector from "../../assets/Vector.svg";
import Category from "../../assets/category.svg";
import ProductTable from "../../components/DashboardComponents/ProductTable";
import StockData from "../../components/DashboardComponents/StockData";
import GraphSection from "../../components/DashboardComponents/GraphSection";

const Dashboard = () => {
  const products = [
    { id: 1, product: "Mayur Door 80*90 (Ganesgh GT)", stockLeft: 50 },
    { id: 2, product: "Mayur Door 80*89 (Ganesh Coffee)", stockLeft: 30 },
    { id: 3, product: "Leader Laminates (SD)", stockLeft: 20 },
    { id: 4, product: "Indian Door 80*39 (Flower Design)", stockLeft: 15 },
    { id: 5, product: "Kalapatru Door 80*38 (4 panel wood)", stockLeft: 15 },
  ];

  return (
    <section className="upper-dash">
      <div className="summary-graph">
        <div className="summary-sec">
          <StockData label="Stock on hand" value="680" imgSrc={Vector} />
          <StockData label="Total categories" value="4" imgSrc={Category} />
        </div>
        <GraphSection />
      </div>
      <div className="cat-pie-chart">
        <h2>Categories</h2>
        <img id="pieChart" src={PieChart} alt="chart" />
        <img src={Legends} alt="legends" />
      </div>
      <ProductTable title="Low Stock Products" data={products} />
      <ProductTable title="Top Selling Products" data={products} />
    </section>
  );
};

export default Dashboard;
