import React, { useEffect } from "react";
import "./ReportPrint.css";
import ReactDOM from "react-dom";
import { useAuth } from "../../customHooks/useAuth";

export default function ReportPrint({ isOpen, onClose }) {
  const { fetchCategory, categories } = useAuth();

  useEffect(() => {
    fetchCategory();
  }, []);
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>

      <section class="print-popup">
        <h1>Print Categories</h1>
        <section class="cat-list-to-print">
          <div class="cat-print-container">
            <input type="checkbox" name="" id="selAll" />{" "}
            <label htmlFor="selAll">Select All</label>
          </div>
          {categories?.map((item) => (
            <div key={item._id} class="cat-print-container">
              <input type="checkbox" name={item.title} id={item._id} />
              <label htmlFor={item.title}>{item.title}</label>
            </div>
          ))}
        </section>
        <div class="btn-container">
          <button onClick={onClose} class="cancel-btn">
            Cancel
          </button>
          <button class="primary-btn">Print</button>
        </div>
      </section>
    </>,
    document.getElementById("overlay")
  );
}
