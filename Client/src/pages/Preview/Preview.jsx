import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Preview.css";

function Preview() {
  const [totalFetchData, setTotalFetchData] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedItems = [], selectedTitles = [] } = location.state || {};
  const [matrixKey, setMatrixKey] = useState([]);
  const [singleVarFetch, setSingleVarFetch] = useState([]);

  const fetchDataForSelectedItems = async () => {
    setIsLoading(true);
    try {
      const allData = await Promise.all(
        selectedItems.map(async (item, index) => {
          const response = await fetch("http://localhost:3000/api/report", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ brandId: item }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(response.statusText);

          return { data, title: selectedTitles[index] || "Unnamed Report" };
        })
      );
      setTotalFetchData(allData); 
      setMatrixKey(allData.length ? Object.keys(allData[0].data.matrix) : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItems.length > 0) fetchDataForSelectedItems();
  }, [selectedItems]);

  useEffect(() => {
    const fetchSingleData = async () => {
      const fetchedData = await Promise.all(
        matrixKey.map(async (key) => {
          try {
            const response = await fetch("http://localhost:3000/api/report", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ matrixKey: key, brandId: selectedItems[0] }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(response.statusText);
            return { data, key };
          } catch (error) {
            console.error("Error fetching single data:", error);
            return null;
          }
        })
      );
      setSingleVarFetch(fetchedData.filter(Boolean));
    };

    if (matrixKey.length && selectedItems.length) {
      fetchSingleData();
    }
  }, [matrixKey, selectedItems]);

  return (
    <div className="total-out">
      <div id="report-content">
        {totalFetchData.map((item, index) => (
          <div key={index} className="report-table-container">
            <h1>{item.title}</h1>
            {item.data && item.data.multiVar === true ? (
              <table>
                <thead className="report-table-head">
                  <tr>
                    <th rowSpan={2}>S.N</th>
                    <th rowSpan={2}>
                      {item.data.brandCol
                        ? `${item.data.brandRow}/${item.data.brandCol}`
                        : item.data.brandRow}
                    </th>
                    {item.data.allColumns?.map((col, colIndex) => (
                      <th key={colIndex} colSpan={4}>
                        {col.column}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {item.data.allColumns?.map((_, colIndex) => (
                      <React.Fragment key={colIndex}>
                        <th>OP</th>
                        <th>IN</th>
                        <th>OUT</th>
                        <th>BAL</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(item.data.matrix || {}).map(
                    ([rowLabel, rowData], rowIndex) => {
                      if (!rowData || Object.keys(rowData).length === 0)
                        return null;

                      return (
                        <tr key={rowIndex}>
                          <td>{rowIndex + 1}</td>
                          <td>{rowLabel}</td>
                          {item.data.allColumns.map((col, colIndex) => {
                            const colData = rowData[col.column];
                            return (
                              <React.Fragment key={colIndex}>
                                <td>{colData?.op ?? ""}</td>
                                <td>{colData?.in ?? ""}</td>
                                <td>{colData?.out ?? ""}</td>
                                <td>{colData?.bal ?? ""}</td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            ) : (
              item.data &&
              Object.entries(item.data.matrix || {}).map(
                ([key, value], innerIndex) => (
                  <table
                    key={innerIndex}
                    style={{ marginBottom: "30px" }}
                    className="table1"
                  >
                    <thead className="report-table-head">
                      <tr>
                        <th rowSpan="2">S.N</th>
                        <th rowSpan="2">Code</th>
                        <th colSpan="4">{key}</th>
                      </tr>
                      <tr>
                        <th>OP</th>
                        <th>IN</th>
                        <th>OUT</th>
                        <th>BAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(value || {}).map(
                        ([innerKey, innerValue], innerIndex) => (
                          <tr key={innerIndex}>
                            <td>{innerIndex + 1}</td>
                            <td>{innerKey}</td>
                            {Object.entries(innerValue || {}).map(
                              ([_, val], colIndex) => (
                                <td key={colIndex}>{val}</td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )
              )
            )}
          </div>
        ))}
      </div>
      <button onClick={() => window.print()} className="primary-btn" id="print-btn">
        Print Report
      </button>
      {isLoading && (
        <div className="center-hanne">
          <div className="bhitri-center">
            <span style={{ textAlign: "center", color: "white", fontSize: "25px" }}>
              Generating Report
            </span>
            <div className="box"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
