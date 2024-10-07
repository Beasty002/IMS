import React from "react";
function SingleVarTable({ data }) {
  const hasData = data && Object.keys(data).length > 0;

  return (
    <div className="brand-item-table single-var">
      <h1>{hasData ? "Brand Data" : "No Data Available"}</h1>
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
          {hasData ? (
            Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td className="table-checkbox">
                  <input type="checkbox" />
                </td>
                <td>{key}</td>
                <td>{value.dfd !== undefined ? value.dfd : 0}</td>
                <td className="table-action-container single-table">
                  <div className="action-container">
                    <i className="bx bx-edit-alt edit-icon"></i>
                    <i className="bx bx-trash del-icon"></i>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SingleVarTable;
