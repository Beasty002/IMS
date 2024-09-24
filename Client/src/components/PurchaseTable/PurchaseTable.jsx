import React, { useEffect } from "react";

function PurchaseTable({ data }) {
  // 0 is initial value and total is callback and product is var represnting the items inside the data
  // simply added all the stockLeft attribute inside the data
  const totalQuantity = data.reduce(
    (total, product) => total + product.stockLeft,
    0
  );

  return (
    <>
      <div className="sale-quantity-table">
        <table>
          <thead className="sale-qnt-table">
            <tr>
              <th className="table-sn">S.N</th>
              <th className="sales-table-prod">Product</th>
              <th >Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td className="sales-table-prod">{item.product}</td>
                <td>{item.stockLeft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-calculate">
        <span>Total Quantity:</span>
        <span>{totalQuantity}</span>
      </div>
    </>
  );
}

export default PurchaseTable;
