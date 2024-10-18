import React, { useEffect, useState } from "react";
import Sales from "../Sales/Sales";
import SaleTable from "../../components/SalesComponent/SaleTable";

function SalesPage() {
  const [salesData, setSalesData] = useState([]);

  const [dateSetter, setDateSetter] = useState("");
  const [prevDate, setPrevDate] = useState("");

  useEffect(() => {
    const today = new Date(Date.now());
    const prevDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    const prevFormattedDate = `${prevDay.getFullYear()}-${(
      prevDay.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${prevDay.getDate().toString().padStart(2, "0")}`;

    setPrevDate(prevFormattedDate);
    setDateSetter(formattedDate);
  }, []);

  const fetchAllSales = async (date) => {
    try {
      console.log(JSON.stringify({ day: date, title: "Sales" }));
      const response = await fetch(
        "http://localhost:3000/api/getSpecificSale",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ day: date, title: "Sales" }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      const filteredData = data.msg.filter((item) => item !== null);
      if (data.msg.every((element) => element === null)) {
        fetchAllSales(prevDate);
      } else {
        setSalesData(filteredData || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (dateSetter) {
      fetchAllSales(dateSetter);
    }
  }, [dateSetter]);
  useEffect(() => {
    console.log(salesData);
  }, [salesData]);

  return (
    <Sales
      title="Sales"
      TableComponent={SaleTable}
      products={salesData}
      setSalesData={setSalesData}
    />
  );
}

export default SalesPage;
