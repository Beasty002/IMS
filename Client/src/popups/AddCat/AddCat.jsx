import React, { useState } from "react";
import ReactDOM from "react-dom";
import './AddCat.css'

function AddCat({ isOpen, onClose, addCategory }) {
  const [createCate, setCreateCate] = useState("");

  if (!isOpen) return null;

  const handleEnter = (event) => {
    // called the fetch function when input is focused  and key event occurs
    if (event.key === 13) {
      handleAddCategory();
      return;
    }
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();

    if (!createCate.trim()) {
      console.log("Category title cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: createCate }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Network error has occurred");
        return;
      }

      addCategory(createCate);

      setCreateCate("");

      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div className="overlay"></div>

      <section className="cat-pop">
        <h2>New Category</h2>
        <form onSubmit={handleAddCategory}>
          <div className="form-container">
            <label>Enter title for the Category:</label>
            <input
              value={createCate}
              onChange={(event) => setCreateCate(event.target.value)}
              onKeyDown={handleEnter}
              type="text"
              placeholder="e.g., plywood, doors ..."
              required
            />
          </div>
          <div className="btn-container">
            <button type="button" onClick={onClose} className="cancel-btn">
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

export default AddCat;
