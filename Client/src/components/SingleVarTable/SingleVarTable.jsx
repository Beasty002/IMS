import React from "react";

function SingleVarTable() {
  return (
    <div className="brand-item-table single-var">
      <h1>SD</h1>
      <table>
        <thead>
          <tr>
            <th className="table-checkbox">
              <input type="checkbox" />
            </th>
            <th>Code</th>
            <th className="stock-count-single">Stock</th>

            <th className="table-action-container">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="table-checkbox">
              <input type="checkbox" />
            </td>
            <td>1000</td>
            <td>1000</td>

            <td className="table-action-container single-table">
              <div className="action-container">
                <i className="bx bx-edit-alt edit-icon"></i>
                <i className="bx bx-trash del-icon"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SingleVarTable;
