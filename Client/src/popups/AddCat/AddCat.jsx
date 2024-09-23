import React, { useState } from "react";
import ReactDOM from "react-dom";

function AddCat({ isOpen, onClose, addCategory }) {
  const [createCate, setCreateCate] = useState("");

  if (!isOpen) return null;

  const handleAddCategory = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({category:createCate}),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Network error has occured");
        return;
      }

      console.log(data.msg);
      addCategory(createCate);
      setCreateCate('');
      // in the button it might cause closing before fetching data to i shifted this here
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div class="overlay"></div>

      <section class="cat-pop">
        <h2>New Category</h2>
        <form onSubmit={handleAddCategory}>
          <div class="form-container">
            <label htmlFor="">Enter title for the Category :</label>
            <input
              value={createCate}
              onChange={(event) => setCreateCate(event.target.value)}
              type="text"
              placeholder="eg plywood, doors ..."
            />
          </div>
          <div class="btn-container">
            <button onClick={onClose} class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="primary-btn">
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
