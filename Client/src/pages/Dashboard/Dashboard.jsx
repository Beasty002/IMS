import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import PieChart from "../../assets/MainChart.svg";
import Legends from "../../assets/Legends.svg";
import Vector from "../../assets/Vector.svg";
import Category from "../../assets/category.svg";
import ProductTable from "../../components/DashboardComponents/ProductTable";
import StockData from "../../components/DashboardComponents/StockData";
import GraphSection from "../../components/DashboardComponents/GraphSection";
import { useAuth } from "../../customHooks/useAuth";

const Dashboard = () => {
  const { categoryLength, fetchCategory } = useAuth();
  const [lowStock, setLowStock] = useState([]);
  const [stock, setStock] = useState("");
  const products = [
    { id: 1, product: "Mayur Door 80*90 (Ganesgh GT)", stockLeft: 50 },
    { id: 2, product: "Mayur Door 80*89 (Ganesh Coffee)", stockLeft: 30 },
    { id: 3, product: "Leader Laminates (SD)", stockLeft: 20 },
    { id: 4, product: "Indian Door 80*39 (Flower Design)", stockLeft: 15 },
    { id: 5, product: "Kalapatru Door 80*38 (4 panel wood)", stockLeft: 15 },
  ];

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/checkStock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      setLowStock(data.lowStock);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(lowStock);
  }, [lowStock]);

  const fetchTotalStock = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/stock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      console.log("Stock yo hai", data);
      setStock(data.msg);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTotalStock();
  }, []);

  return (
    <section className="upper-dash">
      <div className="summary-graph">
        <div className="summary-sec">
          <StockData
            label="Stock on hand"
            value={stock || "N/A"}
            imgSrc={Vector}
          />
          <StockData
            label="Total categories"
            value={categoryLength || "N/A"}
            imgSrc={Category}
          />
        </div>
        <GraphSection />
      </div>
      <div className="cat-pie-chart">
        <h2 className="dash-title">Categories</h2>
        <img id="pieChart" src={PieChart} alt="chart" />
        <img src={Legends} alt="legends" />
      </div>
      <ProductTable title="Low Stock Products" data={lowStock} />
      <ProductTable title="Top Selling Products" data={products} />
    </section>
  );
};

export default Dashboard;
