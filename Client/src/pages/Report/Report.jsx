import React from 'react'
import './Report.css'

function Report() {
  return (
    <>
      <section>
        <h1>Mayur Plywoods</h1>
        <section className="brand-list-top">
          <div className="search-box">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search items..."
              aria-label="Search input"
            />
          </div>
          <div className="btn-container">
            <button className="secondary-btn">
              <i className="bx bx-filter-alt"></i>
              Customize Columns
            </button>
            <button className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Brand
            </button>
          </div>
        </section>

      </section>





    </>
  )
}

export default Report