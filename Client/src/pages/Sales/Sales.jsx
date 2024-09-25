import React, { useState } from "react";
import "./Sales.css";
import SaleTable from "../../components/SalesComponent/SaleTable";
import SaleEntry from "../../popups/SaleEntry/SaleEntry";

function Sales({ title, TableComponent, products }) {
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  const enableEntry = () => {
    setIsEntryOpen(!isEntryOpen);
  };

  return (
    <section className="sale-purchase">
      <h1>{title} </h1>
      <div className="sec-sale-head">
        <div className="left-sale">
          <input type="date" />
        </div>
        <div className="btn-container">
          <button className="secondary-btn">
            <i class="bx bxs-edit"></i>
            <p className="bx-sale">Edit</p>
          </button>
          <button onClick={enableEntry} className="primary-btn">
            <i class="bx bxs-plus-circle"></i>
            <p className="bx-sale">New Entry</p>
          </button>
        </div>
      </div>
      <div className="sale-table-export">
        <TableComponent data={products} />
      </div>
      <SaleEntry isOpen={isEntryOpen} onClose={enableEntry} />
    </section>
  );
}

export default Sales;
