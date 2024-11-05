import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FinalReport.css";

function FinalReport() {
  const { parentCategory, brandId, multiVar } = useParams();
  const [fetchedData, setFetchedData] = useState([]);
  const [matrixKey, setMatrixKey] = useState({});
  const [rowLabel, setRowLabel] = useState("");
  const [colLabel, setColLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [overallData, setOverallData] = useState({});

  useEffect(() => {
    console.log("YO muli var ho hai", multiVar);
  }, [multiVar]);

  const fetchTotalData = async () => {
    console.log(
      JSON.stringify({
        brandId: brandId,
      })
    );
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId: brandId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      setOverallData(data);
      setFetchedData(data.allColumns);
      setMatrixKey(data.matrix);
      setRowLabel(data.brandRow);
      setColLabel(data.brandCol);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (parentCategory && brandId) {
      fetchTotalData();
    }
  }, []);

  useEffect(() => {
    console.log("Lyako fata yo hai", fetchedData);
  }, [fetchedData]);

  useEffect(() => {
    console.log("Matrix fata yo hai", matrixKey);
  }, [matrixKey]);

  const fetchReportData = async () => {
    console.log(JSON.stringify({ overallData, brandId }));
    try {
      const response = await fetch("http://localhost:3000/api/saveReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ overallData, brandId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="save-report">
        <button onClick={fetchReportData} className="primary-btn">
          Save Report
        </button>
      </div>
      <div class="report-table-container">
        {multiVar === "false" ? (
          <>
            {Object.entries(matrixKey).map(([key, value], index) => (
              <table
                style={{
                  marginBottom: "30px",
                }}
                class="table1"
              >
                <thead class="report-table-head">
                  <tr>
                    <th rowspan="2">S.N</th>
                    <th rowspan="2">Code</th>
                    <th colspan="4">{key}</th>
                  </tr>
                  <tr>
                    <th>OP</th>
                    <th>IN</th>
                    <th>OUT</th>
                    <th>BAL</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(value).map(([key, innerValue], index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{key}</td>
                      {Object.entries(innerValue).map(([key, value], index) => (
                        <>
                          <td>{value}</td>
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </>
        ) : (
          <table id="finalReport">
            <thead class="report-table-head">
              <tr>
                <th rowspan="2">S.N</th>

                {colLabel ? (
                  <th rowspan="2">
                    {rowLabel}/{colLabel}
                  </th>
                ) : (
                  <th rowspan="2">{rowLabel}</th>
                )}
                {fetchedData?.map((item) => (
                  <td colSpan={4} key={item._id}>
                    {item.column}
                  </td>
                ))}
              </tr>
              <tr>
                {fetchedData?.map((item) => (
                  <>
                    <th>OP</th>
                    <th>IN</th>
                    <th>OUT</th>
                    <th>BAL</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(matrixKey)?.map(([key, value], index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{key}</td>

                  {Object.entries(value)?.map(([key, innerValue], index) => (
                    <>
                      {Object.entries(innerValue)?.map(
                        ([key, value], index) => (
                          <td>{value}</td>
                        )
                      )}
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default FinalReport;
