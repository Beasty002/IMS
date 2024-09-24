import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./AddBrand.css";

export default function AddBrand({ isOpen, onClose, parentCategory, newBrand }) {
  const [formData, setFormData] = useState({
    brandName: "",
    multiVar: "",
    rowLabel: "",
    colLabel: "",
    parentCat: parentCategory,
  });

  const handleFormData = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchBrandData = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/brand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Network error , Please try again later");
        return;
      }
      newBrand("fetch on more time");
      console.log(formData);
      console.log(data);
        onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <section id="addBrand">
        <h2>New Brand</h2>
        <form onSubmit={fetchBrandData}>
          <div className="form-container">
            <label htmlFor="">Brand Title</label>
            <input
              type="text"
              placeholder="eg: mayur, creata ....."
              name="brandName"
              value={formData.brandName}
              onChange={handleFormData}
            />
          </div>
          <div className="form-container">
            <label>Does this brands'product have multile variations ?</label>
            <div className="radio-form-container">
              <div className="radio-form">
                <input
                  type="radio"
                  name="multiVar"
                  id="variationYes"
                  onChange={handleFormData}
                  value="true"
                  checked={formData.multiVar === "true"} //checked is used cause it will remove potential
                  // rerender error by proving  the existing  value form the state
                />
                <label htmlFor="variationYes">Yes</label>
              </div>
              <div className="radio-form">
                <input
                  type="radio"
                  name="multiVar"
                  value="false"
                  onChange={handleFormData}
                  checked={formData.multiVar === "false"}
                  id="variationNo"
                />
                <label htmlFor="variationNo">No</label>
              </div>
            </div>
          </div>
          <div className="form-container">
            <label htmlFor="">Row Label</label>
            <input
              type="text"
              name="rowLabel"
              value={formData.rowLabel}
              onChange={handleFormData}
              placeholder="eg size , code ...."
            />
          </div>
          {formData.multiVar === "true" ? (
            <></>
          ) : (
            <>
              <div className="form-container">
                <label htmlFor="">Column Label</label>
                <input
                  type="text"
                  value={formData.colLabel}
                  onChange={handleFormData}
                  name="colLabel"
                  placeholder="eg name , mm ...."
                />
              </div>
            </>
          )}
          <div className="btn-container">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Add
            </button>
          </div>
        </form>
      </section>
    </>,
    document.getElementById("overlay")
  );
}
