import React from "react";
import "./CustomizeCol.css";
import ReactDOM from "react-dom";

export default function CustomizeCol({ isOpen, onClose }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <section className="customize-col-popup">
        <h2>Customize Columns</h2>
        <form action="">
          <div className="edit-box-container">
            <div className="edit-col-box">
              <input type="text" value={"mayur ply"} />
              <div className="action-edit-col">
                <i className="fa-regular fa-eye"></i>
                <i className="bx bxs-edit-alt edit-icon"></i>
                <i className="bx bx-trash del-icon"></i>
              </div>
            </div>
            <div className="edit-col-box">
              <input type="text" value={"mayur ply"} />
              <div className="action-edit-col">
                <i className="fa-regular fa-eye"></i>
                <i className="bx bxs-edit-alt edit-icon"></i>
                <i className="bx bx-trash del-icon"></i>
              </div>
            </div>
          </div>

          <div className="btn-container new-col-btn">
            <button className="secondary-btn"> + New Column</button>
          </div>
          <div className="btn-container main-col-btn">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button className="primary-btn">Save</button>
          </div>
        </form>
      </section>
    </>,
    document.getElementById("overlay")
  );
}
