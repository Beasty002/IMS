import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Rename.css"; 

function Rename({ isOpen, onClose }) {
  const [renameInput, setRenameInput] = useState("");

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <section className="rename-pop">
        <h2>Rename Item</h2>
        <form>
          <div className="form-container">
            <label>Enter a new name</label>
            <input
              value={renameInput}
              onChange={(event) => setRenameInput(event.target.value)}
              type="text"
              placeholder="Enter a new name"
              required
            />
          </div>
          <div className="btn-container">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Rename
            </button>
          </div>
        </form>
      </section>
    </>,
    document.getElementById("overlay")
  );
}

export default Rename;
