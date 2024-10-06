import React, { useState, useEffect } from "react";
import "./Sales.css";
import { Link } from "react-router-dom";

function Sales({ title, TableComponent, products }) {
  const [dateSetter, setDateSetter] = useState("");

  const handleDateSubmission = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/getSpecificSale",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ day: dateSetter }),
        }
      );
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

  useEffect(() => {
    console.log(dateSetter);
  }, [dateSetter]);

  return (
    <section className="sale-purchase">
      <h1>{title} Summary </h1>
      <div className="sec-sale-head">
        <div className="left-sale">
          <input
            type="date"
            value={dateSetter}
            onChange={(event) => handleDateSubmission(event)}
          />
        </div>
        <div className="btn-container">
          <button className="secondary-btn">
            <i class="bx bxs-edit"></i>
            <p className="bx-sale">Edit</p>
          </button>
          <button className="primary-btn">
            <i class="bx bxs-plus-circle"></i>
            <Link id="cname" to={`/${title.toLowerCase() + "Entry"}`}>
              <p className="bx-sale">New Entry</p>
            </Link>
          </button>
        </div>
      </div>
      <div className="sale-table-export">
        <TableComponent data={products} />
      </div>
    </section>
  );
}

export default Sales;
