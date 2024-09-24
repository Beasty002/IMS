import React from "react";
import "./Sales.css";
import SaleTable from "../../components/SalesComponent/SaleTable";

function Sales({ title, TableComponent, products }) {

  return (
    <section>
      <div className="sec-sale-head">
        <div className="left-sale">
          <h1>{title} </h1>
          <input type="date" />
        </div>
        <div className="btn-container">
          <button className="secondary-btn">
            <i class="bx bxs-edit"></i>
            <p className="bx-sale">Edit</p>
          </button>
          <button className="primary-btn">
            <i class="bx bxs-plus-circle"></i>
            <p className="bx-sale">New Entry</p>
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
