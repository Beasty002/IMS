import React from "react";
import ReactDOM from "react-dom";
import "./DelPop.css";

export default function DelPop({ isOpen, onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="overlay"></div>
      <div className="del-popup">
        <i className="bx bxs-trash"></i>
        <p className="del-msg">
          {" "}
          Are you sure you want to delete{" "}
          <span className="del-item-name">Mayur Doors</span> ?{" "}
        </p>
        <div className="btn-container">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onClose} className="del-btn">
            Delete
          </button>
        </div>
      </div>
    </>,
    document.getElementById("overlay")
  );
}
