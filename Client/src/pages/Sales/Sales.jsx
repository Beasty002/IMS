import React from "react";
import "./Sales.css";
import SaleTable from "../../components/SalesComponent/SaleTable";

function Sales() {
  const products = [
    { id: 1, product: "Mayur Door 80*90 (Ganesgh GT)", stockLeft: 50 },
    { id: 2, product: "Mayur Door 80*89 (Ganesh Coffee)", stockLeft: 30 },
    { id: 3, product: "Leader Laminates (SD)", stockLeft: 20 },
    { id: 4, product: "Indian Door 80*39 (Flower Design)", stockLeft: 15 },
    { id: 5, product: "Kalapatru Door 80*38 (4 panel wood)", stockLeft: 15 },
    { id: 6, product: "Creta Plywood 8*4 (6mm)", stockLeft: 20 },
    { id: 7, product: "Asislam laminates 115 (SD)", stockLeft: 40 },
  ];
  return (
    <section>
      <div className="sec-sale-head">
        <div className="left-sale">
          <h1>Sales Summary</h1>
          <input type="date" />
        </div>
        <div className="right-sale">
          <button>
            <i class="bx bxs-edit"></i>
            <p className="bx-sale">Edit</p>
          </button>
          <button>
            <i class="bx bxs-plus-circle"></i>
            <p className="bx-sale">New Entry</p>
          </button>
        </div>
      </div>
      <div className="sale-table-export">
        <SaleTable data={products} />
      </div>
    </section>
  );
}

export default Sales;
