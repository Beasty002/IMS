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
  const [topSelling, setTopSelling] = useState([]);
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchLowStock();
  }, []);

  useEffect(() => {
    checkForNewDate();
  }, []);

  useEffect(() => {
    saveReports();
  });

  const saveReports = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/saveReports", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
      } else {
        console.log("error occured");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkForNewDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reportStock", {
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
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    fetchTopSelling();
  }, []);

  const fetchTopSelling = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/topSelling", {
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
      console.log("Top selling ", data);
      setTopSelling(data.topSelling);
    } catch (error) {
      console.error(error);
    }
  };

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
      <ProductTable title="Top Selling Products" data={topSelling} />
    </section>
  );
};

export default Dashboard;
