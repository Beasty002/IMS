import React, { useState, useEffect } from "react";
import "./MulVarList.css";
import CustomizeCol from "../../popups/CustomizeCol/CustomizeCol";
import AddCat from "../../popups/AddCat/AddCat";
import { useParams } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";

export default function MulVarList() {
  const [custPortal, setCustPortal] = useState(false);
  const [catPortal, setCatPortal] = useState(false);
  const [specificId, setSpecificId] = useState();
  const [fetchedBdata, setFetchedBdata] = useState({});
  const [tableData, setTableData] = useState({});
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editableData, setEditableData] = useState({});

  const { fetchBrandData, fetchBrand } = useAuth();
  const { categoryName, brandName } = useParams();

  const enableCustPortal = () => {
    setCustPortal(!custPortal);
  };

  const enableCatPortal = () => {
    setCatPortal(!catPortal);
  };

  useEffect(() => {
    if (categoryName) {
      fetchBrandData(categoryName);
    }
  }, [categoryName]);

  useEffect(() => {
    if (fetchBrand && fetchBrand.length > 0) {
      const requiredId = fetchBrand.find(
        (item) => item.brandName === brandName
      );
      if (requiredId) {
        setSpecificId(requiredId._id);
      }
    }
  }, [fetchBrand, brandName]);

  const fetchRespectiveBrandData = async () => {
    if (specificId) {
      try {
        const response = await fetch("http://localhost:3000/api/getLabels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brandId: specificId }),
        });

        const data = await response.json();
        if (!response.ok) {
          return;
        }
        setFetchedBdata(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cat: categoryName,
          brand: brandName,
        }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setTableData(data.matrix);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    if (specificId) {
      fetchRespectiveBrandData();
    }
  }, [specificId]);

  useEffect(() => {
    if (fetchedBdata && categoryName && brandName) {
      fetchTableData();
    }
  }, [fetchedBdata]);

  useEffect(() => {
    if (tableData) {
      console.log(tableData);
    }
  }, [tableData]);

  const handleEditClick = (index) => {
    setEditRowIndex(index);
    setEditableData({ ...tableData });
  };

  const handleValueChange = (rowKey, colKey, value) => {
    const updatedTableData = { ...editableData };
    updatedTableData[rowKey][colKey] = value;
    setEditableData(updatedTableData);
  };

  const handleSave = async () => {
    const rowKey = Object.keys(editableData)[editRowIndex];
    const updatedRowData = editableData[rowKey];

    const payload = {
      rowKey: rowKey,
      updatedData: updatedRowData,
      categoryName: categoryName,
      brandName: brandName,
      brandId: specificId,
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

      setTableData(editableData);
      setEditRowIndex(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (specificId) {
    console.log(specificId);
  }

  return (
    <>
      <section>
        <h1>Mayur Plywoods</h1>
        <section className="brand-list-top mv">
          <div className="search-box">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search items..."
              aria-label="Search input"
            />
          </div>
          <div className="btn-container mv">
            <button onClick={enableCustPortal} className="secondary-btn">
              <i className="bx bx-filter-alt"></i>
              Customize Columns
            </button>
            <button onClick={enableCatPortal} className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Brand
            </button>
          </div>
        </section>
      </section>

      <section>
        <div className="brand-item-table">
          <table>
            <thead>
              <tr>
                <th className="table-checkbox">
                  <input type="checkbox" />
                </th>
                <th>
                  {fetchedBdata.rowLabel}/{fetchedBdata.colLabel}
                </th>
                {tableData &&
                  Object.keys(tableData).length > 0 &&
                  Object.keys(Object.values(tableData)[0]).map(
                    (colName, index) => <th key={index}>{colName}</th>
                  )}
                <th className="table-action-container">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                Object.keys(tableData).map((rowKey, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="table-checkbox">
                      <input type="checkbox" />
                    </td>
                    <td>{rowKey}</td>
                    {tableData[rowKey] &&
                      Object.entries(tableData[rowKey]).map(
                        ([colKey, value], colIndex) => (
                          <td key={colIndex}>
                            {editRowIndex === rowIndex ? (
                              <input
                                type="text"
                                value={editableData[rowKey][colKey]}
                                className="edit-input"
                                onChange={(e) =>
                                  handleValueChange(
                                    rowKey,
                                    colKey,
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              value
                            )}
                          </td>
                        )
                      )}
                    <td className="table-action-container">
                      <div className="action-container">
                        {editRowIndex === rowIndex ? (
                          <button className="edit-input" onClick={handleSave}>
                            Save
                          </button>
                        ) : (
                          <i
                            className="bx bx-edit-alt edit-icon"
                            onClick={() => handleEditClick(rowIndex)}
                          ></i>
                        )}
                        <i className="bx bx-trash del-icon"></i>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <CustomizeCol
          isOpen={custPortal}
          onClose={enableCustPortal}
          specificId={specificId}
        />
        <AddCat
          isOpen={catPortal}
          onClose={enableCatPortal}
          type="item"
          multiVar="true"
          specificId={specificId}
        />
      </section>
    </>
  );
}
