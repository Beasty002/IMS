import React, { useState } from "react";
import "./CustomizeCol.css";
import ReactDOM from "react-dom";

export default function CustomizeCol({ isOpen, onClose }) {
  const [formData, setFormData] = useState([
    {
      id: Date.now(),
      columnName: "",
    },
  ]);

  const handleInputChange = (event, id) => {
    const { name, value } = event.target;
    setFormData((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  const handleInputAddition = (event) => {
    event.preventDefault();
    setFormData((prevState) => [
      ...prevState,
      {
        id: Date.now() + Math.random(),
        columnName: "",
      },
    ]);
  };

  const fetchColumnData = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/addColumn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(response.status);
        return;
      }
      setFormData("");
      console.log(data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <section className="customize-col-popup">
        <h2>Customize Columns</h2>
        <form>
          {formData?.map((item) => (
            <div key={item.id} className="edit-box-container">
              <div className="edit-col-box">
                <input
                  type="text"
                  name="columnName"
                  placeholder="Enter a column name "
                  value={item.columnName}
                  onChange={(event) => handleInputChange(event, item.id)}
                />
                <div className="action-edit-col">
                  <i className="fa-regular fa-eye"></i>
                  <i className="bx bxs-edit-alt edit-icon"></i>
                  <i className="bx bx-trash del-icon"></i>
                </div>
              </div>
            </div>
          ))}

          <div className="btn-container new-col-btn">
            <button onClick={handleInputAddition} className="secondary-btn">
              + New Column
            </button>
          </div>
          <div className="btn-container main-col-btn">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button onClick={fetchColumnData} className="primary-btn">
              Save
            </button>
          </div>
        </form>
      </section>
    </>,
    document.getElementById("overlay")
  );
}
