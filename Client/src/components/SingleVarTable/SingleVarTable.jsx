import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DelPop from "../../popups/DelPop/DelPop";
import Rename from "../../popups/Rename/Rename";

function SingleVarTable({
  specificId,
  fetchSingleVarData,
  selectedKey,
  searchTerm,
  codeDropDown,
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editableData, setEditableData] = useState({});

  const { categoryName, brandName } = useParams();

  const [protalOn, setPortalOn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [enableDel, setEnableDel] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);

  useEffect(() => {
    if (fetchSingleVarData && fetchSingleVarData.codeStocks) {
      setEditableData(fetchSingleVarData.codeStocks);
    }
  }, [fetchSingleVarData]);

  useEffect(() => {
    console.log("Yo ho hai specifc id", specificId);
  });

  useEffect(() => {
    console.log(selectedKey, specificId, codeDropDown);
  }, [selectedKey, specificId, codeDropDown]);

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
    const updatedRowData = editableData[rowKey];

    const payload = {
      rowKey: rowKey,
      updatedData: updatedRowData,
      brandId: specificId,
      categoryName: categoryName,
      brandName: brandName,
      typeName: selectedKey,
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
      const data = await response.json();

      if (!response.ok) {
        console.error("Error saving the data:", response.statusText);
        return;
      }
      console.log(data);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const filteredData = Object.entries(editableData).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log(editableData);
  }, [editableData]);

  const handleDeleteClick = async (rowKey, rowValue) => {
    try {
      console.log(
        JSON.stringify({
          selectedKey: selectedKey,
          itemName: rowKey,
          rowValue: rowValue,
          brandId: specificId,
        })
      );
      const response = await fetch("http://localhost:3000/api/column", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedKey: selectedKey,
          itemName: rowKey,
          rowValue: rowValue,
          brandId: specificId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const togglePortal = () => {
    setPortalOn(!protalOn);
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="brand-item-table single-var">
      <div className="setting-info">
        <h1 className="table-title">{selectedKey}</h1>
        <div className="portal-setting">
          {protalOn ? (
            <i onClick={togglePortal} className="fa-solid fa-gear fa-spin"></i>
          ) : (
            <i onClick={togglePortal} className="fa-solid fa-gear"></i>
          )}

          {dropdownVisible && (
            <div className="list-setting">
              <ul>
                <li
                  onClick={() => {
                    setEnableEdit(!enableEdit);
                    setPortalOn(!protalOn);
                    setDropdownVisible(!dropdownVisible);
                  }}
                >
                  <i class="fa-solid fa-pen-to-square"></i> <p>Edit Type</p>
                </li>
                <li
                  onClick={() => {
                    setEnableDel(!enableDel);
                    setPortalOn(!protalOn);
                    setDropdownVisible(!dropdownVisible);
                  }}
                >
                  <i className="bx bx-trash del-icon"></i>
                  <p> Delete Type</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Code</th>
            <th className="stock-count-single">Stock</th>
            <th className="table-action-container">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fetchSingleVarData || 0).length > 0 ? (
            filteredData.map(([key, value], index) => (
              <tr key={index}>
                <td className="table-checkbox">
                  <td>{index + 1}</td>
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
                        }`}
                        onClick={() => {
                          if (value !== 0) {
                            handleEditClick(index);
                          }
                        }}
                      ></i>
                    )}
                    <i
                      onClick={() => handleDeleteClick(key, value)}
                      className="bx bx-trash del-icon"
                    ></i>
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
      <DelPop
        isOpen={enableDel}
        selectedKey={selectedKey}
        codeDropDown={codeDropDown}
        onClose={() => setEnableDel(!enableDel)}
        type={"type"}
      />

      <Rename
        isOpen={enableEdit}
        selectedKey={selectedKey}
        codeDropDown={codeDropDown}
        onClose={() => setEnableEdit(!enableEdit)}
      />
    </div>
  );
}

export default SingleVarTable;
