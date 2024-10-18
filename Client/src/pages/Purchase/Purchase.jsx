import React, { useEffect, useState } from "react";
import Sales from "../Sales/Sales";
import PurchaseTable from "../../components/PurchaseTable/PurchaseTable";

function Purchase() {
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
      console.log(JSON.stringify({ day: date, title: "Purchases" }));
      const response = await fetch(
        "http://localhost:3000/api/getSpecificSale",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ day: date, title: "Purchases" }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        fetchAllSales(prevDate);
        return;
      }
      console.log(data);
      setSalesData(data.msg);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (dateSetter) {
      fetchAllSales(dateSetter);
    }
  }, [dateSetter]);

  // const purchaseList = [
  //   { id: 1, product: "Mayur Door 80*90 (Ganesgh GT)", stockLeft: 50 },
  //   { id: 2, product: "Mayur Door 80*89 (Ganesh Coffee)", stockLeft: 30 },
  //   { id: 3, product: "Sulav Laminates (SD)", stockLeft: 20 },
  //   { id: 4, product: "Indian Door 80*39 (Flower Design)", stockLeft: 15 },
  //   { id: 5, product: "Kalapatru Door 80*38 (4 panel wood)", stockLeft: 15 },
  //   { id: 6, product: "Creta Plywood 8*4 (6mm)", stockLeft: 20 },
  //   { id: 7, product: "Asislam laminates 115 (SD)", stockLeft: 40 },
  // ];
  return (
    <Sales
      title="Purchases"
      TableComponent={PurchaseTable}
      products={salesData}
      setSalesData={setSalesData}

    />
  );
}

export default Purchase;
