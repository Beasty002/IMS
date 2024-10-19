import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SingleVarTable({
  // onValueChange,
  specificId,
  fetchSingleVarData,
  selectedKey,
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editableData, setEditableData] = useState({});
  // const [typeId, setTypeId] = useState(null);

  useEffect(() => {
    if (fetchSingleVarData) {
      console.log(fetchSingleVarData);
    }
  }, [fetchSingleVarData]);

  useEffect(() => {
    console.log(selectedKey);
  }, [selectedKey]);

  const { categoryName, brandName } = useParams();
  useEffect(() => {
    if (categoryName && brandName) {
      console.log(categoryName, brandName);
    }
  }, [categoryName, brandName]);

  useEffect(() => {
    if (selectedKey) {
      console.log("Yo ho hai", selectedKey);
    }
  }, [selectedKey]);

  // useEffect(() => {
  //   if (fetchSingleVarData) {
  //     console.log("Fetch yei ho hai", fetchSingleVarData);
  //     setTypeId(fetchSingleVarData.typeId);
  //     console.log(typeId);
  //   }
  // }, [fetchSingleVarData]);

  useEffect(() => {
    if (fetchSingleVarData && fetchSingleVarData.codeStocks) {
      setEditableData(fetchSingleVarData.codeStocks);
    }
  }, [fetchSingleVarData]);

  const handleInputChange = (key, event) => {
    const newValue = event.target.value;
    setEditableData((prevData) => ({
      ...prevData,
      [key]: newValue,
    }));
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleSave = async () => {
    const rowKey = Object.keys(editableData)[editIndex];
    // console.log(rowKey);
    const updatedRowData = editableData[rowKey];
    // console.log("Updated yo ho hai", updatedRowData);
    console.log(categoryName);

    const payload = {
      rowKey: rowKey,
      updatedData: updatedRowData,
      brandId: specificId,
      categoryName: categoryName,
      brandName: brandName,
      typeName: selectedKey,
    };

    console.log("Saving payload:", JSON.stringify(payload));
    try {
      const response = await fetch("http://localhost:3000/api/editStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("Error saving the data:", response.statusText);
        return;
      }

      // onValueChange(rowKey, updatedRowData);
      console.log(data);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="brand-item-table single-var">
      <h4
        style={{
          color: "red",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Dont edit when stock is 0, Purchase stock instead
      </h4>
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
          {fetchSingleVarData && fetchSingleVarData.codeStocks ? (
            Object.entries(editableData).map(([key, value], index) => (
              <tr key={index}>
                <td className="table-checkbox">
                  <input type="checkbox" />
                </td>
                <td>{key}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      className="edit-input"
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(key, e)}
                    />
                  ) : (
                    <span>{value}</span>
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
                        className={`bx bx-edit-alt edit-icon ${
                          value === 0 ? "disabled" : ""
                        }}`}
                        onClick={() => {
                          if (value !== 0) {
                            handleEditClick(index);
                          }
                        }}
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
