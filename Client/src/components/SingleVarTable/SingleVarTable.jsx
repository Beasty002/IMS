import React, { useState } from "react";

function SingleVarTable({ data, onValueChange, categoryName, brandName }) {
  const hasData = data && Object.keys(data).length > 0;

  const [editIndex, setEditIndex] = useState(null);
  const [editableData, setEditableData] = useState(data); // Store editable data

  const handleInputChange = (key, event) => {
    const newValue = event.target.value;
    setEditableData((prevData) => ({
      ...prevData,
      [key]: { ...prevData[key], dfd: newValue }, // Update the editable data
    }));
    onValueChange(key, newValue); // Optional: Notify parent about the change
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleSave = async () => {
    const rowKey = Object.keys(editableData)[editIndex];
    const updatedRowData = editableData[rowKey];

    const payload = {
      rowKey: rowKey,
      updatedData: updatedRowData,
      categoryName: categoryName,
      brandName: brandName,
    };

    console.log(JSON.stringify(payload));
    try {
      const response = await fetch("http://localhost:3000/api/editStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Error saving the data:", response.statusText);
        return;
      }

      // Update the data state with editableData if needed
      onValueChange(rowKey, updatedRowData.dfd); // Update parent state with new value
      setEditIndex(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            Object.entries(editableData).map(([key, value], index) => (
              <tr key={key}>
                <td className="table-checkbox">
                  <input type="checkbox" />
                </td>
                <td>{key}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      className="edit-input"
                      type="number"
                      value={value.dfd !== undefined ? value.dfd : 0}
                      onChange={(e) => handleInputChange(key, e)}
                    />
                  ) : (
                    <span>{value.dfd !== undefined ? value.dfd : 0}</span>
                  )}
                </td>
                <td className="table-action-container single-table">
                  <div className="action-container">
                    {editIndex === index ? (
                      <button className="edit-input" onClick={handleSave}>
                        Save
                      </button>
                    ) : (
                      <i
                        className="bx bx-edit-alt edit-icon"
                        onClick={() => handleEditClick(index)}
                      ></i>
                    )}
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
