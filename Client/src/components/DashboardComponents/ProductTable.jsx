import React from "react";

const ProductTable = ({ title, data }) => (
  <div className="left-table">
    <h2 className="dash-title">{title}</h2>
    <table>
      <thead>
        <tr>
          <th className="table-sn">S.N</th>
          <th>Product</th>
          {title === "Low Stock Products" && <th className="stk-left">Stock Left</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, product, stockLeft }) => (
          <tr key={id}>
            <td className="table-sn">{id}</td>
            <td>{product}</td>
            {title === "Low Stock Products" && <td className="stk-left">{stockLeft}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
