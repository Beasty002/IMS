import React from 'react'

function Report() {
  return (
    <>
      <div className="overlay"></div>
      <div id="newSales">
        <h2>Sales Entry</h2>
        <div className="search-box">
          <i className='bx bx-search-alt'></i>
          <input
            type="text"
            placeholder="Search items to add..."
            aria-label="Search input"
          />
        </div>
        <section className="sales-item-container">
          <form action="">
            <section className="sales-entry-items-list">
              <div className="sales-entry-item">
                <i class='bx bx-trash del-icon'></i>
                <select name="cat" id="" className='cat-select'>
                  <option value="category">Category</option>
                  <option value="category">Plywood</option>
                  <option value="category">Doors</option>
                </select>
                <select name="cat" id="" className='brand-select'>
                  <option value="category">Brand</option>
                  <option value="category">mayur</option>
                  <option value="category">Greenlam</option>
                </select>
                <select name="cat" id="" className='row-select'>
                  <option value="category">Brand</option>
                  <option value="category">mayur</option>
                  <option value="category">Greenlam</option>
                </select>
                <select name="cat" id="" className='column-select'>
                  <option value="category">Brand</option>
                  <option value="category">mayur</option>
                  <option value="category">Greenlam</option>
                </select>
                <div className="sales-entry-qty">
                  <i className='bx bxs-minus-circle' ></i>
                  <input type="number" id="quantity" name="qty" value="0" />
                  <i className='bx bxs-plus-circle'></i>
                </div>
              </div>
              <div className="sales-entry-item">
                <i class='bx bx-trash del-icon'></i>
                <select name="cat" id="" className='cat-select'>
                  <option value="category">Category</option>
                  <option value="category">Plywood</option>
                  <option value="category">Doors</option>
                </select>
                <select name="cat" id="" className='brand-select'>
                  <option value="category">Brand</option>
                  <option value="category">mayur</option>
                  <option value="category">Greenlam</option>
                </select>
                <select name="cat" id="" className='row-select'>
                  <option value="category">Brand</option>
                  <option value="category">mayur</option>
                  <option value="category">Greenlam</option>
                </select>
                <select name="cat" id="" className='column-select'>
                  <option value="category">Brand</option>
                  <option value="category">mayur</option>
                  <option value="category">Greenlam</option>
                </select>
                <div className="sales-entry-qty">
                  <i className='bx bxs-minus-circle' ></i>
                  <input type="number" id="quantity" name="qty" value="0" />
                  <i className='bx bxs-plus-circle'></i>
                </div>
              </div>
              <div className="new-item">
                <span></span>
                <div className="btn-container">
                  <button className='secondary-btn'>+ New Item</button>
                </div>

              </div>
            </section>
            <div className="btn-container new-entry-btn-container">
              <button className="cancel-btn">
                Cancel
              </button>
              <button className="primary-btn">Add</button>
            </div>


          </form>
        </section>
      </div>
    </>
  )
}

export default Report