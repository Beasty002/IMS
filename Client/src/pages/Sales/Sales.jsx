import React, { useState, useEffect } from "react";
import "./Sales.css";
import { Link } from "react-router-dom";

function Sales({ title, TableComponent, products }) {
  const [dateSetter, setDateSetter] = useState("");

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
            onChange={(e) => setDateSetter(e.target.value)}
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
