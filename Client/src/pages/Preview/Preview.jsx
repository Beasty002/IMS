import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Preview.css";

function Preview() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedItems = [], selectedTitles = [] } = location.state || {};
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (selectedItems.length === 0) return;

      setIsLoading(true);
      try {
        const reports = await Promise.all(
          selectedItems.map(async (brandId, index) => {
            const response = await fetch("http://localhost:3000/api/report", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ brandId }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const title = selectedTitles[index] || "Unnamed Report";

            if (data.multiVar) {
              return { data, title, type: "multiVar" };
            }

            const matrixKeys = Object.keys(data.matrix);
            const detailedData = await Promise.all(
              matrixKeys.map(async (matrixKey) => {
                const detailResponse = await fetch(
                  "http://localhost:3000/api/report",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ matrixKey, brandId }),
                  }
                );

                if (!detailResponse.ok) {
                  throw new Error(
                    `HTTP error! status: ${detailResponse.status}`
                  );
                }

                return detailResponse.json();
              })
            );

            return {
              data: detailedData,
              title,
              type: "singleVar",
            };
          })
        );

        setReportData(reports);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [selectedItems, selectedTitles]);

  const renderMultiVarTable = (item) => (
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
            if (!rowData || Object.keys(rowData).length === 0) return null;

            return (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                <td>{rowLabel}</td>
                {item.data.allColumns.map((col, colIndex) => {
                  const colData = rowData[col.column];
                  return (
                    <React.Fragment key={colIndex}>
                      <td>{colData?.op !== undefined ? colData.op : ""}</td>
                      <td>{colData?.in !== undefined ? colData.in : ""}</td>
                      <td>{colData?.out !== undefined ? colData.out : ""}</td>
                      <td>{colData?.bal !== undefined ? colData.bal : ""}</td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );

  const renderSingleVarTables = (item) => (
    <div className="single-report-css">
      {item.data.map((report, reportIndex) => (
        <div key={`report-${reportIndex}`} style={{ marginBottom: "30px" }}>
          {Object.entries(report.matrix || {}).map(([key, value], index) => (
            <table
              key={`table-${key}-${index}`}
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
                    <tr key={`row-${key}-${innerKey}-${innerIndex}`}>
                      <td>{innerIndex + 1}</td>
                      <td>{innerKey}</td>
                      {Object.entries(innerValue || {}).map(
                        ([_, cellValue], colIndex) => (
                          <td key={`cell-${key}-${innerKey}-${colIndex}`}>
                            {cellValue}
                          </td>
                        )
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="total-out report-all-container-print">
        <div id="report-content">
          {reportData.map((item, index) => (
            <div key={index} className="report-table-container">
              <h1 className="table-title" style={{ fontSize: "20px" }}>
                {item.title} {item.data.category}
              </h1>
              {item.type === "multiVar"
                ? renderMultiVarTable(item)
                : renderSingleVarTables(item)}
            </div>
          ))}
        </div>
        <div className="print-btn-container">
          <button
            onClick={() => window.print()}
            className="primary-btn print-btn-main"
            id="print-btn"
          >
            Print
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="center-hanne">
          <div className="bhitri-center">
            <span
              style={{ textAlign: "center", color: "white", fontSize: "25px" }}
            >
              Generating Report
            </span>
            <div className="box"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Preview;
