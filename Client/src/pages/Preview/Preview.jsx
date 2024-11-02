import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Preview.css";

function Preview() {
  const [totalFetchData, setTotalFetchData] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedItems = [], selectedTitles = [] } = location.state || {};

  useEffect(() => {
    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => fetchTotalData(item));
    }
  }, [selectedItems]);

  useEffect(() => {
    console.log(totalFetchData);
  }, [totalFetchData]);

  const fetchTotalData = async (brandId) => {
    console.log("Fetching data for brandId:", brandId);

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brandId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      setTotalFetchData((prevState) => [...prevState, data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="total-out">
        <div id="report-content">
          {totalFetchData.map((item, index) => {
            return (
              <div key={index} className="report-table-container">
                <h1>{selectedTitles[index] || "Unnamed Report"}</h1>
                <table>
                  <thead className="report-table-head">
                    <tr>
                      <th rowSpan={2}>S.N</th>
                      {item.brandCol ? (
                        <th rowSpan={2}>
                          {item.brandRow}/{item.brandCol}
                        </th>
                      ) : (
                        <th rowSpan={2}>{item.brandRow}</th>
                      )}
                      {item.allColumns?.map((col, colIndex) => (
                        <th key={colIndex} colSpan={4}>
                          {col.column}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {item.allColumns?.map((_, colIndex) => (
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
                    {Object.entries(item.matrix).map(
                      ([rowLabel, rowData], rowIndex) => {
                        if (!rowData || Object.keys(rowData).length === 0)
                          return null;

                        return (
                          <tr key={rowIndex}>
                            <td>{rowIndex + 1}</td>
                            <td>{rowLabel}</td>
                            {item.allColumns.map((col, colIndex) => {
                              const colData = rowData[col.column];

                              return (
                                <React.Fragment key={colIndex}>
                                  {colData ? (
                                    <>
                                      <td>
                                        {colData.op !== undefined
                                          ? colData.op
                                          : ""}
                                      </td>
                                      <td>
                                        {colData.in !== undefined
                                          ? colData.in
                                          : ""}
                                      </td>
                                      <td>
                                        {colData.out !== undefined
                                          ? colData.out
                                          : ""}
                                      </td>
                                      <td>
                                        {colData.bal !== undefined
                                          ? colData.bal
                                          : ""}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => window.print()}
          className="primary-btn"
          id="print-btn"
        >
          Print Report
        </button>
      </div>
      {isLoading ? (
        <div className="center-hanne">
          <div className="bhitri-center">
            <span
              style={{
                textAlign: "center",
                color: "white",
                fontSize: "25px",
              }}
            >
              Generating Report
            </span>
            <div className="box"></div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Preview;
