import React from "react";
import ReactDOM from "react-dom";

function AddCat({ isOpen, onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div class="overlay"></div>

      <section class="cat-pop">
        <h2>New Category</h2>
        <div class="form-container">
          <label htmlFor="">Enter title for the Category :</label>
          <input type="text" placeholder="eg plywood, doors ..." />
        </div>
        <div class="btn-container">
          <button onClick={onClose} class="cancel-btn">
            Cancel
          </button>
          <button onClick={onClose} class="primary-btn">
            Add
          </button>
        </div>
      </section>
    </>,
    document.getElementById("overlay")
  );
}

export default AddCat;
