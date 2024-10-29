import React, { useEffect, useState } from "react";
import "./ReportPrint.css";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

export default function ReportPrint({ isOpen, onClose, data }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

 

  // useEffect(() => {
  //   if (data) {
  //     const fetchingIds = data.map((item) => item._id);
  //     setFetchIds(fetchingIds);
  //     console.log("Fetch hanne id yo ho hai", fetchingIds);
  //   }
  // }, [data]);

  

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((item) => item._id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleDataFetch = () => {
    navigate("/previewReport", { state: { selectedItems } });
    onClose();
  };

  const isAllSelected =
    data?.length > 0 && selectedItems.length === data.length;

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>

      <section className="print-popup">
        <h1>Print Categories</h1>
        <section className="cat-list-to-print">
          <div className="cat-print-container">
            <input
              type="checkbox"
              id="selAll"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />{" "}
            <label htmlFor="selAll">Select All</label>
          </div>
          {data?.map((item) => (
            <div key={item._id} className="cat-print-container">
              <input
                type="checkbox"
                id={item._id}
                checked={selectedItems.includes(item._id)}
                onChange={() => handleCheckboxChange(item._id)}
              />
              <label htmlFor={item._id}>{item.title || item.brandName}</label>
            </div>
          ))}
        </section>
        <div className="btn-container">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleDataFetch} className="primary-btn">
            Print
          </button>
        </div>
      </section>
    </>,
    document.getElementById("overlay")
  );
}
