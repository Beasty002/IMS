import React, { useEffect, useState } from "react";
import Sales from "../Sales/Sales";
import SaleTable from "../../components/SalesComponent/SaleTable";

function SalesPage() {
  const [salesData, setSalesData] = useState([]);

  const fetchAllSales = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sales", {
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
      setSalesData(data.msg);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSales();
  }, []);

  return (
    <Sales title="Sales" TableComponent={SaleTable} products={salesData} />
  );
}

export default SalesPage;
