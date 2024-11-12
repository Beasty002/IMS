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
  const [allData, setAllData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [colLabel, setColLabel] = useState([]);

  const { fetchBrandData, fetchBrand } = useAuth();
  const { categoryName, brandName } = useParams();

  const enableCustPortal = () => {
    setCustPortal(!custPortal);
  };

  const enableCatPortal = () => {
    setCatPortal(!catPortal);
  };

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

        console.log(data);
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
      console.log(data);
      setAllData(data);
      setTableData(data.matrix);
      setColLabel(data.allColumns);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    console.log(fetchedBdata);
  }, [fetchedBdata]);

  useEffect(() => {
    if (specificId) {
      fetchRespectiveBrandData();
    }
  }, []);

  useEffect(() => {
    if (fetchedBdata && categoryName && brandName) {
      fetchTableData();
    }
  }, [fetchedBdata]);

  useEffect(() => {
    if (tableData) {
      setFilteredData(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    if (searchQuery) {
      console.log(searchQuery);
      const filtered = Object.keys(tableData)
        .filter((rowKey) => {
          if (rowKey.toLowerCase().includes(searchQuery.toLowerCase())) {
            return true;
          }

          return Object.keys(tableData[rowKey]).some((nestedKey) =>
            String(tableData[rowKey][nestedKey])
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        })
        .reduce((obj, key) => {
          obj[key] = tableData[key];
          return obj;
        }, {});
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
  }, [searchQuery, tableData]);

  const handleEditClick = (index) => {
    setEditRowIndex(index);
    setEditableData({ ...tableData });
  };

  const handleDeleteClick = async (rowKey) => {
    try {
      const response = await fetch("http://localhost:3000/api/type", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rowKey: rowKey, brandId: specificId }),
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

  useEffect(() => {
    console.log("YO aauna prne ho", brandName);
  }, [brandName]);

  return (
    <>
      <section>
        <h1>
          {brandName} {categoryName}{" "}
        </h1>
        <section className="brand-list-top mv">
          <div className="search-box">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search items..."
              aria-label="Search input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="btn-container mv">
            <button onClick={enableCustPortal} className="secondary-btn">
              <i className="bx bx-filter-alt"></i>
              Customize Columns
            </button>
            <button onClick={enableCatPortal} className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Type
            </button>
          </div>
        </section>
      </section>

      <section>
        <div className="brand-item-table">
          <table>
            <thead>
              <tr>
                <th>S.N</th>
                <th>
                  {allData.brandRow}/{allData.brandCol}
                </th>
                {colLabel?.map((item) => (
                  <th key={item._id}>{item.column}</th>
                ))}
                <th className="table-action-container">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData &&
                Object.keys(filteredData).map((rowKey, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{rowIndex + 1}</td>
                    <td>{rowKey}</td>
                    {filteredData[rowKey] &&
                      Object.entries(filteredData[rowKey])

                        .filter(([innerKey]) => !innerKey.match(/\s\d+/))
                        .map(([innerKey, value], colIndex) => (
                          <td key={colIndex}>
                            {editRowIndex === rowIndex ? (
                              <input
                                type="text"
                                value={
                                  editableData[rowKey]?.[innerKey] || value
                                }
                                className="edit-input"
                                onChange={(e) =>
                                  handleValueChange(
                                    rowKey,
                                    innerKey,
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              value
                            )}
                          </td>
                        ))}
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
                        <i
                          onClick={() => handleDeleteClick(rowKey)}
                          className="bx bx-trash del-icon"
                        ></i>
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
          specificId={specificId}
          type="item"
          multiVar="true"
        />
      </section>
    </>
  );
}
