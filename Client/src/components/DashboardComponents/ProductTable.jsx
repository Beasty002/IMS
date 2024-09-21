import React from "react";

const ProductTable = ({ title, data }) => (
  <div className="left-table">
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          <th>S.N</th>
          <th>Product</th>
          {title === "Low Stock Products" && <th>Stock Left</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, product, stockLeft }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{product}</td>
            {title === "Low Stock Products" && <td>{stockLeft}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
