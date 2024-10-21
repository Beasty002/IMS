import React, { useState, useEffect } from "react";
import "./Sales.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
function Sales({ title, TableComponent, products, setSalesData }) {
  const [dateSetter, setDateSetter] = useState("");
  const [editClicked, setEditClicked] = useState(false);
  const [resData, setResData] = useState([]);
  const [titleName, setTitleName] = useState("");
  const [click, setClick] = useState("");

  useEffect(() => {
    const fetchDataByDate = async () => {
      if (dateSetter !== "") {
        try {
          console.log(JSON.stringify({ day: dateSetter, title }));
          const response = await fetch(
            "http://localhost:3000/api/getSpecificSale",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ day: dateSetter, title }),
            }
          );
          const data = await response.json();
          if (!response.ok) {
            console.log(response.statusText);
            return;
          }
          console.log(data);
          const filteredData = data.msg.filter((item) => item !== null);
          setSalesData(filteredData || []);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchDataByDate();
  }, [dateSetter, setSalesData]);

  const handleDateChange = (event) => {
    setDateSetter(event.target.value);
  };

  const handleStockEdit = () => {
    setEditClicked(!editClicked);
  };

  const handleDataRetrieve = (editData, type, allowSave) => {
    console.log("Taneko data yo ho hai", editData);
    setTitleName(type);
    setClick(allowSave);
    setResData(editData);
  };

  const handleStockSave = async () => {
    setEditClicked(!editClicked);
    console.log(JSON.stringify({ updateStock: resData, title, titleName }));
    try {
      const response = await fetch(`http://localhost:3000/api/${titleName}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updateStock: resData, title }),
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
    <section className="sale-purchase">
      <h1>{title} Summary </h1>
      <div className="sec-sale-head">
        <div className="left-sale">
          <input type="date" value={dateSetter} onChange={handleDateChange} />
        </div>
        <div className="btn-container">
          {editClicked ? (
            !click ? (
              <button
                onClick={() =>
                  toast.error("Please click on Confirm Edit first", {
                    autoClose: 1300,
                  })  
                }
                className="secondary-btn"
              >
                <i className="bx bxs-edit"></i>
                <p className="bx-sale">Save</p>
              </button>
            ) : (
              <button onClick={handleStockSave} className="secondary-btn">
                <i className="bx bxs-edit"></i>
                <p className="bx-sale">Save</p>
              </button>
            )
          ) : (
            <button onClick={handleStockEdit} className="secondary-btn">
              <i className="bx bxs-edit"></i>
              <p className="bx-sale">Edit</p>
            </button>
          )}

          <button className="primary-btn">
            <i className="bx bxs-plus-circle"></i>
            <Link id="cname" to={`/${title.toLowerCase() + "Entry"}`}>
              <p className="bx-sale">New Entry</p>
            </Link>
          </button>
        </div>
      </div>
      <div className="sale-table-export">
        <TableComponent
          data={products}
          handleStockEdit={handleStockEdit}
          title={title}
          editClicked={editClicked}
          handleDataRetrieve={handleDataRetrieve}
        />
      </div>
      <ToastContainer />
    </section>
  );
}

export default Sales;
