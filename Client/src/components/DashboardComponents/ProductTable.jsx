import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const ProductTable = ({ title, data }) => {
  const itemsPerPage = 5; 
  const [currentPage, setCurrentPage] = useState(0); 

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const displayedItems = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); 
  };

  return (
    <div className="left-table">
      <h2 className="dash-title">{title}</h2>
      <table>
        <thead>
          <tr>
            <th className="table-sn">S.N</th>
            <th>Product</th>
            {title === "Low Stock Products" && (
              <th className="stk-left">Stock Left</th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayedItems.map((item, index) => (
            <tr key={index + 1}>
              <td className="table-sn">{index + 1 + currentPage * itemsPerPage}</td>
              <td>{item.brandCategory}</td>
              {title === "Low Stock Products" && (
                <td className="stk-left">{item.stock}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={<span className="prev-item">{"<"}</span>}
        nextLabel={<span className="next-item">{">"}</span>}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"prev-item"}
        nextClassName={"next-item"}
        activeClassName={"active"}
        disabledClassName={"disabled"}
      />
    </div>
  );
};

export default ProductTable;
