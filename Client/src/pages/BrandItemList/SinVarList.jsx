import React from 'react'

export default function SinVarList() {
    return (
        <>
            <section>
                <div className="title-customize-cont">
                    <h1>Mayur Plywoods</h1>
                    <div className="btn-container">
                        <button className="secondary-btn">
                            <i className="bx bx-filter-alt"></i>
                            Customize Columns
                        </button>
                    </div>
                </div>

                <section className="brand-list-top">
                    <div className="search-select-container">
                        <div className="search-box">
                            <i className="bx bx-search-alt"></i>
                            <input
                                type="text"
                                placeholder="Search items..."
                                aria-label="Search input"
                            />
                        </div>
                        <div className="sel-container">
                            <select name="" id="">
                                <option value="">SD</option>
                                <option value="">MF</option>
                                <option value="">godawari</option>
                            </select>
                        </div>

                    </div>

                    <div className="btn-container">

                        <button className="primary-btn">
                            <i className="bx bx-plus-circle"></i> New Item
                        </button>
                    </div>
                </section>

            </section>
            <section>
                <div className="brand-item-table single-var">
                    <table>
                        <thead>
                            <tr>
                                <th className='table-checkbox'><input type="checkbox" /></th>
                                <th>Code</th>
                                <th className='stock-count-single'>Stock</th>

                                <th className='table-action-container'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td className='table-checkbox'>
                                    <input type="checkbox" />
                                </td>
                                <td>1000</td>
                                <td>1000</td>

                                <td className='table-action-container single-table'>
                                    <div className="action-container">
                                        <i className="bx bx-edit-alt edit-icon"></i>
                                        <i className="bx bx-trash del-icon"></i>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </section>
        </>
    )
}
