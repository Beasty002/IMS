import React, { useEffect } from "react";

function SaleTable({ data = [] }) {
  //  safe access to sQty in case the product is null or undefined
  const totalQuantity = data.reduce(
    (total, product) => total + (product?.sQty || 0),
    0
  );

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <div className="sale-quantity-table">
        <table>
          <thead className="sale-qnt-table">
            <tr>
              <th className="table-sn">S.N</th>
              <th className="sales-table-prod">Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={item?._id || index}>
                <td className="table-sn">{index + 1}</td>
                <td className="sales-table-prod">
                  {item?.sBrand || "N/A"} {item?.sRowLabel || "N/A"} ({" "}
                  {item?.sColLabel || "N/A"} )
                </td>
                <td>{item?.sQty || 0}</td>
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

export default SaleTable;
