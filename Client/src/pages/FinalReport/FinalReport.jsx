import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FinalReport.css";

function FinalReport() {
  const { parentCategory, brandId } = useParams();
  const [fetchedData, setFetchedData] = useState([]);
  const [matrixKey, setMatrixKey] = useState({});
  const [rowLabel, setRowLabel] = useState("");
  const [colLabel, setColLabel] = useState("");

  const fetchTotalData = async () => {
    console.log(
      JSON.stringify({
        brandId: brandId,
      })
    );
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
      setFetchedData(data.allColumns);
      setMatrixKey(data.matrix);
      setRowLabel(data.brandRow);
      setColLabel(data.brandCol);
    } catch (error) {
      console.error(error);
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

  return (
    <>
      <div class="report-table-container">
        <table id="finalReport">
          <thead class="report-table-head">
            <tr>
              <th rowspan="2">S.N</th>
              <th rowspan="2">
                {rowLabel}/{colLabel}
              </th>
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
                    {Object.entries(innerValue)?.map(([key, value], index) => (
                      <td>{value}</td>
                    ))}
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FinalReport;
