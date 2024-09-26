import React from 'react'
import './Report.css'

function Report() {
  return (

    <section>
      <h1>Categories</h1>
      <div className="cat-list-top">
        <div className="search-box">
          <i className='bx bx-search-alt'></i>
          <input
            type="text"
            placeholder="Search categories..."
            aria-label="Search input"
          />
        </div>
        <div className="btn-container">
          <button className="primary-btn"><i class='bx bxs-printer'></i> Print</button>
        </div>


      </div>
      <div className="cat-list">
        <div className="cat-box">
          <h3>Plywood</h3>
          <p className="cat-stock-availability">Stock available : 80</p>
          <div className="action-container">
            <i class='bx bx-printer print-icon' ></i>

          </div>
        </div>
      </div>
    </section>

  )
}

export default Report